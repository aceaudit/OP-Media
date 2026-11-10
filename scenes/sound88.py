# 88. 47 Tabs Open (v3 original, no voice) — restrained: an anxious repeated-note piano and a pulsing low bass over a laptop-fan
# whir that keeps rising while the tabs spawn; on "Not Responding" the music muffles to a held drone (low hit); a quiet UI click on
# "Close tabs", one long descending sweep while the tabs collapse and the fan winds down; the Overthinking tab plays a tinny loop that
# cuts dead on mute; a beat of near-silence, then a warm major piano/strings bed that resolves on the end card.
import numpy as np
from score import *
D = 15.0
voice = np.zeros(int(D * SR))
bpm = 100; b = 60 / bpm
M = Part('m', D, -3).prog(0, 0).prog(1, 48).prog(2, 52).prog(3, 38).prog(4, 89).prog(5, 33)
# tension: repeated-note piano (E5/F5) getting busier, pulsing bass, dark pad
for k, t in enumerate(np.arange(0.0, 4.5, b / 2)):
    M.note(t, 0, midi('E5') if k % 2 == 0 else midi('F5'), int(46 + 24 * t / 4.5), b / 2 * 0.7)
    M.note(t, 3, midi('A1') if (k // 4) % 2 == 0 else midi('F1'), int(70 + 20 * t / 4.5), b / 2 * 0.8)
pad(M, 4, 0.0, 4.5, bpm, ['Am', 'F'], 50, beats=4, oct_=0, swell=(40, 80))
# not responding: one held low drone
M.note(4.5, 4, midi('A2'), 60, 1.5); M.note(4.5, 4, midi('E3'), 52, 1.5)
# closing: soft descending piano
for i, n in enumerate(['E5', 'C5', 'A4', 'G4', 'E4', 'C4']): M.note(6.05 + i * 0.26, 0, midi(n), 52, 0.5)
# warm major bed
piano_arp(M, 0, 9.6, 14.8, bpm, ['C', 'G', 'Am', 'F'], vel=60)
pad(M, 1, 9.6, 14.8, bpm, ['C', 'G', 'Am', 'F'], 62, beats=4, oct_=1, swell=(45, 95))
bassline(M, 5, 10.2, 14.8, bpm, ['C', 'G', 'Am', 'F'], vel=84, pattern=(0, 0, 7, 0), beats=1)
for nn in chord_notes('C', 1) + [midi('C3'), midi('E5'), midi('G5')]: M.note(12.6, 2, nn, 92, 2.3); M.note(12.6, 1, nn, 92, 2.3)
Dr = Part('dr', D, -2).prog(9, 48, 128)
drums(Dr, 9, 10.2, 12.5, bpm, 'half', 66)
mus = M.render()
tt = np.arange(len(mus)) / SR; w = ((tt >= 4.5) & (tt < 5.95)).astype(float)
mus = mus * (1 - w[:, None]) + lp(mus, 650) * w[:, None]
# the Overthinking tab: a tinny loop from a small speaker, cut dead on mute
O = Part('o', D, -6).prog(0, 0)
for k, t in enumerate(np.arange(7.8, 8.6, b / 4)): O.note(t, 0, midi('D#5') if k % 2 else midi('E5'), 72, b / 4 * 0.8)
ot = O.render(); ot = bp(ot, 700, 3200, 4); ot[int(8.6 * SR):] = 0
music = reverb(mus, 0.3, 2.4, 0.6) + Dr.render() + ot * 1.6
fx = FX(D); rng = np.random.default_rng(8)
# laptop fan: band-limited noise that rises with the tabs, holds, then winds down while they close
n = int(D * SR); tf = np.arange(n) / SR
fan_env = np.interp(tf, [0, 2.3, 4.5, 5.9, 6.05, 7.6, 8.0], [0.35, 0.8, 1.0, 1.0, 0.9, 0.15, 0.0])
fan = bp(rng.standard_normal(n), 250, 1400, 2) * fan_env
fx.add(0.0, fan, 0.05)
fx.impact(0.0, 0.5, 50, 0.6, 0.4); fx.whoosh(0.0, 0.3, 0.14, 600, 6000)
fx.whoosh(2.4, 0.25, 0.12, 600, 6000)
fx.impact(4.5, 0.45, 48, 0.9, 0.2)
fx.whoosh(4.75, 0.25, 0.1, 800, 5000)
fx.tick(5.9, 0.12, 2400)
fx.whoosh(6.05, 1.5, 0.16, 4000, 300, False)
fx.whoosh(9.1, 0.3, 0.1, 2500, 400, False)
fx.riser(9.6, 0.6, 0.12); fx.impact(9.6, 0.35, 50, 0.9, 0.3)
fx.impact(12.6, 0.35, 50, 1.2, 0.4)
master(voice, music, fx.a, D, 'sound88.wav', music_db=-3, fx_db=-8)
print('ok')
