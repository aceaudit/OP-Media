#!/bin/bash
# usage: encode.sh <frames_dir> <audio.wav> <output.mp4>
# High-quality master for social upload: 1080x1920, 30fps, H.264 High@4.2, BT.709, ~15-20 Mbps,
# faint temporal grain against banding, brand watermark, audio levelled to -14 LUFS.
set -e
FR="$1"; AU="$2"; OUT="$3"
WM=/home/claude/ownpace-logo/ownpace-video-watermark.png
FPS=${FPS:-30}
ffmpeg -v error -y -framerate $FPS -i "$FR/f%04d.${EXT:-png}" -i "$AU" -i "$WM" \
  -filter_complex "[2]scale=252:-1,format=rgba,colorchannelmixer=aa=0.9[wm];[0][wm]overlay=(W-w)/2:1528,noise=alls=3:allf=t,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[v];[1]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -preset slow -crf 14 -profile:v high -level 4.2 -maxrate 30M -bufsize 60M -g $((FPS*2)) \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration,bit_rate,size -of compact "$OUT"
