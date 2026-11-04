(()=>{'use strict';
const path=location.pathname,projectsPath=path.includes('/projects/'),isIndex=/\/projects\/(?:index(?:\.html)?)?$/.test(path),isStudies=/\/studies(?:\.html)?$/.test(path),filter=new URLSearchParams(location.search).get('filter');
let depth=!projectsPath?0:isIndex?(filter&&filter!=='All'?2:1):isStudies?1:/\/(garden-and-city|contour-counterform|spatial-scores)(?:\.html)?$/.test(path)?2:3;
document.documentElement.dataset.depth=depth;
if(!isIndex&&!isStudies){if(projectsPath&&depth===3)fetch('../assets/project-catalogue.json').then(r=>r.json()).then(items=>{const slug=path.split('/').pop().replace(/\.html$/,'');const p=items.find(p=>p.slug===slug),back=document.querySelector('.project-top .back');if(p&&back){back.href='index.html?filter='+encodeURIComponent(p.category);back.textContent='← '+p.category;}});return;}
fetch('../assets/project-catalogue.json').then(r=>r.json()).then(items=>{
 const grid=document.querySelector('.project-grid');if(!grid)return;grid.classList.add('terrain-cluster');
 const groups=['Identity','Print & Surface','Artwork & Print','Treatments','3D & Motion','Photography'];
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let entries;
 if(isStudies)entries=items.filter(p=>p.kind==='study').map(p=>({...p,href:p.slug+'.html',sub:'Research / '+p.images.length+' plates'}));
 else if(depth===1)entries=groups.map(category=>{const list=items.filter(p=>p.category===category);return {name:category,href:'index.html?filter='+encodeURIComponent(category),previews:list.flatMap(p=>p.previews.slice(0,2)),sub:list.length+(list.length===1?' project':' projects')};});
 else entries=items.filter(p=>p.category===filter).map(p=>({...p,href:p.slug+'.html',sub:p.category}));
 grid.innerHTML=entries.map((p,i)=>`<a class="project-card terrain-stone stone-${i%6}" href="${esc(p.href)}"><div class="card-image" data-cycle="${esc(JSON.stringify(p.previews))}"><img src="../${esc(p.previews[0])}" alt="${esc(p.name)}" loading="${i<4?'eager':'lazy'}"></div><div class="card-caption"><span>${esc(p.name)}</span><span>${esc(p.sub)}</span></div></a>`).join('');
 const intro=document.querySelector('.index-intro');if(intro){const heading=intro.querySelector('h1'),eyebrow=intro.querySelector('.eyebrow'),lead=intro.querySelector('.lede'),count=intro.querySelector('.index-count');
 if(isIndex&&depth===1){heading.innerHTML='Selected<br>work.';eyebrow.textContent='CLVSTR / Fields of work';if(lead)lead.textContent='Identity, print, image, motion.';count.textContent='Six fields / '+items.filter(p=>p.kind!=='study').length+' projects';}
 if(isIndex&&depth===2){heading.textContent=filter;heading.classList.add('field-title');eyebrow.innerHTML='<a href="index.html">← Fields of work</a>';if(lead)lead.remove();count.textContent=entries.length+' projects';}}
 const filters=document.querySelector('.filters');if(filters)filters.outerHTML='<nav class="terrain-breadcrumb" aria-label="Work navigation">'+(depth===2?'<a href="index.html">← All fields</a><span>'+esc(filter)+'</span>':'<span>Choose a field to enter</span><a href="studies.html">Studies ↗</a>')+'</nav>';
 document.dispatchEvent(new Event('catalogue-ready'));
});
})();
