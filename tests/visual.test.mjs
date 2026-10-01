import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {render,get,inline} from '../server/render.mjs';
const pages=JSON.parse(fs.readFileSync('content/pages-manifest.json'));
const config=JSON.parse(fs.readFileSync('admin/config.yml'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
test('les 11 pages conservent exactement leur HTML actuel',()=>{
 assert.equal(pages.length,11);
 for(const page of pages){
  const data=JSON.parse(fs.readFileSync(page.data));const template=fs.readFileSync(page.template,'utf8');
  let expected=fs.readFileSync(page.output,'utf8');
  if(page.id==='accueil'){const old=JSON.parse(fs.readFileSync('content/home.json'));expected=fs.readFileSync('templates/index.html','utf8').replace(/\{\{(\w+)\}\}/g,(_,k)=>esc(old[k]));}
  assert.equal(render(page,data,template),expected,page.id);
  const file=config.collections.flatMap(c=>c.files).find(f=>f.name===page.id);assert.ok(file);
  const fields=file.fields.flatMap(g=>g.fields.map(f=>g.name+'.'+f.name));assert.deepEqual(new Set(fields),new Set(page.fields.map(f=>f.path)));
 }
});
test('la modification d’une FAQ met aussi à jour les données structurées',()=>{
 const page=pages.find(p=>p.id==='marketing-btob-aix-en-provence');const data=JSON.parse(fs.readFileSync(page.data));const template=fs.readFileSync(page.template,'utf8');
 const f=page.fields.find(f=>f.default.startsWith('Connect se positionne'));assert.ok(f);
 const [g,k]=f.path.split('.');data[g][k]='Une nouvelle réponse précise pour le client.';
 const output=render(page,data,template);
 assert.ok(output.includes('<p>Une nouvelle réponse précise pour le client.</p>'));
 const json=JSON.parse(output.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
 assert.equal(json['@graph'].find(n=>n['@type']==='FAQPage').mainEntity[0].acceptedAnswer.text,data[g][k]);
});
test('les liens dangereux sont refusés et le HTML injecté est neutralisé',()=>{
 assert.ok(!inline('<script>alert(1)</script><a href="javascript:alert(1)">Texte</a>').includes('<script'));
 assert.ok(!inline('[Texte](javascript:alert(1))').includes('href="javascript:'));
 const page=pages.find(p=>p.id==='marketing-btob-aix-en-provence');const data=JSON.parse(fs.readFileSync(page.data));
 const link=page.fields.find(f=>f.kind==='link');const [g,k]=link.path.split('.');data[g][k]='javascript:alert(1)';
 assert.throws(()=>render(page,data,fs.readFileSync(page.template,'utf8')),/Lien invalide/);
});
test('chaque aperçu est enregistré et reflète une modification sans publication',async()=>{
 const registered={};globalThis.window={h:(tag,props,...children)=>({tag,props,children}),createClass:spec=>spec};
 globalThis.CMS={registerPreviewTemplate:(name,component)=>registered[name]=component,registerPreviewStyle:()=>{}};
 globalThis.location={origin:'https://www.connect-affaires.fr'};
 const {registerPreviews}=await import('../dist/admin/previews.js');
 const previews=JSON.parse(fs.readFileSync('dist/admin/preview-data.json'));registerPreviews(previews);
 assert.equal(Object.keys(registered).length,11);
 const page=pages.find(p=>p.id==='marketing-btob-aix-en-provence');const data=JSON.parse(fs.readFileSync(page.data));
 const f=page.fields.find(f=>f.path==='entete.champ_002');assert.ok(f);const [g,k]=f.path.split('.');data[g][k]='Titre de contrôle';
 const result=registered[page.id].render.call({props:{entry:{get:()=>({toJS:()=>data})},getAsset:v=>({toString:()=>v})},state:{mobile:true},setState:()=>{}});
 const frame=result.children.find(e=>e?.tag==='iframe');assert.ok(frame);assert.ok(frame.props.srcDoc.includes('Titre de contrôle'));
 assert.ok(!frame.props.srcDoc.includes('<script'));assert.equal(frame.props.sandbox,'allow-same-origin');assert.equal(frame.props.style.width,'min(390px,100%)');
});
