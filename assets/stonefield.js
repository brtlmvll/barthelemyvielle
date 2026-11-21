(()=>{'use strict';
const dialog=document.querySelector('.field-lightbox');
const buttons=[...document.querySelectorAll('.field-tile .image-open')];
if(!dialog||!buttons.length)return;
const image=dialog.querySelector('.field-display img');
const caption=dialog.querySelector('figcaption');
const status=dialog.querySelector('.field-status');
const counter=dialog.querySelector('.field-counter');
const reduce=matchMedia('(prefers-reduced-motion:reduce)');
let index=0,opener=null,selected=null,request=0,closing=false,closeTimer;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function show(i){
  const ticket=++request;
  index=(i+buttons.length)%buttons.length;
  const button=buttons[index],source=button.querySelector('img');
  status.textContent='Loading image…';
  const large=new Image();
  large.src=button.dataset.full||source.currentSrc||source.src;
  try{
    await large.decode();
    if(ticket!==request||!dialog.open||closing)return;
    if(dialog.classList.contains('is-ready')){
      dialog.classList.remove('is-ready');
      await wait(reduce.matches?0:200);
    }
    if(ticket!==request||!dialog.open||closing)return;
    selected?.classList.remove('is-displayed');
    selected=button.closest('.field-tile');
    selected.classList.add('is-displayed');
    image.src=large.src;
    image.alt=source.alt;
    caption.textContent=source.alt;
    counter.textContent=`${index+1} / ${buttons.length}`;
    status.textContent='';
    // Commit the hidden state before the loaded image begins its reveal.
    void image.offsetWidth;
    dialog.classList.add('is-ready');
  }catch{
    if(ticket===request&&dialog.open&&!closing)status.textContent='Image unavailable. Try another image or close.';
  }
}

function close(){
  if(!dialog.open||closing)return;
  closing=true;++request;
  dialog.classList.add('is-closing');
  selected?.classList.remove('is-displayed');
  closeTimer=setTimeout(()=>dialog.close(),reduce.matches?0:450);
}

buttons.forEach((button,i)=>button.addEventListener('click',()=>{
  if(dialog.open)return;
  opener=button;closing=false;
  dialog.classList.remove('is-ready','is-closing');
  dialog.showModal();
  document.documentElement.classList.add('field-viewer-open');
  show(i);
}));
dialog.querySelector('.close-viewer').addEventListener('click',close);
dialog.querySelector('.field-prev').addEventListener('click',()=>{if(!closing)show(index-1);});
dialog.querySelector('.field-next').addEventListener('click',()=>{if(!closing)show(index+1);});
dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
dialog.addEventListener('keydown',e=>{
  if(closing)return;
  if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}
  if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}
});
let outside=false;
dialog.addEventListener('pointerdown',e=>{outside=e.target===dialog;});
dialog.addEventListener('click',e=>{if(e.target===dialog&&outside)close();outside=false;});
let touch=null;
dialog.addEventListener('touchstart',e=>{const p=e.touches[0];touch={x:p.clientX,y:p.clientY,time:Date.now()};},{passive:true});
dialog.addEventListener('touchend',e=>{
  if(!touch||closing)return;
  const p=e.changedTouches[0],dx=p.clientX-touch.x,dy=p.clientY-touch.y,elapsed=Date.now()-touch.time;touch=null;
  if(elapsed>700)return;
  if(dy>80&&Math.abs(dy)>Math.abs(dx))close();
  else if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))show(index+(dx<0?1:-1));
},{passive:true});
dialog.addEventListener('close',()=>{
  clearTimeout(closeTimer);++request;closing=false;
  selected?.classList.remove('is-displayed');selected=null;
  dialog.classList.remove('is-ready','is-closing');
  document.documentElement.classList.remove('field-viewer-open');
  image.removeAttribute('src');status.textContent='';
  opener?.focus({preventScroll:true});
});
})();
