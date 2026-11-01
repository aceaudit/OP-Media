# 79. Painful Story — creator's reel audio untouched (11.4 s) + soft accents + the run to the top as a 1.6 s payoff.
import numpy as np
from soundlib import *
from voedit import load, place, fade
from scipy.io import wavfile
v = fade(load('/home/claude/batch70/s10.wav'), 0.0, 0.08)
voice = place(v, len(t)); pk = np.max(np.abs(voice))
fx = Fx()
fx.noise_env(np.exp(-t / 0.6), 0.004, 4000, 10000)                                          # confetti sparkle at frame 0
fx.sweep(2.05, 2.6, 1600, 300, 0.005, 'sin'); fx.whoosh(2.3, 0.02, 0.1, 600, 4000)          # pull back to reveal the valley
for i in range(3): fx.hit(2.75 + i * 0.12, 0.006, 200, 0.05, 0.3, 0.005, 0.1)
for i in range(6): fx.hit(3.95 + i * 0.22, 0.004, 100, 0.03, 0.2, 0.005, 0.06)
fx.noise_env(smooth(5.2, 5.5, t) * (1 - smooth(8.3, 8.9, t)), 0.0025, 2000, 8000)            # rain in the valley
fx.sweep(5.6, 6.65, 400, 1200, 0.003, 'sin'); fx.ping(6.64, 1318.51, 0.008, 0.6)            # the line climbs to THE END
fx.bell(8.32, 659.25, 0.008, 1.6)                                                            # accept
fx.sweep(9.3, 10.24, 200, 800, 0.003, 'saw')
for i in range(6): fx.hit(10.3 + i * 0.16, 0.009, 90, 0.04, 0.3, 0.008, 0.1)                 # the run
fx.hit(11.25, 0.02, 60, 0.25, 0.5, 0.02, 0.5)
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(11.25 + dt, f, 0.013, 1.6)
fx.noise_env(np.exp(-np.maximum(0, t - 11.25) / 0.7) * (t >= 11.25), 0.004, 5000, 12000)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound79.wav', SR, (st * 32767).astype(np.int16)); print('ok sound79.wav', round(pk, 3))
