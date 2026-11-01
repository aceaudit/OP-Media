# 75. Expect Less, Demand More — creator's audio, one sentence removed (18.34–22.23: a line with profanity), ended before the host's reply.
import numpy as np
from soundlib import *
from voedit import load, place, fade, xsplice
from scipy.io import wavfile
x = load('/home/claude/batch70/s06.wav')
v = fade(xsplice(x, [(0.0, 18.34), (22.23, 57.62)]), 0.0, 0.08)
voice = place(v, len(t)); pk = np.max(np.abs(voice)); print('voice len', len(v) / SR)
fx = Fx()
SC = [5.3, 8.7, 12.6, 16.1, 18.43, 22.9, 24.1, 29.7, 32.7, 35.0, 37.1, 41.5, 45.0, 48.4]
for ts in SC: fx.whoosh(ts, 0.01, 0.07, 1200, 5000)
for ts in (7.92, 9.36, 13.76, 14.64, 16.72, 21.91): fx.sweep(ts, ts + 0.3, 600, 300, 0.004, 'sin')      # battery drains
fx.hit(13.76, 0.01, 2000, 0.02, 1.0, 0.03, 0.2)                                                         # promise shatters
fx.ping(26.79, 392.0, 0.008, 0.25); fx.ping(29.27, 1046.5, 0.01, 0.4); fx.ping(29.33, 1318.51, 0.008, 0.4)
for ts, f in ((32.39, 784.0), (34.71, 880.0), (36.63, 987.77), (39.7, 1046.5)): fx.ping(ts, f, 0.009, 0.35)  # charging steps
for i in range(10): fx.ping(39.7 + i * 0.13, 1318.51 + 60 * i, 0.003, 0.2)                              # seats light up
for i in range(3): fx.hit(43.59 + i * 0.12, 0.008, 3000, 0.01, 1.0, 0.02, 0.08)                         # snip
fx.ping(47.47, 1046.5, 0.01, 0.5); fx.ping(47.53, 1567.98, 0.008, 0.5)
for ts in (49.6, 49.95, 50.3, 50.6, 50.9): fx.hit(ts, 0.006, 1500, 0.03, 0.4, 0.006, 0.08)              # darts bounce off
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(53.75 + dt, f, 0.009, 1.4)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound75.wav', SR, (st * 32767).astype(np.int16)); print('ok sound75.wav', round(pk, 3))
