# 65. Find the Odd One Out — 120 BPM. Tense half-time groove with a ticking clock under each search,
# a bright "found it" chime + hit on each reveal, a lift for the harder round, warm open bed for the message.
import json
import numpy as np
from soundlib import *
EV = json.load(open('ev65.json'))
BPM = EV['bpm']; R1, R2 = EV['r1'], EV['r2']
PROG = ['Am', 'F', 'C', 'G']
drum, bassfx, lead, fx = Fx(), Fx(), Fx(), Fx()
drums(drum, BPM, 0, R1['tr'] - 0.02, 'half', 0.8)
drums(drum, BPM, R1['tr'], R2['t0'] - 0.02, 'drive', 0.8)
drums(drum, BPM, R2['t0'], R2['tr'] - 0.02, 'half', 0.9, fills=(R2['tr'] - 0.5,))
drums(drum, BPM, R2['tr'], DUR, 'drive', 0.9)
bass_prog(bassfx, BPM, 0, DUR, PROG, 0.17)
arp(lead, BPM, R2['tr'], DUR, ['F', 'C', 'G', 'Am'], 0.035)
pad = pad_prog(BPM, 0, R2['tr'], PROG, 0.45, 1600) + pad_prog(BPM, R2['tr'], DUR, ['F', 'C', 'G', 'Am'], 0.6, 2600)
for R in (R1, R2):
    s = R['ts']
    while s < R['tr'] - 0.05:
        fx.hit(s, 0.07, 2000, 0.008, 0.6, 0.002, 0.04); fx.hit(s + 0.5, 0.04, 1500, 0.008, 0.6, 0.002, 0.04); s += 1.0
    riser(fx, R['tr'] - 1.2, R['tr'], 0.05)
    impact(fx, R['tr'], 0.35)
    for f, dt in ((659.26, 0), (880.0, 0.05), (1318.51, 0.1)): fx.bell(R['tr'] + dt, f, 0.03, 1.6)
fx.whoosh(R2['t0'], 0.05, 0.1); fx.hit(R2['t0'], 0.06, 600, 0.03, 0.3, 0.003, 0.08)
fx.whoosh(EV['m2'], 0.03, 0.08)
for f, dt in ((659.26, 0), (880.0, 0.08)): fx.ping(EV['m2'] + dt, f, 0.03, 0.8)
dk = duck()
beat = drum.a + bassfx.a * dk
music = (pad + lead.a) * (0.55 + 0.45 * dk)
finish2(beat, music + fx.a, 'sound65.wav')
