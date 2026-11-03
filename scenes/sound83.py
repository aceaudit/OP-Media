# 83. Year 4. Still Nothing. (v3 original, no voice) — the ending's choir chord, a tape rewind, then a lonely piano through
# years 1–3 (water drips, a giggle on each laugh, wind in the snow), a storm and a heartbeat in year 4, a sub rumble and
# shimmer as the roots light up, a riser into a huge hit when it erupts, and an epic climb with the camera to the top.
import numpy as np
from score import *
FF = 1.2; D = FF + 16.8
T = lambda s: FF + s
voice = np.zeros(int(D * SR))
bpm = 90; b = 60 / bpm
M = Part('m', D, -3).prog(0, 0).prog(1, 48).prog(2, 52).prog(3, 42).prog(4, 61).prog(5, 45).prog(6, 89).prog(7, 33)
# ending (0–0.7): big C chord, then the rewind
for nn in chord_notes('C', 1) + [midi('C3'), midi('E5')]: M.note(0.0, 2, nn, 100, 0.7); M.note(0.0, 1, nn, 100, 0.7)
# years 1–3: lonely piano
mel = [(0.2, 'E5'), (0.8, 'C5'), (1.4, 'A4'), (2.0, 'E5'), (2.6, 'D5'), (3.2, 'C5'), (3.8, 'E5'), (4.4, 'B4'), (5.0, 'A4')]
for s, n in mel: M.note(T(s), 0, midi(n), 66, 1.0)
pad(M, 6, T(0.1), T(5.2), bpm, ['Am', 'F', 'C', 'G'], 48, beats=4, oct_=0)
# laughs: a descending pizzicato giggle
for s in (1.9, 2.4, 3.6, 4.1, 4.6, 5.5, 6.1):
    for i, n in enumerate(['E5', 'C5', 'A4']): M.note(T(s) + i * 0.08, 5, midi(n), 70, 0.1)
# year 4: storm, minor strings, cello
pad(M, 1, T(5.2), T(7.6), bpm, ['Am', 'Dm', 'E'], 62, beats=4, oct_=0, swell=(40, 85))
M.note(T(5.2), 3, midi('A1'), 95, 2.4)
# rise (6.85) → x-ray (7.6): strings swell, choir shimmer
pad(M, 2, T(7.6), T(9.6), bpm, ['F', 'G'], 62, beats=4, oct_=1, swell=(40, 105))
for k, t in enumerate(np.arange(T(8.6), T(9.6), 0.0625)): M.note(t, 1, midi('E4') + (k % 2), 50 + k * 4, 0.07)
# year 5: epic climb
bpm2 = 120
piano_arp(M, 0, T(9.6), T(13.2), bpm2, ['C', 'G', 'Am', 'F'], vel=74)
pad(M, 1, T(9.6), T(13.2), bpm2, ['C', 'G', 'Am', 'F'], 82, beats=4, oct_=1, swell=(70, 115))
bassline(M, 7, T(9.6), T(13.2), bpm2, ['C', 'G', 'Am', 'F'], vel=105, pattern=(0, 0, 12, 0), beats=1)
for nn in chord_notes('C', 1) + [midi('C3'), midi('G5')]: M.note(T(9.6), 4, nn, 122, 0.8); M.note(T(12.5), 4, nn, 118, 1.0)
for nn in chord_notes('C', 1) + [midi('C3'), midi('E5'), midi('G5')]: M.note(T(12.5), 2, nn, 110, 4.5); M.note(T(12.5), 1, nn, 105, 4.5)
for nn in chord_notes('C', 0) + [midi('C6')]: M.note(T(13.2), 0, nn, 85, 3.4)
Dr = Part('dr', D, -2).prog(9, 48, 128).prog(8, 116)
drums(Dr, 9, T(9.6), T(12.5), bpm2, 'pop', 108)
for k, t in enumerate(np.arange(T(8.9), T(9.6), b / 4)): Dr.note(t, 8, midi('C3'), 60 + k * 6, 0.2)
for t in (0.0, T(9.6), T(12.5)): Dr.note(t, 9, GM['crash'], 120, 1.5)
for s in (1.6, 3.4, 5.2): Dr.note(T(s), 8, midi('C2'), 105, 0.4)
Dr.note(T(9.6), 8, midi('C2'), 127, 0.6)
music = reverb(M.render(), 0.3, 2.6, 0.6) + Dr.render()
fx = FX(D)
fx.impact(0.0, 0.9, 42, 1.2, 0.8); fx.scrape(0.0, 0.7, 0.08)
fx.rewind(0.72, 0.5, 0.5); fx.tape_stop(1.05, 0.2, 0.3)
for s in (0.0,): fx.thud(T(s) + 0.1, 0.35)
for s in (0.35, 2.0, 3.8, 7.0):
    for i in range(7): fx.pop(T(s) + 0.15 + i * 0.12, 2200 + 200 * (i % 3), 0.07)
for s in (1.6, 3.4, 5.2): fx.whoosh(T(s), 0.3, 0.3, 600, 6000)
fx.scrape(T(1.6), 1.0, 0.06)                     # wind in the snow
fx.chime(T(2.65), gain=0.12)                     # sun
fx.scrape(T(5.2), 2.4, 0.07)                     # rain
fx.impact(T(5.35), 0.7, 38, 1.4, 0.4); fx.impact(T(6.4), 0.5, 40, 1.2, 0.4)
fx.thud(T(5.95), 0.6)
for s in (6.2, 6.75): fx.heartbeat(T(s), 0.7)
fx.impact(T(6.85), 0.35, 60, 0.4, 0.8)
fx.whoosh(T(7.55), 0.5, 0.45, 4000, 150, False); fx.subdrop(T(7.6), 0.8, 70, 28, 1.8)
for i in range(16): fx.tick(T(7.7) + i * 0.09, 0.08, 1800 + 150 * (i % 4))
fx.riser(T(9.6), 1.0, 0.45); fx.impact(T(9.6), 1.4, 36, 1.8, 1.0); fx.subdrop(T(9.6), 1.0); fx.shatter(T(9.6), 0.25)
for w in range(1, 6): fx.pop(T(9.6) + (T(12.5) - T(9.6)) * w / 6 + 0.05, 1200 + 100 * w, 0.18)
fx.whoosh(T(10.0), 2.4, 0.3, 200, 5000)
fx.impact(T(12.5), 0.9, 44, 1.6, 1.0); fx.chime(T(12.55), gain=0.2)
fx.impact(T(13.2), 0.5, 50, 1.2, 0.6)
master(voice, music, fx.a, D, 'sound83.wav', music_db=-3, fx_db=-5)
print('ok')
