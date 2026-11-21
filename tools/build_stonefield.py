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
# Removed by Bart (iPhone photos, Accomplicoins, Field notes) or unusable (lorem ipsum). Never re-add.
EXCLUDE_DIRS = ('assets/photo/', 'assets/studies/', 'assets/logo-bank/')  # studies/: generated (ChatGPT, Midjourney, code), not Bart's work
EXCLUDE = {'assets/logo-bank/logo-002.png', 'assets/archive/de-saint-aise/05.svg', 'assets/archive/de-saint-aise/06.svg', 'assets/studies-curated/field-notes.webp', 'assets/studies-archives/marques-accomplicoins.webp', 'assets/archive/hovr/02.svg', 'assets/archive/99-cts-records/02.svg', 'assets/archive/common-wave/03.svg', 'assets/archive/de-saint-aise/02.svg', 'assets/archive/de-saint-aise/03.svg', 'assets/archive/golfinho/02-poster.svg', 'assets/archive/golfinho/03-poster.svg', 'assets/archive/golfinho/04-poster.svg', 'assets/archive/hovr/01.svg', 'assets/archive/hovr/03.svg', 'assets/archive/hovr/04.svg', 'assets/archive/hovr/05.svg', 'assets/archive/longchamp/02-poster.svg', 'assets/archive/longchamp/03-poster.svg', 'assets/archive/longchamp/04-poster.svg', 'assets/archive/petit-producteur/01.svg', 'assets/archive/terrarivm-generalis/01.svg', 'assets/archive/terrarivm-generalis/02.svg', 'assets/archive/terrarivm-generalis/04.svg', 'assets/archive/vibra/01-poster.svg', 'assets/archive/vibra/02-poster.svg', 'assets/archive/vibra/03-poster.svg', 'assets/studies-archives/estaing-isaby-39.webp', 'assets/studies-archives/estaing-isaby-51.webp', 'assets/studies-archives/estaing-neural-3-image.webp', 'assets/studies-archives/estaing-neural-8196.webp', 'assets/studies-archives/marques-fathaer-h.webp', 'assets/studies-archives/marques-fathaer-haello.webp', 'assets/studies-archives/og-studies.jpg', 'assets/studies-curated/haello.webp', 'assets/studies-curated/multimum.webp', 'assets/studies-curated/tribe.webp', 'assets/studies/recovered/night-signals-02.svg'}
content = set()

def add(path, name, href=None):
    path = Path(path)
    if path.as_posix() in EXCLUDE or path.as_posix().startswith(EXCLUDE_DIRS) or path.as_posix() in globals().get('used_elsewhere', set()):
        return
    source = ROOT / path
    if path.suffix.lower() not in SUPPORTED or not source.is_file() or path in items:
        return
    digest = sha256(source.read_bytes()).digest()
    if digest in content:
        return
    content.add(digest)
    items[path] = name, href

# Stonefield is exclusive: images already shown in Work or Studies cannot re-enter.
used_elsewhere = set()
for project in json.loads((ROOT/'assets/project-catalogue.json').read_text()):
    used_elsewhere.update(path.split('?')[0] for path in project['images'] + project.get('previews', []))
elsewhere_digests = {sha256((ROOT/path).read_bytes()).digest() for path in used_elsewhere if (ROOT/path).is_file()}
content.update(elsewhere_digests)

folders = [
    ('assets/archive', None),
    ('assets/studies-archives', 'Studies'),
    ('assets/studies-curated', 'Studies'),
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
