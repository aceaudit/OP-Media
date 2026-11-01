# 75. Expect Less, Demand More (v3) — separated voice, trimmed ("Why are you angry … as much as you did." and the profanity
# line cut) + score: a pulsing synth bass under the battery, electric zaps as each cable plugs in, power-down blips on every
# let-down, a low-battery alarm, silence on "Guess what?", the beat drops on "It's fine", a charge-up on every "you'll…",
# zapping cords that get snipped, a huge hit on "demand more", and a full-tilt run to the end card.
import numpy as np
from score import *
from voedit import load, xsplice
D = 47.34
voice = xsplice(load('/home/claude/sep/s06.voice.wav'), [(0, 8.73), (15.99, 18.34), (22.23, 57.62)])
bpm = 100; b = 60 / bpm
M = Part('m', D, -3).prog(0, 38).prog(1, 89).prog(2, 0).prog(3, 48).prog(4, 61).prog(5, 81).prog(6, 52).prog(7, 8)
PROG = ['Dm', 'Bb', 'F', 'C']
# 0–15.6: tense pulse (synth bass eighths + dark pad), thinning out as the battery drains
for k, t in enumerate(np.arange(0.0, 15.4, b / 2)):
    root = {0: 'D2', 1: 'A#1', 2: 'F2', 3: 'C2'}[int(t // (4 * b)) % 4]
    M.note(t, 0, midi(root), 92 if k % 2 == 0 else 70, b / 2 * 0.8)
pad(M, 1, 0.0, 15.4, bpm, PROG, 58, beats=4, oct_=0, swell=(35, 80))
for t, n in [(11.17, 'A4'), (11.77, 'F4'), (12.37, 'D4'), (12.97, 'E4'), (13.57, 'F4'), (14.17, 'D4')]: M.note(t, 2, midi(n), 62, 0.9)
# 16.49 "fine" → 16.97 the beat drops in a brighter key; builds through the "you'll…" run
piano_chords(M, 2, 16.97, 34.24, bpm, ['F', 'C', 'Dm', 'Bb'], vel=58, beats=2)
pad(M, 1, 16.97, 34.24, bpm, ['F', 'C', 'Dm', 'Bb'], 62, beats=4, oct_=0)
bassline(M, 0, 16.97, 34.24, bpm, ['F', 'C', 'Dm', 'Bb'], vel=95, pattern=(0, 0, 7, 0), beats=1)
pad(M, 3, 22.44, 34.24, bpm, ['F', 'C', 'Dm', 'Bb'], 60, beats=4, oct_=1, swell=(40, 95))
# 34.24–36.3: the cords hum — bass drone + tension strings; release on the snip
M.note(34.24, 0, midi('D2'), 100, 2.1)
for k, t in enumerate(np.arange(34.3, 36.3, 0.125)): M.note(t, 3, midi('D4') + (k // 4) % 2, 60 + k, 0.12)
# 36.33 onward: epic — Dm Bb F C with brass, choir, lead; "MORE" stab at 40.21
pad(M, 3, 36.33, 46.49, bpm, PROG, 72, beats=4, oct_=1, swell=(55, 110))
pad(M, 6, 37.74, 46.49, bpm, PROG, 60, beats=4, oct_=1)
bassline(M, 0, 36.33, 46.49, bpm, PROG, vel=105, pattern=(0, 0, 0, 12), beats=1)
piano_arp(M, 2, 36.33, 46.49, bpm, PROG, vel=60)
for nn in chord_notes('F', 1) + [midi('F3'), midi('C5')]: M.note(40.21, 4, nn, 120, 0.8); M.note(40.21, 3, nn, 115, 1.4)
for i, (t, n) in enumerate([(41.14, 'A4'), (41.74, 'C5'), (42.34, 'D5'), (43.54, 'F5'), (44.14, 'E5'), (44.54, 'D5'), (45.14, 'C5'), (45.74, 'D5')]): M.note(t, 5, midi(n), 80, 0.55)
for nn in chord_notes('Dm', 1) + [midi('D3'), midi('A5')]: M.note(46.49, 3, nn, 110, 0.85); M.note(46.49, 4, nn, 112, 0.6); M.note(46.49, 6, nn, 90, 0.85)
M.note(46.49, 0, midi('D1'), 110, 0.85)
Dr = Part('dr', D, -2).prog(9, 0, 128).prog(8, 116)
drums(Dr, 9, 0.0, 8.73, bpm, 'pulse', 55)
drums(Dr, 9, 16.97, 22.44, bpm, 'half', 85)
drums(Dr, 9, 22.44, 34.24, bpm, 'pop', 92, fill_at=33.6)
drums(Dr, 9, 36.33, 41.14, bpm, 'half', 95)
drums(Dr, 9, 41.14, 46.4, bpm, 'pop', 108, fill_at=45.9)
for t in (16.97, 22.44, 36.33, 40.21, 46.49): Dr.note(t, 9, GM['crash'], 115, 1.5)
for k, t in enumerate(np.arange(38.6, 40.2, b / 2)): Dr.note(t, 8, midi('C3'), 70 + k * 5, 0.25)
Dr.note(40.21, 8, midi('C2'), 127, 0.6); Dr.note(16.49, 8, midi('C2'), 120, 0.5)
music = reverb(M.render(), 0.22, 2.0, 0.5) + Dr.render()
mute = np.ones(len(music)); t_ = np.arange(len(music)) / SR
mute *= np.clip(1 - (t_ - 15.45) / 0.2, 0, 1) + np.clip((t_ - 16.45) / 0.05, 0, 1)   # silence for "Guess what?"
mute = np.clip(mute, 0, 1); music = music * mute[:, None]
fx = FX(D)
for t in (0.3, 0.88, 1.44): fx.glitch(t, 0.14, 0.35); fx.pop(t, 1400, 0.3); fx.impact(t, 0.35, 70, 0.3, 1.2); fx.whoosh(t + 0.15, 0.3, 0.12, 2000, 400, False)
fx.ding(3.28, 1760, 0.18, 0.4); fx.ding(3.45, 1760, 0.18, 0.4)
fx.whoosh(5.3, 0.3, 0.35, 600, 8000)
for i in range(10): fx.tick(5.4 + i * 0.25, 0.12, 3000)
fx.pop(7.92, 700, 0.35); fx.whoosh(8.0, 0.4, 0.2, 2500, 300, False)
fx.whoosh(8.73, 0.3, 0.45, 600, 9000)
for t in (9.46, 10.74): fx.whoosh(t + 0.1, 0.35, 0.18, 2500, 250, False)
fx.whoosh(11.17, 0.3, 0.3, 600, 7000)
fx.pop(12.6, 1000, 0.2)
fx.record_scratch(14.6, 0.25)
for i in range(3): fx.ding(14.69 + i * 0.22, 1046.5 if i % 2 == 0 else 880, 0.2, 0.18)
fx.thud(15.62, 0.5)
fx.tape_stop(15.2, 0.4, 0.35)
fx.impact(16.49, 0.9, 45, 1.0, 0.8); fx.subdrop(16.49, 0.6)
fx.whoosh(16.84, 0.3, 0.3, 600, 8000)
fx.whoosh(19.1, 0.6, 0.25, 3000, 300, False); fx.pop(19.53, 900, 0.25)
fx.riser(22.0, 0.75, 0.3, 300, 2500); fx.ding(22.01, 1318.5, 0.25, 0.8); fx.impact(22.01, 0.6, 55, 0.6, 1.0)
fx.whoosh(22.44, 0.3, 0.35, 600, 8000)
fx.pop(25.13, 500, 0.4); fx.ding(25.15, 1568, 0.22, 0.7)
fx.whoosh(25.44, 0.3, 0.3, 600, 8000); fx.thud(26.6, 0.4); fx.whoosh(27.2, 0.4, 0.3, 300, 3000); fx.impact(27.49, 0.6, 55, 0.5, 0.8)
fx.whoosh(27.74, 0.3, 0.3, 600, 8000); fx.swish(29.4, 0.3)
fx.whoosh(29.84, 0.3, 0.3, 600, 8000)
for i in range(10): fx.ding(32.44 + i * 0.13, 1046.5 * 2 ** (i / 12 * 1.2), 0.1, 0.35)
fx.whoosh(34.24, 0.3, 0.35, 600, 8000)
for k, t in enumerate(np.arange(34.3, 36.3, 0.09)): fx.glitch(t, 0.05, 0.05 + 0.002 * k)
for i in range(3): fx.shatter(36.33 + i * 0.12, 0.25); fx.pop(36.33 + i * 0.12, 1800, 0.3)
fx.impact(36.33, 0.9, 42, 1.2, 1.0)
fx.whoosh(37.74, 0.3, 0.3, 600, 8000); fx.pop(37.85, 500, 0.35); fx.whoosh(38.4, 0.5, 0.25, 3000, 300, False)
fx.riser(40.21, 1.6, 0.35); fx.impact(40.21, 1.3, 40, 1.6, 1.0); fx.subdrop(40.21, 0.9)
fx.whoosh(41.14, 0.3, 0.35, 600, 8000)
for t in (42.34, 42.69, 43.04, 43.34, 43.64): fx.whoosh(t - 0.15, 0.25, 0.12, 800, 5000); fx.pop(t, 1300, 0.22)
fx.whoosh(44.54, 0.5, 0.35, 300, 6000)
fx.impact(46.49, 1.0, 45, 0.9, 1.0); fx.chime(46.5, gain=0.2)
master(voice, music, fx.a, D, 'sound75.wav', music_db=-12, fx_db=-7)
print('ok')
