#!/bin/bash
# usage: sepchunks.sh sNN  → sNN.voice.wav / sNN.music.wav via 16 s chunks (1 s overlap), one process per chunk
i=$1; src=/home/claude/batch70/$i.mp4; d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $src)
mkdir -p ch_$i; k=0; s=0
while python3 -c "import sys; sys.exit(0 if $s < $d - 0.05 else 1)"; do
  ffmpeg -v error -y -ss $s -t 16 -i $src -vn -ac 2 -ar 44100 ch_$i/c$k.wav
  python3 sep.py ch_$i/c$k.wav ch_$i/c$k > /dev/null 2>&1 || echo "fail $k"
  k=$((k+1)); s=$(python3 -c "print($s + 15)")
done
python3 - $i $k <<'PY'
import sys, numpy as np; sys.path.insert(0, '/home/claude/rat-race')
from voedit import load; from scipy.io import wavfile
i, k = sys.argv[1], int(sys.argv[2]); SR = 48000; OV = SR
for st, name in ((0, 'voice'), (1, 'music')):
    parts = [load(f'ch_{i}/c{j}.stem{st}.48k.wav') for j in range(k)]
    out = parts[0].copy()
    for p in parts[1:]:
        o = min(OV, len(p)); w = np.linspace(0, 1, o); out[-o:] = out[-o:] * (1 - w) + p[:o] * w; out = np.concatenate([out, p[o:]])
    wavfile.write(f'{i}.{name}.wav', SR, (np.clip(out, -1, 1) * 32767).astype(np.int16)); print(name, len(out) / SR)
PY
