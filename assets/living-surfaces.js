(()=>{'use strict';
const NS='http://www.w3.org/2000/svg',reduced=matchMedia('(prefers-reduced-motion: reduce)'),prefix=location.pathname.includes('/projects/')?'../':'';
let paused=reduced.matches;const windows=[],seen=new WeakSet();
// One geometry system. The artwork itself is never translated, scaled or sliced.
const forms=[[[7,5],[33,3],[66,7],[94,4],[97,33],[94,65],[96,94],[65,97],[34,93],[5,96],[3,65],[6,34]],[[10,3],[35,7],[67,2],[93,10],[95,35],[98,65],[91,97],[65,94],[32,98],[3,90],[7,64],[2,32]],[[4,10],[32,2],[65,5],[96,3],[92,32],[98,67],[95,92],[68,98],[35,95],[8,98],[2,67],[5,35]]];
const open=[[3,3],[33,3],[66,3],[97,3],[97,33],[97,66],[97,97],[66,97],[33,97],[3,97],[3,66],[3,33]];
const control=document.createElement('button');control.type='button';control.className='motion-control';
function state(){document.documentElement.classList.toggle('motion-paused',paused);control.textContent=paused?'Motion off ◦':'Motion on ·';control.setAttribute('aria-pressed',String(!paused));control.setAttribute('aria-label',paused?'Resume motion':'Pause motion');}
control.addEventListener('click',()=>{paused=!paused;state();});(document.querySelector('.sitebar')||document.querySelector('#bar')||document.body).appendChild(control);reduced.addEventListener('change',()=>{paused=reduced.matches;state();});state();
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{const w=windows.find(w=>w.host===e.target);if(w)w.visible=e.isIntersecting;}),{threshold:.02});
function svgElement(name,attrs){const el=document.createElementNS(NS,name);for(const [k,v]of Object.entries(attrs||{}))el.setAttribute(k,v);return el;}
function register(host,shape=false){if(seen.has(host)){const w=windows.find(w=>w.host===host);if(w&&!w.shape){w.image=host.querySelector('img');if(host.dataset.cycle){try{w.urls=JSON.parse(host.dataset.cycle).map(u=>prefix+u);}catch{}}}return w;}seen.add(host);let path,clip,image;
 if(shape){const old=host.querySelector('svg'),oldImage=old?.querySelector('image');if(!old)return;const source=oldImage?.getAttribute('href');const svg=svgElement('svg',{viewBox:'0 0 100 100','aria-hidden':'true',class:'window-svg'});const id='window-'+windows.length;const defs=svgElement('defs'),cp=svgElement('clipPath',{id});clip=svgElement('path');cp.append(clip);defs.append(cp);svg.append(defs);path=svgElement('path',{class:'window-fill'});svg.append(path);
 if(source){image=svgElement('image',{href:source,x:14,y:14,width:72,height:72,preserveAspectRatio:'xMidYMid meet',class:'window-image','clip-path':`url(#${id})`});svg.append(image);}const rim=svgElement('path',{class:'window-rim'});svg.append(rim);old.replaceWith(svg);host.classList.add('window-host');host._windowRim=rim;
 }else{const svg=svgElement('svg',{viewBox:'0 0 100 100',preserveAspectRatio:'none',class:'aperture-frame','aria-hidden':'true'});path=svgElement('path',{class:'aperture-fill'});svg.append(path);host.prepend(svg);host.classList.add('window-surface');image=host.querySelector('img');}
 const w={host,path,clip,image,shape,seed:windows.length,hover:false,openness:0,visible:false,urls:[],index:0,next:performance.now()+2400+windows.length*107};windows.push(w);observer.observe(host);host.addEventListener('pointerenter',()=>w.hover=true);host.addEventListener('pointerleave',()=>w.hover=false);host.addEventListener('focusin',()=>w.hover=true);host.addEventListener('focusout',()=>w.hover=false);paint(w,0);return w;
}
function paint(w,t){const phase=t/(11000+w.seed%5*1300)+w.seed*.31,part=Math.floor(phase),raw=phase-part,mix=raw*raw*(3-2*raw),a=forms[part%3],b=forms[(part+1)%3];w.openness+=(Number(w.hover)-w.openness)*.12;const h=w.openness*.7;
 const points=a.map((p,i)=>p.map((v,axis)=>{const target=v+(b[i][axis]-v)*mix;const drift=Math.sin(t*.00065+i*1.73+w.seed+axis)*.6;return (target+drift)*(1-h)+open[i][axis]*h;}));
 // Large project images use only the outer margin: their full composition remains intact.
 if(!w.shape&&w.host.classList.contains('image-open'))points.forEach(p=>{p[0]=p[0]<50?p[0]*.4:100-(100-p[0])*.4;p[1]=p[1]<50?p[1]*.4:100-(100-p[1])*.4;});
 const d=points.map((p,i)=>(i?'L':'M')+p.map(v=>v.toFixed(2)).join(' ')).join(' ')+' Z';w.path.setAttribute('d',d);w.clip?.setAttribute('d',d);w.host._windowRim?.setAttribute('d',d);
}
function attach(){document.querySelectorAll('.card-image,.pcover,.image-open').forEach(h=>register(h));document.querySelectorAll('.m,.hs').forEach(h=>register(h,true));}
attach();document.addEventListener('catalogue-ready',attach);
fetch(prefix+'assets/project-catalogue.json').then(r=>r.json()).then(projects=>{
 attach();for(const w of windows){if(w.shape){const label=w.host.textContent.toLowerCase();const section=label.startsWith('work')?projects.filter(p=>p.kind!=='study'):label.includes('stud')?projects.filter(p=>p.kind==='study'):label.includes('photo')?projects.filter(p=>p.kind==='photography'):label.includes('identity')||label.includes('brand')?projects.filter(p=>p.category==='Identity'):label.includes('artwork')?projects.filter(p=>p.category==='Artwork & Print'):label.includes('motion')||label.includes('treatment')?projects.filter(p=>p.category==='Treatments'||p.category==='3D & Motion'):projects.filter(p=>p.category==='Print & Surface');w.urls=section.flatMap(p=>p.previews.slice(0,2)).map(u=>prefix+u);
 }else{const card=w.host.closest('.project-card'),link=card?.getAttribute('href');const p=link?projects.find(p=>new URL(link,location.href).pathname.split('/').pop().replace(/\.html$/,'')===p.slug):null;if(p)w.urls=p.previews.map(u=>prefix+u);else if(w.host.dataset.cycle){try{w.urls=JSON.parse(w.host.dataset.cycle).map(u=>prefix+u);}catch{}}}}
}).catch(()=>{});
let last=0,elapsed=0,previous=performance.now();
function frame(now){requestAnimationFrame(frame);const delta=Math.min(now-previous,80);previous=now;if(paused||document.hidden)return;elapsed+=delta;if(now-last<55)return;last=now;
 for(const w of windows){if(!w.visible||w.host.closest('[hidden]')||w.host.closest('.sheet:not(.open)'))continue;paint(w,elapsed);if(w.image&&w.urls.length>1&&!w.hover&&now>w.next){w.next=now+1900+(w.seed%5)*137;w.index=(w.index+1)%w.urls.length;const url=w.urls[w.index],preload=new Image();preload.onload=()=>{if(paused||w.hover||!w.visible)return;if(w.shape)w.image.setAttribute('href',url);else w.image.src=url;};preload.src=url;}}
}requestAnimationFrame(frame);
})();
