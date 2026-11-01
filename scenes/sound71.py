# 71. The Hard Years — creator's reel audio untouched + soft accents (age plucks, thunder, fall, bulb, the eight years lighting up).
import numpy as np
from soundlib import *
from voedit import load, place, fade
from scipy.io import wavfile
v = fade(load('/home/claude/batch70/s02.wav'), 0.0, 0.05)
voice = place(v, len(t)); pk = np.max(np.abs(voice))
fx = Fx()
NOTES = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51]
for ts, f in zip([0.56, 1.04, 1.6, 2.0, 2.48, 2.8, 3.28, 3.92], NOTES): pluck(fx, ts, f, 0.012, 0.2)
fx.noise_env(np.exp(-np.maximum(0, t - 4.8) / 0.6) * (t >= 4.8), 0.02, 40, 300)          # thunder rumble
fx.hit(4.8, 0.02, 60, 0.25, 0.5, 0.02, 0.6)
for ts in (5.3, 14.35): fx.whoosh(ts, 0.02, 0.07, 1200, 6000)
for ts in (6.88, 7.05, 7.22, 7.35): fx.hit(ts, 0.006, 300, 0.04, 0.4, 0.006, 0.08)
fx.hit(7.95, 0.02, 70, 0.12, 0.5, 0.015, 0.3)                                              # body hits the ground
fx.hit(8.32, 0.016, 110, 0.08, 0.6, 0.01, 0.2)                                              # FAILED stamp
fx.bell(9.3, 1318.51, 0.009, 1.0)                                                           # lightbulb
fx.noise_env(smooth(10.3, 10.7, t) * (1 - smooth(13.1, 13.4, t)), 0.004, 2000, 8000)        # rain
fx.sweep(12.7, 13.28, 300, 1200, 0.004, 'sin'); fx.hit(13.28, 0.02, 55, 0.3, 0.4, 0.02, 0.6)
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1)): fx.ping(13.3 + dt, f, 0.01, 0.6)
for i, f in enumerate(NOTES): fx.ping(15.12 + i * 0.11, f, 0.007, 0.35)
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(16.16 + dt, f, 0.011, 2.0)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound71.wav', SR, (st * 32767).astype(np.int16)); print('ok sound71.wav', round(pk, 3))
