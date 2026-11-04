from pathlib import Path
import math,json,html,shutil
R=Path(__file__).resolve().parents[1];out=R/'assets/studies';out.mkdir(exist_ok=True)
def svg(name,title,body,bg='#e8e4db',ink='#1b2421',accent='#a7432c'):
 s=f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="{bg}"/><g fill="none" stroke="{ink}" stroke-width="2">{body}</g><g fill="{ink}" font-family="Arial,sans-serif" font-size="12" letter-spacing="3"><text x="55" y="50">CLVSTR / {title.upper()}</text><text x="55" y="852">INDEPENDENT RESEARCH</text><text x="1080" y="852">{name[-2:]}</text></g></svg>'
 (out/(name+'.svg')).write_text(s);return 'assets/studies/'+name+'.svg'
contours=[]
# Original line fields: no source-frame pixels are reused.
body=''
for j in range(47):
 pts=[]
 for k in range(121):
  x=70+k*1060/120;y=125+j*13+75*math.sin(x/240+j*.028)*math.exp(-((x-625)/520)**2)+34*math.exp(-((x-760)/125)**2)*math.sin(j*.16)
  pts.append(f'{x:.1f},{y:.1f}')
 body+='<polyline points="'+' '.join(pts)+'"/>'
body+='<rect x="731" y="110" width="9" height="650" fill="#a7432c" stroke="none"/>'
contours.append(svg('contour-01','Contour / Strata',body))
body=''
for j in range(1,36):
 pts=[]
 for k in range(145):
  t=k*math.tau/144;r=15+j*9+math.sin(3*t+j*.03)*j*1.8+math.cos(5*t)*j*.8
  pts.append(f'{600+math.cos(t)*r*1.45:.1f},{445+math.sin(t)*r:.1f}')
 body+='<polygon points="'+' '.join(pts)+'"/>'
body+='<circle cx="600" cy="445" r="7" fill="#a7432c" stroke="none"/>'
contours.append(svg('contour-02','Contour / Counterform',body,bg='#d6dfcf'))
body=''
for j in range(46):
 y=135+j*13;body+=f'<path d="M80 {y} H{420+j*3} l{70-j} {-35-j*1.1} H1120"/>'
body+='<path d="M610 90V790" stroke="#a7432c" stroke-width="5"/>'
contours.append(svg('contour-03','Contour / Fold',body))
body=''
for col in range(3):
 for j in range(23):
  x=95+col*355;y=165+j*24
  body+=f'<path d="M{x} {y} Q{x+95} {y-95*math.sin(j*.1+col)} {x+285} {y}"/>'
body+='<path d="M445 110V770 M800 110V770" stroke="#a7432c" stroke-width="1"/>'
contours.append(svg('contour-04','Contour / Three fields',body,bg='#c9d8d2'))
spaces=[];body=''
for j in range(15):
 x=100+j*27;y=120+j*12;w=950-j*53;h=630-j*23
 body+=f'<path d="M{x} {y+h} V{y} H{x+w} V{y+h}" stroke-width="{2 if j%3 else 5}"/>'
body+='<rect x="615" y="295" width="60" height="360" fill="#ab4b32" stroke="none"/>'
spaces.append(svg('space-01','Spatial scores / Threshold',body,bg='#e6e2d8'))
body=''
for j in range(9):
 x=95+j*116;w=40+15*math.sin(j*.8)
 body+=f'<path d="M{x} 180 v540 h{w:.1f} V180 Z" fill="#203c40" stroke="none"/>'
body+='<path d="M70 470H1130" stroke="#af4a31" stroke-width="8"/>'
spaces.append(svg('space-02','Spatial scores / Intervals',body,bg='#cad6d1'))
body='<path d="M170 170H1030V730H170Z M170 170L455 340H745L1030 170 M170 730L455 545H745L1030 730 M455 340V545 M745 340V545" stroke-width="3"/>'
for j in range(1,14):
 f=j/14;x=170+285*f;y=170+170*f;xr=1030-285*f;yb=730-185*f
 body+=f'<path d="M{x} {yb} V{y} H{xr} V{yb}"/>'
body+='<rect x="480" y="365" width="240" height="155" fill="#b75639" stroke="none"/>'
spaces.append(svg('space-03','Spatial scores / Lightwell',body,bg='#e4ded2'))
body=''
for col,width in enumerate([15,110,230]):
 x=110+col*360;body+=f'<rect x="{x}" y="190" width="260" height="500" stroke-width="4"/><rect x="{x+130-width/2}" y="220" width="{width}" height="440" fill="#263e42" stroke="none"/>'
body+='<path d="M75 735H1125" stroke="#b75639" stroke-width="5"/>'
spaces.append(svg('space-04','Spatial scores / Opening',body,bg='#dae0d7'))
new=[dict(name='Contour / Counterform',slug='contour-counterform',category='Studies',kind='study',description='Original graphic research into contour, strata and negative space. Landscape references from the personal screen archive become a new language of lines, folds and intervals.',images=contours,previews=contours),dict(name='Spatial Scores',slug='spatial-scores',category='Studies',kind='study',description='Original graphic research into thresholds, repetition and light. Architectural references from the personal screen archive are translated into abstract planes, openings and spatial rhythms.',images=spaces,previews=spaces)]
p=R/'assets/project-catalogue.json';catalogue=json.loads(p.read_text());catalogue=[x for x in catalogue if x['slug'] not in [n['slug'] for n in new]]+new;p.write_text(json.dumps(catalogue,ensure_ascii=False,indent=2))
base=(R/'projects/garden-and-city.html').read_text();head=base.split('<main id="content">')[0];foot=base[base.index('<footer class="footer">'):]
for project in new:
 title=project['name'];desc=project['description'];h=head.replace('Garden &amp; City',html.escape(title)).replace('Garden & City',html.escape(title)).replace('garden-and-city.html',project['slug']+'.html')
 # Replace all page-specific SEO fields, retaining the existing site navigation.
 import re
 h=re.sub(r'(<meta name="description" content=")[^"]*',lambda m:m[1]+html.escape(desc,quote=True),h)
 h=re.sub(r'(<meta property="og:description" content=")[^"]*',lambda m:m[1]+html.escape(desc,quote=True),h)
 h=re.sub(r'(<meta property="og:image" content=")[^"]*',lambda m:m[1]+'https://barthelemyvielle.com/'+project['images'][0],h)
 body=f'<main id="content"><div class="project-top"><a class="back" href="studies.html">← Studies</a><span class="micro">Independent research / 2026</span></div><section class="project-intro"><div class="title-block"><p class="eyebrow">CLVSTR / Studies</p><h1>{html.escape(title)}</h1></div><div class="project-description"><p class="lede">{html.escape(desc)}</p><dl><div><dt>Status</dt><dd>Original exploratory work</dd></div><div><dt>Medium</dt><dd>Vector compositions</dd></div><div><dt>Process</dt><dd>Observation → abstraction → system</dd></div></dl><a class="explore" href="#project-images">Explore the studies ↓</a></div></section><div class="image-sequence" id="project-images">'
 labels=['Strata','Counterform','Fold','Three fields'] if project['slug']=='contour-counterform' else ['Threshold','Intervals','Lightwell','Opening']
 for i,src in enumerate(project['images']):
  body+=f'<figure class="visual"><button class="image-open" data-full="../{src}" aria-label="View {labels[i]} full size"><img src="../{src}" alt="{labels[i]} — original graphic study" loading="{ "eager" if i==0 else "lazy"}"></button><figcaption><span>0{i+1} / 04</span><span>{labels[i]}</span></figcaption></figure>'
 body+='</div><nav class="project-pagination"><a href="studies.html"><span class="eyebrow">← Research index</span><strong>All studies</strong></a><a href="'+('spatial-scores.html' if project['slug']=='contour-counterform' else 'contour-counterform.html')+'"><span class="eyebrow">Next study ↗</span><strong>'+('Spatial Scores' if project['slug']=='contour-counterform' else 'Contour / Counterform')+'</strong></a></nav></main>'
 (R/'projects'/(project['slug']+'.html')).write_text(h+body+foot)
# Studies becomes a real index with three distinct research paths.
h=head.replace('Garden &amp; City','Studies').replace('Garden & City','Studies').replace('garden-and-city.html','studies.html')
s=h+'<main id="content"><section class="index-intro"><div><p class="eyebrow">CLVSTR / Research index</p><h1>Studies.</h1></div><div><p class="lede">A place to test forms, spaces and visual systems.</p><p class="index-count">Three research paths</p></div></section><div class="project-grid studies-grid">'
for project in [next(p for p in catalogue if p['slug']=='garden-and-city'),*new]:
 s+=f'<a class="project-card" href="{project["slug"]}.html"><div class="card-image"><img src="../{project["images"][0]}" alt="{html.escape(project["name"])}" loading="eager"></div><div class="card-caption"><span>{html.escape(project["name"])}</span><span>Research ↗</span></div><p class="study-card-summary">{html.escape(project["description"])}</p></a>'
s+='</div></main>'+foot;(R/'projects/studies.html').write_text(s)
# Include both new studies in the general project index.
p=R/'projects/index.html';s=p.read_text();s=re.sub(r'<a class="project-card" href="(?:contour-counterform|spatial-scores)\.html".*?</a>','',s,flags=re.S);insert=''
for project in new:
 insert+=f'<a class="project-card" href="{project["slug"]}.html" data-category="Studies"><div class="card-image"><img src="../{project["images"][0]}" alt="{html.escape(project["name"])}" loading="lazy"><span class="open-mark" aria-hidden="true">↗</span></div><div class="card-caption"><span>{html.escape(project["name"])}</span><span>Studies</span></div></a>'
s=s.replace('</div></main><footer',insert+'</div></main><footer').replace('30 projects &amp; studies','32 projects &amp; studies').replace('30 projects & studies','32 projects & studies');p.write_text(s)
for p in (R/'projects').glob('*.html'):
 s=p.read_text().replace('<a href="garden-and-city.html">Studies</a>','<a href="studies.html">Studies</a>');p.write_text(s)
p=R/'assets/project-links.js';s=p.read_text().replace("ROOT+'garden-and-city.html'","ROOT+'studies.html'");p.write_text(s)
p=R/'main.html';s=p.read_text().replace('Garden & City · research','Three research paths');p.write_text(s)
print('Two original studies + three-path Studies index created')
