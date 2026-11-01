# 78. Turtle Theory — creator's reel audio untouched + a soft underwater bed and accents.
import numpy as np
from soundlib import *
from voedit import load, place, fade
from scipy.io import wavfile
v = fade(load('/home/claude/batch70/s09.wav'), 0.0, 0.05)
voice = place(v, len(t)); pk = np.max(np.abs(voice))
fx = Fx()
fx.noise_env(0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * t), 0.0035, 80, 400)                          # underwater hush
for i in range(40): fx.ping(0.3 + i * 0.83 + 0.2 * np.sin(i), 900 + 300 * ((i * 7) % 5), 0.0018, 0.03)   # bubbles
for ts in (0.2, 0.9, 1.7, 2.7, 3.2, 3.8): fx.whoosh(ts, 0.006, 0.05, 2000, 8000)                 # fish dart past
fx.sweep(4.5, 6.3, 70, 55, 0.004, 'sin')                                                           # shark
for ts in (2.6, 4.45, 6.3, 8.8, 12.2, 15.6, 19.4, 23.8, 28.7, 31.4): fx.whoosh(ts, 0.008, 0.07, 800, 4000)
for i in range(4): fx.ping(8.8 + i / 0.9, 659.25 * 2 ** (i / 12 * 2), 0.007, 0.3)                 # strokes
fx.noise_env(smooth(12.2, 12.5, t) * (1 - smooth(13.8, 14.2, t)), 0.012, 60, 600)                # chaos
fx.bell(14.24, 1046.5, 0.008, 1.6)                                                                 # calm
fx.noise_env(smooth(17.0, 17.4, t) * (1 - smooth(19.2, 19.5, t)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.5 * t)), 0.006, 300, 3000)   # waves on the shore
fx.hit(20.64, 0.01, 1800, 0.03, 0.8, 0.02, 0.15)
for i in range(9): fx.hit(21.0 + i / 6, 0.006, 500, 0.03, 0.4, 0.005, 0.08)                       # bricks of patience
for i in range(7): fx.hit(23.85 + i * 0.18, 0.008, 90, 0.04, 0.3, 0.008, 0.1)                     # sprinter
fx.hit(25.2, 0.014, 60, 0.15, 0.4, 0.012, 0.3)
for i in range(4): fx.ping(27.1 + i * 0.4, 1760.0, 0.003, 0.05)
for i in range(3): fx.ping(29.5 + i * 0.6, 987.77 + 60 * i, 0.005, 0.2)
fx.ping(30.52, 1318.51, 0.008, 0.4)
fx.sweep(31.4, 32.76, 300, 900, 0.003, 'saw'); fx.hit(32.76, 0.02, 200, 0.05, 1.0, 0.03, 0.4)
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(33.4 + dt, f, 0.011, 2.0)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound78.wav', SR, (st * 32767).astype(np.int16)); print('ok sound78.wav', round(pk, 3))
