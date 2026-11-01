#!/bin/bash
# usage: qc.sh "file.mp4" t1,t2,... → specs + loudness + frame sheet qc.png
F="$1"; T="$2"
ffprobe -v error -select_streams v -show_entries stream=width,height,r_frame_rate,codec_name,pix_fmt -show_entries format=duration,size,bit_rate -of compact "$F"
ffmpeg -hide_banner -nostats -i "$F" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2 | tr -s ' '
python3 - "$F" "$T" <<'PY'
import sys, subprocess
from PIL import Image
f, ts = sys.argv[1], [float(x) for x in sys.argv[2].split(',')]
ims = []
for t in ts:
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',f,'-frames:v','1','-vf','scale=270:480','/tmp/claude-0/-home-claude/9a4211c1-9efa-550c-8ee2-41f0093aca27/scratchpad/q.png'])
    ims.append(Image.open('/tmp/claude-0/-home-claude/9a4211c1-9efa-550c-8ee2-41f0093aca27/scratchpad/q.png').copy())
im = Image.new('RGB', (270*len(ims), 480))
for i, x in enumerate(ims): im.paste(x, (i*270, 0))
im.save('/home/claude/rat-race/qc.png')
PY
