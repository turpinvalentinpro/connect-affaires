import { marked } from './vendor/marked.esm.js';
const escape = s => String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const get=(data,path)=>path.split('.').reduce((v,k)=>v?.[k],data);
function inline(value) {
 const doc=new DOMParser().parseFromString(marked.parseInline(value,{breaks:true}),'text/html');
 const tags=new Set(['STRONG','EM','B','I','A','BR','CODE','S']);
 for(const el of [...doc.body.querySelectorAll('*')].reverse()) {
  if(!tags.has(el.tagName)){el.replaceWith(...el.childNodes);continue;}
  for(const attr of [...el.attributes])if(el.tagName!=='A'||!['href','title'].includes(attr.name))el.removeAttribute(attr.name);
  if(el.tagName==='A'&&(!/^(?:https?:|mailto:|tel:|\/(?!\/)|#)/i.test(el.getAttribute('href')||'')))el.removeAttribute('href');
 }
 return doc.body.innerHTML;
}
export function registerPreviews(pages) {
 const h=window.h;
 for(const page of pages) {
  const Preview=window.createClass({
   getInitialState(){return {mobile:false};},
   render(){
    const data=this.props.entry.get('data').toJS(),values={};
    for(const f of page.fields) {
     const v=get(data,f.path)??'';
     values[f.path]=f.original!==undefined&&v===f.default?f.original:f.kind==='inline'?inline(v):escape(v);
     if(f.kind==='media'&&v){try{values[f.path]=escape(this.props.getAsset(v).toString());}catch{}}
    }
    let html=page.template.replace(/\{\{([\w.]+)\}\}/g,(_,key)=>values[key]??'');
    html=html.replace(/<head[^>]*>/i,match=>match+'<base href="'+escape(location.origin)+'/">');
    html=html.replace(/<\/head>/i,'<style>html{scroll-behavior:auto}body{pointer-events:none}.reveal,.reveal-up,.fade-in,[data-reveal]{opacity:1!important;transform:none!important}*{animation:none!important;transition:none!important}.site-header{position:relative!important}</style></head>');
    return h('div',{style:{margin:0,background:'#e9eef4',minHeight:'100vh'}},
     h('div',{style:{display:'flex',gap:8,alignItems:'center',padding:12,position:'sticky',top:0,zIndex:99,background:'#fff',borderBottom:'1px solid #dde4ee',flexWrap:'wrap'}},
      h('strong',{style:{font:'600 13px system-ui',marginRight:'auto'}},'Aperçu · '+page.label),
      h('button',{type:'button',onClick:()=>this.setState({mobile:false}),style:{padding:'9px 12px',border:'1px solid #ccd6e2',borderRadius:8,background:this.state.mobile?'white':'#dff2ff'}},'Adaptatif'),
      h('button',{type:'button',onClick:()=>this.setState({mobile:true}),style:{padding:'9px 12px',border:'1px solid #ccd6e2',borderRadius:8,background:this.state.mobile?'#dff2ff':'white'}},'Téléphone')),
     h('p',{style:{font:'12px system-ui',padding:'0 12px',color:'#526178'}},'Les changements ne sont pas encore publiés. Les liens et formulaires sont désactivés dans cet aperçu.'),
     h('iframe',{title:'Aperçu de '+page.label,srcDoc:html,sandbox:'allow-same-origin',style:{display:'block',width:this.state.mobile?'min(390px,100%)':'100%',height:'calc(100vh - 105px)',minHeight:450,border:0,margin:'0 auto',background:'white'}}));
   }
  });
  CMS.registerPreviewTemplate(page.id,Preview);
 }
 CMS.registerPreviewStyle('body{margin:0!important;padding:0!important;max-width:none!important}button{cursor:pointer}',{raw:true});
}
