# 59. Marble Race — 128 BPM. Countdown beeps, the beat drops on GO, every peg/rail/marble collision is a real
# clack from the physics log, the beat cuts out for the slow-motion photo finish (heartbeat + riser), impact + cheer on the win.
import json
import numpy as np
from soundlib import *
EV = json.load(open('ev59.json'))
BPM, GO, BEAT = EV['bpm'], EV['go'], EV['beat']
SW0, SWE, WIN = EV['sw0'], EV['sw0'] + EV['swv'], EV['win']
PROG = ['Am', 'F', 'C', 'G']
drum, bassfx, lead, fx = Fx(), Fx(), Fx(), Fx()
# countdown
for k in range(3): fx.ping(k * BEAT, 880.0, 0.06, 0.12, 0.002); fx.ping(k * BEAT, 1760.0, 0.015, 0.06, 0.002)
fx.ping(GO, 1760.0, 0.07, 0.35, 0.002); fx.ping(GO, 2637.0, 0.02, 0.2, 0.002)
impact(fx, GO, 0.3); fx.whoosh(GO + 0.05, 0.04, 0.1)
drums(drum, BPM, GO, SW0 - 0.02, 'drive', 1.0)
bass_prog(bassfx, BPM, GO, SW0, PROG, 0.18)
arp(lead, BPM, GO + 4 * BEAT, SW0, PROG, 0.03)
pad = pad_prog(BPM, 0, DUR, PROG, 0.45, 1800)
slow = smooth(SW0 - 0.1, SW0 + 0.2, t) * (1 - smooth(WIN - 0.05, WIN + 0.05, t))
pad = pad * (1 - 0.6 * slow)
# slow motion: heartbeat + riser
hb = SW0 + 0.05
while hb < WIN - 0.2:
    kick(fx, hb, 0.32); kick(fx, hb + 0.2, 0.2); hb += 0.62
riser(fx, SW0 + 0.2, WIN, 0.08)
fx.sweep(SW0, SW0 + 0.5, 600, 120, 0.05, 'sin')
# collisions from the physics log
last = {0: -1, 1: -1, 2: -1}
for ts, kind, sp in EV['hits']:
    if ts - last[kind] < 0.018: continue
    last[kind] = ts
    a = min(1.0, sp / 1400)
    sl = 0.7 if SW0 <= ts < SWE else 1.0
    if kind == 0: fx.hit(ts, 0.05 * a, 380 * sl, 0.03, 0.25, 0.002, 0.08)
    elif kind == 1: fx.hit(ts, 0.045 * a, (1700 + (ts * 997 % 900)) * sl, 0.035, 0.15, 0.002, 0.12)
    else: fx.hit(ts, 0.06 * a, (2400 + (ts * 613 % 700)) * sl, 0.02, 0.5, 0.002, 0.07)
# rolling rumble during the race
roll = smooth(GO, GO + 0.3, t) * (1 - smooth(EV['fin'][2] - 0.2, EV['fin'][2] + 0.3, t))
fx.noise_env(roll * (1 - 0.5 * slow), 0.012, 120, 600)
for lc in EV['leadChanges']:
    fx.whoosh(lc, 0.03, 0.06, 1500, 6000); fx.ping(lc, 1318.5, 0.02, 0.12)
# the win
impact(fx, WIN, 0.5)
for f, dt in ((440.0, 0), (554.37, 0.03), (659.26, 0.06), (880.0, 0.1), (1108.73, 0.13), (1318.51, 0.16)): fx.bell(WIN + dt, f, 0.03, 2.0)
cheer = smooth(WIN, WIN + 0.15, t) * np.exp(-np.maximum(0, t - WIN - 0.4) / 1.4) * (t >= WIN)
fx.noise_env(cheer, 0.05, 700, 3500)
for k in range(6): clap(fx, WIN + 0.25 + k * 0.11 + (k % 2) * 0.03, 0.06)
for ts in EV['fin']:
    if abs(ts - WIN) > 0.01: fx.hit(ts, 0.03, 1200, 0.05, 0.2, 0.002, 0.1)
# back to the beat after the win
drums(drum, BPM, WIN, DUR, 'drive', 0.95)
bass_prog(bassfx, BPM, WIN, DUR, PROG, 0.17)
arp(lead, BPM, WIN + 0.5, DUR, PROG, 0.035)
fx.whoosh(EV['m1'], 0.03, 0.08); fx.whoosh(EV['m2'], 0.03, 0.08)
for f, dt in ((659.26, 0), (880.0, 0.08)): fx.ping(EV['m2'] + dt, f, 0.03, 0.8)
dk = duck()
beat = drum.a + bassfx.a * dk
music = (pad + lead.a) * (0.55 + 0.45 * dk)
finish2(beat, music + fx.a, 'sound59.wav')
