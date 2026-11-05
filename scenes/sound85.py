# 85. Your Future Self Is Watching (v3 original, no voice) — restrained: a low hit as the window opens, a sparse minor piano while
# he scrolls and the future self dims, near-silence on "Look up", then a warm build (piano, strings, drums) through the page, the
# mile and the early night, lifting into a full major chord as the future self lights up gold. Effects: soft whooshes and low hits only.
import numpy as np
from score import *
D = 15.0
voice = np.zeros(int(D * SR))
bpm = 92; b = 60 / bpm
M = Part('m', D, -3).prog(0, 0).prog(1, 48).prog(2, 52).prog(3, 42).prog(4, 89).prog(5, 33)
pad(M, 4, 0.0, 6.2, bpm, ['Am', 'F', 'C', 'E'], 52, beats=4, oct_=0, swell=(35, 75))
for t, n in [(0.2, 'E5'), (1.0, 'C5'), (1.8, 'A4'), (2.6, 'E5'), (3.4, 'D5'), (4.2, 'C5'), (5.0, 'B4'), (5.8, 'A4')]: M.note(t, 0, midi(n), 62, 0.9)
M.note(0.0, 3, midi('A1'), 80, 6.0)
# "Look up": one held note
M.note(6.25, 1, midi('E4'), 60, 1.1); M.note(6.25, 1, midi('A3'), 55, 1.1)
# the build
piano_arp(M, 0, 7.4, 12.6, bpm, ['F', 'C', 'G', 'Am'], vel=62)
pad(M, 1, 7.4, 12.6, bpm, ['F', 'C', 'G', 'Am'], 66, beats=4, oct_=1, swell=(50, 105))
bassline(M, 5, 7.4, 12.6, bpm, ['F', 'C', 'G', 'Am'], vel=90, pattern=(0, 0, 7, 0), beats=1)
for nn in chord_notes('C', 1) + [midi('C3'), midi('E5'), midi('G5')]: M.note(10.8, 2, nn, 100, 4.0); M.note(10.8, 1, nn, 100, 4.0)
for nn in chord_notes('C', 0) + [midi('C6')]: M.note(12.6, 0, nn, 78, 2.3)
Dr = Part('dr', D, -2).prog(9, 48, 128)
drums(Dr, 9, 8.5, 12.5, bpm, 'half', 82)
for t in (7.4, 10.8): Dr.note(t, 9, GM['crash'], 100, 1.5)
music = reverb(M.render(), 0.3, 2.6, 0.6) + Dr.render()
fx = FX(D)
fx.impact(0.0, 0.5, 48, 0.9, 0.4); fx.whoosh(0.0, 0.4, 0.15, 400, 4000)
fx.whoosh(2.2, 0.4, 0.15, 500, 5000)
fx.whoosh(4.55, 0.35, 0.12, 2500, 300, False)
fx.whoosh(6.2, 0.3, 0.2, 400, 5000); fx.impact(6.25, 0.35, 55, 0.6, 0.3)
fx.whoosh(6.9, 0.25, 0.18, 600, 6000)
fx.riser(7.4, 0.8, 0.2); fx.impact(7.4, 0.8, 42, 1.0, 0.5); fx.subdrop(7.4, 0.6)
for t in (8.5, 9.6): fx.whoosh(t, 0.25, 0.14, 600, 6000)
for t in np.arange(8.6, 9.55, 0.3): fx.thud(t, 0.1)
fx.riser(10.8, 1.0, 0.2); fx.impact(10.8, 0.8, 44, 1.4, 0.5)
fx.impact(12.6, 0.4, 50, 1.2, 0.4)
master(voice, music, fx.a, D, 'sound85.wav', music_db=-3, fx_db=-8)
print('ok')
