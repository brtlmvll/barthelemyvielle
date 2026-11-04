"""Replace exact archive image URLs without changing design or project metadata."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
rows=json.loads((root/'archive-local-manifest.json').read_text())
assert len(rows)==57
for r in rows:
 p=root/r['local']
 assert p.is_file() and p.stat().st_size==r['bytes'],p
for name in ('index.html','main.html','main-strobe.html'):
 p=root/name
 if not p.exists():continue
 s=p.read_text(); count=0
 for r in rows:
  count+=s.count(r['source'])
  s=s.replace(r['source'],r['local'])
 if count:
  p.write_text(s)
 print(name,':',count,'liens remplacés')
