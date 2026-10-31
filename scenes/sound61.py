# 61. $1M or a Penny — 120 BPM. Clock ticks while you pick; a coin "tick" on every day (pitch climbing with the value),
# a held breath at day 20, tension build days 21–27, impact when B passes A on day 28, bigger hits on 29 and 30.
import json
import numpy as np
from soundlib import *
EV = json.load(open('ev61.json'))
BPM = EV['bpm']; D = EV['days']; C = EV['c']
PROG = ['Am', 'F', 'C', 'G']
drum, bassfx, lead, fx = Fx(), Fx(), Fx(), Fx()
drums(drum, BPM, 0, C, 'half', 0.7)
drums(drum, BPM, C, D[19] + 0.1, 'drive', 0.9)
drums(drum, BPM, D[20], D[27] - 0.02, 'drive', 1.0, fills=(7.5,))
drums(drum, BPM, D[27], DUR, 'drive', 1.05)
bass_prog(bassfx, BPM, 0, DUR, PROG, 0.18)
arp(lead, BPM, D[29], DUR, PROG, 0.04)
pad = pad_prog(BPM, 0, DUR, PROG, 0.5, 2000)
for k in range(2): fx.hit(0.5 + k, 0.08, 1800, 0.01, 0.5, 0.003, 0.05)
# a coin tick per day, pitch rising
for d, ts in enumerate(D, start=1):
    f = 600 * 2 ** (d / 14)
    fx.hit(ts, 0.05 + 0.002 * d, f, 0.02, 0.25, 0.002, 0.06); fx.ping(ts, f * 2, 0.012, 0.05)
# day 20 pause: drop out, heartbeat
for k in range(2): kick(fx, EV['p20'] + 0.1 + k * 0.5, 0.25)
fx.sweep(EV['p20'], EV['p20'] + 0.9, 300, 200, 0.03, 'sin')
riser(fx, D[20], D[27], 0.06)
# day 28 pass, 29, 30
impact(fx, D[27], 0.45); fx.whoosh(D[27], 0.05, 0.1)
for f, dt in ((440.0, 0), (554.37, 0.03), (659.26, 0.06)): fx.bell(D[27] + dt, f, 0.03, 1.4)
impact(fx, D[28], 0.4)
impact(fx, D[29], 0.6)
for f, dt in ((440.0, 0), (554.37, 0.03), (659.26, 0.06), (880.0, 0.1), (1108.73, 0.13), (1318.51, 0.16)): fx.bell(D[29] + dt, f, 0.035, 2.0)
for k in range(10): fx.ping(D[29] + 0.2 + k * 0.07, 1800 + 300 * (k % 4), 0.015, 0.25)   # coin shower
fx.whoosh(EV['m1'], 0.03, 0.08); fx.whoosh(EV['m2'], 0.03, 0.08)
for f, dt in ((659.26, 0), (880.0, 0.08)): fx.ping(EV['m2'] + dt, f, 0.03, 0.8)
dk = duck()
beat = drum.a + bassfx.a * dk
music = (pad + lead.a) * (0.55 + 0.45 * dk)
finish2(beat, music + fx.a, 'sound61.wav')
