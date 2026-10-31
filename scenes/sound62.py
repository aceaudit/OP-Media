# 62. Signs You're an Overthinker — 128 BPM lofi. Each sign lands with a pop + rising note; a "mind chatter" texture
# (busy little murmur blips) gets denser with every sign, the beat gets tighter; the bubble POPS and it all drops
# into a calm, open half-time bed.
import json
import numpy as np
from soundlib import *
EV = json.load(open('ev62.json'))
BPM = EV['bpm']; IT = EV['items']; POP = EV['pop']
PROG = ['Am', 'F', 'C', 'G']
drum, bassfx, lead, fx = Fx(), Fx(), Fx(), Fx()
drums(drum, BPM, 0, IT[3], 'lofi', 0.85)
drums(drum, BPM, IT[3], POP - 0.02, 'drive', 0.9)
drums(drum, BPM, POP + 0.47, DUR, 'half', 0.8)
bass_prog(bassfx, BPM, 0, POP, PROG, 0.17)
bass_prog(bassfx, BPM, POP, DUR, ['F', 'C', 'G', 'Am'], 0.14)
arp(lead, BPM, POP + 0.47, DUR, ['F', 'C', 'G', 'Am'], 0.03, step=1.0)
pad = pad_prog(BPM, 0, POP, PROG, 0.45, 1600) + pad_prog(BPM, POP, DUR, ['F', 'C', 'G', 'Am'], 0.6, 2600)
NOTES = [523.25, 587.33, 659.26, 783.99, 880.0, 1046.5]
for k, ts in enumerate(IT):
    fx.hit(ts, 0.06, 700, 0.03, 0.3, 0.003, 0.08); fx.whoosh(ts, 0.025, 0.05, 1800, 6000)
    fx.ping(ts + 0.02, NOTES[k], 0.04, 0.35); fx.ping(ts + 0.02, NOTES[k] * 2, 0.012, 0.2)
# mind chatter: short band-limited murmurs, density and level grow with each sign
r2 = np.random.default_rng(62)
for k in range(6):
    t0 = IT[k]; t1 = IT[k + 1] if k < 5 else POP
    n = 4 + 5 * k
    for _ in range(n):
        s = r2.uniform(t0 + 0.1, t1); d = r2.uniform(0.06, 0.16); f = r2.uniform(300, 900)
        m = (t >= s) & (t < s + d); tt = t[m] - s
        env = np.sin(np.pi * tt / d) ** 2
        fx.a[m] += (0.006 + 0.0025 * k) * env * (np.sin(2 * np.pi * f * tt) * (1 + 0.6 * np.sin(2 * np.pi * r2.uniform(20, 40) * tt))) 
fx.noise_env(smooth(IT[2], POP, t) * (t < POP), 0.015, 400, 1400)
riser(fx, IT[5], POP, 0.06)
# the pop
fx.hit(POP, 0.12, 1400, 0.01, 0.9, 0.004, 0.06, fdrop=4000); fx.whoosh(POP, 0.05, 0.15, 900, 8000)
impact(fx, POP, 0.3)
for f, dt in ((349.23, 0), (440.0, 0.05), (523.25, 0.1), (659.26, 0.16), (880.0, 0.22)): fx.bell(POP + 0.05 + dt, f, 0.03, 2.4)
fx.whoosh(EV['m2'], 0.025, 0.08)
for f, dt in ((523.25, 0), (659.26, 0.08)): fx.ping(EV['m2'] + dt, f, 0.03, 0.9)
dk = duck()
beat = drum.a + bassfx.a * dk
music = (pad + lead.a) * (0.55 + 0.45 * dk)
finish2(beat, music + fx.a, 'sound62.wav')
