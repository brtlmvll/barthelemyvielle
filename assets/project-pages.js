(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const colourButtons=[...document.querySelectorAll('.colour-toggle')];
function setColour(on){document.body.classList.toggle('original-colour',on);colourButtons.forEach(b=>{b.setAttribute('aria-pressed',String(on));b.textContent=on?'Return to monochrome ↗':'View original colour ↗';});}
colourButtons.forEach(b=>b.addEventListener('click',()=>setColour(!document.body.classList.contains('original-colour'))));
const filters=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('[data-category]')];
function filter(value){if(!filters.some(b=>b.dataset.filter===value))value='All';filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===value)));cards.forEach(c=>c.hidden=value!=='All'&&c.dataset.category!==value);const count=document.querySelector('.index-count');if(count)count.textContent=cards.filter(c=>!c.hidden).length+' projects & studies';}
filters.forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.filter;history.replaceState(null,'',v==='All'?location.pathname:location.pathname+'?filter='+encodeURIComponent(v));filter(v);}));if(filters.length)filter(new URLSearchParams(location.search).get('filter')||'All');
if(false&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-seen');io.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));}
const dialog=document.querySelector('.lightbox');let opener=null;
document.querySelectorAll('.image-open').forEach(b=>b.addEventListener('click',()=>{if(!dialog)return;opener=b;const img=b.querySelector('img');dialog.querySelector('img').src=b.dataset.full;dialog.querySelector('img').alt=img.alt;dialog.querySelector('p').textContent=img.alt;dialog.showModal();}));if(dialog){dialog.querySelector('.close-viewer').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{dialog.querySelector('img').removeAttribute('src');if(opener)opener.focus();});dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});}
})();
