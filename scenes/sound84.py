# 84. The 2-Minute Rule (v3 original, no voice) — a phone buzz slams in over a sleepy lo-fi couch loop, swipe, a red X on the hour,
# a timer beep and a fast tick-tock groove as he gets up, shoes on, door, jogging footsteps; DING at 0:00 and a held breath on
# "stop?"… then the drop: drums, bass and brass while the stopwatch races, a riser into the end card.
import numpy as np
from score import *
D = 15.0
voice = np.zeros(int(D * SR))
M = Part('m', D, -3).prog(0, 4).prog(1, 38).prog(2, 48).prog(3, 61).prog(4, 0).prog(5, 89).prog(6, 81).prog(7, 0)
# 0–4.0 sleepy lo-fi EP
for k, (t, ch) in enumerate([(0.1, 'Fmaj7' if 'Fmaj7' in CH else 'F'), (1.4, 'Em' if 'Em' in CH else 'C'), (2.7, 'Dm'), (3.4, 'G')]):
    for nn in chord_notes(ch, 0): M.note(t, 0, nn, 58, 1.2)
# 4.0–8.2 tick-tock build: pizz on the beat, bass
bpm = 110; b = 60 / bpm
for k, t in enumerate(np.arange(4.0, 8.15, b / 2)):
    ch = ['C', 'G', 'Am', 'F'][int((t - 4.0) // (2 * b)) % 4]; M.note(t, 4, chord_notes(ch, 1)[k % 3], 88, b / 2)
    if k % 2 == 0: M.note(t, 1, chord_notes(ch, -1)[0], 92, b / 2)
pad(M, 2, 5.9, 8.2, bpm, ['F', 'G'], 60, beats=4, oct_=1, swell=(40, 90))
# 8.2–9.2 the held breath: one pad note
M.note(8.25, 5, midi('E4'), 60, 0.95); M.note(8.25, 5, midi('B3'), 55, 0.95)
# 9.2 drop
bassline(M, 1, 9.2, 13.2, bpm, ['C', 'G', 'Am', 'F'], vel=108, pattern=(0, 0, 12, 0), beats=1)
pad(M, 2, 9.2, 13.2, bpm, ['C', 'G', 'Am', 'F'], 74, beats=4, oct_=1, swell=(60, 110))
for nn in chord_notes('C', 1) + [midi('C3')]: M.note(9.2, 3, nn, 122, 0.6)
lead = [(9.5, 'E5'), (9.77, 'G5'), (10.05, 'A5'), (10.6, 'G5'), (11.15, 'E5'), (11.42, 'G5'), (11.7, 'C6'), (12.25, 'B5')]
for t, n in lead: M.note(t, 6, midi(n), 82, 0.3)
for nn in chord_notes('C', 1) + [midi('C3'), midi('G5')]: M.note(13.2, 2, nn, 108, 1.7); M.note(13.2, 3, nn, 112, 0.7)
for nn in chord_notes('C', 0) + [midi('E5')]: M.note(13.2, 7, nn, 80, 1.7)
Dr = Part('dr', D, -2).prog(9, 0, 128).prog(8, 116)
drums(Dr, 9, 0.1, 4.0, 72, 'half', 50)
drums(Dr, 9, 4.0, 8.2, bpm, 'pulse', 78)
drums(Dr, 9, 9.2, 13.2, bpm, 'pop', 108, fill_at=12.9)
for t in (9.2, 13.2): Dr.note(t, 9, GM['crash'], 120, 1.5)
Dr.note(9.2, 8, midi('C2'), 127, 0.6)
music = reverb(M.render(), 0.22, 1.8, 0.5) + Dr.render()
fx = FX(D)
# restrained, cinematic SFX only (user, Nov 4: "ease off on the corny sound effects")
for burst_t in (0.05, 0.55, 1.05):                                                 # a real phone vibration, low and quiet
    for i in range(10): fx.pop(burst_t + i * 0.025, 140 + 20 * (i % 2), 0.08)
fx.impact(0.05, 0.5, 55, 0.5, 0.4)
fx.whoosh(1.6, 0.3, 0.25, 600, 7000)
fx.swish(3.15, 0.15)
fx.ding(4.0, 1568, 0.08, 0.4)                                                      # one soft timer beep
for i, t in enumerate(np.arange(4.3, 8.2, 0.5)): fx.tick(t, 0.06, 2200)
fx.scrape(6.6, 0.5, 0.06); fx.whoosh(7.4, 0.3, 0.2, 600, 6000)
for t in np.arange(7.7, 8.2, 0.33): fx.thud(t, 0.15)
fx.ding(8.2, 1318.5, 0.12, 1.0)                                                    # the timer runs out
fx.riser(9.2, 0.6, 0.25); fx.impact(9.2, 1.1, 38, 1.4, 0.6); fx.subdrop(9.2, 0.7)
for t in np.arange(9.4, 13.1, 0.27): fx.thud(t, 0.1)
fx.riser(13.2, 2.0, 0.2); fx.impact(13.2, 0.7, 44, 1.2, 0.6)
master(voice, music, fx.a, D, 'sound84.wav', music_db=-3, fx_db=-8)
print('ok')
