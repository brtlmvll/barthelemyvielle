(()=>{'use strict';
const ROOT='projects/';
fetch('assets/project-catalogue.json').then(r=>{if(!r.ok)throw new Error('Catalogue');return r.json();}).then(projects=>{
 const byName=new Map(projects.map(p=>[p.name.toLowerCase(),p]));
 document.querySelectorAll('.pcard').forEach(card=>{const title=card.querySelector('.pctitle'),p=title&&byName.get(title.textContent.trim().toLowerCase());if(!p)return;const button=card.querySelector('.pchead'),link=document.createElement('a');link.className=button.className;link.href=ROOT+p.slug+'.html';link.innerHTML=button.innerHTML;button.replaceWith(link);card.querySelector('.pcmore')?.remove();const count=card.querySelector('.pcopen');if(count)count.textContent='Explore project ↗︎';const cover=card.querySelector('.pcover');if(cover){cover.style.backgroundImage='none';const img=document.createElement('img');img.src=p.previews[0];img.alt=p.name;img.loading='lazy';cover.appendChild(img);cover.dataset.cycle=JSON.stringify(p.previews);}});
 document.querySelectorAll('.witem').forEach(item=>{const n=item.querySelector('.wn'),p=n&&byName.get(n.textContent.trim().toLowerCase());if(!p)return;const a=document.createElement('a');a.href=ROOT+p.slug+'.html';a.setAttribute('aria-label','Open '+p.name+' project');item.parentNode.insertBefore(a,item);a.appendChild(item);});
 document.dispatchEvent(new Event('catalogue-ready'));
}).catch(()=>{});
document.addEventListener('click',event=>{const work=event.target.closest('[data-go="work"]');if(work){event.preventDefault();event.stopImmediatePropagation();location.href=ROOT+'index.html';return;}const target=event.target.closest('[data-go="studies"]');if(target){event.preventDefault();event.stopImmediatePropagation();location.href=ROOT+'studies.html';}},true);
if(location.hash==='#work')location.replace(ROOT+'index.html');
if(location.hash==='#studies')location.replace(ROOT+'studies.html');
})();
