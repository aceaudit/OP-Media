#!/bin/bash
# usage: prev.sh NN t1,t2,...  → stills at full size + a labelled contact sheet prevNN.png (cols of 360px)
N=$1; T=$2; D=/home/claude/rat-race/prev$N
rm -rf $D && node rf.cjs v$N.html $D stills $T 2>&1 | grep -v '^done' ; python3 - "$D" "$N" <<'PY'
import sys, os
from PIL import Image, ImageDraw
d, n = sys.argv[1], sys.argv[2]
fs = sorted(os.listdir(d), key=lambda f: float(f[1:-4]))
cols = min(6, len(fs)); rows = (len(fs) + cols - 1) // cols
im = Image.new('RGB', (360 * cols, 640 * rows), 'black'); dr = ImageDraw.Draw(im)
for i, f in enumerate(fs):
    im.paste(Image.open(os.path.join(d, f)).resize((360, 640)), ((i % cols) * 360, (i // cols) * 640))
    dr.text(((i % cols) * 360 + 6, (i // cols) * 640 + 4), f[1:-4], fill='red')
im.save(f'/home/claude/rat-race/prev{n}.png')
PY
