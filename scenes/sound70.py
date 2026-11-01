# 70. Two Choices — creator's reel audio untouched (7.27 s) + soft accents; the last 2 s are our payoff (leap + catch + shimmer).
import numpy as np
from soundlib import *
from voedit import load, place, fade
from scipy.io import wavfile
v = fade(load('/home/claude/batch70/s01.wav'), 0.0, 0.05)
voice = place(v, len(t)); pk = np.max(np.abs(voice))
fx = Fx()
for i in range(int(1.85 / 0.07)): fx.ping(i * 0.07, 1567.98 if i % 2 else 1318.51, 0.0035 * (1 - i / 30), 0.03)      # alarm trill, very soft
for ts, f in ((1.92, 880.0), (2.16, 1046.5)): fx.ping(ts, f, 0.01, 0.25)
fx.ping(3.04, 392.0, 0.01, 0.2)                                                   # snooze boop
for i in range(18): fx.hit(3.15 + i * 0.085, 0.004, 3000, 0.01, 0.6, 0.004, 0.03)    # clock spinning forward
fx.sweep(4.86, 5.12, 1800, 300, 0.005, 'sin'); fx.whoosh(4.98, 0.02, 0.08, 1500, 6000)  # rewind
for f, dt in ((1046.5, 0), (1318.51, 0.05), (1567.98, 0.1)): fx.ping(5.12 + dt, f, 0.011, 0.45)
fx.whoosh(5.3, 0.025, 0.08, 800, 5000)
for i in range(10): fx.hit(5.75 + i * 0.209, 0.012, 90, 0.05, 0.25, 0.01, 0.12)    # footsteps
fx.sweep(7.0, 8.0, 300, 1400, 0.004, 'sin'); fx.whoosh(7.8, 0.03, 0.12, 1000, 6000)
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(8.02 + dt, f, 0.013, 2.2)
fx.noise_env(np.exp(-np.maximum(0, t - 8.02) / 0.5) * (t >= 8.02), 0.006, 5000, 12000)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound70.wav', SR, (st * 32767).astype(np.int16)); print('ok sound70.wav', round(pk, 3))
