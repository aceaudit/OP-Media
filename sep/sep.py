# usage: python3 sep.py in.mp4 out_prefix   → out_prefix.voice.wav / out_prefix.music.wav (48 kHz mono)
import sys, subprocess, numpy as np, sherpa_onnx, time
from scipy.io import wavfile
src, out = sys.argv[1], sys.argv[2]
SR = 44100
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vn', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
x = np.frombuffer(pcm, np.float32).reshape(-1, 2).T.copy()
cfg = sherpa_onnx.OfflineSourceSeparationConfig(model=sherpa_onnx.OfflineSourceSeparationModelConfig(uvr=sherpa_onnx.OfflineSourceSeparationUvrModelConfig(model='/home/claude/sep/UVR-MDX-NET-Voc_FT.onnx'), num_threads=2))
sp = sherpa_onnx.OfflineSourceSeparation(cfg)
t0 = time.time(); r = sp.process(sample_rate=SR, samples=x); print('sep', round(time.time() - t0, 1), 's', 'stems', len(r.stems))
names = []
for i, st in enumerate(r.stems):
    d = np.array([np.array(ch.data) for ch in st.data]) if hasattr(st, 'data') else None
    m = d.mean(0)
    tmp = f'{out}.stem{i}.wav'; wavfile.write(tmp, r.sample_rate, m.astype(np.float32))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', f'{out}.stem{i}.48k.wav'])
    print(i, 'rms', round(float(np.sqrt(np.mean(m ** 2))), 4))
