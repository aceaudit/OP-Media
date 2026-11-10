# 89. Crabs in a Bucket (v3 original, no voice) — restrained: a low plucked-cello tension figure and the dry scrape of claws on tin,
# one dull metal thud when the crab is dragged down; a whoosh into the pit, a dark low pad with a little wind from above while he
# climbs; low dissonant piano under the voices; a low hit and sub drop on the yank; a single held note while he looks back; then a
# warm build (piano, strings, soft drums) as he climbs into the light, a full major chord at the top and a soft swell when the hands meet.
import numpy as np
from score import *
D = 16.0
voice = np.zeros(int(D * SR))
bpm = 90; b = 60 / bpm
M = Part('m', D, -3).prog(0, 0).prog(1, 48).prog(2, 52).prog(3, 45).prog(4, 89).prog(5, 33)
# cold open: pizz-free low cello figure (bowed, short), minor
for k, t in enumerate(np.arange(0.0, 2.6, b / 2)): M.note(t, 3, midi(['D2', 'D2', 'F2', 'E2'][k % 4]), 84, b / 2 * 0.9)
M.note(0.0, 4, midi('D3'), 50, 2.6); M.note(0.0, 4, midi('A3'), 44, 2.6)
# the pit: dark pad, sparse low piano
pad(M, 4, 2.6, 8.3, bpm, ['Dm', 'Bb', 'Gm', 'Dm'], 50, beats=4, oct_=0, swell=(40, 70))
for t, n in [(2.7, 'D4'), (3.6, 'F4'), (4.6, 'C#4'), (5.1, 'D4'), (5.6, 'C#4')]: M.note(t, 0, midi(n), 58, 1.0)
M.note(6.2, 3, midi('D1'), 100, 1.4)
M.note(7.0, 0, midi('A3'), 56, 1.4); M.note(7.0, 0, midi('D4'), 50, 1.4)
# the climb: warm build
piano_arp(M, 0, 8.3, 15.8, bpm, ['Bb', 'F', 'Gm', 'Eb'], vel=60)
pad(M, 1, 8.3, 15.8, bpm, ['Bb', 'F', 'Gm', 'Eb'], 64, beats=4, oct_=1, swell=(48, 100))
bassline(M, 5, 8.6, 15.8, bpm, ['Bb', 'F', 'Gm', 'Eb'], vel=86, pattern=(0, 0, 7, 0), beats=1)
for nn in chord_notes('Bb', 1) + [midi('A#2'), midi('D5'), midi('F5')]: M.note(10.0, 2, nn, 96, 3.0); M.note(10.0, 1, nn, 92, 3.0)
for nn in chord_notes('Bb', 1) + [midi('A#2'), midi('F5')]: M.note(13.8, 2, nn, 92, 2.2); M.note(13.8, 1, nn, 92, 2.2)
Dr = Part('dr', D, -2).prog(9, 48, 128)
drums(Dr, 9, 9.3, 13.7, bpm, 'half', 72)
Dr.note(10.0, 9, GM['crash'], 84, 1.5)
music = reverb(M.render(), 0.3, 2.6, 0.6) + Dr.render()
fx = FX(D); rng = np.random.default_rng(11)
# claws scraping on tin, quiet
fx.scrape(0.1, 0.5, 0.06); fx.scrape(0.75, 0.4, 0.05); fx.scrape(1.25, 0.3, 0.05)
fx.whoosh(1.6, 0.4, 0.12, 3000, 300, False)
fx.impact(2.0, 0.45, 55, 0.5, 0.5)
n = int(0.5 * SR); tt = np.arange(n) / SR; fx.add(2.0, bp(rng.standard_normal(n), 1800, 4200) * np.exp(-tt / 0.06), 0.05)   # dull tin knock
fx.whoosh(2.6, 0.3, 0.16, 500, 6000)
# wind from above while he climbs
n = int(5.6 * SR); wind = lp(rng.standard_normal(n), 500) * (0.6 + 0.4 * np.sin(np.linspace(0, 5, n))); fx.add(2.6, wind * np.minimum(1, np.linspace(0, 6, n)) * np.minimum(1, np.linspace(6, 0, n)), 0.05)
fx.impact(6.2, 0.6, 45, 0.9, 0.3); fx.subdrop(6.2, 0.5); fx.whoosh(6.2, 0.3, 0.14, 3000, 400, False)
fx.whoosh(7.75, 0.25, 0.1, 500, 4000)
fx.riser(10.0, 1.4, 0.18); fx.impact(10.0, 0.6, 44, 1.4, 0.5)
fx.whoosh(10.6, 0.3, 0.1, 600, 5000)
fx.riser(12.95, 0.9, 0.14); fx.impact(12.95, 0.3, 50, 1.0, 0.3)
fx.impact(13.8, 0.35, 50, 1.2, 0.4)
master(voice, music, fx.a, D, 'sound89.wav', music_db=-3, fx_db=-8)
print('ok')
