(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let leaving=false;
const native='onpagereveal' in window&&'CSSViewTransitionRule' in window;
addEventListener('pageshow',()=>{leaving=false;document.body.getAnimations().forEach(a=>a.cancel());});
document.addEventListener('click',e=>{
 const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;
 const u=new URL(a.href);if(u.origin!==location.origin||!/^https?:$/.test(u.protocol)||u.pathname===location.pathname&&u.search===location.search)return;
 if(native)return;
 if(leaving){e.preventDefault();return;}if(reduced.matches)return;
 leaving=true;e.preventDefault();
 const go=()=>location.assign(u.href);
 document.body.animate([{opacity:1},{opacity:0}],{duration:120,easing:'ease-out',fill:'forwards'}).finished.then(go,go);
});
/* Lot 12 (Claude): the clicked window travels to the project's opening image, and back. */
const NAME='bv-window',off=()=>{try{return sessionStorage.getItem('bv-motion')==='off';}catch{return false;}};
const slug=u=>{try{return new URL(u,location.href).pathname.split('/').pop().replace(/\.html$/,'');}catch{return '';}};
const isIndex=p=>/\/projects\/(index(\.html)?)?$/.test(p);
const hero=()=>document.querySelector('.hero-visual .image-open');
const card=s=>s&&document.querySelector(`.project-card[href$="${s}.html"] .card-image,a[href$="/${s}.html"] .card-image,a[href="${s}.html"] .card-image`);
const tag=(el,vt)=>{if(!el)return;el.style.viewTransitionName=NAME;vt.finished.catch(()=>{}).finally(()=>{el.style.viewTransitionName='';});};
let lastCard=null;
document.addEventListener('pointerdown',e=>{lastCard=e.target.closest('a')?.querySelector('.card-image')||null;},true);
addEventListener('pageswap',e=>{const vt=e.viewTransition;if(!vt)return;if(off()||reduced.matches){vt.skipTransition();return;}
 const to=e.activation?.entry?.url||'';
 if(isIndex(location.pathname)){const c=lastCard&&lastCard.closest('a')&&slug(lastCard.closest('a').href)===slug(to)?lastCard:card(slug(to));tag(c,vt);}
 else if(hero()&&isIndex(new URL(to,location.href).pathname))tag(hero(),vt);});
addEventListener('pagereveal',e=>{const vt=e.viewTransition;if(!vt)return;if(off()||reduced.matches){vt.skipTransition();return;}
 const from=navigation?.activation?.from?.url||'';if(!from)return;const fp=new URL(from,location.href).pathname;
 if(isIndex(location.pathname)){const c=card(slug(from));if(c){tag(c,vt);}}
 else if(isIndex(fp))tag(hero(),vt);});
/* Signal: a short dotted sweep along the window, on contact only. */
const sig=el=>{if(!el||off()||reduced.matches)return;el.classList.remove('signal-on');void el.offsetWidth;el.classList.add('signal-on');};
document.addEventListener('pointerenter',e=>{const t=e.target;if(t instanceof Element&&t.matches('.card-image,.hero-visual .image-open'))sig(t);},true);
document.addEventListener('animationend',e=>{if(e.animationName==='bv-signal')e.target.classList.remove('signal-on');},true);
/* Back to Work keeps the filter and the scroll position (layout settles after the catalogue loads). */
if(isIndex(location.pathname)){try{history.scrollRestoration='manual';}catch{}
 const key='bv-scroll:'+location.pathname+location.search;
 addEventListener('pagehide',()=>{try{sessionStorage.setItem(key,String(scrollY));}catch{}});
 const back=(performance.getEntriesByType('navigation')[0]||{}).type==='back_forward';
 const restore=()=>{let y=0;try{y=+sessionStorage.getItem(key)||0;}catch{}if(y)scrollTo(0,y);};
 if(back){document.addEventListener('catalogue-ready',()=>requestAnimationFrame(restore),{once:true});addEventListener('load',restore,{once:true});}}
})();
