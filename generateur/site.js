(function(){
var d=document,w=window,root=d.documentElement,hasIO='IntersectionObserver' in w,rm=w.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Formulaire de contact (Web3Forms) */
[].forEach.call(d.querySelectorAll('form.c-form'),function(f){var ok=f.querySelector('.c-form-msg.ok'),ko=f.querySelector('.c-form-msg.err'),btn=f.querySelector('[type=submit]');
f.addEventListener('submit',function(e){e.preventDefault();if(ok)ok.classList.remove('is-ok');if(ko)ko.classList.remove('is-err');var label=btn.value;btn.value='Envoi en cours...';btn.disabled=true;
fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){return r.json();}).then(function(j){if(j&&j.success){f.reset();if(ok)ok.classList.add('is-ok');}else{throw 0;}}).catch(function(){if(ko)ko.classList.add('is-err');}).then(function(){btn.value=label;btn.disabled=false;});});});
/* Video : lecture muette uniquement quand elle est visible */
[].forEach.call(d.querySelectorAll('video.c-video'),function(v){v.muted=true;v.defaultMuted=true;v.playsInline=true;
if(!hasIO){var p=v.play();if(p&&p.catch)p.catch(function(){});return;}
new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){});}else{v.pause();}});},{threshold:.2}).observe(v);});
/* Trait sous "TPE et PME" dans le titre principal */
var h1=d.querySelector('h1.c-h1');
if(h1&&h1.childNodes.length===1&&h1.firstChild.nodeType===3){var t=h1.firstChild,k='TPE et PME',i=t.data.indexOf(k);if(i>-1){var mid=t.splitText(i);mid.splitText(k.length);var s=d.createElement('span');s.className='c-mark';mid.parentNode.replaceChild(s,mid);s.appendChild(mid);
if(!rm){root.classList.add('js-mark');w.requestAnimationFrame(function(){w.requestAnimationFrame(function(){s.classList.add('on');});});}}}
/* En-tete compact, barre de progression, video qui s'agrandit */
var hdr=d.querySelector('.c-header'),bar=d.createElement('div');bar.className='c-progress';bar.setAttribute('aria-hidden','true');d.body.appendChild(bar);
var vw=d.querySelector('.c-video-wrap'),tick=false;
function onScroll(){tick=false;var y=w.pageYOffset||root.scrollTop,max=root.scrollHeight-w.innerHeight;
bar.style.transform='scaleX('+(max>0?Math.min(y/max,1):0).toFixed(4)+')';
if(hdr)hdr.classList.toggle('is-scrolled',y>40);
if(vw&&!rm){var r=vw.getBoundingClientRect(),vh=w.innerHeight,p=Math.min(Math.max((vh-r.top)/(vh*.85),0),1);vw.style.transform='scale('+(.84+.16*p).toFixed(4)+')';vw.style.borderRadius=(44-26*p).toFixed(1)+'px';}}
w.addEventListener('scroll',function(){if(!tick){tick=true;w.requestAnimationFrame(onScroll);}},{passive:true});
w.addEventListener('resize',onScroll,{passive:true});onScroll();
if(!hasIO||rm)return;
/* Apparition des blocs au defilement (le contenu reste dans le HTML) */
root.classList.add('js-rv');
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('rv-in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.12});
[].forEach.call(d.querySelectorAll('.c-sub,.c-svc-row,.c-proof,.c-tl-step,.c-timeline,.c-faq-item,.c-ref,.c-refs-label,.c-pipe-step,.c-principle,.c-aside,.c-example,.c-list-item,.c-step,.c-form,.c-related-link,.c-legal-h2'),function(el){
if(el.getBoundingClientRect().top<w.innerHeight*.92)return;
var i=[].indexOf.call(el.parentNode.children,el);el.style.setProperty('--d',Math.min(i,6)*90+'ms');el.classList.add('rv');io.observe(el);});
/* Compteurs */
var co=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;co.unobserve(en.target);
var el=en.target,to=parseFloat(el.getAttribute('data-count')),pre=el.getAttribute('data-prefix')||'',suf=el.getAttribute('data-suffix')||'',t0=null,dur=1500;
function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1);el.textContent=pre+Math.round(to*(1-Math.pow(1-p,3)))+suf;if(p<1)w.requestAnimationFrame(step);}
w.requestAnimationFrame(step);});},{threshold:.6});
[].forEach.call(d.querySelectorAll('[data-count]'),function(c){co.observe(c);});
})();
