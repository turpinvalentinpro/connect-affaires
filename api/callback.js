const oauth = require('../server/oauth');

module.exports = async function handler(req, res) {
  oauth.headers(res);
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return oauth.message(res, 405, 'Méthode non autorisée'); }
  res.setHeader('Set-Cookie', oauth.cookie('', 0));
  try {
    const { id, secret } = oauth.settings();
    const url = new URL(req.url, oauth.ORIGIN);
    const session = oauth.readSession(req, url.searchParams.get('state'), secret);
    if (!session) return oauth.message(res, 400, 'Session invalide ou expirée. Fermez cette fenêtre et reconnectez-vous depuis /admin/.');
    if (url.searchParams.has('error')) return oauth.message(res, 400, 'Autorisation refusée. Fermez cette fenêtre pour réessayer.');
    const code = url.searchParams.get('code');
    if (!code || code.length > 1024) return oauth.message(res, 400, 'Code GitHub absent ou invalide.');
    const exchange = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: id, client_secret: secret, redirect_uri: oauth.CALLBACK, code, code_verifier: session.verifier }), signal: AbortSignal.timeout(10000)
    });
    if (!exchange.ok) throw new Error('Échange refusé');
    const data = await exchange.json();
    if (data.error || typeof data.access_token !== 'string' || !data.access_token) throw new Error('Jeton absent');
    const options = { headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${data.access_token}`, 'User-Agent': 'Connect-CMS' }, signal: AbortSignal.timeout(10000) };
    const userResponse = await fetch('https://api.github.com/user', options);
    if (!userResponse.ok) throw new Error('Utilisateur inconnu');
    const user = await userResponse.json();
    if (typeof user.login !== 'string' || user.login.toLowerCase() !== oauth.LOGIN) return oauth.message(res, 403, 'Ce compte GitHub n’est pas autorisé à administrer Connect.');
    const repoResponse = await fetch(`https://api.github.com/repos/${oauth.REPO}`, options);
    if (!repoResponse.ok) return oauth.message(res, 403, 'Le dépôt Connect est inaccessible à ce compte.');
    const repo = await repoResponse.json();
    if (repo.permissions?.push !== true) return oauth.message(res, 403, 'Droits d’écriture requis sur le dépôt Connect.');
    return oauth.success(res, data.access_token);
  } catch { return oauth.message(res, 502, 'Connexion GitHub impossible. Vérifiez le Client ID, le Client Secret et l’adresse de retour dans GitHub, puis réessayez.'); }
};
