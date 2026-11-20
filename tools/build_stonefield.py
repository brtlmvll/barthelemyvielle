"""Build the archive index. New stills in assets/stonefield/screens are picked up automatically."""
from hashlib import sha256
from html import escape
from pathlib import Path
import json
import random
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / 'tools/stonefield.html'
SUPPORTED = {'.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif'}
items = {}
content = set()

def add(path, name, href=None):
    path = Path(path)
    source = ROOT / path
    if path.suffix.lower() not in SUPPORTED or not source.is_file() or path in items:
        return
    digest = sha256(source.read_bytes()).digest()
    if digest in content:
        return
    content.add(digest)
    items[path] = name, href

for project in json.loads((ROOT/'assets/project-catalogue.json').read_text()):
    for path in project['images']:
        add(path, project['name'], project['slug']+'.html')

for record in json.loads((ROOT/'archive-local-manifest.json').read_text()):
    add(record['local'], record['project'])

folders = [
    ('assets/archive', None),
    ('assets/studies', 'Studies'),
    ('assets/studies-archives', 'Studies'),
    ('assets/studies-curated', 'Studies'),
    ('assets/photo', 'Field notes'),
    ('assets/stonefield/screens', None),
]
for folder, label in folders:
    for path in sorted((ROOT/folder).rglob('*')):
        relative = path.relative_to(ROOT)
        name = label or (path.parent.name if folder=='assets/archive' else path.stem)
        add(relative, name.replace('-', ' ').replace('_', ' '))

rng = random.Random(48127)
stones = list(items.items())
rng.shuffle(stones)
blocks = []
labels = set()
for i, (path, (name, href)) in enumerate(stones):
    asset = '../'+quote(path.as_posix(), safe='/')
    size = rng.choices(('s','m','l','wide','tall'), (25,31,17,17,10))[0]
    if i < 9:
        size = ('l','s','wide','m','s','tall','m','s','wide')[i]
    variant = rng.randrange(1,8)
    tilt = rng.choice((-3,-2,-1,0,0,1,2,3))
    shift = rng.choice((-6,-3,0,0,4,6))
    caption = escape(name,quote=True)
    tag = ''
    if name not in labels and (i < 9 or rng.random() < .48):
        labels.add(name)
        tag = (f'<a class="field-tag" href="{escape(href,quote=True)}">{caption}</a>'
               if href else f'<span class="field-tag">{caption}</span>')
    loading = 'eager' if i < 9 else 'lazy'
    blocks.append(
        f'<figure class="field-tile size-{size} shape-{variant}" style="--tilt:{tilt}deg;--shift:{shift}px">'
        f'<button type="button" class="image-open" data-full="{asset}" aria-label="Open image: {caption}">'
        f'<img src="{asset}" loading="{loading}" decoding="async" alt="{caption}"></button>{tag}</figure>'
    )

html=TEMPLATE.read_text().replace('@@COUNT@@',str(len(blocks))).replace('@@STONES@@','\n'.join(blocks))
(ROOT/'projects/stonefield.html').write_text(html)
print(f'{len(blocks)} distinct images')
