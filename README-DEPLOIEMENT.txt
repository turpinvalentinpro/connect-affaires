CONNECT — VERSION ASTRO + GSAP

Structure
- Homepage : Astro + GSAP
- Pages SEO existantes : conservées telles quelles dans /public pour ne pas modifier leurs URLs
- Assets : /public
- Build : dist/

Vercel
1. Framework Preset : Astro (recommandé). Si le projet reste sur Other, cela fonctionne aussi avec les réglages ci-dessous.
2. Build Command : npm run build
3. Output Directory : dist
4. Install Command : npm install (ou laisser Vercel le détecter)
5. Root Directory : racine du dépôt

Le fichier vercel.json contient également buildCommand et outputDirectory afin d'éviter l'ancienne erreur liée au dossier public.

SEO conservé
- URL d'accueil inchangée
- pages locales .html inchangées
- ressources .html inchangées
- cas client inchangé
- sitemap.xml conservé
- robots.txt conservé
- données structurées sur la homepage
- contenu principal rendu en HTML statique par Astro

Commandes locales
npm install
npm run dev
npm run build
