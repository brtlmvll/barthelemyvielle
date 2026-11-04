(()=>{'use strict';const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// Native same-origin document transitions retain the scene between depth changes.
const native='onpageswap' in window&&CSS.supports('view-transition-name','none');
if(!native&&!reduce){document.documentElement.animate([{opacity:.25},{opacity:1}],{duration:480,easing:'cubic-bezier(.2,.6,.2,1)'});document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;const url=new URL(a.href);if(url.origin!==location.origin||url.pathname===location.pathname&&url.search===location.search)return;e.preventDefault();document.documentElement.animate([{opacity:1},{opacity:.15}],{duration:200,fill:'forwards',easing:'ease-in'}).finished.then(()=>location.assign(a.href));});}
addEventListener('pageshow',()=>{document.documentElement.style.opacity='';});
})();
