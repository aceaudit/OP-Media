# chunked separation for long reels: python3 sep2.py in.mp4 out_prefix  → out_prefix.voice.wav / .music.wav (48 kHz mono)
import sys, subprocess, numpy as np, sherpa_onnx
from scipy.io import wavfile
src, out = sys.argv[1], sys.argv[2]; SR = 44100
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vn', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
x = np.frombuffer(pcm, np.float32).reshape(-1, 2).T.copy(); N = x.shape[1]
cfg = sherpa_onnx.OfflineSourceSeparationConfig(model=sherpa_onnx.OfflineSourceSeparationModelConfig(uvr=sherpa_onnx.OfflineSourceSeparationUvrModelConfig(model='/home/claude/sep/UVR-MDX-NET-Voc_FT.onnx'), num_threads=2))
sp = sherpa_onnx.OfflineSourceSeparation(cfg)
CH, OV = 12 * SR, 1 * SR; acc = [np.zeros(N), np.zeros(N)]; wsum = np.zeros(N)
s = 0
while s < N:
    e = min(N, s + CH); seg = x[:, s:e].copy()
    r = sp.process(sample_rate=SR, samples=seg)
    w = np.ones(e - s); r_ = min(OV, (e - s) // 2)
    if s > 0: w[:r_] = np.linspace(0, 1, r_)
    if e < N: w[-r_:] = np.linspace(1, 0, r_)
    for i, st in enumerate(r.stems[:2]):
        d = np.array([np.array(c.data) for c in st.data]).mean(0)[:e - s]; acc[i][s:e] += d * w
    wsum[s:e] += w; print('chunk', s / SR, flush=True)
    if e == N: break
    s = e - OV
for i, name in enumerate(['voice', 'music']):
    y = acc[i] / np.maximum(wsum, 1e-6); tmp = f'{out}.{name}.44k.wav'; wavfile.write(tmp, SR, y.astype(np.float32))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', f'{out}.{name}.wav'])
print('ok')
