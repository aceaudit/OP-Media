# 68. 100 Tries — 120 BPM. Three slow, lonely throws (paper thud, rim clank, a sad "bwomp"), then the beat drops
# on "Or… keep going": rapid-fire whooshes, every make is a swish + a rising pentatonic ping, the 100th throw
# lands on the downbeat with an impact, bells and a cheer.
import json
import numpy as np
from soundlib import *
EV = json.load(open('ev68.json'))
BPM = EV['bpm']; FAST, LAST = EV['fast'], EV['last']
PROG = ['Am', 'F', 'C', 'G']
drum, bassfx, lead, fx = Fx(), Fx(), Fx(), Fx()
for k in range(2): kick(drum, k * 2.0, 0.3)
drums(drum, BPM, FAST, LAST - 0.02, 'drive', 0.95, fills=(LAST - 0.5,))
drums(drum, BPM, LAST, DUR, 'drive', 1.0)
bass_prog(bassfx, BPM, FAST, DUR, PROG, 0.18)
arp(lead, BPM, LAST + 0.5, DUR, ['F', 'C', 'G', 'Am'], 0.035)
pad = pad_prog(BPM, 0, FAST, ['Am', 'Am'], 0.4, 1300) + pad_prog(BPM, FAST, DUR, PROG, 0.5, 2200)
PENT = [523.25, 587.33, 659.26, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98, 1760.0, 2093.0]
made = 0
for tr, tl, kind in EV['throws']:
    slow = tr < FAST
    fx.whoosh(tr + 0.05, 0.03 if slow else 0.012, 0.05, 1200, 6000)
    if kind == 'in':
        m = (t >= tl) & (t < tl + 0.18); tt = t[m] - tl
        fx.a[m] += (0.03 if tl < LAST - 0.01 else 0.05) * band(WN[m], 2500, 9000) * np.exp(-tt / 0.05)
        fx.ping(tl + 0.01, PENT[min(made // 2, len(PENT) - 1)], 0.03, 0.25); made += 1
    elif kind in ('rimL', 'rimR'):
        fx.hit(tl, 0.05 if slow else 0.02, 1350, 0.06, 0.3, 0.002, 0.2); fx.ping(tl, 2700, 0.012 if slow else 0.005, 0.15)
        fx.hit(tl + 0.3, 0.03 if slow else 0.01, 160, 0.03, 0.5, 0.004, 0.08)
    else:
        fx.hit(tl, 0.05 if slow else 0.015, 170, 0.03, 0.6, 0.004, 0.08)
# the lonely bit
fx.sweep(2.8, 3.4, 330, 150, 0.035, 'sin')
riser(fx, 3.2, FAST, 0.06)
impact(fx, FAST, 0.3); fx.whoosh(FAST, 0.04, 0.1)
# the 100th
impact(fx, LAST, 0.55)
for f, dt in ((440.0, 0), (554.37, 0.03), (659.26, 0.06), (880.0, 0.1), (1108.73, 0.13), (1318.51, 0.16)): fx.bell(LAST + dt, f, 0.035, 2.2)
cheer = smooth(LAST, LAST + 0.15, t) * np.exp(-np.maximum(0, t - LAST - 0.3) / 1.1) * (t >= LAST)
fx.noise_env(cheer, 0.035, 700, 3500)
for k in range(6): clap(fx, LAST + 0.25 + k * 0.11 + (k % 2) * 0.03, 0.05)
fx.whoosh(EV['m2'], 0.03, 0.08)
for f, dt in ((659.26, 0), (880.0, 0.08)): fx.ping(EV['m2'] + dt, f, 0.03, 0.8)
dk = duck()
beat = drum.a + bassfx.a * dk
music = (pad + lead.a) * (0.55 + 0.45 * dk)
finish2(beat, music + fx.a, 'sound68.wav')
