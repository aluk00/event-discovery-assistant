#!/usr/bin/env python3
"""Post-process the pptx pptxgenjs writes: deflate every part and dedupe media.

pptxgenjs stores parts uncompressed and embeds one copy of an image per slide,
which made the deck ~950 KB. This brings it to ~105 KB with identical content.
"""
import hashlib, os, sys, zipfile

path = sys.argv[1] if len(sys.argv) > 1 else 'TYPE-A-Production-Calendar.pptx'
zin = zipfile.ZipFile(path)
names = zin.namelist()
data = {n: zin.read(n) for n in names}
zin.close()

media = [n for n in names if n.startswith('ppt/media/')]
seen, alias = {}, {}
for n in sorted(media):
    h = hashlib.sha256(data[n]).hexdigest()
    if h in seen:
        alias[os.path.basename(n)] = os.path.basename(seen[h])
    else:
        seen[h] = n

drop = {n for n in media if os.path.basename(n) in alias}
for rels in [n for n in names if n.endswith('.rels')]:
    txt = data[rels].decode('utf-8')
    for old, new in alias.items():
        txt = txt.replace('/' + old + '"', '/' + new + '"')
    data[rels] = txt.encode('utf-8')

tmp = path + '.tmp'
zo = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED, compresslevel=9)
for n in ['[Content_Types].xml'] + [x for x in names if x != '[Content_Types].xml']:
    if n in drop:
        continue
    zi = zipfile.ZipInfo(n)
    zi.compress_type = zipfile.ZIP_DEFLATED
    zo.writestr(zi, data[n])
zo.close()
os.replace(tmp, path)
print('%s: %d media -> %d unique, %.0f KB' % (path, len(media), len(seen), os.path.getsize(path) / 1024))
