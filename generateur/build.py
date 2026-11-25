# -*- coding: utf-8 -*-
import json, os, shutil, html, re
from parts import *
from pages_home import HOME_MAIN
from pages_services import CONSEIL, MARKETING, ACQ, CRM
from pages_other import APROPOS, MENTIONS, CONFID, RESSOURCES, CAS, STRUCT, MKTG
import pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=str(ROOT/"public")
CDN="https://cdn.prod.website-files.com/6b06dfb1e0f326915ad32bd6/"
REWRITE={CDN+"6b06e2026fa456232f154d67_valentin.jpg":SITE+"/valentin.jpg",
 CDN+"6b06e9d9a7e7b990811edbf8_connect-motion-conseil-commercial.webm":SITE+"/connect-motion-16x9.webm",
 CDN+"6b06e9f9ec4de9743ea25ec9_connect-motion-conseil-commercial-poster.jpg":SITE+"/connect-motion-poster.jpg"}
def fix(o):
    s=json.dumps(o,ensure_ascii=False)
    for a,b in REWRITE.items(): s=s.replace(a,b)
    assert "website-files" not in s; return s
B=str(ROOT/"generateur"/"jsonld")+"/"
LD={"":json.load(open(B+"home2.json"))}
ids={"6b06e158c9b7355851072a3d":"conseil-commercial-aix-en-provence","6b06e1591f8b835785efe8ba":"marketing-btob-aix-en-provence","6b06e159bca309f22e0aff51":"acquisition-btob-aix-en-provence","6b06e15993a2d9a4500828ec":"crm-organisation-commerciale-aix-en-provence","6b06e15993a2d9a450082909":"a-propos","6b06f948f7822bddfb048a4e":"structurer-developpement-commercial-pme","6b06f9495f5cc620b9231ce6":"marketing-btob-tpe-pme","6b06f948f7822bddfb048a30":"cas-client-fer-de-lance","6b06f948aabb5b4f5b1cb7ce":"ressources"}
for f in ("pages.json","newpages.json"):
    for p in json.load(open(B+f)): LD[ids[p["id"]]]=p["jsonLdSchema"]
PAGES=[  # slug, title, description, body, og type
("","Conseil commercial et marketing BtoB à Aix-en-Provence | Connect","Connect accompagne les TPE et PME d'Aix-en-Provence, Marseille et PACA : stratégie commerciale, marketing BtoB, acquisition et CRM. Un seul interlocuteur, au forfait.",HOME_MAIN,"website"),
("conseil-commercial-aix-en-provence","Conseil commercial à Aix-en-Provence pour TPE et PME | Connect","Conseil commercial à Aix-en-Provence : positionnement, offre, ciblage, plan d'action et pilotage pour les TPE, PME et dirigeants. Diagnostic court possible.",CONSEIL,"website"),
("marketing-btob-aix-en-provence","Marketing BtoB à Aix-en-Provence pour TPE et PME | Connect","Marketing BtoB à Aix-en-Provence : messages, contenus, landing pages et visibilité locale pour attirer les bons prospects et les convertir en rendez-vous.",MARKETING,"website"),
("acquisition-btob-aix-en-provence","Acquisition BtoB et prospection à Aix-en-Provence | Connect","Acquisition BtoB à Aix-en-Provence : ciblage, prospection, campagnes, partenariats et suivi des leads pour un flux d'opportunités plus régulier.",ACQ,"website"),
("crm-organisation-commerciale-aix-en-provence","CRM et organisation commerciale à Aix-en-Provence | Connect","Mise en place ou simplification de CRM pour TPE et PME à Aix-en-Provence : pipeline clair, relances organisées, indicateurs simples.",CRM,"website"),
("a-propos","Valentin Turpin, fondateur de Connect, Aix-en-Provence","Valentin Turpin a créé Connect après des études de communication et une expérience terrain dans la vente. Il accompagne les TPE et PME du pays d'Aix et de PACA.",APROPOS,"profile"),
("ressources","Ressources commerciales et marketing BtoB pour TPE et PME | Connect","Guides et cas client pour structurer votre développement commercial et votre marketing BtoB : méthodes concrètes, exemples réels, à appliquer à votre échelle.",RESSOURCES,"website"),
("cas-client-fer-de-lance","Cas client Fer de Lance : site, visibilité et acquisition | Connect","Comment Fer de Lance Tattoo est passé d'abonnés sur les réseaux à des demandes de devis régulières : contexte, actions menées et résultats rapportés par la cliente.",CAS,"article"),
("structurer-developpement-commercial-pme","Comment structurer le développement commercial d'une PME | Connect","Cible, offre, canaux, suivi des leads, indicateurs : la méthode en 6 étapes pour structurer le développement commercial d'une PME sans alourdir l'organisation.",STRUCT,"article"),
("marketing-btob-tpe-pme","Marketing BtoB : par où commencer en TPE ou PME ? | Connect","Objectif commercial, parcours du prospect, contenus utiles, conversion, indicateurs : par où commencer le marketing BtoB quand on est une TPE ou une PME.",MKTG,"article"),
("mentions-legales","Mentions légales | Connect","Mentions légales du site connect-affaires.fr : éditeur, hébergeur et propriété intellectuelle.",MENTIONS,"website"),
("politique-de-confidentialite","Politique de confidentialité | Connect","Comment Connect collecte, utilise et protège les données personnelles transmises via le site connect-affaires.fr.",CONFID,"website"),
]
LASTMOD="2026-11-25"
def head(slug,title,desc,ogt):
    url=SITE+("/"+slug if slug else "/"); e=html.escape
    img=SITE+("/valentin.jpg" if slug=="a-propos" else "/connect-motion-poster.jpg")
    ld=f'<script type="application/ld+json">{fix(LD[slug])}</script>' if slug in LD else ""
    pre='<link rel="preload" as="image" href="/connect-motion-poster.jpg">' if slug=="" else ""
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="{ogt}">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Connect">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{img}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(title)}">
<meta name="twitter:description" content="{e(desc)}">
<meta name="twitter:image" content="{img}">
<meta name="theme-color" content="#0b1f3a">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt">
<link rel="stylesheet" href="/styles.css">
{pre}{ld}
</head>
<body>
'''
os.makedirs(OUT+"/clients",exist_ok=True)
for slug,t,d,body,ogt in PAGES:
    doc=head(slug,t,d,ogt)+HEADER+"\n"+body+"\n"+FOOTER+'\n<script src="/site.js" defer></script>\n</body>\n</html>\n'
    open(f"{OUT}/{slug or 'index'}.html","w").write(doc)
# 404
open(OUT+"/404.html","w").write(head("404","Page introuvable | Connect","Cette page n'existe pas ou a été déplacée.","website").replace('<link rel="canonical" href="'+SITE+'/404">','').replace('index, follow, max-image-preview:large','noindex')+HEADER+'<main class="c-legal"><div class="c-container"><div class="c-legal-inner"><h1 class="c-h1-page">Page introuvable</h1><p class="c-p">Cette page n\'existe pas ou a été déplacée.</p><a href="/" class="c-btn">Retour à l\'accueil</a></div></div></main>'+FOOTER+'<script src="/site.js" defer></script></body></html>')
for f in ("base.css","styles-webflow.css","anim.css"): pass
open(OUT+"/styles.css","w").write("".join(open(str(ROOT/"generateur"/f)).read() for f in ("base.css","styles-webflow.css","anim.css")))
shutil.copy(str(ROOT/"generateur"/"site.js"),OUT+"/site.js")
# sitemap / robots
urls=''.join(f'  <url><loc>{SITE}/{s}</loc><lastmod>{LASTMOD}</lastmod></url>\n' for s,*_ in PAGES)
open(OUT+"/sitemap.xml","w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'</urlset>\n')
open(OUT+"/robots.txt","w").write("User-agent: *\nAllow: /\n\n# Guide pour les assistants IA : https://www.connect-affaires.fr/llms.txt\nSitemap: https://www.connect-affaires.fr/sitemap.xml\n")
print("ok", sorted(os.listdir(OUT)))
