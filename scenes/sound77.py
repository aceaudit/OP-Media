# 77. Same Letters (v3) — separated voice + a playful score: pizzicato strings + celesta over a light kit; every flip lands on a
# rising celesta arpeggio; strings and choir swell on "choice"; full chord when he steps to the gold side.
import numpy as np
from score import *
from voedit import load
D = 26.4
voice = load('/home/claude/sep/s08.voice.wav')
PAIRS = [('HATE', 1.68, 2.0, 2.48, 4.48), ('ENEMIES', 5.44, 6.0, 6.48, 7.92), ('LYING', 8.8, 9.28, 9.68, 10.88), ('FAILURE', 12.08, 12.72, 13.28, 14.56), ('CRY', 15.44, 15.92, 16.32, 17.52), ('NEGATIVITY', 18.8, 19.36, 19.76, 20.96)]
bpm = 92; beat = 60 / bpm; prog = ['C', 'Am', 'F', 'G']
M = Part('m', D, -3).prog(0, 45).prog(1, 8).prog(2, 49).prog(3, 52).prog(4, 33)
for k, t in enumerate(np.arange(0.0, 22.2, beat / 2)):
    c = chord_notes(prog[int(k // 8) % 4], 1); M.note(t, 0, c[[0, 2, 1, 2][k % 4]], 72 if k % 2 == 0 else 58, 0.2)
for k, t in enumerate(np.arange(0.0, 22.2, beat * 2)): M.note(t, 4, chord_notes(prog[int(k // 2) % 4], -1)[0], 85, beat * 1.8)
ARP = [[72, 76, 79, 84], [74, 77, 81, 86], [76, 79, 83, 88], [77, 81, 84, 89], [79, 83, 86, 91], [81, 84, 88, 93]]
for p, (w, tb, th, tl, tg) in enumerate(PAIRS):
    for i in range(len(w)): M.note(tg + i * 0.06, 1, ARP[p][i % 4] + 12 * (i // 4), 88, 0.4)
pad(M, 2, 22.3, D - 0.3, 70, ['F', 'G', 'C'], 70, beats=2, oct_=1, swell=(50, 125)); pad(M, 3, 23.1, D - 0.3, 70, ['G', 'C'], 60, beats=2, oct_=1)
for nn in chord_notes('C', 1) + [midi('E5'), midi('G5')]: M.note(24.4, 1, nn, 100, 1.5)
Dr = Part('dr', D, -2).prog(9, 40, 128)
drums(Dr, 9, 1.68, 22.2, bpm, 'half', 70); Dr.note(24.4, 9, GM['crash'], 110, 1.5)
music = reverb(M.render(), 0.22, 2.0, 0.45) + Dr.render() * 0.8
fx = FX(D)
for i in range(30): fx.tick(0.02 + i * 0.055, 0.22, 1800 + (i % 5) * 200)
for p, (w, tb, th, tl, tg) in enumerate(PAIRS):
    n = len(w)
    for i in range(n): fx.pop(tb + 0.12 + i * 0.045, 500 + 30 * i, 0.08)
    for i in range(n): fx.tick(th + (i + 0.5) * (tl + 0.25 - th) / n, 0.18, 2600)
    for i in range(n): fx.swish(tg + i * 0.06 + 0.1, 0.12)
    d = tg + n * 0.06 + 0.15; fx.impact(d, 0.5, 70, 0.5, 0.5); fx.ding(d, 1318.5 * 2 ** (p / 12), 0.2, 0.7)
for i in range(6): fx.whoosh(22.32 + i * 0.06, 0.2, 0.12, 1500, 5000)
fx.riser(24.4, 1.2, 0.35); fx.impact(24.4, 1.0, 44, 1.2); fx.subdrop(24.4, 0.8); fx.chime(24.45, gain=0.24)
master(voice, music, fx.a, D, 'sound77.wav', music_db=-12, fx_db=-8)
print('ok')
