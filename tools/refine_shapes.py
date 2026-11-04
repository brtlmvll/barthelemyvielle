from pathlib import Path
p=Path(__file__).resolve().parents[1]/'main.html';s=p.read_text()
a=s.index('  function coverRects(');b=s.index('  function hubSVG(',a)
s=s[:a]+'''  var fragmentSerial=0;
  function coverRects(S,cls,outline){var cols=4,rows=4,pts=[],out='';
    for(var y=0;y<=rows;y++){var row=[];for(var x=0;x<=cols;x++)row.push([x*S/cols+(x&&x<cols?(Math.random()-.5)*S*.08:0),y*S/rows+(y&&y<rows?(Math.random()-.5)*S*.08:0)]);pts.push(row);}
    function shard(poly){var id='shard-'+(++fragmentSerial),cx=0,cy=0;poly.forEach(function(p){cx+=p[0]/3;cy+=p[1]/3;});out+='<defs><clipPath id="'+id+'"><polygon points="'+poly.map(function(p){return p.join(',');}).join(' ')+'"/></clipPath></defs><g class="'+cls+'" data-cx="'+cx+'" data-cy="'+cy+'"><path d="'+outline+'" clip-path="url(#'+id+')"/></g>';}
    for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){var a=pts[r][c],b=pts[r][c+1],d=pts[r+1][c],e=pts[r+1][c+1];shard([a,b,e]);shard([a,e,d]);}return out;}
  function wireFrag(el){var frags=[].slice.call(el.querySelectorAll('.frag,.hfrag')),anims=[],iteration=0;if(!frags.length)return;
    function run(open){anims.forEach(function(a){a.cancel();});anims=[];if(reduce||document.documentElement.classList.contains('motion-paused'))return;
      var mode=(iteration++)%3,ox=Math.random()*240,oy=Math.random()*240;
      frags.forEach(function(r,i){var cx=+r.getAttribute('data-cx'),cy=+r.getAttribute('data-cy'),angle=Math.atan2(cy-oy,cx-ox),dist=Math.hypot(cx-ox,cy-oy),delay=dist/340*160;
        var dx=mode===1?(i%2?1:-1)*35:Math.cos(angle)*(24+dist*.14),dy=mode===2?-30-Math.random()*25:Math.sin(angle)*(24+dist*.14),rot=(Math.random()-.5)*38;
        var resting={opacity:.87,transform:'translate(0px,0px) rotate(0deg) scale(1)'},scattered={opacity:0,transform:'translate('+dx.toFixed(1)+'px,'+dy.toFixed(1)+'px) rotate('+rot.toFixed(1)+'deg) scale(.72)'};
        anims.push(r.animate(open?[resting,scattered]:[scattered,resting],{duration:open?600+Math.random()*220:420,delay:delay*(open?1:.25),fill:'forwards',easing:'cubic-bezier(.16,.7,.2,1)'}));});}
    el.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch')run(true);});el.addEventListener('pointerleave',function(){run(false);});el.addEventListener('focus',function(){run(true);});el.addEventListener('blur',function(){run(false);});
    document.addEventListener('motion-state',function(e){if(e.detail.paused){anims.forEach(function(a){a.cancel();});anims=[];}});}
''' +s[b:]
s=s.replace("'<g clip-path=\"url(#'+cid+')\">'+coverRects(S,\"hfrag\")+'</g>'","'<g>'+coverRects(S,\"hfrag\",d)+'</g>'")
s=s.replace("'<g clip-path=\"url(#'+cid+')\">'+coverRects(S,\"frag\")+'</g>'","'<g>'+coverRects(S,\"frag\",d)+'</g>'")
s=s.replace('sub:"Fashion Print · 11 prints"','sub:"Identity · Print · Image · Motion"')
s=s.replace('phrases:["Fashion Print","11 motifs","TRENDT","Rockaedron","U-Exist","Sérigraphie","Encre rongeante"]','phrases:["Identity","Printed matter","Treatments","Surface","Photography","Artwork"]')
s=s.replace('phrases:["Garden & City","Signalétique","Illustration","Cauterets","Recherche","Identité"]','phrases:["Garden & City","Signage","Illustration","Cauterets","Research","Identity"]')
s=s.replace('phrases:["Profil","Contact","CLVSTR","Baruto","Rockaedron","Information"]','phrases:["Profile","Contact","CLVSTR","Baruto","Rockaedron","Information"]')
css='''/* CHARACTER IDLE / FRAGMENT MATTER */
.m svg,.hs svg{animation:ink-idle 8s ease-in-out infinite alternate;transform-origin:50% 70%}.m:nth-child(2) svg,.hs:nth-child(2n) svg{animation-delay:-3.2s;animation-duration:10s}.m:nth-child(3) svg,.hs:nth-child(3n) svg{animation-delay:-6s;animation-duration:12s}.frag,.hfrag{opacity:.87}.shot,.hshot{filter:grayscale(1) contrast(1.12)}.m .lab,.m .sub{opacity:1;transform:none}.m .wrap::after,.hs .hw::after{content:'';position:absolute;left:25%;right:25%;bottom:-5px;height:1px;background:currentColor;opacity:.15;animation:ground-breath 8s ease-in-out infinite alternate;pointer-events:none}@keyframes ink-idle{0%{transform:translateY(0) rotate(-.6deg) scale(1)}45%{transform:translate(1.5px,-3px) rotate(.3deg) scale(1.007)}100%{transform:translate(-1px,-1.5px) rotate(.7deg) scale(.993)}}@keyframes ground-breath{from{transform:scaleX(.85);opacity:.11}to{transform:scaleX(1.08);opacity:.23}}@media(hover:none){.frag,.hfrag{opacity:.48}}@media(prefers-reduced-motion:reduce){.m svg,.hs svg,.m .wrap::after,.hs .hw::after{animation:none}.frag,.hfrag{opacity:.35}}
'''
if '/* CHARACTER IDLE' not in s:s=s.replace('</style>',css+'</style>',1)
s=s.replace('>Écrire<','>Write<')
p.write_text(s)
