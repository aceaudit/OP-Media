# 69. Unreasonable Volume — the creator's original reel audio (voice + its own quiet music bed) kept exactly as is,
# with a few very soft Own Pace accents on top: scene-change whooshes, a ding on the interview and the YES,
# a small lift on "take off", and a gentle shimmer on "dream of" that also carries the last half-second.
import json
import numpy as np
from soundlib import *
from scipy.io import wavfile
sr, v = wavfile.read('voice69.wav'); v = v.astype(float) / 32768
voice = np.zeros_like(t); voice[:min(len(v), len(t))] = v[:len(t)]
pk = np.max(np.abs(voice))
fx = Fx()
for ts in (8.2, 9.2, 14.95, 19.7, 27.7, 36.4): fx.whoosh(ts, 0.02, 0.07, 1200, 6000)
for f, dt in ((880.0, 0), (1318.51, 0.06)): fx.ping(18.75 + dt, f, 0.012, 0.5)
for f, dt in ((1046.5, 0), (1318.51, 0.05), (1567.98, 0.1)): fx.ping(25.5 + dt, f, 0.012, 0.6)
fx.sweep(35.2, 35.75, 400, 1600, 0.006, 'sin'); fx.ping(35.75, 1760.0, 0.01, 0.6)
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(46.25 + dt, f, 0.012, 2.0)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound69.wav', SR, (st * 32767).astype(np.int16)); print('ok sound69.wav', round(pk, 3))
