# 66. Spot the Change — 120 BPM soft lofi with a ticking wall clock and keyboard clatter (the distractions),
# a slowly rising tone you barely notice (like the wall), a hit + flicker swishes on the reveal, warm close.
import json
import numpy as np
from soundlib import *
EV = json.load(open('ev66.json'))
BPM = EV['bpm']; R = EV['r']; FLE = EV['fle']
PROG = ['Am', 'F', 'C', 'G']
drum, bassfx, lead, fx = Fx(), Fx(), Fx(), Fx()
drums(drum, BPM, 0, R - 0.02, 'lofi', 0.75)
drums(drum, BPM, FLE, DUR, 'drive', 0.85)
bass_prog(bassfx, BPM, 0, R, PROG, 0.15)
bass_prog(bassfx, BPM, FLE, DUR, ['F', 'C', 'G', 'Am'], 0.16)
arp(lead, BPM, FLE, DUR, ['F', 'C', 'G', 'Am'], 0.035)
pad = pad_prog(BPM, 0, R, PROG, 0.4, 1500) + pad_prog(BPM, R, DUR, ['F', 'C', 'G', 'Am'], 0.6, 2600)
# wall clock ticks (each second) + keyboard clatter
for s in range(0, int(R) + 1): fx.hit(s + 0.001, 0.045, 2600, 0.006, 0.5, 0.002, 0.03)
r2 = np.random.default_rng(66)
s = 0.1
while s < R - 0.1:
    fx.hit(s, r2.uniform(0.008, 0.016), r2.uniform(1800, 3200), 0.004, 0.8, 0.0015, 0.02); s += r2.uniform(0.07, 0.16)
# barely-there rising tone (the slow change)
m = t < R; tt = t[m]; f = 220 * 2 ** (tt / R * 0.5)
fx.a[m] += 0.008 * np.sin(2 * np.pi * np.cumsum(f) / SR) * smooth(0.3, 2, tt)
# reveal
impact(fx, R, 0.4); fx.sweep(R - 0.25, R, 200, 900, 0.03, 'sin')
k = 0
while R + k * 0.25 < FLE: fx.whoosh(R + k * 0.25, 0.03, 0.03, 1500, 7000); fx.hit(R + k * 0.25, 0.03, 900 if k % 2 else 600, 0.02, 0.3, 0.002, 0.05); k += 1
for f, dt in ((440.0, 0), (554.37, 0.04), (659.26, 0.08)): fx.bell(FLE + dt, f, 0.03, 1.8)
fx.whoosh(EV['m1'], 0.03, 0.08); fx.whoosh(EV['m2'], 0.03, 0.08)
for f, dt in ((659.26, 0), (880.0, 0.08)): fx.ping(EV['m2'] + dt, f, 0.03, 0.8)
dk = duck()
beat = drum.a + bassfx.a * dk
music = (pad + lead.a) * (0.55 + 0.45 * dk)
finish2(beat, music + fx.a, 'sound66.wav')
