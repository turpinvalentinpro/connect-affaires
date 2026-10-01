# Mise à jour — Administration visuelle Connect

## Installation sur le CMS déjà en service

Cette archive est une MISE À JOUR, pas un site complet. Ajouter son contenu à la racine du dépôt turpinvalentinpro/connect-affaires, branche main. Conserver les fichiers et dossiers déjà présents. Les nouvelles versions de admin/, build.mjs et package.json remplacent celles du même nom.

1. Décompresser connect-cms-visuel-mise-a-jour.zip.
2. GitHub > dépôt connect-affaires > branche main > Add file > Upload files.
3. Glisser les fichiers ET les dossiers de l'archive depuis l'Explorateur Windows dans la zone d'import. Ne pas déposer le dossier parent ni le ZIP.
4. Vérifier la présence de admin/editeur.html, admin/previews.js, admin/editor.css, content/accueil.json, content/pages-manifest.json, templates/accueil.html, server/render.mjs, build.mjs, package.json et package-lock.json, ainsi que les dossiers content/pages et templates/pages.
5. Faire un seul commit : « Administration visuelle et édition des pages ».
6. Attendre Ready sur le nouveau déploiement Vercel, puis ouvrir https://www.connect-affaires.fr/admin/ et actualiser avec Ctrl+F5 si l'ancien écran reste visible.

Ne pas recréer l'application OAuth. Ne pas changer les variables GitHub déjà enregistrées dans Vercel. Les fonctions api/auth.js, api/callback.js et server/oauth.js restent en place et ne sont pas remplacées par cette mise à jour.

Les contenus proviennent du dépôt actuel, commit b1f2819 (récupéré le 1er octobre 2026). L'accueil a été relu avant la livraison et était inchangé. Éviter de modifier simultanément les contenus pendant cet import. Si vous avez publié de nouveaux changements depuis, demander une actualisation de la migration avant import.

## Votre nouvelle interface

/admin/ affiche les pages sous forme de cartes avec images, classées en Accueil, Pages services, Ressources et guides, Cas client et Informations légales. Choisir « Modifier la page » pour accéder à l'éditeur connecté à GitHub.

Les champs sont regroupés en rubriques repliables dans l'ordre de la page. Déplier seulement la rubrique concernée. L'aperçu affiche la mise en page du site avec les modifications non publiées. C'est un aperçu de contenu, pas un outil permettant de déplacer librement les blocs ni de modifier par clic direct sur la page. Les liens, formulaires et scripts du site sont désactivés dans l'aperçu.

Sur ordinateur, les champs et l'aperçu sont côte à côte. Sur écran de moins de 800 pixels, l'interface est adaptée pour afficher une seule colonne ; le bouton « Voir l'aperçu » / « Revenir aux champs » alterne les vues. Dans l'aperçu, le bouton Téléphone simule une largeur maximale de 390 pixels. Utiliser Safari ou Chrome et autoriser la fenêtre de connexion GitHub si nécessaire.

L'adaptation responsive est fournie mais n'a pas pu être contrôlée visuellement dans un navigateur dans cet environnement. Vérifier les boutons, le défilement, l'ouverture des rubriques et la publication sur votre téléphone après installation. En cas de problème, envoyer une capture ; l'accès ordinateur reste la référence pour la validation initiale.

## Pages disponibles

- Accueil : les 32 champs existants, organisés en 9 rubriques.
- Conseil commercial, Marketing BtoB, Acquisition BtoB, CRM et organisation : textes, images, descriptions d'images et boutons du contenu principal.
- Ressources : introduction et cartes existantes.
- Guides développement commercial et marketing BtoB.
- Cas client Fer de Lance.
- Mentions légales et politique de confidentialité.

440 champs sont proposés sur 11 pages. Les liens intégrés aux paragraphes enrichis peuvent être modifiés avec l'éditeur de texte. Les adresses des pages, balises SEO techniques, navigation et pied de page commun des pages annexes restent encadrés. Pas de création/suppression libre de pages ni de nouvelles sections. Les rubriques existantes restent en place.

Les textes détaillés de services, avis et FAQ de l'accueil ne sont pas ajoutés aux 32 champs de l'accueil dans cette mise à jour. Les FAQ des pages services sont, elles, éditables.

Les changements sont enregistrés dans GitHub, puis Vercel reconstruit les pages. Le CMS ne remplace pas le contenu du site instantanément : attendre Ready avant de vérifier la publication.

## Contenus et SEO

Après migration, le contenu éditable de l'accueil est dans content/accueil.json. L'ancien content/home.json n'est plus la source utilisée pour générer l'accueil. Le modèle utilisé est templates/accueil.html. Les autres pages utilisent content/pages et templates/pages. Ne pas modifier directement les fichiers HTML générés à la racine pour changer le contenu : le build utilise les modèles.

Les 11 pages générées sont identiques octet par octet aux pages actuelles tant qu'aucun contenu n'est modifié. Les URL, liens canoniques, titres SEO, descriptions, sitemap, redirections et design restent conservés. Les textes sont intégrés au HTML lors de la génération. Quand une réponse ou question FAQ éditable change, la chaîne correspondante est également mise à jour dans les données structurées de cette page.

Les balises techniques SEO restent fixes dans cette version : une refonte importante du sujet d'une page doit donc être accompagnée d'une révision manuelle de ces balises.

Les pages admin sont déjà couvertes par les en-têtes noindex de la configuration Vercel existante. Les aperçus sont internes à l'administration et ne créent pas de nouvelles pages indexables. Le tableau de bord montre uniquement des informations publiques ; l'édition et la publication nécessitent la connexion GitHub.

## Vérifications effectuées

- Génération des 11 pages.
- Comparaison exacte du HTML avec la version actuelle du dépôt.
- Correspondance des 440 champs entre données, configuration CMS et modèles.
- Contrôles OAuth locaux conservés.
- Modification d'une FAQ et synchronisation des données structurées.
- Refus des liens dangereux et nettoyage des champs enrichis.
- Enregistrement des 11 aperçus et modification simulée d'un titre dans l'aperçu.

Validation réelle après import : ouvrir l'éditeur Marketing BtoB, déplier l'en-tête, modifier un texte, contrôler l'aperçu, publier et vérifier le nouveau déploiement. Puis contrôler le même parcours sur téléphone. Les tests locaux ne remplacent pas la vérification de l'interface réelle.

## Retour arrière

Annuler uniquement le commit de cette mise à jour dans GitHub et redéployer. Les anciens fichiers content/home.json et templates/index.html restent disponibles, et l'ancien commit permet de rétablir build.mjs et la configuration de l'administration. Sauvegarder d'abord les nouvelles modifications éventuelles réalisées après migration.
