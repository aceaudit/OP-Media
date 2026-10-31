# 64. Things That Are NOT a Waste of Time — 128 BPM driving listicle: each item lands on a bar downbeat with a
# whoosh + stamp; little foley per scene (bounces off the "No.", footsteps, a rewind, a dropped ball, a clock);
# the recap opens up with bells.
import json
import numpy as np
from soundlib import *
EV = json.load(open('ev64.json'))
BPM, BAR = EV['bpm'], EV['bar']; IT = EV['items']; END = EV['end']
PROG = ['Am', 'F', 'C', 'G']
drum, bassfx, lead, fx = Fx(), Fx(), Fx(), Fx()
drums(drum, BPM, 0, END, 'drive', 0.9)
drums(drum, BPM, END, DUR, 'half', 0.85)
bass_prog(bassfx, BPM, 0, DUR, PROG, 0.17)
arp(lead, BPM, END, DUR, ['F', 'C', 'G', 'Am'], 0.035)
pad = pad_prog(BPM, 0, END, PROG, 0.4, 1700) + pad_prog(BPM, END, DUR, ['F', 'C', 'G', 'Am'], 0.6, 2600)
NOTES = [523.25, 587.33, 659.26, 783.99, 880.0, 1046.5]
for k, ts in enumerate(IT):
    if ts > 0: fx.whoosh(ts - 0.04, 0.05, 0.06, 1200, 7000)
    fx.ping(ts + 0.45, NOTES[k], 0.04, 0.4); fx.hit(ts + 0.45, 0.06, 500, 0.03, 0.3, 0.003, 0.08)   # NOT A WASTE stamp
r1 = IT[0]
for k in range(3): fx.sweep(r1 + 0.3 + k * 0.6, r1 + 0.55 + k * 0.6, 160, 110, 0.02, 'sin')        # soft snore
r2 = IT[1]
for k in range(3): fx.hit(r2 + 0.05 + k * 0.32 + 0.5, 0.06, 300 + 80 * k, 0.05, 0.2, 0.003, 0.15, fdrop=600)  # boing off
fx.ping(r2 + 0.3, 196.0, 0.04, 0.2)
r3 = IT[2]
for k in range(8): fx.hit(r3 + 0.1 + k * (1 / 3.75) / 2 * 1.0, 0.04, 140, 0.02, 0.5, 0.004, 0.06)              # footsteps
r4 = IT[3]
fx.sweep(r4 + 0.7, r4 + 0.95, 1400, 200, 0.04, 'saw'); fx.whoosh(r4 + 0.82, 0.04, 0.1)                      # rewind
for k in range(6): fx.hit(r4 + 1.1 + k * 0.13, 0.03, 140, 0.02, 0.5, 0.004, 0.06)
r5 = IT[4]
for k in range(5): fx.hit(r5 + 0.05 + k * 0.21, 0.03, 900, 0.01, 0.2, 0.002, 0.04)                          # juggle taps
for k, d in enumerate((0.0, 0.2, 0.33)): fx.hit(r5 + 1.45 + d, 0.06 * (0.6 ** k), 260, 0.04, 0.3, 0.004, 0.1)  # drop + bounces
fx.sweep(r5 + 1.2, r5 + 1.5, 700, 350, 0.025, 'sin')
r6 = IT[5]
s = r6
while s < END: fx.hit(s, 0.04, 2300, 0.006, 0.5, 0.002, 0.03); s += 60 / BPM
impact(fx, END, 0.35)
for f, dt in ((349.23, 0), (440.0, 0.05), (523.25, 0.1), (698.46, 0.16)): fx.bell(END + 0.05 + dt, f, 0.03, 2.4)
for i in range(6): fx.ping(END + 0.08 * i + 0.1, 1046.5 + 60 * i, 0.012, 0.15)
dk = duck()
beat = drum.a + bassfx.a * dk
music = (pad + lead.a) * (0.55 + 0.45 * dk)
finish2(beat, music + fx.a, 'sound64.wav')
