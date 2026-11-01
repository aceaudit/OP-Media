# 72. Only Focus — creator's reel audio (voice + its own soft music) untouched + soft accents.
import numpy as np
from soundlib import *
from voedit import load, place, fade
from scipy.io import wavfile
v = fade(load('/home/claude/batch70/s03.wav'), 0.0, 0.08)
voice = place(v, len(t)); pk = np.max(np.abs(voice))
fx = Fx()
for i in range(9): fx.ping(0.05 + i * 0.075, [1318.5, 1760.0, 1174.7][i % 3], 0.003, 0.05)      # notification chatter
fx.hit(0.72, 0.016, 80, 0.2, 0.3, 0.01, 0.4); fx.whoosh(0.72, 0.02, 0.05, 2000, 8000)           # spotlight snaps shut
for a, b, num in ((1.3, 2.85, 1), (3.04, 3.75, 2), (3.85, 4.56, 3), (5.2, 5.8, 4), (5.9, 6.5, 5), (6.6, 7.1, 6), (7.15, 7.7, 7)):
    fx.noise_env(smooth(a, a + 0.05, t) * (1 - smooth(b - 0.05, b, t)), 0.0025, 3000, 9000)     # pencil scratch
    fx.ping(b, 659.25 * 2 ** (num / 12), 0.006, 0.18)
for f, dt in ((1046.5, 0), (1318.51, 0.06)): fx.ping(7.76 + dt, f, 0.01, 0.3)                       # level up
fx.sweep(8.3, 9.66, 200, 700, 0.003, 'saw')                                                         # crowding back in
fx.hit(9.68, 0.02, 120, 0.06, 1.0, 0.03, 0.4); fx.noise_env(np.exp(-np.maximum(0, t - 9.68) / 0.25) * (t >= 9.68), 0.01, 3000, 12000)   # shatter
for i in range(20): fx.hit(10.6 + i * 0.043, 0.003, 2500, 0.01, 0.6, 0.004, 0.02)                   # time-lapse ticks
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(12.35 + dt, f, 0.011, 1.6)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.08, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound72.wav', SR, (st * 32767).astype(np.int16)); print('ok sound72.wav', round(pk, 3))
