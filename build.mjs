import fs from 'node:fs';
import path from 'node:path';
const data=JSON.parse(fs.readFileSync('content/home.json','utf8'));
const schema=JSON.parse(fs.readFileSync('content/schema.json','utf8'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
const values={};
for(const {key,kind} of schema){
 const v=data[key];
 if(typeof v!=='string'||!v.trim()||v.length>6000)throw Error(`Champ invalide : ${key}`);
 if(kind==='email'&&!/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v))throw Error('Email invalide');
 if(kind==='url'&&!/^https:\/\/[^\s"'<>]+$/.test(v))throw Error('Lien HTTPS requis');
 if(kind==='media'&&!/^\/(?!\/)[a-zA-Z0-9_./%-]+$/.test(v))throw Error('Chemin média local requis');
 if(kind==='media'&&(v.includes('..')||!fs.existsSync('.'+v)))throw Error(`Média absent : ${v}`);
 if(key==='video'&&!v.toLowerCase().endsWith('.webm'))throw Error('La vidéo doit être au format WebM');
 values[key]=escape(v);
}
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist');
for(const e of fs.readdirSync('.',{withFileTypes:true})){
 if(e.name.startsWith('.')||['dist','node_modules','templates','content','package.json','package-lock.json','build.mjs','vercel.json','INSTALLATION.md','api','server','tests'].includes(e.name))continue;
 if(e.isDirectory()||/\.(html|jpg|jpeg|png|webm|svg|ico|txt|xml|webp|css|js)$/.test(e.name))fs.cpSync(e.name,path.join('dist',e.name),{recursive:true});
}
const template=fs.readFileSync('templates/index.html','utf8');
const output=template.replace(/\{\{(\w+)\}\}/g,(_,key)=>{if(!(key in values))throw Error(`Champ inconnu : ${key}`);return values[key]});
fs.writeFileSync('dist/index.html',output);fs.writeFileSync('dist/preview.html',output);
console.log(`Landing page générée : ${schema.length} champs ; pages annexes conservées.`);
