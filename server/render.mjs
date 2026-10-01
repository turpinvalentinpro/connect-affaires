import { marked } from 'marked';
import sanitize from 'sanitize-html';
export const escape = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
export const get = (data,path) => path.split('.').reduce((v,k) => v?.[k],data);
export const plain = html => sanitize(html,{allowedTags:[],allowedAttributes:{}}).replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'");
export function inline(value) {
 return sanitize(marked.parseInline(value,{breaks:true}),{allowedTags:['strong','em','b','i','a','br','code','s'],allowedAttributes:{a:['href','title']},allowedSchemes:['https','http','mailto','tel'],allowProtocolRelative:false});
}
export function validate(value,kind) {
 if(typeof value!=='string'||!value.trim()||value.length>12000)throw Error('Texte vide ou trop long');
 if(kind==='email'&&!/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))throw Error('Email invalide');
 if(kind==='url'&&!/^https:\/\/[^\s"'<>]+$/.test(value))throw Error('Lien HTTPS requis');
 if(kind==='link'&&!/^(?:https?:\/\/[^\s"'<>]+|mailto:[^\s"'<>]+|tel:[+\d\s()-]+|\/(?!\/)[^\s"'<>]*|#[\w-]+)$/.test(value))throw Error('Lien invalide');
 if(kind==='media'&&(!/^\/(?!\/)[a-zA-Z0-9_./%-]+$/.test(value)||value.includes('..')))throw Error('Chemin de média invalide');
}
export function render(page,data,template) {
 const values={},changes=new Map();
 for(const f of page.fields) {
  const value=get(data,f.path);try { validate(value,f.kind); } catch(e) {throw Error(`${page.label} / ${f.path} : ${e.message}`);}
  values[f.path]=f.original!==undefined&&value===f.default ? f.original : f.kind==='inline' ? inline(value) : escape(value);
  if(f.original!==undefined&&value!==f.default)changes.set(plain(f.original),f.kind==='inline'?plain(inline(value)):value);
 }
 let html=template.replace(/\{\{([\w.]+)\}\}/g,(_,key)=>{if(!(key in values))throw Error('Champ manquant '+key);return values[key];});
 if(changes.size)html=html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,(_,open,json,close)=>{
  const update=v=>typeof v==='string'?(changes.get(v)??v):Array.isArray(v)?v.map(update):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,update(x)])):v;
  return open+JSON.stringify(update(JSON.parse(json))).replaceAll('<','\\u003c')+close;
 });
 return html;
}
