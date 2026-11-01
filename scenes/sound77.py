# 77. Same Letters — creator's reel audio untouched + soft tile sounds (drop clacks, counting ticks, flips, a chime per pair).
import numpy as np
from soundlib import *
from voedit import load, place, fade
from scipy.io import wavfile
v = fade(load('/home/claude/batch70/s08.wav'), 0.0, 0.05)
voice = place(v, len(t)); pk = np.max(np.abs(voice))
fx = Fx()
for i in range(28): fx.hit(0.02 + i * 0.056, 0.0025, 1800, 0.008, 0.6, 0.003, 0.02)       # shuffling tiles
PAIRS = [('HATE', 1.68, 2.0, 2.48, 4.48), ('ENEMIES', 5.44, 6.0, 6.48, 7.92), ('LYING', 8.8, 9.28, 9.68, 10.88), ('FAILURE', 12.08, 12.72, 13.28, 14.56), ('CRY', 15.44, 15.92, 16.32, 17.52), ('NEGATIVITY', 18.8, 19.36, 19.76, 20.96)]
CH = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]
for p, (w, tb, th, tl, tg) in enumerate(PAIRS):
    n = len(w)
    for i in range(n): fx.hit(tb + i * 0.045, 0.006, 900, 0.015, 0.7, 0.004, 0.04)                # tiles land
    for i in range(n): fx.ping(th + (i + 0.5) * (tl + 0.25 - th) / n, 1200 + 40 * i, 0.003, 0.05)  # counted
    for i in range(n): fx.whoosh(tg + i * 0.06 + 0.1, 0.004, 0.03, 3000, 9000)                      # flips
    d = tg + n * 0.06 + 0.15
    fx.ping(d, CH[p], 0.01, 0.4); fx.ping(d + 0.05, CH[p] * 1.5, 0.007, 0.4)
for i in range(6): fx.whoosh(22.32 + i * 0.06, 0.004, 0.03, 1500, 5000)                            # strike-through
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(24.4 + dt, f, 0.012, 1.8)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound77.wav', SR, (st * 32767).astype(np.int16)); print('ok sound77.wav', round(pk, 3))
