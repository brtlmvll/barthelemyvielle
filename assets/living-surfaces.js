(()=>{'use strict';
const NS='http://www.w3.org/2000/svg',prefix=location.pathname.includes('/projects/')?'../':'',reduced=matchMedia('(prefers-reduced-motion: reduce)'),windows=[],seen=new WeakMap();
let paused=reduced.matches;try{paused=paused||sessionStorage.getItem('bv-motion')==='off';}catch{}
const forms=[[[3,9],[26,2],[64,3],[93,9],[99,33],[97,71],[90,94],[62,99],[23,96],[3,87],[1,55],[2,28]],[[8,3],[35,1],[72,4],[96,14],[98,46],[95,79],[82,97],[51,99],[16,94],[2,76],[1,43],[4,18]],[[5,13],[29,3],[61,1],[90,5],[98,29],[99,66],[92,91],[64,98],[27,99],[5,87],[1,57],[2,31]]];
const homeForms=[[[25,5],[53,2],[77,15],[84,33],[66,49],[85,65],[70,90],[43,98],[19,85],[27,64],[12,44],[24,26]],[[2,73],[12,54],[24,63],[37,25],[50,57],[62,39],[76,65],[91,52],[99,78],[85,93],[43,96],[12,89]],[[26,12],[58,4],[82,22],[92,46],[73,59],[83,81],[54,95],[25,89],[11,67],[18,44],[13,28],[20,19]]];
const rectangle=[[2,3],[30,2],[65,2],[97,3],[98,32],[98,68],[97,97],[65,98],[30,98],[2,97],[2,65],[2,32]];
const texture=document.createElement('div');texture.className='site-texture';texture.setAttribute('aria-hidden','true');document.body.prepend(texture);
const button=document.createElement('button');button.className='motion-control';button.type='button';
function state(){document.documentElement.classList.toggle('motion-paused',paused);button.textContent=paused?'Motion off ◦':'Motion on ·';button.setAttribute('aria-pressed',String(!paused));button.setAttribute('aria-label',paused?'Resume motion':'Pause motion');}
button.addEventListener('click',()=>{paused=!paused;try{sessionStorage.setItem('bv-motion',paused?'off':'on');}catch{}state();});(document.querySelector('.sitebar')||document.querySelector('#bar')||document.body).append(button);reduced.addEventListener('change',()=>{paused=reduced.matches;state();});state();
function el(name,attrs={}){const node=document.createElementNS(NS,name);for(const [key,value]of Object.entries(attrs))node.setAttribute(key,value);return node;}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{const w=seen.get(e.target);if(w){w.visible=e.isIntersecting;if(w.visible)e.target.classList.add('surface-seen');}}),{threshold:.04});
let colours={};fetch(prefix+'assets/preview-metadata.json').then(r=>r.json()).then(data=>{colours=data;windows.forEach(w=>applyColour(w,w.current));}).catch(()=>{});
function applyColour(w,url){const meta=colours[url?.replace(/^\.\.\//,'')];if(!meta)return;w.host.style.setProperty('--image-ground',meta.background);if(!w.home&&!w.layoutSet){w.host.style.setProperty('--preview-ratio',Math.max(.78,Math.min(1.75,meta.ratio)));w.layoutSet=true;}if(w.home)w.path.style.setProperty('--image-ground',meta.background);}
function setSource(w,url,force=false){if(!url||url===w.current)return;const preload=new Image();preload.onload=()=>{if(paused&&w.current)return;w.current=url;w.image.src=url;applyColour(w,url);if(w.home&&(w.host.dataset.section||w.host.dataset.go)==='work'){const p=projects.find(p=>p.previews.some(u=>prefix+u===url));if(p)w.host.querySelector('.sub').textContent=p.name+' / '+p.category;}};preload.src=url;}
function register(host,home=false){if(seen.has(host))return seen.get(host);const svg=el('svg',{class:home?'window-svg':'surface-definitions',viewBox:'0 0 100 100','aria-hidden':'true'}),id='surface-'+windows.length,defs=el('defs'),clip=el('clipPath',{id,clipPathUnits:'objectBoundingBox'}),clipPath=el('path',{transform:'scale(.01)'});clip.append(clipPath);defs.append(clip);svg.append(defs);let image,path;
 if(home){const old=host.querySelector('svg');if(!old)return;path=el('path',{class:'window-fill'});image=document.createElement('img');image.className='window-image';image.alt='';image.style.clipPath=`url(#${id})`;svg.append(path);old.replaceWith(svg);host.querySelector('.wrap').append(image);host.classList.add('window-host');}
 else{image=host.querySelector('img');if(!image)return;path=clipPath;host.prepend(svg);host.classList.add('window-surface');host.style.clipPath=`url(#${id})`;}
 const homeIndex=home?[...document.querySelectorAll('.m')].indexOf(host):-1;
 const w={host,home,homeIndex,path,clip:clipPath,image,seed:windows.length,base:forms[(home?homeIndex:windows.length)%3],hover:false,open:0,visible:false,urls:[],current:home?'':image.getAttribute('src'),next:performance.now()+900+(windows.length%5)*110,burst:0,token:0};windows.push(w);seen.set(host,w);observer.observe(host);applyColour(w,w.current);
 const enter=()=>{w.hover=true;w.next=performance.now()+120;};
 const leave=()=>{w.hover=false;w.token++;};host.addEventListener('pointerenter',enter);host.addEventListener('pointerleave',leave);host.addEventListener('focusin',enter);host.addEventListener('focusout',leave);paint(w,0);return w;
}
function pathData(points,round=.12){const near=(p,q)=>p.map((v,i)=>(v+(q[i]-v)*round).toFixed(3)).join(' ');let d='M'+near(points[0],points.at(-1));points.forEach((p,i)=>{if(i)d+=' L'+near(p,points[(i+points.length-1)%points.length]);d+=' Q'+p.map(v=>v.toFixed(3)).join(' ')+' '+near(p,points[(i+1)%points.length]);});return d+' Z';}
function paint(w,time){const target=0;w.open+=((reduced.matches?target:target-w.open))*(reduced.matches?1:.18);if(reduced.matches)w.open=target;const points=w.base.map((p,i)=>p.map((v,a)=>{const value=v+(rectangle[i][a]-v)*w.open;return value+(Math.sin(time*.00048+w.seed+i*.71)*.18+Math.sin(time*.00023+i*1.9)*.09)*(1-w.open);}));const d=pathData(points,w.home?.1:.24);w.clip.setAttribute('d',d);if(w.home)w.path.setAttribute('d',d);}
function attach(){document.querySelectorAll('.card-image,.pcover').forEach(h=>register(h));document.querySelectorAll('.m').forEach(h=>register(h,true));}
attach();document.addEventListener('catalogue-ready',()=>{attach();configure();});
let projects=[];function configure(){for(const w of windows){if(w.home){const key=w.host.dataset.section||w.host.dataset.go;const list=key==='studies'?projects.filter(p=>p.kind==='study'):key==='work'?projects.filter(p=>p.kind!=='study'):projects.filter(p=>p.category==='Photography');if(key==='work'){const priority=['de-saint-aise','terrarivm-generalis','hovr','common-wave'];list.splice(0,list.length,...list.filter(p=>priority.includes(p.slug)));list.sort((a,b)=>(priority.includes(a.slug)?priority.indexOf(a.slug):99)-(priority.includes(b.slug)?priority.indexOf(b.slug):99));}w.urls=list.flatMap(p=>key==='studies'?p.previews:[...p.previews.slice(1,2),...p.previews.slice(0,1)]).map(u=>prefix+u);}
 else{if(w.host.dataset.cycle){try{w.urls=JSON.parse(w.host.dataset.cycle).map(u=>prefix+u);}catch{}}else{const href=w.host.closest('a')?.getAttribute('href'),slug=href?.split('/').pop().replace(/\.html$/,'');const p=projects.find(p=>p.slug===slug);if(p)w.urls=p.previews.map(u=>prefix+u);}}if(w.home)w.host.classList.toggle('has-preview',w.urls.length>0);if(w.urls.length&&!w.current)setSource(w,w.urls[0]);}}
fetch(prefix+'assets/project-catalogue.json').then(r=>r.json()).then(data=>{projects=data;configure();}).catch(()=>{});
let previous=0,elapsed=0;function frame(now){requestAnimationFrame(frame);if(now-previous<42)return;const dt=Math.min(80,now-previous);previous=now;if(document.hidden)return;if(!paused)elapsed+=dt;for(const w of windows){if(!w.visible||w.host.closest('.sheet:not(.open)'))continue;if(!paused||Math.abs(w.open-(w.home&&w.hover&&w.urls.length?1:0))>.001)paint(w,elapsed);if(!paused&&!reduced.matches&&w.urls.length>1&&now>w.next){w.next=now+(w.hover?460:1100)+(w.seed%3)*53;const i=(w.urls.indexOf(w.current)+1)%w.urls.length;setSource(w,w.urls[i],true);}}}requestAnimationFrame(frame);
})();

/* ===== CLVSTR · entrance + arrival — additive, non-destructive (Claude) ===== */
(()=>{'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let off=reduce.matches;try{off=off||sessionStorage.getItem('bv-motion')==='off';}catch{}
  if(off)return;
  const EASE='cubic-bezier(.22,.65,.2,1)';
  const ready=fn=>document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);

  /* HOME ENTRANCE — organic settle, ink coming into focus (no circle) */
  function entrance(){
    const home=document.querySelector('#home');if(!home)return;
    const picks=[],add=sel=>home.querySelectorAll(sel).forEach(el=>{if(el&&!picks.includes(el))picks.push(el);});
    add('#bar, #topnav');
    home.querySelectorAll('.m').forEach(el=>{if(!picks.includes(el))picks.push(el);});
    add('.home-featured, .hb .tag, .hb .ft');
    picks.forEach((el,i)=>el.animate(
      [{opacity:0,transform:'translateY(16px) scale(.985)',filter:'blur(10px)'},
       {opacity:1,offset:.62,filter:'blur(0px)'},
       {opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0px)'}],
      {duration:1150,delay:120+i*95,easing:EASE,fill:'backwards'}));
  }

  /* ARRIVAL — one-time settle as content blocks enter view */
  const seen=new WeakSet();
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting||seen.has(e.target))return;
    seen.add(e.target);io.unobserve(e.target);
    e.target.animate(
      [{opacity:.001,transform:'translateY(26px)',filter:'blur(7px)'},
       {opacity:1,transform:'translateY(0)',filter:'blur(0px)'}],
      {duration:920,easing:EASE,fill:'backwards'});
  }),{threshold:.08,rootMargin:'0px 0px -6% 0px'});
  function watch(){
    document.querySelectorAll('.project-intro,.index-intro,.chapter-heading,.terrain-stone,.image-open,.card-image,.project-pagination a,.sheet').forEach(el=>{
      if(el.closest('#home')||el.classList.contains('reveal')||seen.has(el))return;io.observe(el);});
  }
  /* PERPETUAL — gentle never-still float on the home masses.
     ChatGPT's window-system.css flattened the ambient morph, so the home
     went static after entry; this keeps a small, constant motion alive
     without touching the !important-locked .wrap/svg. */
  function floatHome(){
    const home=document.querySelector('#home');if(!home)return;
    [...home.querySelectorAll('.m')].forEach((el,i)=>{
      const dur=7200+i*950,dy=3+(i%2?1:0);
      el.animate(
        [{transform:'translateY(0) rotate(-.35deg) scale(1)'},
         {transform:'translateY(-'+dy+'px) rotate(.3deg) scale(1.012)'},
         {transform:'translateY(0) rotate(-.35deg) scale(1)'}],
        {duration:dur,delay:1320+i*95,iterations:Infinity,easing:'ease-in-out'});
    });
  }
  ready(()=>{entrance();floatHome();watch();});
  document.addEventListener('catalogue-ready',watch);
})();
