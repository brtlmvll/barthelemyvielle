// One image viewer for project galleries, Studies and Stonefield.
const sources=[...document.querySelectorAll('.image-open,.study-image')].filter(el=>el.querySelector('img,svg'));
if(sources.length)mount();

function mount(){
  const css=document.createElement('link');
  css.rel='stylesheet';css.href=new URL('image-viewer.css?v=20261122-close',import.meta.url).href;document.head.append(css);
  document.querySelectorAll('dialog.lightbox,dialog.studies-viewer').forEach(el=>{if(!el.open)el.remove();});
  const fr=document.documentElement.lang.startsWith('fr');
  const text=fr?{label:'Visionneuse des images',close:'Fermer',prev:'Précédente',next:'Suivante',loading:'Chargement de l’image…',error:'Image indisponible. Essayez la suivante ou fermez.'}:{label:'Image viewer',close:'Close',prev:'Previous',next:'Next',loading:'Loading image…',error:'Image unavailable. Try another image or close.'};
  const dialog=document.createElement('dialog');dialog.className='bv-image-viewer';dialog.setAttribute('aria-label',text.label);
  dialog.innerHTML=`<button type="button" class="bv-viewer-close" aria-label="${text.close}" autofocus>${text.close} ✕</button><p class="bv-viewer-status" role="status"></p><figure class="bv-viewer-display"><div class="bv-viewer-media"></div><figcaption></figcaption><nav class="bv-viewer-nav" aria-label="${text.label}"><button type="button" data-step="-1" aria-label="${text.prev}">← ${text.prev}</button><span aria-live="polite"></span><button type="button" data-step="1" aria-label="${text.next}">${text.next} →</button></nav></figure>`;
  document.body.append(dialog);
  const media=dialog.querySelector('.bv-viewer-media'),caption=dialog.querySelector('figcaption'),status=dialog.querySelector('.bv-viewer-status'),counter=dialog.querySelector('.bv-viewer-nav span');
  const reduce=matchMedia('(prefers-reduced-motion:reduce)');
  function motionOff(){try{return reduce.matches||sessionStorage.getItem('bv-motion')==='off';}catch{return reduce.matches;}}
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  let index=0,opener=null,selected=null,request=0,closing=false,closeTimer,outside=false,touch=null;

  async function visualFor(source,ticket){
    const image=source.querySelector('img');
    if(image){const large=new Image();large.src=source.dataset.full||image.currentSrc||image.src;large.alt=image.alt||source.getAttribute('aria-label')||'';await large.decode();return large;}
    const svg=source.querySelector('svg').cloneNode(true);
    // Keep detail viewBoxes intact and isolate cloned clip paths/masks from the page.
    const ids=new Map([...svg.querySelectorAll('[id]')].map(el=>[el.id,`bv-view-${ticket}-${el.id}`]));
    for(const el of [svg,...svg.querySelectorAll('*')])for(const attr of [...el.attributes]){
      let value=attr.value;
      if(attr.name==='id'&&ids.has(value))value=ids.get(value);
      else for(const [old,id]of ids){value=value.split(`url(#${old})`).join(`url(#${id})`);if((attr.name==='href'||attr.name==='xlink:href')&&value===`#${old}`)value=`#${id}`;}
      if(value!==attr.value)el.setAttribute(attr.name,value);
    }
    await Promise.all([...svg.querySelectorAll('image')].map(async el=>{const href=el.getAttribute('href')||el.getAttribute('xlink:href');if(href&&!href.startsWith('#')){const img=new Image();img.src=href;await img.decode();}}));
    const vb=svg.viewBox.baseVal;
    const width=vb.width||Number(svg.getAttribute('width'))||1000,height=vb.height||Number(svg.getAttribute('height'))||1000;
    svg.style.width=`min(86vw, ${72*width/height}dvh, 1600px)`;svg.style.height='auto';svg.style.aspectRatio=`${width} / ${height}`;
    return svg;
  }

  async function show(i){
    const ticket=++request;index=(i+sources.length)%sources.length;
    const source=sources[index];status.textContent=text.loading;
    try{
      const visual=await visualFor(source,ticket);
      if(ticket!==request||!dialog.open||closing)return;
      if(dialog.classList.contains('is-ready')){
        dialog.classList.add('is-switching');dialog.classList.remove('is-ready');
        await wait(motionOff()?0:200);
      }
      if(ticket!==request||!dialog.open||closing)return;
      selected?.classList.remove('bv-viewer-source-hidden');
      selected=source.closest('.field-tile')||source;
      selected.classList.add('bv-viewer-source','bv-viewer-source-hidden');
      media.replaceChildren(visual);
      caption.textContent=source.dataset.caption||source.querySelector('img')?.alt||source.getAttribute('aria-label')||'';
      counter.textContent=`${index+1} / ${sources.length}`;status.textContent='';
      dialog.classList.toggle('bv-no-motion',motionOff());
      void media.offsetWidth;dialog.classList.remove('is-switching');dialog.classList.add('is-ready');
    }catch{if(ticket===request&&dialog.open&&!closing)status.textContent=text.error;}
  }

  function close(){
    if(!dialog.open||closing)return;
    closing=true;++request;dialog.classList.add('is-closing');
    selected?.classList.remove('bv-viewer-source-hidden');
    closeTimer=setTimeout(()=>dialog.close(),motionOff()?0:200);
  }
  sources.forEach((source,i)=>source.addEventListener('click',()=>{
    if(dialog.open)return;
    opener=source;closing=false;dialog.classList.remove('is-ready','is-closing','is-switching');
    dialog.classList.toggle('bv-no-motion',motionOff());dialog.showModal();
    document.documentElement.classList.add('bv-image-viewer-open');show(i);
  }));
  dialog.querySelector('.bv-viewer-close').addEventListener('click',close);
  dialog.querySelectorAll('[data-step]').forEach(button=>{button.hidden=sources.length<2;button.addEventListener('click',()=>{if(!closing)show(index+Number(button.dataset.step));});});
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.addEventListener('keydown',e=>{if(closing)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}});
  dialog.addEventListener('pointerdown',e=>{outside=e.target===dialog;});
  dialog.addEventListener('click',e=>{if(e.target===dialog&&outside)close();outside=false;});
  dialog.addEventListener('touchstart',e=>{const p=e.touches[0];touch={x:p.clientX,y:p.clientY,time:Date.now()};},{passive:true});
  dialog.addEventListener('touchend',e=>{
    if(!touch||closing)return;
    const p=e.changedTouches[0],dx=p.clientX-touch.x,dy=p.clientY-touch.y,elapsed=Date.now()-touch.time;touch=null;
    if(elapsed>700)return;
    if(dy>80&&Math.abs(dy)>Math.abs(dx))close();else if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))show(index+(dx<0?1:-1));
  },{passive:true});
  dialog.addEventListener('close',()=>{
    clearTimeout(closeTimer);++request;closing=false;selected?.classList.remove('bv-viewer-source-hidden');selected=null;
    dialog.classList.remove('is-ready','is-closing','is-switching');document.documentElement.classList.remove('bv-image-viewer-open');
    media.replaceChildren();status.textContent='';opener?.focus({preventScroll:true});
  });
}
