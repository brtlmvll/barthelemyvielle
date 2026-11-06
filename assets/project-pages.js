(()=>{'use strict';
const dialog=document.querySelector('.lightbox'),buttons=[...document.querySelectorAll('.image-open')];if(!dialog||!buttons.length)return;
let index=0,opener;const image=dialog.querySelector('img'),caption=dialog.querySelector('p');
const tools=document.createElement('div');tools.className='viewer-tools';tools.innerHTML='<button type="button" aria-label="Previous image">← Previous</button><span aria-live="polite"></span><button type="button" aria-label="Next image">Next →</button>';dialog.prepend(tools);const [prev,next]=tools.querySelectorAll('button'),counter=tools.querySelector('span');
function show(i){index=(i+buttons.length)%buttons.length;const b=buttons[index],source=b.querySelector('img');image.src=b.dataset.full||source.src;image.alt=source.alt;caption.textContent=source.alt;counter.textContent=String(index+1).padStart(2,'0')+' / '+String(buttons.length).padStart(2,'0');prev.disabled=next.disabled=buttons.length<2;const neighbour=buttons[(index+1)%buttons.length];if(neighbour){const p=new Image();p.src=neighbour.dataset.full||neighbour.querySelector('img').src;}}
buttons.forEach((b,i)=>b.addEventListener('click',()=>{opener=b;show(i);dialog.showModal();}));prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));dialog.querySelector('.close-viewer').addEventListener('click',()=>dialog.close());dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}});dialog.addEventListener('close',()=>{image.removeAttribute('src');opener?.focus({preventScroll:true});});dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
})();

/* Viewer: easier exit — tap image or backdrop to close, swipe down to close,
   swipe left/right to navigate (Claude) */
(()=>{const d=document.querySelector('.lightbox');if(!d)return;const img=d.querySelector('img');
const tools=()=>d.querySelector('.viewer-tools');
img.addEventListener('click',()=>d.close());d.querySelector('p')?.addEventListener('click',()=>d.close());
let x0=0,y0=0,t=0;d.addEventListener('touchstart',e=>{const p=e.touches[0];x0=p.clientX;y0=p.clientY;t=Date.now();},{passive:true});
d.addEventListener('touchend',e=>{const p=e.changedTouches[0],dx=p.clientX-x0,dy=p.clientY-y0;if(Date.now()-t>700)return;
 if(dy>70&&Math.abs(dy)>Math.abs(dx)){d.close();return;}
 if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){const b=tools()?.querySelectorAll('button');if(b&&b.length===2)(dx<0?b[1]:b[0]).click();}},{passive:true});
})();
