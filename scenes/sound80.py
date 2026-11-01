# 80. Me vs Me — creator's reel audio untouched + soft race/game accents.
import numpy as np
from soundlib import *
from voedit import load, place, fade
from scipy.io import wavfile
v = fade(load('/home/claude/batch70/s11.wav'), 0.0, 0.08)
voice = place(v, len(t)); pk = np.max(np.abs(voice))
fx = Fx()
for i in range(18): fx.hit(0.05 + i * 0.21, 0.004 * (1 - 0.5 * (i > 12)), 100, 0.03, 0.3, 0.006, 0.06)   # footsteps
fx.sweep(2.64, 3.4, 900, 200, 0.004, 'sin')                                                               # the others vanish
fx.ping(3.0, 1046.5, 0.007, 0.3)
fx.noise_env(smooth(4.6, 5.0, t) * (1 - smooth(7.7, 7.9, t)), 0.002, 1500, 6000)                          # ghost shimmer
fx.ping(7.04, 880.0, 0.008, 0.3); fx.ping(7.1, 1318.51, 0.006, 0.3)
fx.ping(9.6, 659.25, 0.008, 0.4)
for ts, f in ((10.56, 784.0), (11.68, 987.77), (12.88, 1174.66)): fx.ping(ts + 0.45, f, 0.009, 0.35)
fx.hit(14.88, 0.014, 70, 0.15, 0.4, 0.01, 0.3)
for ts in (3.95, 7.9, 10.1, 13.8, 15.5): fx.whoosh(ts, 0.01, 0.07, 1200, 5000)
fx.hit(16.32, 0.03, 55, 0.3, 1.0, 0.03, 0.6); fx.noise_env(np.exp(-np.maximum(0, t - 16.32) / 0.25) * (t >= 16.32), 0.01, 300, 5000)   # VS slam
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(17.6 + dt, f, 0.012, 1.6)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound80.wav', SR, (st * 32767).astype(np.int16)); print('ok sound80.wav', round(pk, 3))
