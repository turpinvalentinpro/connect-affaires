import fs from 'node:fs';
import path from 'node:path';
import { get, render } from './server/render.mjs';
const pages=JSON.parse(fs.readFileSync('content/pages-manifest.json','utf8'));
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist');
for(const e of fs.readdirSync('.',{withFileTypes:true})) {
 if(e.name.startsWith('.'))continue;
 if(e.isDirectory()) {if(['admin','uploads','ressources','cas-clients'].includes(e.name))fs.cpSync(e.name,path.join('dist',e.name),{recursive:true});}
 else if(/\.(html|jpg|jpeg|png|webm|svg|ico|txt|xml|webp|css)$/.test(e.name))fs.copyFileSync(e.name,path.join('dist',e.name));
}
const previews=[];
for(const page of pages) {
 const data=JSON.parse(fs.readFileSync(page.data,'utf8'));
 for(const f of page.fields.filter(x=>x.kind==='media')) {
  const value=get(data,f.path);
  if(typeof value!=='string'||!fs.existsSync('.'+value))throw Error(`Média absent : ${page.label} / ${value}`);
  if(f.path==='video.video'&&!value.toLowerCase().endsWith('.webm'))throw Error('Vidéo WebM requise');
 }
 const template=fs.readFileSync(page.template,'utf8').replace(/<\/head>/i, '<link rel="stylesheet" href="/responsive-media.css?v=20261007"></head>');
 const html=render(page,data,template);fs.writeFileSync(path.join('dist',page.output),html);
 if(page.id==='accueil')fs.writeFileSync('dist/preview.html',html);
 const clean=template.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<meta\b[^>]*http-equiv[^>]*>/gi,'');
 previews.push({id:page.id,label:page.label,fields:page.fields,template:clean});
}
fs.writeFileSync('dist/admin/preview-data.json',JSON.stringify(previews));
fs.mkdirSync('dist/admin/vendor',{recursive:true});
fs.copyFileSync('node_modules/marked/lib/marked.esm.js','dist/admin/vendor/marked.esm.js');
console.log(`${pages.length} pages générées avec leurs aperçus. Contenu présent dans le HTML.`);
