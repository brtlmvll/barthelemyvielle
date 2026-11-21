/* Stonefield: random scattered layout, new on every visit (Claude, 21/11).
   Tiles keep their shape, tilt and image; only order, size and position are drawn.
   Without JS the CSS grid stays as fallback. */
(()=>{'use strict';
const field=document.querySelector('.field-deposit');if(!field)return;
const tiles=[...field.querySelectorAll('.field-tile')];if(!tiles.length)return;
const rnd=Math.random;
// shuffle DOM order (viewer navigation follows it)
for(let i=tiles.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[tiles[i],tiles[j]]=[tiles[j],tiles[i]];}
tiles.forEach(t=>field.append(t));
const ratios={'size-s':1,'size-m':1.38,'size-l':1.05,'size-wide':.64,'size-tall':1.85};
const draw=tiles.map(t=>{const k=Object.keys(ratios).find(c=>t.classList.contains(c))||'size-m';
  return {t,ratio:ratios[k]*(0.88+rnd()*0.24),scale:Math.pow(rnd(),1.7),xseed:rnd(),jit:rnd()};});
function layout(){
  const W=field.clientWidth;if(!W)return;const mob=W<620;
  const gap=mob?12:Math.max(20,W*.02),minW=mob?W*.26:W*.075,maxW=mob?W*.54:W*.24;
  const placed=[];let bottom=0;
  const hits=(x,y,w,h)=>placed.some(r=>x<r.x+r.w+gap&&x+w+gap>r.x&&y<r.y+r.h+gap&&y+h+gap>r.y);
  for(const d of draw){
    const w=Math.round(minW+(maxW-minW)*d.scale),h=Math.round(w*d.ratio);
    let best=null;
    for(let k=0;k<(mob?12:18);k++){
      const x=Math.round((k===0?d.xseed:rnd())*(W-w));
      // slide down until free
      let lo=0;while(hits(x,lo,w,h))lo+=8;
      const score=lo+rnd()*(mob?14:36);
      if(!best||score<best.s)best={x,y:lo,s:score};
    }
    const y=best.y+Math.round(d.jit*(mob?6:18));
    placed.push({x:best.x,y,w,h});
    Object.assign(d.t.style,{position:'absolute',left:best.x+'px',top:y+'px',width:w+'px',height:h+'px',gridColumn:'auto',gridRow:'auto'});
    bottom=Math.max(bottom,y+h);
  }
  field.style.height=bottom+'px';
}
field.classList.add('is-scattered');layout();
let to;addEventListener('resize',()=>{clearTimeout(to);to=setTimeout(layout,150);});
})();
