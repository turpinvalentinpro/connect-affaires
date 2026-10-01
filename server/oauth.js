const crypto = require('node:crypto');
const ORIGIN = 'https://www.connect-affaires.fr';
const REPO = 'turpinvalentinpro/connect-affaires';
const LOGIN = 'turpinvalentinpro';
const COOKIE = '__Host-connect-oauth';
const CALLBACK = ORIGIN + '/api/callback';

function settings() {
  const id = process.env.GITHUB_CLIENT_ID;
  const secret = process.env.GITHUB_CLIENT_SECRET;
  if (!id || !secret) throw new Error('Configuration OAuth absente');
  return { id, secret };
}
function headers(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
}
function cookie(value, maxAge = 600) {
  return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
function sign(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}
function createSession(secret) {
  const session = { state: crypto.randomBytes(32).toString('base64url'), verifier: crypto.randomBytes(32).toString('base64url'), expires: Date.now() + 600000 };
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  return { ...session, cookie: cookie(`${payload}.${sign(payload, secret)}`) };
}
function readSession(req, state, secret) {
  const value = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
  if (!value || value.length > 2048 || !state) return null;
  const [payload, signature, extra] = value.split('.');
  const expected = sign(payload, secret);
  if (extra || !signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (session.state !== state || !Number.isFinite(session.expires) || session.expires < Date.now() || session.expires > Date.now() + 600000 || typeof session.verifier !== 'string') return null;
    return session;
  } catch { return null; }
}
function message(res, status, text) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(text);
}
function success(res, token) {
  const nonce = crypto.randomBytes(24).toString('base64url');
  const result = JSON.stringify('authorization:github:success:' + JSON.stringify({ token, provider: 'github' })).replace(/</g, '\\u003c');
  res.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.statusCode = 200;
  res.end(`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Connexion Connect</title><p id="status">Connexion validée. Retour à l’administration…</p><script nonce="${nonce}">
  const origin = ${JSON.stringify(ORIGIN)};
  if (window.opener) {
    const receive = event => {
      if (event.origin !== origin || event.source !== window.opener || event.data !== 'authorizing:github') return;
      window.removeEventListener('message', receive);
      window.opener.postMessage(${result}, origin);
    };
    window.addEventListener('message', receive);
    window.opener.postMessage('authorizing:github', origin);
  } else { document.getElementById('status').textContent = 'Ouvrez /admin/ et relancez la connexion depuis cette page.'; }
  </script></html>`);
}
module.exports = { ORIGIN, REPO, LOGIN, CALLBACK, settings, headers, cookie, createSession, readSession, message, success };
