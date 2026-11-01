# 74. Lazy vs Winners — creator's reel audio untouched (8.85 s) + soft accents + 2 s scoreboard payoff.
import numpy as np, json
from soundlib import *
from voedit import load, place, fade
from scipy.io import wavfile
v = fade(load('/home/claude/batch70/s05.wav'), 0.0, 0.06)
voice = place(v, len(t)); pk = np.max(np.abs(voice))
fx = Fx()
T_SWAP, T_END = 4.48, 8.95
rep = []; tt = 0.15
while tt < T_END:
    rep.append(tt); rate = 1.6 if tt < T_SWAP else min(3.2, 1.6 + (tt - T_SWAP) * 0.9); tt += 1 / rate
for r in rep: fx.hit(r + 0.3, 0.004 if r < T_SWAP else 0.007, 140, 0.03, 0.4, 0.006, 0.06)
for r in (0.5, 1.6): fx.ping(r + 0.5, 330.0, 0.006, 0.15)
fx.hit(2.45, 0.012, 70, 0.1, 0.4, 0.01, 0.25)                    # lazy flops
fx.bell(2.9, 1318.51, 0.006, 0.9)                                 # dream of the trophy
fx.whoosh(T_SWAP, 0.02, 0.07, 1200, 6000)
fx.hit(5.92, 0.016, 60, 0.18, 0.4, 0.015, 0.35)
fx.ping(7.04, 659.25, 0.007, 0.3); fx.ping(7.12, 587.33, 0.006, 0.3)
fx.hit(T_END + 0.05, 0.012, 90, 0.08, 0.5, 0.01, 0.2); fx.hit(T_END + 0.3, 0.018, 60, 0.2, 0.5, 0.015, 0.4)
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(T_END + 0.3 + dt, f, 0.012, 1.8)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound74.wav', SR, (st * 32767).astype(np.int16)); print('ok sound74.wav', round(pk, 3))
