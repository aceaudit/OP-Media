#!/bin/bash
# usage: queue.sh NN "Title" [PREV_NN]   — waits until PREV's frames dir is gone and its mp4 exists
N="$1"; T="$2"; P="$3"
cd /home/claude/rat-race
if [ -n "$P" ]; then until ls /home/claude/ownpace-videos/ | grep -q "^$P\. " && [ ! -d frames$P ]; do sleep 15; done; fi
rm -rf frames$N && FMT=jpg PORT=83$N PAGE=v$N.html node render_p.cjs frames$N 60 > render$N.log 2>&1 && EXT=jpg FPS=60 ./encode.sh frames$N sound$N.wav "/home/claude/ownpace-videos/$N. $T.mp4" && rm -rf frames$N
