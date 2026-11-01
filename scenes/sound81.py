# 81. Restart — creator's reel audio untouched (12.9 s) + soft game sounds; the run after CONTINUE is our 1.5 s payoff.
import numpy as np
from soundlib import *
from voedit import load, place, fade
from scipy.io import wavfile
v = fade(load('/home/claude/batch70/s12.wav'), 0.0, 0.06)
voice = place(v, len(t)); pk = np.max(np.abs(voice))
fx = Fx()
fx.hit(0.12, 0.008, 2000, 0.01, 0.8, 0.004, 0.03)                                             # click
for f, dt in ((523.25, 0), (659.25, 0.06), (783.99, 0.12), (1046.5, 0.18)): fx.ping(0.2 + dt, f, 0.008, 0.18)   # restart chime
fx.sweep(0.3, 0.6, 1600, 400, 0.004, 'saw')                                                     # rewind glitch
fx.sweep(1.3, 1.9, 300, 1200, 0.004, 'sin'); fx.ping(1.9, 1318.51, 0.007, 0.3)                 # energy refills
for ts in (2.5, 2.7): fx.ping(ts, 1760.0, 0.005, 0.06)
fx.ping(2.9, 1567.98, 0.008, 0.3)                                                               # focus locked
for t0, ok in ((3.65, 0), (4.05, 0), (4.4, 0), (4.7, 0), (5.0, 1)):
    fx.whoosh(t0 + 0.3, 0.006, 0.05, 1500, 6000)
    if ok: [fx.ping(t0 + 0.55 + dt, f, 0.009, 0.3) for f, dt in ((783.99, 0), (987.77, 0.06), (1174.66, 0.12))]
    else: fx.ping(t0 + 0.55, 196.0, 0.007, 0.12)
fx.noise_env(smooth(5.9, 6.2, t) * (1 - smooth(8.7, 9.0, t)), 0.0015, 200, 1200)
fx.sweep(7.0, 7.7, 400, 1400, 0.004, 'sin'); fx.ping(7.6, 1318.51, 0.008, 0.4)
fx.ping(9.3, 330.0, 0.006, 0.15); fx.ping(9.45, 659.25, 0.006, 0.15)
fx.whoosh(11.75, 0.008, 0.08, 2000, 7000)
fx.hit(12.0, 0.016, 1500, 0.03, 1.0, 0.03, 0.25)                                                # GIVE UP shatters
for f, dt in ((880.0, 0), (1108.73, 0.05), (1318.51, 0.1), (1760.0, 0.16)): fx.bell(12.24 + dt, f, 0.012, 1.6)
for i in range(9): fx.hit(12.4 + i * 0.2, 0.008, 90, 0.04, 0.3, 0.008, 0.1)
mix = voice + fx.a * pk * 2.2
mix *= 1 - smooth(DUR - 0.05, DUR, t)
st = np.stack([mix, mix], axis=1); st /= np.max(np.abs(st)) / 0.89
wavfile.write('sound81.wav', SR, (st * 32767).astype(np.int16)); print('ok sound81.wav', round(pk, 3))
