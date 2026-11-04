"""Build standalone project pages from the existing portfolio and local asset manifest."""
from pathlib import Path
import json,re,html,unicodedata,subprocess
R=Path(__file__).resolve().parents[1]; S=(R/'main.html').read_text(); D=json.JSONDecoder()
def extract(name):return D.raw_decode(S.split('var '+name+'=',1)[1].lstrip())[0]
def esc(s):return html.escape(str(s),quote=True)
def slug(s):return re.sub('[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')
archive=extract('ARCHIVE'); desc=extract('DESC'); rows=json.loads((R/'archive-local-manifest.json').read_text()); mapping={r['source']:r['local'] for r in rows}
projects=[]
types={'U-Exist':'Print & Surface','Vibra':'Treatments','Golfinho':'Treatments','Longchamp':'Treatments','Maskné Protect':'3D & Motion','Hshtgs':'Identity','Koridor #2':'Artwork & Print'}
for fam in archive.values():
 for p in fam['projects']:
  name=p['n']; category=types.get(name, 'Identity' if fam['lab']=='Branding' else 'Artwork & Print')
  projects.append(dict(name=name,slug=slug(name),category=category,description=desc[name],images=[mapping.get(u,u) for u in p['imgs']],kind='project'))
# Preserve documented client attributions instead of assigning all prints to Kiwami.
prints=extract('PRINTS')
tech={'Sérigraphie':'Screen printing','Dessin · numérisation':'Drawing · scanning','Encre rongeante · sérigraphie':'Discharge ink · screen printing','Photographie · composition':'Photography · composition','Numérisation · composition':'Scanning · composition','Impression directe':'Direct printing'}
for name,client,method,img in prints:
 projects.append(dict(name=name,slug='print-'+slug(name),category='Print & Surface',description=f'{tech.get(method,method)}. A surface-design study for {client}, presented here through the original pattern.',images=['assets/fashion/'+img+'.jpg'],client=client,technique=tech.get(method,method),kind='print'))
photos=extract('PHOTOS')
projects.append(dict(name='Field Notes',slug='field-notes',category='Photography',description='A photographic notebook of surfaces, structures, plants and encounters. Close observation links the natural environment to the built world.',images=['assets/photo/'+p+'.jpg' for p in photos],kind='photography'))
gc=extract('GC')
projects.append(dict(name='Garden & City',slug='garden-and-city',category='Studies',description='An identity and spatial-design study for Garden & City in Cauterets. Signage, illustration and spatial proposals are explored as parts of one visual system.',images=['assets/gc/'+n+'.jpg' for names in gc.values() for n in names],kind='study',sections=gc))
for project in projects:
 project['previews']=[str(f.relative_to(R)) for f in sorted((R/'assets/previews').glob(project['slug']+'-*.svg'))]
P=R/'projects';P.mkdir(exist_ok=True)
# Animated originals are opt-in; still previews keep the page light and respect reduced motion.
for p in projects:
 for src in p['images']:
  if src.endswith('.gif'):
   target=R/src.replace('.gif','-poster.jpg')
   if not target.exists():subprocess.run(['sips','-s','format','jpeg','-Z','1600',str(R/src),'--out',str(target)],check=True,stdout=subprocess.DEVNULL)
def head(title,description,image,url):
 return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(title)} — Barthélémy Vielle</title><meta name="description" content="{esc(description)}"><link rel="canonical" href="https://barthelemyvielle.com/projects/{url}"><meta property="og:title" content="{esc(title)} — Barthélémy Vielle"><meta property="og:description" content="{esc(description)}"><meta property="og:image" content="https://barthelemyvielle.com/{image}"><meta property="og:type" content="website"><meta property="og:url" content="https://barthelemyvielle.com/projects/{url}"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="../assets/project-pages.css?v=20261104-window"><script src="../assets/project-pages.js?v=20261104-window" defer></script><script src="../assets/living-surfaces.js?v=20261104-window" defer></script><link rel="stylesheet" href="../assets/window-system.css?v=20261104-window"></head><body><a class="skip" href="#content">Skip to content</a><header class="sitebar"><a class="signature" href="../main.html">BARTHÉLÉMY VIELLE <span>CLVSTR</span></a><nav aria-label="Main"><a href="index.html">Work</a><a href="garden-and-city.html">Studies</a><a href="../main.html#about">Information</a></nav></header>'''
def footer():return '''<footer class="footer"><a href="index.html">All projects ↗</a><span>CLVSTR · Barthélémy Vielle</span><a href="mailto:barthelemy.vielle@gmail.com">Get in touch ↗</a></footer><dialog class="lightbox" aria-label="Image viewer"><button class="close-viewer" aria-label="Close image viewer">Close ×</button><img alt=""><p></p></dialog></body></html>'''
def img_path(src):return src.replace('.gif','-poster.jpg')
def figure(src,p,i,hero=False):
 motion=False; image=img_path(src)
 label=p['name']+' — '+('animated presentation' if motion else 'visual')+' '+str(i+1)
 return f'''<figure class="visual {'hero-visual' if hero else 'reveal'}" data-sequence="{i}"><button class="image-open" aria-label="View {esc(label)} full size" data-full="../{image}"><img src="../{image}" alt="{esc(label)}" loading="{'eager' if hero else 'lazy'}" decoding="async" {'fetchpriority="high"' if hero else ''}></button>{f'<button class="play-loop" data-animation="../{src}" aria-pressed="false">Play loop ↗</button>' if motion else ''}<figcaption><span>{str(i+1).zfill(2)} / {str(len(p['images'])).zfill(2)}</span><span>{'Motion study · play on demand' if motion else esc(p['name'])}</span></figcaption></figure>'''
for idx,p in enumerate(projects):
 title=p['name']; image=img_path(p['images'][0]); study=p['kind']=='study'
 prev=projects[(idx-1)%len(projects)]; nxt=projects[(idx+1)%len(projects)]
 metadata=f'<div><dt>Discipline</dt><dd>{esc(p["category"])}</dd></div>'
 if p.get('client'):metadata+=f'<div><dt>Client</dt><dd>{esc(p["client"])}</dd></div><div><dt>Process</dt><dd>{esc(p["technique"])}</dd></div>'
 if study:metadata+='<div><dt>Status</dt><dd>Research & proposals</dd></div><div><dt>Location</dt><dd>Cauterets, France</dd></div>'
 body=head(title,p['description'],image,p['slug']+'.html')+f'''<main id="content"><div class="project-top"><a class="back" href="index.html">← All projects</a><span class="micro">{str(idx+1).zfill(2)} / {str(len(projects)).zfill(2)} — {esc(p['category'])}</span></div><section class="project-intro"><div class="title-block"><p class="eyebrow">{'Research dossier' if study else 'Selected work'} / CLVSTR</p><h1>{esc(title)}</h1><div class="strand" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div><div class="project-description"><p class="lede">{esc(p['description'])}</p><dl>{metadata}</dl><button class="colour-toggle" aria-pressed="false">View original colour ↗</button><a class="explore" href="#project-images">Explore project ↓</a></div></section>'''
 if study:
  sections={'Signage':('In the space','Signage and orientation proposals connect the identity to the places where it would be encountered.'),'Illustration':('A cast of characters','Illustration studies explore a distinct voice for reception, wayfinding and communication.'),'Campaign':('Out in the world','A campaign application tests how the identity can operate beyond the building.'),'Spaces':('Spatial proposals','Rendered studies examine scale, surfaces and the relationship between graphics and architecture.')}
  body+='<nav class="chapter-nav" aria-label="Study chapters">'+''.join(f'<a href="#chapter-{slug(k)}">{esc(k)}</a>' for k in p['sections'])+'</nav><div id="project-images" class="study-body">'
  i=0
  for key,names in p['sections'].items():
   label,text=sections.get(key,(key,'A selection of research and applications from the study.'))
   body+=f'<section class="chapter" id="chapter-{slug(key)}"><div class="chapter-heading"><p class="eyebrow">{esc(key)}</p><h2>{esc(label)}</h2><p>{esc(text)}</p></div><div class="image-sequence">'
   for n in names:body+=figure('assets/gc/'+n+'.jpg',p,i);i+=1
   body+='</div></section>'
  body+='</div>'
 else:
  body+='<div id="project-images" class="image-sequence">'+''.join(figure(src,p,i,i==0) for i,src in enumerate(p['images']))+'</div>'
 body+=f'''<nav class="project-pagination" aria-label="Project navigation"><a href="{prev['slug']}.html"><span class="eyebrow">← Previous project</span><strong>{esc(prev['name'])}</strong></a><a href="{nxt['slug']}.html"><span class="eyebrow">Next project ↗</span><strong>{esc(nxt['name'])}</strong></a></nav></main>'''+footer()
 (P/(p['slug']+'.html')).write_text(body)
# A direct index, with filters that are also shareable through the URL.
filters=['All','Identity','Print & Surface','Artwork & Print','Treatments','3D & Motion','Photography','Studies']
s=head('Selected work','Identities, printed matter, treatments, motion and studies by Barthélémy Vielle.',img_path(projects[0]['images'][0]),'index.html')
s+='''<main id="content"><section class="index-intro"><div><p class="eyebrow">CLVSTR / Project index</p><h1>Selected<br>work.</h1></div><div><p class="lede">Identities, images and objects.<br>From physical matter to digital form.</p><p class="index-count" aria-live="polite">30 projects & studies</p><button class="colour-toggle" aria-pressed="false">View original colour ↗</button></div></section><nav class="filters" aria-label="Filter projects">'''
s+=''.join(f'<button data-filter="{esc(f)}" aria-pressed="{str(f=="All").lower()}">{esc(f)}</button>' for f in filters)+'</nav><div class="project-grid">'
for i,p in enumerate(projects):
 s+=f'''<a class="project-card reveal" href="{p['slug']}.html" data-category="{esc(p['category'])}"><div class="card-image"><img src="../{(p['previews'][0] if p.get('previews') else img_path(p['images'][0]))}" alt="{esc(p['name'])}" loading="{'eager' if i<2 else 'lazy'}" decoding="async"><span class="card-fragments" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="open-mark" aria-hidden="true">↗</span></div><div class="card-caption"><span>{esc(p['name'])}</span><span>{esc(p['category'])}</span></div></a>'''
s+='</div></main>'+footer();(P/'index.html').write_text(s)
(R/'assets/project-catalogue.json').write_text(json.dumps([{k:([img_path(x) for x in v] if k=='images' else v) for k,v in p.items() if k not in ['sections']} for p in projects],ensure_ascii=False,indent=2))
print(len(projects),'project pages generated')
