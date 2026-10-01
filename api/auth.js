const crypto = require('node:crypto');
const oauth = require('../server/oauth');

module.exports = function handler(req, res) {
  oauth.headers(res);
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return oauth.message(res, 405, 'Méthode non autorisée'); }
  const url = new URL(req.url, oauth.ORIGIN);
  if (url.searchParams.get('provider') !== 'github') return oauth.message(res, 400, 'Fournisseur non autorisé');
  const site = url.searchParams.get('site_id');
  if (site && site !== new URL(oauth.ORIGIN).hostname) return oauth.message(res, 400, 'Ouvrez https://www.connect-affaires.fr/admin/');
  try {
    const { id, secret } = oauth.settings();
    const session = oauth.createSession(secret);
    const destination = new URL('https://github.com/login/oauth/authorize');
    destination.search = new URLSearchParams({ client_id: id, redirect_uri: oauth.CALLBACK, scope: 'repo', state: session.state, login: oauth.LOGIN, allow_signup: 'false', code_challenge: crypto.createHash('sha256').update(session.verifier).digest('base64url'), code_challenge_method: 'S256' }).toString();
    res.setHeader('Set-Cookie', session.cookie);
    res.setHeader('Location', destination.href);
    res.statusCode = 302;
    res.end();
  } catch { return oauth.message(res, 503, 'Connexion non configurée : vérifiez les deux variables GitHub dans Vercel, puis redéployez.'); }
};
