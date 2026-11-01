# 76. The Work You're Avoiding — creator's audio: first quote untouched, an aside between the two quotes removed
# (5.75–7.62, contains profanity) and replaced by 1.1 s of our pickaxe hits; second quote untouched.
import numpy as np
from soundlib import *
from voedit import load, place, fade
from scipy.io import wavfile
x = load('/home/claude/batch70/s07.wav'); SRr = 48000
a = fade(x[:int(5.75 * SRr)], 0.0, 0.06); b = fade(x[int(7.62 * SRr):], 0.08, 0.06)
voice = place(a, len(t)) + place(b, len(t), 6.85); pk = np.max(np.abs(voice))
fx = Fx()
for h0, h1 in ((0.1, 0.75), (0.8, 1.5), (1.55, 2.25), (2.3, 2.75)):
    for i in range(int((h1 - h0) * 1.4) + 1): fx.noise_env(np.exp(-((t - (h0 + i * 0.7 + 0.1)) / 0.05) ** 2), 0.006, 600, 3000)
    fx.ping(h1, 523.25, 0.004, 0.15)
for i in range(3): fx.ping(2.96 + i * 0.07, 1567.98 + 200 * i, 0.004, 0.25)
fx.bell(4.88, 659.25, 0.008, 1.6); fx.noise_env(smooth(4.88, 5.2, t) * (1 - smooth(5.8, 6.0, t)), 0.002, 200, 800)
HITS = [6.0, 6.45, 6.9, 7.4, 7.9, 8.35, 8.83, 9.23]
for i, h in enumerate(HITS[:-1]): fx.hit(h, 0.016 + 0.002 * i, 180, 0.05, 1.0, 0.012, 0.25); fx.ping(h, 2400 + 100 * i, 0.004, 0.06)
fx.hit(9.23, 0.03, 60, 0.3, 1.0, 0.03, 0.6); fx.noise_env(np.exp(-np.maximum(0, t - 9.23) / 0.3) * (t >= 9.23), 0.012, 400, 6000)
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(9.25 + dt, f, 0.013, 2.2)
fx.noise_env(np.exp(-np.maximum(0, t - 9.3) / 0.8) * (t >= 9.3), 0.004, 5000, 12000)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound76.wav', SR, (st * 32767).astype(np.int16)); print('ok sound76.wav', round(pk, 3))
