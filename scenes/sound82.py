# 82. 86,400 (v3 original, no voice) — cash-register slam on the deposit, a bright pizzicato groove, clock ticks + minor turn on
# the midnight rule, silence + heartbeat before the flip, a huge drop on "SECONDS", a spend-blip on every drain, coins clinking into
# the YOU jar as the music lifts to major, and a midnight bell on the end card.
import numpy as np
from score import *
D = 16.5
bpm = 100; b = 60 / bpm
voice = np.zeros(int(D * SR))
M = Part('m', D, -3).prog(0, 4).prog(1, 38).prog(2, 89).prog(3, 48).prog(4, 61).prog(5, 14).prog(6, 52).prog(7, 0)
# 0–2.6 bright: pizzicato C major arps + bass
for k, t in enumerate(np.arange(0.1, 2.65, b / 2)):
    ch = ['C', 'C', 'F', 'G'][int(t // (2 * b)) % 4]; nn = chord_notes(ch, 1); M.note(t, 0, nn[k % 3] + (12 if k % 4 == 3 else 0), 92, b / 2)
    if k % 2 == 0: M.note(t, 1, chord_notes(ch, -1)[0], 96, b / 2)
# 2.7–6.8 the rule: minor, sneaky pizz + low strings
for k, t in enumerate(np.arange(2.7, 6.75, b / 2)):
    ch = ['Am', 'Am', 'F', 'E'][int((t - 2.7) // (2 * b)) % 4]; nn = chord_notes(ch, 0); M.note(t, 0, nn[(k * 2) % 3], 80 if k % 2 else 95, b / 2)
pad(M, 3, 2.7, 6.8, bpm, ['Am', 'F', 'E'], 58, beats=4, oct_=0, swell=(40, 80))
# 7.9 drop: drums + synth bass + strings + brass stab, Am F C G
bassline(M, 1, 7.9, 12.3, bpm, ['Am', 'F', 'C', 'G'], vel=105, pattern=(0, 0, 12, 0), beats=1)
pad(M, 3, 7.9, 12.3, bpm, ['Am', 'F', 'C', 'G'], 70, beats=4, oct_=1, swell=(60, 100))
for nn in chord_notes('Am', 1) + [midi('A2')]: M.note(7.9, 4, nn, 120, 0.7)
# 12.35 lift to major + choir; 14.6 end chord; 15.55 midnight bell
piano_arp(M, 7, 12.35, 16.3, bpm, ['F', 'C', 'G', 'C'], vel=62)
pad(M, 6, 12.35, 16.3, bpm, ['F', 'C', 'G', 'C'], 66, beats=4, oct_=1, swell=(50, 105))
bassline(M, 1, 12.35, 14.6, bpm, ['F', 'C'], vel=95, pattern=(0, 12), beats=2)
for nn in chord_notes('C', 1) + [midi('C3'), midi('G5')]: M.note(14.6, 3, nn, 105, 1.9); M.note(14.6, 4, nn, 100, 0.8)
for t in (15.55, 16.05): M.note(t, 5, midi('C5'), 110, 1.4); M.note(t, 5, midi('C4'), 95, 1.4)
Dr = Part('dr', D, -2).prog(9, 0, 128).prog(8, 116)
drums(Dr, 9, 0.1, 2.6, bpm, 'pulse', 70)
drums(Dr, 9, 7.9, 12.3, bpm, 'trap', 100)
drums(Dr, 9, 12.35, 14.6, bpm, 'pop', 92)
for t in (0.05, 7.9, 12.35, 14.6): Dr.note(t, 9, GM['crash'], 118, 1.5)
Dr.note(7.9, 8, midi('C2'), 127, 0.6)
music = reverb(M.render(), 0.2, 1.8, 0.5) + Dr.render()
fx = FX(D)
# restrained, cinematic SFX only (user, Nov 4: "ease off on the corny sound effects")
fx.impact(0.05, 0.7, 50, 0.6, 0.6); fx.ding(0.12, 1046.5, 0.08, 0.6)          # deposit lands: low hit + one soft notification tone
fx.whoosh(2.4, 0.3, 0.18, 600, 6000)
for i, t in enumerate(np.arange(2.75, 7.85, 0.5)): fx.tick(t, 0.07, 2200)       # a quiet clock under the rule and the hush
fx.riser(7.9, 1.0, 0.3); fx.whoosh(7.85, 0.35, 0.3, 300, 7000); fx.impact(7.9, 1.2, 38, 1.6, 0.6); fx.subdrop(7.9, 0.9)
for t in (9.0, 9.95, 10.9): fx.whoosh(t + 0.1, 0.45, 0.16, 1800, 200, False)    # each drain: a soft downward air
fx.thud(12.45, 0.3)
fx.impact(14.6, 0.5, 50, 1.0, 0.5); fx.whoosh(14.55, 0.3, 0.16, 800, 6000)
master(voice, music, fx.a, D, 'sound82.wav', music_db=-3, fx_db=-8)
print('ok')
