# 63. Your Brain at 3 PM vs 3 AM — 128 BPM. A lazy lofi loop with a ticking clock; every 3 AM thought is a
# "bloop" and the mix gets busier and more tense as they pile up; tape-stop at the switch, pen scribbles as each
# thought goes onto paper, then a calm, sleepy bed with the beat soft and far away.
import json
import numpy as np
from soundlib import *
EV = json.load(open('ev63.json'))
BPM = EV['bpm']; X = EV['x']; SL = EV['sleep']
PROG = ['Am', 'F', 'C', 'G']
drum, bassfx, lead, fx = Fx(), Fx(), Fx(), Fx()
drums(drum, BPM, 0, X - 0.05, 'lofi', 0.85)
drums(drum, BPM, SL, DUR, 'half', 0.55)
bass_prog(bassfx, BPM, 0, X, PROG, 0.16)
bass_prog(bassfx, BPM, SL, DUR, ['F', 'C', 'G', 'Am'], 0.1)
pad = pad_prog(BPM, 0, X, PROG, 0.4, 1500) + pad_prog(BPM, X, DUR, ['F', 'C', 'G', 'Am'], 0.55, 2400)
arp(lead, BPM, SL, DUR, ['F', 'C', 'G', 'Am'], 0.028, step=1.0)
# ticking clock
s = 0.0
while s < X: fx.hit(s, 0.035, 2600, 0.006, 0.5, 0.002, 0.03); s += 60 / BPM
r2 = np.random.default_rng(63)
for k, ts in enumerate(EV['th']):
    f = r2.choice([392.0, 440.0, 523.25, 587.33, 659.26, 783.99])
    fx.sweep(ts, ts + 0.09, f * 0.7, f * 1.3, 0.05, 'sin'); fx.ping(ts + 0.05, f * 2, 0.02, 0.12)
fx.noise_env(smooth(EV['th'][4], X, t) * (t < X), 0.02, 500, 2500)
riser(fx, EV['th'][8], X, 0.06)
# tape stop at the switch
m = (t >= X - 0.35) & (t < X); tt = t[m] - (X - 0.35)
fx.a[m] += 0.06 * np.sin(2 * np.pi * np.cumsum(220 * (1 - tt / 0.35) ** 2) / SR) * (1 - tt / 0.35)
fx.whoosh(X + 0.1, 0.05, 0.15, 600, 5000)
# notepad + pen scribbles for each thought landing
fx.hit(EV['pad'], 0.05, 500, 0.04, 0.4, 0.004, 0.1)
for ts in EV['tin']:
    ts = ts + 0.3
    m = (t >= ts) & (t < ts + 0.11); tt = t[m] - ts
    fx.a[m] += 0.03 * band(r2.standard_normal(m.sum()), 2500, 7000) * (0.5 + 0.5 * np.sin(2 * np.pi * 28 * tt)) * np.sin(np.pi * tt / 0.11)
for f, dt in ((349.23, 0), (440.0, 0.06), (523.25, 0.12), (698.46, 0.2)): fx.bell(SL + dt, f, 0.03, 2.6)
fx.whoosh(EV['m2'], 0.025, 0.08)
for f, dt in ((523.25, 0), (659.26, 0.08)): fx.ping(EV['m2'] + dt, f, 0.03, 0.9)
dk = duck()
beat = drum.a + bassfx.a * dk
music = (pad + lead.a) * (0.55 + 0.45 * dk)
finish2(beat, music + fx.a, 'sound63.wav')
