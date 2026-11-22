(()=>{'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches;
 try{paused=paused||sessionStorage.getItem('bv-motion')==='off';}catch{}
 const toggle=document.querySelector('.study-motion');
 function state(){document.documentElement.classList.toggle('study-paused',paused);if(toggle){toggle.textContent=paused?'Motion off ◦':'Motion on ·';toggle.setAttribute('aria-pressed',String(!paused));toggle.setAttribute('aria-label',paused?'Activer le mouvement':'Mettre le mouvement en pause');}}
 toggle?.addEventListener('click',()=>{paused=!paused;try{sessionStorage.setItem('bv-motion',paused?'off':'on');}catch{}state();});reduced.addEventListener('change',()=>{paused=reduced.matches;state();});state();
 const ns='http://www.w3.org/2000/svg',windows=[];
 const forms=[[[3,12],[25,3],[66,2],[93,11],[99,36],[97,73],[86,94],[58,99],[22,94],[3,82],[1,49],[2,28]],[[6,7],[35,1],[70,4],[94,15],[99,47],[94,81],[80,97],[48,98],[17,94],[2,74],[1,41],[3,19]],[[3,14],[28,4],[63,1],[91,7],[98,30],[99,67],[91,92],[61,98],[25,97],[4,86],[1,58],[2,32]]];
 function svgEl(name,attrs){const n=document.createElementNS(ns,name);for(const [k,v]of Object.entries(attrs||{}))n.setAttribute(k,v);return n;}
 function draw(w,t){const points=w.base.map((p,i)=>p.map(v=>v+Math.sin(t*.00035+i*.7+w.seed)*.16));const near=(p,q)=>p.map((v,i)=>(v+(q[i]-v)*.22).toFixed(3)).join(' ');let d='M'+near(points[0],points.at(-1));points.forEach((p,i)=>{if(i)d+=' L'+near(p,points[(i+11)%12]);d+=' Q'+p.join(' ')+' '+near(p,points[(i+1)%12]);});w.path.setAttribute('d',d+' Z');}
 const observer=new IntersectionObserver(es=>es.forEach(e=>{const w=windows.find(w=>w.host===e.target);if(w)w.visible=e.isIntersecting;}),{rootMargin:'80px'});
 document.querySelectorAll('.study-window').forEach((host,i)=>{const svg=svgEl('svg',{class:'study-definitions','aria-hidden':'true'}),defs=svgEl('defs'),clip=svgEl('clipPath',{id:'study-edge-'+i,clipPathUnits:'objectBoundingBox'}),path=svgEl('path',{transform:'scale(.01)'});clip.append(path);defs.append(clip);svg.append(defs);host.prepend(svg);host.style.clipPath='url(#study-edge-'+i+')';const w={host,path,seed:i,base:forms[i%3],visible:false,next:performance.now()+1750,index:0};try{w.slides=JSON.parse(host.dataset.slides||'[]');}catch{w.slides=[];}windows.push(w);draw(w,0);observer.observe(host);});
 let previous=0,time=0;function frame(now){requestAnimationFrame(frame);if(now-previous<65)return;const dt=Math.min(100,now-previous);previous=now;if(paused||document.hidden)return;time+=dt;windows.forEach(w=>{if(!w.visible)return;draw(w,time);if(w.slides.length<2||now<w.next)return;const contact=w.host.closest('a').matches(':hover,:focus-visible');w.next=now+(contact?650:1750);w.index=(w.index+1)%w.slides.length;const image=w.host.querySelector('img');if(!image)return;const src=w.slides[w.index];const preload=new Image();preload.onload=()=>{if(!paused)image.src=src;};preload.src=src;});}if(windows.length)requestAnimationFrame(frame);
})();

// Shared image viewer: project galleries, Studies and Stonefield.
import(new URL('image-viewer.js?v=20261122-close',document.currentScript.src).href);
