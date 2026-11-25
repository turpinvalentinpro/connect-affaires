# connect-affaires.fr

Site statique HTML/CSS/JS, sans framework ni build. Vercel sert directement le dossier `public/`.

## Structure

- `public/` : le site en ligne (12 pages, 404, sitemap.xml, robots.txt, llms.txt, images, vidéo, styles.css, site.js)
- `vercel.json` : URLs sans .html, redirections 301 des anciennes adresses, en-têtes de cache et de sécurité
- `generateur/` : sources qui produisent `public/` (textes des pages, CSS, données structurées)

## Déployer

1. Dans le dépôt GitHub, supprimer l'ancien contenu (Astro, `admin/`, `src/`, `content/`, `api/`, `server/`, `package.json`, les .html à la racine, etc.) et copier à la place le contenu de ce dossier.
2. Commit puis push sur la branche de production : Vercel redéploie seul.
3. Vercel > Settings > Build & Deployment : Framework Preset « Other ». Le `vercel.json` force déjà l'absence de build et le dossier `public`.
4. Vercel > Settings > Domains : `www.connect-affaires.fr` en domaine principal, `connect-affaires.fr` redirigé vers www (308).

## Vérifier après la mise en ligne

- https://www.connect-affaires.fr/conseil-commercial-aix-en-provence.html doit rediriger vers la même URL sans .html
- https://www.connect-affaires.fr/politique-confidentialite.html doit rediriger vers /politique-de-confidentialite
- Envoyer le formulaire de contact une fois pour tester Web3Forms
- Search Console : soumettre https://www.connect-affaires.fr/sitemap.xml et inspecter l'accueil

## Modifier un texte

Option simple : éditer directement le fichier HTML concerné dans `public/`.

Option propre (garde le générateur à jour) : modifier le texte dans `generateur/pages_*.py`, puis lancer `python3 generateur/build.py` et pousser.
Penser à mettre à jour `LASTMOD` dans `build.py` pour le sitemap.
