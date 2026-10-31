# 58. Count the Squares — 128 BPM. Half-time tension under the countdown (clock ticks), then the beat kicks in
# as the counting starts; every highlighted square is a rising pluck, a riser into the reveal, impact on "30".
import json
import numpy as np
from soundlib import *
EV = json.load(open('ev58.json'))
BPM, BAR = EV['bpm'], EV['bar']
PROG = ['Am', 'F', 'C', 'G']
drum, bassfx, lead, fx = Fx(), Fx(), Fx(), Fx()
drums(drum, BPM, 0, EV['t1'], 'half', 0.8)
drums(drum, BPM, EV['t1'], EV['t4'] - BAR / 8, 'drive', 0.9)
drums(drum, BPM, EV['t4'], DUR, 'drive', 1.0)
bass_prog(bassfx, BPM, 0, DUR, PROG, 0.18)
arp(lead, BPM, EV['t4'], DUR, PROG, 0.04)
pad = pad_prog(BPM, 0, DUR, PROG, 0.5)
# countdown ticks
for k in range(4): fx.hit(0.5 + k, 0.09, 1800, 0.01, 0.5, 0.003, 0.05)
fx.hit(EV['t1'] - 0.02, 0.05, 900, 0.03, 0.4, 0.004, 0.1)
PENT = [440.0, 523.25, 587.33, 659.26, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98]
for k, ts in enumerate(EV['one']): pluck(fx, ts, PENT[min(k // 2, 9)], 0.05, 0.12)
for k, ts in enumerate(EV['two']): pluck(fx, ts, PENT[min(2 + k, 9)] * 0.5, 0.07, 0.2); fx.whoosh(ts, 0.015, 0.04, 2000, 7000)
for k, ts in enumerate(EV['three']): pluck(fx, ts, [220.0, 261.63, 293.66, 329.63][k], 0.09, 0.3); kick(fx, ts, 0.25)
riser(fx, EV['three'][-1], EV['t4'], 0.07)
impact(fx, EV['t4'], 0.45)
for f, dt in ((440.0, 0), (554.37, 0.03), (659.26, 0.06), (880.0, 0.1), (1318.51, 0.14)): fx.bell(EV['t4'] + dt, f, 0.03, 1.8)
fx.whoosh(EV['m1'], 0.03, 0.08); fx.whoosh(EV['m2'], 0.03, 0.08)
for f, dt in ((659.26, 0), (880.0, 0.08)): fx.ping(EV['m2'] + dt, f, 0.03, 0.8)
dk = duck()
beat = drum.a + bassfx.a * dk
music = (pad * 0.9 + lead.a) * (0.55 + 0.45 * dk)
finish2(beat, music + fx.a, 'sound58.wav')
