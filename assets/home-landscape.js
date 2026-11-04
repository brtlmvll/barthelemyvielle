(()=>{'use strict';
const hosts=[...document.querySelectorAll('#masses>.m')];if(!hosts.length)return;
// Orthographic projection: one ground plane, independent height at every vertex.
const models=[
 {ring:[[-83,-50],[-30,-82],[58,-65],[88,-16],[71,53],[8,78],[-69,47],[-94,2]],heights:[65,88,77,58,65,79,98,85],peak:[-12,-8,111],number:'01'},
 {ring:[[-104,-40],[-53,-74],[40,-76],[103,-20],[84,40],[12,66],[-79,51],[-110,7]],heights:[24,40,47,29,34,53,41,28],peak:[-10,-2,64],number:'02'},
 {ring:[[-48,-36],[-12,-57],[45,-32],[57,18],[14,49],[-39,28]],heights:[65,112,96,69,84,71],peak:[-3,-4,130],number:'03'}
];
const project=([x,y,z=0])=>[150+(x-y)*.82,190+(x+y)*.36-z];
const coords=points=>points.map(p=>p.map(n=>n.toFixed(2)).join(',')).join(' ');
const face=(points,fill,cls='')=>`<polygon class="${cls}" points="${coords(points)}" fill="${fill}" stroke="#171916" stroke-width=".7" stroke-linejoin="round"/>`;
hosts.forEach((host,i)=>{
 const m=models[i],ground=m.ring.map(p=>project(p)),top=m.ring.map((p,k)=>project([...p,m.heights[k]])),peak=project(m.peak);
 const sideColours=['url(#ink-dense)','url(#ink-cross)','url(#ink-lines)','url(#ink-dense)','url(#ink-black)','url(#ink-cross)','url(#ink-lines)','url(#ink-dense)'];
 const topColours=['#e7e7de','#f1f0e7','#e7e7de','#ecece2','#dedfd4','#e7e7de','#f1f0e7','#ecece2'];
 let sides='',tops='';
 for(let k=0;k<top.length;k++){let next=(k+1)%top.length;sides+=face([ground[k],ground[next],top[next],top[k]],sideColours[k%8],'rock-side');tops+=face([top[k],top[next],peak],topColours[k%8],'rock-face');}
 // Painted back-to-front; the cap occludes rear extrusion faces.
 host.classList.add('home-rock');host.style.setProperty('--arrival',`${[120,0,260][i]}ms`);host.style.setProperty('--idle',`${[9,12,10][i]}s`);
 const old=host.querySelector('.wrap');old.innerHTML=`<svg class="rock-svg" viewBox="0 0 300 265" aria-hidden="true"><defs><pattern id="ink-lines" width="3.3" height="3.3" patternUnits="userSpaceOnUse" patternTransform="rotate(24)"><rect width="3.3" height="3.3" fill="#e7e7dd"/><path d="M.3 0L.65 3.3" stroke="#161914" stroke-width=".65"/></pattern><pattern id="ink-dense" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)"><rect width="2.2" height="2.2" fill="#dadcd1"/><path d="M.4 0L.8 2.2" stroke="#10130f" stroke-width="1.15"/></pattern><pattern id="ink-cross" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="url(#ink-lines)"/><path d="M0 1L5 4M0 4L2 5M4 0L5 1" stroke="#171916" stroke-width=".65"/></pattern><pattern id="ink-black" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#10130f"/><path d="M0 1L3 2" stroke="#d9ddce" stroke-width=".35"/></pattern><filter id="ink-edge-${i}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="${i+3}" result="grain"/><feDisplacementMap in="SourceGraphic" in2="grain" scale="1.05" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="rock-shadow-${i}" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="8"/></filter></defs><g class="rock-ground"><ellipse cx="150" cy="206" rx="100" ry="25" fill="#000" opacity=".38" filter="url(#rock-shadow-${i})"/><path d="M36 204 L150 248 L266 204" fill="none" stroke="currentColor" stroke-opacity=".11" stroke-width=".6"/></g><g class="rock-shell" filter="url(#ink-edge-${i})">${sides}<g class="rock-crown">${tops}<path d="M${top[0]} Q${top[0][0]+18},${top[0][1]+7} ${peak} M${top[3]} L${peak} M${top[5]} Q${peak[0]+14},${top[5][1]-17} ${peak}" fill="none" stroke="#181b16" stroke-width=".6" opacity=".45"/><path d="M${peak[0]-13},${peak[1]+17} l9,5 -3,12 8,4 -1,10 M${top[4][0]-12},${top[4][1]-3} l-9,-7 -5,1 -12,-8" fill="none" stroke="#151914" stroke-width=".65" opacity=".65"/></g><path d="M${coords(top).replaceAll(' ',' L')} Z" fill="none" stroke="#121610" stroke-opacity=".8" stroke-width="1"/></g><image class="rock-art" x="28" y="12" width="244" height="207" preserveAspectRatio="xMidYMid meet"/></svg>`;
 host.querySelector('.lab').insertAdjacentHTML('beforebegin',`<span class="rock-number" aria-hidden="true">${m.number} /</span>`);
 host.dataset.rest=host.querySelector('.sub').textContent;
});
const reduced=matchMedia('(prefers-reduced-motion:reduce)');let pools=[],cursor=[0,0,0],hover=[false,false,false];
hosts.forEach((h,i)=>{h.addEventListener('pointerenter',()=>hover[i]=true);h.addEventListener('pointerleave',()=>hover[i]=false);h.addEventListener('focusin',()=>hover[i]=true);h.addEventListener('focusout',()=>hover[i]=false);});
fetch('assets/project-catalogue.json').then(r=>r.json()).then(projects=>{
 pools=[projects.filter(p=>p.kind!=='study').flatMap(p=>p.previews.slice(0,1)),projects.filter(p=>p.kind==='study').flatMap(p=>p.previews.slice(0,2)),[]];
 hosts.forEach((h,i)=>{if(pools[i].length)h.querySelector('.rock-art').setAttribute('href',pools[i][0]);});
}).catch(()=>{});
// Source changes are cuts between whole images, never transforms of the artwork.
setInterval(()=>{if(document.hidden||document.body.classList.contains('away')||document.documentElement.classList.contains('motion-paused')||reduced.matches)return;hosts.forEach((h,i)=>{if(!pools[i]?.length||hover[i])return;const url=pools[i][++cursor[i]%pools[i].length],image=new Image();image.onload=()=>{if(!hover[i])h.querySelector('.rock-art').setAttribute('href',url);};image.src=url;});},3200);
})();
