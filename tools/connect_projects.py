from pathlib import Path
R=Path(__file__).resolve().parents[1]
p=R/'main.html';s=p.read_text()
s=s.replace('workhub.hidden=false;galFashion.hidden=true;galPhoto.hidden=true;','workhub.hidden=false;Object.keys(GALS).forEach(function(k){GALS[k].hidden=true;});')
s=s.replace('DEUX TERRAINS — LE MOTIF &amp; L’IMAGE.','Identities, printed matter, images and motion.').replace('Two terrains — pattern &amp; image.','Identities, printed matter, images and motion.').replace('Two terrains — pattern & image.','Identities, printed matter, images and motion.').replace('Two grounds — the pattern &amp; the image.','Identities, printed matter, images and motion.').replace('Two grounds — the pattern & the image.','Identities, printed matter, images and motion.')
s=s.replace('lab:"Branding",  sub:"7 projects"','lab:"Identity",  sub:"6 projects"').replace('lab:"Motion",    sub:"4 projects"','lab:"Treatments & Motion", sub:"4 projects"')
s=s.replace('branding:"Branding",artwork:"Artwork",motion:"Motion"','branding:"Identity",artwork:"Artwork",motion:"Treatments & Motion"')
s=s.replace('ARCHIVE[famKey].projects.forEach(function(pr){','ARCHIVE[famKey].projects.filter(function(pr){return famKey!=="branding"||pr.n!=="U-Exist";}).forEach(function(pr){')
# Correct image previews: each family should show work from that family.
s=s.replace('sub:"6 projects",img:"assets/fashion/p02.jpg"','sub:"6 projects",img:"assets/archive/de-saint-aise/01.jpg"')
s=s.replace('sub:"6 projects",img:"assets/fashion/p13.jpg"','sub:"6 projects",img:"assets/archive/koridor-2/01.jpg"')
s=s.replace('sub:"4 projects",img:"assets/fashion/p19.jpg"','sub:"4 projects",img:"assets/archive/vibra/01-poster.jpg"')
if 'id="project-shortcuts"' not in s:
 s=s.replace('<div class="hubshapes" id="hubshapes">','<nav id="project-shortcuts" aria-label="Project index"><a href="projects/index.html">View all projects ↗</a><a href="projects/index.html?filter=Print%20%26%20Surface">Print &amp; Surface ↗</a></nav><div class="hubshapes" id="hubshapes">')
 # Actual source may have a different class ordering.
 if 'id="project-shortcuts"' not in s:
  s=s.replace('<div id="hubshapes" class="hubshapes">','<nav id="project-shortcuts" aria-label="Project index"><a href="projects/index.html">View all projects ↗</a><a href="projects/index.html?filter=Print%20%26%20Surface">Print &amp; Surface ↗</a></nav><div id="hubshapes" class="hubshapes">')
if 'assets/project-links.js' not in s:s=s.replace('</body>','<script src="assets/project-links.js" defer></script>\n</body>')
if '/* PROJECT PAGES */' not in s:s=s.replace('</style>','/* PROJECT PAGES */\n#project-shortcuts{display:flex;justify-content:center;gap:30px;flex-wrap:wrap;margin:20px 0 35px;font-size:11px;letter-spacing:.08em}#project-shortcuts a,.project-open-link{color:inherit;text-decoration:none;border-bottom:1px solid currentColor;padding:12px 0}.project-open-link{display:inline-block;margin:24px 0 60px;font-size:11px}.ghead a{color:inherit;text-decoration:none}\n</style>',1)
p.write_text(s)
