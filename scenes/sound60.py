# 60. Read This in 3 Seconds — 128 BPM lofi groove; clock ticks under each timer, a quick letter-shuffle ripple
# as the words unscramble, a chime + soft hit when they lock in; the recap opens up into a warm half-time bed.
import json
import numpy as np
from soundlib import *
EV = json.load(open('ev60.json'))
BPM, BAR = EV['bpm'], EV['bar']
PROG = ['Am', 'F', 'C', 'G']
drum, bassfx, lead, fx = Fx(), Fx(), Fx(), Fx()
RC = EV['recap']
drums(drum, BPM, 0, RC, 'lofi', 0.9)
drums(drum, BPM, RC, DUR, 'half', 0.9)
bass_prog(bassfx, BPM, 0, DUR, PROG, 0.17)
arp(lead, BPM, RC, DUR, PROG, 0.035)
pad = pad_prog(BPM, 0, DUR, PROG, 0.5, 2000)
NOTES = [523.25, 587.33, 659.26, 783.99, 880.0, 1046.5, 1174.66, 1318.51]
for k, R in enumerate(EV['rounds']):
    if R['t0'] > 0: fx.whoosh(R['t0'], 0.04, 0.07); fx.hit(R['t0'], 0.05, 900, 0.03, 0.3, 0.003, 0.08)
    s = R['ts']
    while s < R['tu'] - 0.05:
        fx.hit(s, 0.07, 2000, 0.008, 0.6, 0.002, 0.04); fx.hit(s + 0.5, 0.04, 1500, 0.008, 0.6, 0.002, 0.04); s += 1.0
    for j in range(8): pluck(fx, R['tu'] + j * 0.042, NOTES[j] * (1 + 0.5 * (k == 2)) * (0.5 if k == 0 else 1), 0.035, 0.08)
    fx.whoosh(R['tu'] + 0.15, 0.03, 0.12, 1500, 7000)
    T = R['tu'] + 0.4
    kick(fx, T, 0.3)
    for f, dt in ((880.0, 0), (1108.73, 0.04), (1318.51, 0.08)): fx.bell(T + dt, f * (2 ** (k / 12 * 2)), 0.028, 1.4)
impact(fx, RC, 0.35)
for f, dt in ((440.0, 0.0), (554.37, 0.04), (659.26, 0.08), (880.0, 0.12)): fx.bell(RC + 0.15 + dt, f, 0.03, 2.2)
fx.whoosh(EV['m2'], 0.03, 0.08)
for f, dt in ((659.26, 0), (880.0, 0.08)): fx.ping(EV['m2'] + dt, f, 0.03, 0.8)
dk = duck()
beat = drum.a + bassfx.a * dk
music = (pad + lead.a) * (0.55 + 0.45 * dk)
finish2(beat, music + fx.a, 'sound60.wav')
