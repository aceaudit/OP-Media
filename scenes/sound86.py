# 86. The Wrong Bus (v3 original, no voice) — restrained: a low engine rumble and the hiss of the road under a sad minor piano,
# one soft whoosh as the YOUR DREAM sign passes, a paper rustle for the ticket, a single bus bell on the cord, air brakes and the
# door hiss, then the music turns warm and hopeful as he walks the other way into the sunrise.
import numpy as np
from score import *
D = 16.0
voice = np.zeros(int(D * SR))
bpm = 84; b = 60 / bpm
M = Part('m', D, -3).prog(0, 0).prog(1, 48).prog(2, 52).prog(3, 42).prog(4, 89).prog(5, 33)
pad(M, 4, 0.0, 8.6, bpm, ['Dm', 'Bb', 'F', 'C'], 50, beats=4, oct_=0, swell=(35, 70))
for t, n in [(0.3, 'A4'), (1.0, 'F4'), (1.7, 'D4'), (2.6, 'A4'), (3.3, 'G4'), (4.0, 'F4'), (5.0, 'E4'), (5.7, 'F4'), (6.4, 'D4')]: M.note(t, 0, midi(n), 60, 0.9)
M.note(0.0, 3, midi('D2'), 72, 7.0)
pad(M, 1, 7.0, 8.6, bpm, ['Gm', 'A' if 'A' in CH else 'E'], 60, beats=4, oct_=0, swell=(40, 90))
# stepping off: warm and hopeful
piano_arp(M, 0, 9.0, 15.8, bpm, ['F', 'C', 'Dm', 'Bb'], vel=60)
pad(M, 1, 9.0, 15.8, bpm, ['F', 'C', 'Dm', 'Bb'], 62, beats=4, oct_=1, swell=(45, 100))
bassline(M, 5, 10.0, 15.8, bpm, ['F', 'C', 'Dm', 'Bb'], vel=84, pattern=(0, 0, 7, 0), beats=1)
for nn in chord_notes('F', 1) + [midi('F2'), midi('C5'), midi('A5')]: M.note(13.6, 2, nn, 96, 2.3); M.note(13.6, 1, nn, 96, 2.3)
Dr = Part('dr', D, -2).prog(9, 48, 128)
drums(Dr, 9, 11.0, 15.5, bpm, 'half', 70)
music = reverb(M.render(), 0.3, 2.6, 0.6) + Dr.render()
fx = FX(D)
n = int(D * SR); tt = np.arange(n) / SR; rng = np.random.default_rng(3)
eng = lp(rng.standard_normal(n), 140) * (0.8 + 0.2 * np.sin(2 * np.pi * 7 * tt))
road = bp(rng.standard_normal(n), 800, 3000) * 0.18
env = np.clip(1 - (tt - 8.6) / 0.5, 0, 1) * (tt < 10.0)
fx.add(0.0, (eng * 2.2 + road) * env, 0.5)
fx.whoosh(3.9, 0.6, 0.16, 400, 3500)
fx.scrape(5.0, 0.35, 0.05)
fx.ding(7.95, 1046.5, 0.07, 0.8)
fx.add(8.6, bp(rng.standard_normal(int(0.6 * SR)), 2500, 8000) * np.linspace(1, 0, int(0.6 * SR)) ** 2, 0.08)
fx.thud(9.0, 0.3)
fx.add(9.05, bp(rng.standard_normal(int(0.45 * SR)), 3000, 9000) * np.sin(np.pi * np.linspace(0, 1, int(0.45 * SR))), 0.06)
fx.whoosh(10.0, 0.3, 0.16, 600, 5000)
dep = lp(rng.standard_normal(int(2.2 * SR)), 160) * np.linspace(1, 0, int(2.2 * SR)) ** 1.5
fx.add(10.2, dep * 2.0, 0.45)
for t in np.arange(11.3, 14.2, 0.42): fx.thud(t, 0.08)
fx.impact(13.6, 0.35, 50, 1.2, 0.4)
master(voice, music, fx.a, D, 'sound86.wav', music_db=-3, fx_db=-8)
print('ok')
