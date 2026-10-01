# Connect — CMS pour la production

Dépôt : https://github.com/turpinvalentinpro/connect-affaires
Branche : main
Administration : https://www.connect-affaires.fr/admin/

Cette archive contient le site et le CMS, y compris les fonctions de connexion GitHub pour Vercel. Elle n'a pas été déployée par l'assistant. Aucun secret réel n'est inclus. La connexion et la publication réelles doivent encore être validées sur votre compte.

## Installation

1. Les variables GITHUB_CLIENT_ID et GITHUB_CLIENT_SECRET doivent être enregistrées dans le projet Vercel, environnement Production. Elles viennent de votre application OAuth GitHub Connect CMS. Ne les ajoutez pas aux fichiers GitHub.
2. Dans cette application OAuth, Homepage URL = https://www.connect-affaires.fr ; Authorization callback URL = https://www.connect-affaires.fr/api/callback. Device Flow désactivé, expiration des jetons désactivée pour ce flux sans renouvellement.
3. Conserver une copie de l'ancien site ou noter le commit de production avant l'import. La capture fournie indiquait 71eb2bb ; vérifier qu'il est toujours le dernier commit avant installation.
4. Décompresser le ZIP. Dans GitHub, branche main, choisir Add file > Upload files. Glisser le CONTENU du dossier décompressé à la racine (pas le ZIP, pas un dossier parent). L'import doit contenir notamment api/, server/, admin/, content/, templates/, build.mjs, package.json et vercel.json, ainsi que les fichiers du site. Un seul commit : « Installer administration Connect ».
5. Vercel reconstruit le projet depuis main. vercel.json prévoit Framework = Other (null), Build Command = npm run build, Output Directory = dist et les fonctions api/. Si Vercel signale un conflit avec un réglage existant, ouvrir Settings > Build and Deployment et utiliser ces valeurs. Runtime Node.js 22.x.
6. Attendre Ready sur le NOUVEAU déploiement et vérifier le site public. Ne pas confondre avec un ancien déploiement encore Ready.
7. Ouvrir exactement https://www.connect-affaires.fr/admin/ ; autoriser la fenêtre de connexion si le navigateur la bloque. Se connecter avec turpinvalentinpro et autoriser Connect CMS.
8. Ouvrir « Landing page Connect » puis « Textes, médias et contact ». Modifier un petit texte, publier, attendre le nouveau déploiement Ready, puis vérifier ce texte sur le site public. Le rétablir si c'était un essai.

## Connexion et droits

L'accès est réservé au compte turpinvalentinpro et vérifie ses droits d'écriture sur turpinvalentinpro/connect-affaires. Le compte connecté doit aussi disposer du droit de pousser sur main ; une protection de branche peut empêcher la publication directe.

Le flux OAuth utilise le scope GitHub repo pour fonctionner aussi avec un dépôt privé. GitHub peut donc annoncer un accès plus large aux dépôts du compte : ce scope OAuth n'est pas limité à un seul dépôt. Le code de cette installation vérifie l'identité et le dépôt Connect, mais ne réduit pas la portée du jeton auprès de GitHub. Pour retirer l'accès, révoquer Connect CMS dans GitHub > Settings > Applications > Authorized OAuth Apps. Une future duplication pour un client nécessite une configuration et des identifiants séparés.

Le secret OAuth reste côté serveur dans Vercel. Le jeton utilisateur est remis à Decap dans le navigateur, conformément au fonctionnement du CMS. Se déconnecter du CMS sur un ordinateur partagé. Ne pas ajouter de jeton, de secret ou de fichier .env dans GitHub.

Les fonctions ont une session signée limitée à dix minutes, state, PKCE, cookies Secure/HttpOnly/SameSite=Lax et vérification exacte de l'origine de la fenêtre admin. Les réponses OAuth ne sont pas mises en cache. Les pages admin et API sont noindex ; preview.html est aussi noindex. Seul le domaine www.connect-affaires.fr permet la connexion de production.

## Ce qui est modifiable

32 champs : accroche, titres et introductions, méthode, présentation, portrait et description, couverture et vidéo WebM, email public, zone de contact, lien Google, texte des boutons et pied de page. L'aperçu visuel Decap est désactivé ; vérifier le résultat sur le site après déploiement.

Les textes détaillés des prestations, témoignages, FAQ, pages annexes et réglages SEO ne sont pas éditables dans cette version. Pas de création libre de pages ou de sections. La structure du site reste encadrée.

Les contenus sont dans content/home.json ; le modèle de la landing page est templates/index.html. Ne pas éditer directement index.html ou dist/index.html pour les futurs changements de contenu : le build les régénère depuis le modèle et le contenu.

Images : noms simples sans espaces ni accents, JPG/PNG/WebP compressés. Les fichiers importés vont dans uploads/. Vidéo : WebM. Les médias locaux doivent exister dans le dépôt. Un fichier trop volumineux peut dépasser les limites de GitHub ou ralentir le site.

L'email éditable est l'adresse publique de l'accueil. Le destinataire Web3Forms ne change pas automatiquement ; il dépend du compte Web3Forms existant. Les coordonnées des mentions légales et pages annexes restent à modifier séparément.

## Si une étape échoue

- /admin/ renvoie 404 : vérifier le dernier déploiement, la présence du dossier admin à la racine et le dossier de sortie dist.
- /api/auth renvoie 404 : vérifier api/auth.js et api/callback.js à la racine du dépôt, avec server/oauth.js ; ces fonctions ne doivent pas être déplacées dans dist.
- Connexion non configurée : vérifier les deux variables Vercel et redéployer après leur enregistrement.
- Erreur de callback : vérifier l'URL GitHub, avec https, www et /api/callback exactement.
- Fenêtre de connexion bloquée : autoriser les popups, fermer la fenêtre et recommencer depuis /admin/.
- Compte non autorisé : utiliser turpinvalentinpro.
- Enregistrement refusé : vérifier les droits GitHub et les protections de main.
- Build refusé : lire les logs Vercel ; corriger le champ ou le chemin de média indiqué. Vercel conserve normalement le précédent déploiement opérationnel.

Retour arrière : utiliser le précédent déploiement dans Vercel pour restaurer le service, puis annuler le commit concerné dans GitHub afin qu'un déploiement ultérieur ne réintroduise pas le problème.

## Vérifications réalisées et limites

npm test : contrôles de session, PKCE, identité, droits, échange de messages entre fenêtres et erreurs réseau avec appels GitHub simulés.
npm run build : 32 champs générés. HTML de la landing page identique à la version préparée avant ajout de l'authentification. Pages annexes, sitemap et robots conservés. Fichiers serveur, tests et contenu source exclus du dossier public dist. Le script Decap 3.16.3 est accessible sur son CDN.

La connexion OAuth réelle, la sauvegarde GitHub, le déploiement Vercel et l'affichage du CMS restent à vérifier après installation. Les tests simulés ne remplacent pas cette validation.

Decap ne nécessite pas d'abonnement CMS. Les conditions et limites du compte Vercel restent applicables ; cette archive ne change pas le plan d'hébergement.
