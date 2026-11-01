# 71. The Hard Years (v3) — separated voice + score: a drum hit + rising note on every age (16→23), thunder on "easy", an
# emotional piano/strings road that darkens with each blow, near-silence and a heartbeat on "lose yourself", an epic drop on
# "stronger" (taiko, brass, choir), and soaring strings + piano as the eight years light up.
import numpy as np
from score import *
from voedit import load
D = 17.8
voice = load('/home/claude/sep/s02.voice.wav')
AGES = [0.56, 1.04, 1.6, 2.0, 2.48, 2.8, 3.28, 3.92]
M = Part('m', D, -3).prog(0, 0).prog(1, 48).prog(2, 52).prog(3, 61).prog(4, 117).prog(5, 47).prog(6, 49)
for i, t in enumerate(AGES): M.note(t, 4, midi('C3') + [0, 2, 4, 5, 7, 9, 11, 12][i], 110, 0.3); M.note(t, 0, midi('C5') + [0, 2, 4, 5, 7, 9, 11, 12][i], 80, 0.4)
for nn in [midi('A1'), midi('E2'), midi('A2'), midi('C3')]: M.note(4.8, 3, nn, 115, 0.9)
piano_arp(M, 0, 5.3, 11.7, 92, ['Am', 'F', 'C', 'G'], vel=56)
pad(M, 6, 5.3, 11.7, 92, ['Am', 'F', 'C', 'G'], 62, beats=4, oct_=1, swell=(45, 100))
pad(M, 1, 9.0, 11.7, 92, ['Dm', 'E'], 70, beats=4, oct_=0)
for i in range(16): M.note(12.6 + i * 0.04, 5, midi('A2'), 50 + i * 4, 0.12)
bar = 60 / 92 * 4
for k, t in enumerate(np.arange(13.28, 14.4, bar / 2)):
    for nn in chord_notes(['F', 'G'][k % 2], 1): M.note(t, 3, nn, 120, bar / 2); M.note(t, 2, nn, 110, bar / 2); M.note(t, 1, nn, 105, bar / 2)
pad(M, 6, 14.4, D - 0.2, 70, ['F', 'G', 'C'], 78, beats=2, oct_=1, swell=(60, 125)); piano_arp(M, 0, 14.4, D - 0.2, 110, ['F', 'G', 'C', 'C'], vel=62)
for nn in chord_notes('C', 1) + [midi('E5'), midi('G5')]: M.note(16.45, 2, nn, 115, 1.4); M.note(16.45, 3, nn, 118, 1.1)
Dr = Part('dr', D, -1).prog(9, 48, 128).prog(8, 116)
drums(Dr, 9, 5.3, 11.7, 92, 'half', 80)
for k, t in enumerate(np.arange(13.28, 14.4, 60 / 92 / 2)): Dr.note(t, 8, midi('C3') if k % 4 == 0 else midi('G3'), 125 if k % 4 == 0 else 90, 0.3)
drums(Dr, 9, 14.4, D - 0.3, 92, 'pop', 95)
for t in (4.8, 13.28, 16.45): Dr.note(t, 9, GM['crash'], 120, 1.5)
music = reverb(M.render(), 0.3, 2.6, 0.6) + Dr.render()
fx = FX(D)
for t in AGES: fx.impact(t, 0.35, 70, 0.3, 0.6)
fx.impact(4.8, 1.0, 40, 1.6); fx.scrape(4.6, 0.8, 0.15)
for ts in (5.3, 14.35): fx.whoosh(ts, 0.35, 0.5, 600, 8000)
fx.whoosh(6.1, 0.5, 0.3, 3000, 300, False)
for ts in (6.88, 7.05, 7.22, 7.35): fx.pop(ts, 300, 0.25)
fx.thud(7.95, 0.8); fx.impact(8.32, 0.6, 110, 0.4, 1.2)
fx.ding(9.3, 1568, 0.3, 0.9)
fx.scrape(10.3, 2.9, 0.07); fx.impact(10.64, 0.5, 45, 1.0)
for k in range(2): fx.heartbeat(12.0 + k * 0.7, 0.8)
fx.riser(13.28, 0.8, 0.45); fx.impact(13.28, 1.3, 40, 1.6); fx.subdrop(13.28, 1.0)
for i in range(8): fx.ding(15.12 + i * 0.11, 880 * 2 ** (i / 12 * 1.5), 0.12, 0.4)
fx.chime(16.45, gain=0.24)
master(voice, music, fx.a, D, 'sound71.wav', music_db=-12, fx_db=-7)
print('ok')
