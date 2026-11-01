# 73. Proud of You — creator's reel audio untouched (voice + its own music) + very soft accents.
import numpy as np
from soundlib import *
from voedit import load, place, fade
from scipy.io import wavfile
v = fade(load('/home/claude/batch70/s04.wav'), 0.0, 0.05)
voice = place(v, len(t)); pk = np.max(np.abs(voice))
fx = Fx()
for ts in (3.6, 6.5, 10.2, 14.9, 17.8, 20.6, 23.7, 25.2, 31.6, 34.5, 40.8, 45.9, 49.8, 54.5): fx.whoosh(ts, 0.008, 0.07, 1200, 5000)
for f, dt in ((1318.51, 0), (1760.0, 0.08)): fx.ping(2.0 + dt, f, 0.008, 0.35)                       # reminder
for ts in (4.5, 5.6): fx.noise_env(np.exp(-np.maximum(0, t - ts) / 0.7) * (t >= ts), 0.012, 40, 250)  # distant thunder
fx.noise_env(smooth(3.6, 3.9, t) * (1 - smooth(6.3, 6.6, t)), 0.0025, 2000, 8000)                   # rain
fx.hit(11.55, 0.014, 60, 0.2, 0.3, 0.01, 0.4)                                                       # the weight lands
for i in range(30): fx.hit(14.95 + i * 0.095, 0.0025, 4000, 0.008, 0.8, 0.003, 0.02)                # pages tearing
for i in range(6): fx.hit(17.9 + i * 0.5, 0.003, 2600, 0.01, 0.5, 0.004, 0.03)                      # clock at night
for ts in (20.8, 21.28, 21.52, 21.84, 22.24, 22.56): fx.hit(ts + 0.2, 0.01, 70, 0.08, 0.4, 0.01, 0.2)
fx.hit(22.9, 0.014, 55, 0.2, 0.4, 0.01, 0.4)
fx.ping(24.56, 1046.5, 0.009, 0.5); fx.ping(24.62, 1567.98, 0.006, 0.5)                              # you are here
fx.noise_env(smooth(25.2, 25.5, t) * (1 - smooth(31.3, 31.6, t)), 0.002, 2000, 8000)
for i in range(5): fx.ping(33.4 + i * 0.12, [659.25, 783.99, 880.0, 1046.5, 1318.51][i], 0.006, 0.4)
fx.hit(36.6, 0.014, 60, 0.15, 0.4, 0.01, 0.3)                                                       # sack set down
fx.ping(44.45, 880.0, 0.008, 0.5); fx.ping(44.5, 1318.51, 0.007, 0.6)                               # message arrives
for f, dt in ((659.25, 0), (830.61, 0.06), (987.77, 0.12)): fx.bell(53.52 + dt, f, 0.008, 2.0)
for f, dt in ((523.25, 0), (659.25, 0.08), (783.99, 0.16), (1046.5, 0.24)): fx.bell(55.36 + dt, f, 0.008, 2.4)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound73.wav', SR, (st * 32767).astype(np.int16)); print('ok sound73.wav', round(pk, 3))
