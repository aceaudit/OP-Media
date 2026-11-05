# remux a rendered video with its soundtrack wav at -14 LUFS: measure, apply gain, true-peak safe limiter, re-measure and trim once
import json, subprocess, sys, os, re
vid, wav = sys.argv[1], sys.argv[2]
def meas(src, af=''):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', src, '-af', (af + ',' if af else '') + 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1])
g = -14.0 - meas(wav)
for _ in range(2):
    af = f'volume={g:.2f}dB,alimiter=limit=0.82:attack=2:release=60:level=false'
    got = meas(wav, af); g += -14.0 - got
af = f'volume={g:.2f}dB,alimiter=limit=0.82:attack=2:release=60:level=false'
tmp = vid.replace('.mp4', '.new.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', vid, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', af, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', tmp], check=True)
os.replace(tmp, vid); print('gain', round(g, 2))
