const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const vm = require('node:vm');
const auth = require('../api/auth');
const callback = require('../api/callback');
const oauth = require('../server/oauth');
process.env.GITHUB_CLIENT_ID = 'test-client';
process.env.GITHUB_CLIENT_SECRET = 'test-secret-not-real';
function response() { return { headers: {}, setHeader(k,v) { this.headers[k]=v; }, end(v='') { this.body=v; } }; }
function start() { const res=response(); auth({method:'GET',url:'/api/auth?provider=github&site_id=www.connect-affaires.fr',headers:{}},res); return {res,params:new URL(res.headers.Location).searchParams}; }
function request(res, params, state = params.get('state')) { return {method:'GET',url:'/api/callback?code=example&state='+state,headers:{cookie:res.headers['Set-Cookie'].split(';')[0]}}; }

test('auth: origin fixe, session signée, PKCE, cookie sécurisé', () => {
  const {res,params}=start(); assert.equal(res.statusCode,302);
  assert.equal(params.get('redirect_uri'),oauth.CALLBACK);
  assert.equal(params.get('code_challenge_method'),'S256');
  assert.match(res.headers['Set-Cookie'], /HttpOnly; Secure; SameSite=Lax/);
  const session=oauth.readSession(request(res,params),params.get('state'),process.env.GITHUB_CLIENT_SECRET);
  assert.equal(params.get('code_challenge'),crypto.createHash('sha256').update(session.verifier).digest('base64url'));
  const bad=response();auth({method:'GET',url:'/api/auth?provider=github&site_id=evil.example',headers:{}},bad);assert.equal(bad.statusCode,400);
});
test('callback refuse une session absente, falsifiée, expirée ou un état différent avant tout appel réseau', async () => {
  const original=global.fetch;global.fetch=()=>{throw Error('Aucun appel réseau attendu');};
  try {
    const {res,params}=start();
    for (const req of [request(res,params,'incorrect'),{...request(res,params),headers:{}},{...request(res,params),headers:{cookie:res.headers['Set-Cookie'].split(';')[0]+'x'}}]) {
      const out=response();await callback(req,out);assert.equal(out.statusCode,400);
    }
    const payload=Buffer.from(JSON.stringify({state:'expired',verifier:'verifier',expires:Date.now()-1000})).toString('base64url');
    const signature=crypto.createHmac('sha256',process.env.GITHUB_CLIENT_SECRET).update(payload).digest('base64url');
    const out=response();await callback({method:'GET',url:'/api/callback?state=expired&code=x',headers:{cookie:`__Host-connect-oauth=${payload}.${signature}`}},out);assert.equal(out.statusCode,400);
  } finally {global.fetch=original;}
});
test('callback contrôle identité et droit écriture; le secret ne parvient pas au navigateur', async () => {
  const original=global.fetch;
  try {
    for (const [login,push,status] of [['intrus',true,403],[oauth.LOGIN,false,403],[oauth.LOGIN,true,200]]) {
      const {res,params}=start();let calls=0;
      global.fetch=async(url,options)=>{
        calls++;
        if(url.includes('access_token')) {assert.ok(options.body.get('code_verifier'));return {ok:true,json:async()=>({access_token:'mock-access-token'})};}
        if(url.endsWith('/user'))return {ok:true,json:async()=>({login})};
        assert.equal(url,`https://api.github.com/repos/${oauth.REPO}`);return {ok:true,json:async()=>({permissions:{push}})};
      };
      const out=response();await callback(request(res,params),out);assert.equal(out.statusCode,status);
      assert.ok(!out.body.includes(process.env.GITHUB_CLIENT_SECRET));
      if(status===403)assert.ok(!out.body.includes('mock-access-token'));
      if(login==='intrus')assert.equal(calls,2);
      if(status===200) {
        assert.equal(out.headers['Cache-Control'],'no-store');
        assert.match(out.headers['Set-Cookie'],/Max-Age=0/);
        const script=out.body.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1];
        const sent=[];let listener;const opener={postMessage:(data,origin)=>sent.push({data,origin})};
        const window={opener,addEventListener:(name,fn)=>listener=fn,removeEventListener:()=>{}};
        vm.runInNewContext(script,{window});assert.equal(sent[0].data,'authorizing:github');
        listener({origin:'https://evil.example',source:opener,data:'authorizing:github'});assert.equal(sent.length,1);
        listener({origin:oauth.ORIGIN,source:{},data:'authorizing:github'});assert.equal(sent.length,1);
        listener({origin:oauth.ORIGIN,source:opener,data:'authorizing:github'});assert.equal(sent.length,2);
        assert.equal(sent[1].origin,oauth.ORIGIN);assert.match(sent[1].data,/authorization:github:success:/);
      }
    }
  } finally {global.fetch=original;}
});
test('échec GitHub: erreur générique sans secret ni jeton', async () => {
  const original=global.fetch;
  try {global.fetch=async()=>{throw Error('secret-from-upstream');};const {res,params}=start();const out=response();await callback(request(res,params),out);assert.equal(out.statusCode,502);assert.ok(!out.body.includes('secret-from-upstream'));}
  finally{global.fetch=original;}
});
