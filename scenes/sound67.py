# 67. Don't Quit Now — 120 BPM. Every pickaxe strike lands on the beat (clink + rock thud) over a driving groove;
# when the top digger quits the drums drop out and only one pick keeps time under a riser; the breakthrough hits
# with an impact, bells and a cheer; a low "dun" on the zoom to the gap; warm close.
import json
import numpy as np
from soundlib import *
EV = json.load(open('ev67.json'))
BPM = EV['bpm']; DIG, B, Q, BRK, Z = EV['dig'], EV['beat'], EV['quit'], EV['brk'], EV['zoom']
PROG = ['Am', 'F', 'C', 'G']
drum, bassfx, lead, fx = Fx(), Fx(), Fx(), Fx()
drums(drum, BPM, 0, Q, 'drive', 0.85)
drums(drum, BPM, BRK, DUR, 'drive', 0.95)
bass_prog(bassfx, BPM, 0, Q, PROG, 0.17)
bass_prog(bassfx, BPM, BRK, DUR, ['F', 'C', 'G', 'Am'], 0.17)
arp(lead, BPM, BRK + 0.5, DUR, ['F', 'C', 'G', 'Am'], 0.035)
pad = pad_prog(BPM, 0, Q, PROG, 0.4, 1600) + pad_prog(BPM, Q, BRK, ['Am', 'Am'], 0.55, 1200) + pad_prog(BPM, BRK, DUR, ['F', 'C', 'G', 'Am'], 0.6, 2600)
def strike(ts, amp):
    fx.hit(ts, 0.05 * amp, 2900, 0.04, 0.4, 0.002, 0.15); fx.hit(ts, 0.06 * amp, 110, 0.05, 0.6, 0.006, 0.12)
n = 1
while DIG + n * B < BRK + 0.01:
    ts = DIG + n * B
    strike(ts, 1.0 if ts <= Q else 0.8)
    if ts <= Q: fx.hit(ts + 0.012, 0.03, 3300, 0.03, 0.3, 0.002, 0.1)    # second pick, a hair later
    n += 1
# quit: pick drops, sigh
fx.hit(Q + 0.2, 0.05, 900, 0.03, 0.4, 0.003, 0.1); fx.hit(Q + 0.32, 0.03, 1100, 0.02, 0.3, 0.003, 0.08)
fx.sweep(Q + 0.1, Q + 0.6, 400, 250, 0.02, 'sin')
riser(fx, Q + 0.6, BRK, 0.06)
impact(fx, BRK, 0.55); fx.whoosh(BRK, 0.06, 0.15, 600, 8000)
for f, dt in ((440.0, 0), (554.37, 0.03), (659.26, 0.06), (880.0, 0.1), (1108.73, 0.13), (1318.51, 0.16)): fx.bell(BRK + dt, f, 0.035, 2.2)
cheer = smooth(BRK, BRK + 0.15, t) * np.exp(-np.maximum(0, t - BRK - 0.3) / 1.0) * (t >= BRK)
fx.noise_env(cheer, 0.035, 700, 3500)
fx.whoosh(Z, 0.05, 0.12, 400, 4000); kick(fx, Z + 0.05, 0.3); fx.ping(Z + 0.05, 110.0, 0.05, 0.8)
fx.whoosh(EV['m1'], 0.03, 0.08); fx.whoosh(EV['m2'], 0.03, 0.08)
for f, dt in ((659.26, 0), (880.0, 0.08)): fx.ping(EV['m2'] + dt, f, 0.03, 0.8)
dk = duck()
beat = drum.a + bassfx.a * dk
music = (pad + lead.a) * (0.55 + 0.45 * dk)
finish2(beat, music + fx.a, 'sound67.wav')
