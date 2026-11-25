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
[].forEach.call(d.querySelectorAll('.c-sub,.c-svc-row,.c-proof,.c-tl-step,.c-faq-item,.c-ref,.c-refs-label,.c-pipe-step,.c-principle,.c-aside,.c-example,.c-list-item,.c-step,.c-form,.c-related-link,.c-legal-h2'),function(el){
if(el.getBoundingClientRect().top<w.innerHeight*.92)return;
var i=[].indexOf.call(el.parentNode.children,el);el.style.setProperty('--d',Math.min(i,6)*90+'ms');el.classList.add('rv');io.observe(el);});
/* Ligne de la timeline : tracee quand le bloc arrive a l'ecran */
var tio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('tl-in');tio.unobserve(e.target);}});},{threshold:.2});
[].forEach.call(d.querySelectorAll('.c-timeline'),function(t){t.classList.add('tl-anim');tio.observe(t);});
/* Compteurs */
var co=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;co.unobserve(en.target);
var el=en.target,to=parseFloat(el.getAttribute('data-count')),pre=el.getAttribute('data-prefix')||'',suf=el.getAttribute('data-suffix')||'',t0=null,dur=1500;
function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1);el.textContent=pre+Math.round(to*(1-Math.pow(1-p,3)))+suf;if(p<1)w.requestAnimationFrame(step);}
w.requestAnimationFrame(step);});},{threshold:.6});
[].forEach.call(d.querySelectorAll('[data-count]'),function(c){co.observe(c);});
})();
/* Consentement cookies et Google Analytics */
(function(){var w=window,d=document,GA='G-YQL7F6LPR1',KEY='connect-consent',MAX=182*864e5;
function get(){try{var v=JSON.parse(localStorage.getItem(KEY));if(v&&Date.now()-v.t<MAX)return v.c;}catch(e){}return null;}
function set(c){try{localStorage.setItem(KEY,JSON.stringify({c:c,t:Date.now()}));}catch(e){}}
function loadGA(){if(w.__ga)return;w.__ga=1;w.dataLayer=w.dataLayer||[];w.gtag=function(){dataLayer.push(arguments);};gtag('js',new Date());gtag('config',GA);var s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA;d.head.appendChild(s);}
function clearGA(){var h=location.hostname.replace(/^www\./,'');d.cookie.split(';').forEach(function(c){var n=c.split('=')[0].trim();if(/^_ga/.test(n)){['','; domain=.'+h,'; domain='+location.hostname].forEach(function(dm){d.cookie=n+'=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'+dm;});}});}
function close(b){b.classList.remove('is-open');setTimeout(function(){b.remove();},250);}
function banner(){if(d.querySelector('.c-cookie'))return;var b=d.createElement('div');b.className='c-cookie';b.setAttribute('role','dialog');b.setAttribute('aria-label','Gestion des cookies');
b.innerHTML='<div class="c-cookie-inner"><p class="c-cookie-text">J\'utilise Google Analytics pour savoir quelles pages sont lues et améliorer le site. Ces cookies de mesure ne sont déposés qu\'avec votre accord. <a href="/politique-de-confidentialite#cookies">En savoir plus</a></p><div class="c-cookie-actions"><button type="button" class="c-cookie-btn is-ghost" data-c="0">Refuser</button><button type="button" class="c-cookie-btn" data-c="1">Accepter</button></div></div>';
b.addEventListener('click',function(e){var t=e.target.closest('[data-c]');if(!t)return;var ok=t.getAttribute('data-c')==='1';set(ok);if(ok)loadGA();else clearGA();close(b);});
d.body.appendChild(b);requestAnimationFrame(function(){b.classList.add('is-open');});}
var c=get();if(c===true)loadGA();else if(c===null)banner();
d.addEventListener('click',function(e){var t=e.target.closest('.js-cookie-prefs');if(!t)return;e.preventDefault();banner();});
})();
