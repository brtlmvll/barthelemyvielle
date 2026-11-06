(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let leaving=false;
addEventListener('pageshow',()=>{leaving=false;document.body.getAnimations().forEach(a=>a.cancel());});
document.addEventListener('click',e=>{
 const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;
 const u=new URL(a.href);if(u.origin!==location.origin||!/^https?:$/.test(u.protocol)||u.pathname===location.pathname&&u.search===location.search)return;
 if(leaving){e.preventDefault();return;}if(reduced.matches)return;
 leaving=true;e.preventDefault();
 const go=()=>location.assign(u.href);
 document.body.animate([{opacity:1},{opacity:0}],{duration:120,easing:'ease-out',fill:'forwards'}).finished.then(go,go);
});
})();
