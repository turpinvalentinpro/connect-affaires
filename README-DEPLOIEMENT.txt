CONNECT - version Astro + GSAP

Déploiement GitHub / Vercel

1. Déposer le CONTENU de ce dossier à la racine du dépôt GitHub.
2. Dans Vercel :
   Framework Preset : Astro
   Build Command : npm run build
   Output Directory : dist
   Install Command : laisser Vercel utiliser npm install automatiquement
3. Relancer un déploiement.

Le fichier vercel.json contient déjà buildCommand et outputDirectory.

Pages désormais rendues par Astro :
- /
- /ressources.html
- /conseil-commercial-aix-en-provence.html
- /marketing-btob-aix-en-provence.html
- /acquisition-btob-aix-en-provence.html
- /crm-organisation-commerciale-aix-en-provence.html
- /structurer-developpement-commercial-pme.html
- /marketing-btob-tpe-pme.html
- /cas-client-fer-de-lance.html

Les anciennes URLs imbriquées /ressources/... et /cas-clients/... sont redirigées par vercel.json.

SEO conservé : canonical, meta descriptions, données structurées, sitemap.xml, robots.txt et URLs .html déjà connues de Google.
