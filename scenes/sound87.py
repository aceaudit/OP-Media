# 87. Pause Before You React (v3 original, no voice) — restrained: a low hit and a tense pulsing bass under the insult; on PAUSE
# the music cuts to a muffled hush; three soft low piano notes under 3·2·1 with an airy breath in and out; a soft whoosh for the
# cards; when he picks RESPOND and the world plays again, a warm piano/strings bed returns and resolves on the end card.
import numpy as np
from score import *
D = 15.0
voice = np.zeros(int(D * SR))
bpm = 96; b = 60 / bpm
M = Part('m', D, -3).prog(0, 0).prog(1, 48).prog(2, 52).prog(3, 38).prog(4, 89).prog(5, 33)
for k, t in enumerate(np.arange(0.0, 1.5, b / 2)): M.note(t, 3, midi('D2') + (1 if k % 4 == 3 else 0), 92, b / 2 * 0.8)
for nn in (midi('D4'), midi('D#4'), midi('A4')): M.note(0.0, 1, nn, 70, 1.5)
# the pause: a muffled hush pad
pad(M, 4, 1.55, 7.9, bpm, ['Dm', 'F'], 44, beats=8, oct_=0)
for t, n in [(2.6, 'A2'), (3.7, 'G2'), (4.8, 'F2')]: M.note(t, 0, midi(n), 62, 1.2)
# play: warm major bed
piano_arp(M, 0, 8.0, 14.8, bpm, ['C', 'G', 'Am', 'F'], vel=60)
pad(M, 1, 8.0, 14.8, bpm, ['C', 'G', 'Am', 'F'], 62, beats=4, oct_=1, swell=(45, 95))
bassline(M, 5, 9.0, 14.8, bpm, ['C', 'G', 'Am', 'F'], vel=84, pattern=(0, 0, 7, 0), beats=1)
for nn in chord_notes('C', 1) + [midi('C3'), midi('E5'), midi('G5')]: M.note(12.8, 2, nn, 92, 2.1); M.note(12.8, 1, nn, 92, 2.1)
Dr = Part('dr', D, -2).prog(9, 48, 128)
drums(Dr, 9, 9.0, 12.7, bpm, 'half', 68)
mus = M.render()
# the hush: low-pass the whole bed during the pause
tt = np.arange(len(mus)) / SR; w = ((tt >= 1.5) & (tt < 8.0)).astype(float)
mus = mus * (1 - w[:, None]) + lp(mus, 700) * w[:, None]
music = reverb(mus, 0.3, 2.4, 0.6) + Dr.render()
fx = FX(D); rng = np.random.default_rng(5)
fx.impact(0.0, 0.7, 50, 0.6, 0.6); fx.whoosh(0.0, 0.3, 0.2, 600, 6000)
fx.whoosh(0.9, 0.25, 0.12, 800, 5000)
fx.impact(1.5, 0.45, 60, 0.4, 0.2)
for t0, up in ((2.6, True), (3.7, None), (4.8, False)):
    if up is None: continue
    nn = int(1.0 * SR); env = np.linspace(0, 1, nn) if up else np.linspace(1, 0, nn); env = np.sin(np.pi / 2 * env)
    fx.add(t0, bp(rng.standard_normal(nn), 400, 2500) * env, 0.05)
fx.whoosh(5.9, 0.35, 0.14, 500, 5000)
fx.riser(8.0, 0.6, 0.15); fx.impact(7.4, 0.35, 55, 0.6, 0.3)
fx.whoosh(8.0, 0.3, 0.16, 400, 5000)
fx.impact(12.8, 0.35, 50, 1.2, 0.4)
master(voice, music, fx.a, D, 'sound87.wav', music_db=-3, fx_db=-8)
print('ok')
