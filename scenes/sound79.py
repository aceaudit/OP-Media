# 79. Painful Story (v3) — separated voice + score: triumphant brass/choir chord on the frame-0 win → tape-stop rewind into a sad
# solo piano in the valley with rain → strings rise as the line climbs → quiet on "accept the pain" → riser + timpani on
# "get ready" → epic drop on "success" (taiko, brass, choir) as he runs the climb → hit at the top.
import numpy as np
from score import *
from voedit import load
D = 13.2
voice = load('/home/claude/sep/s10.voice.wav')
E = Part('epic', D, -3).prog(0, 61).prog(1, 52).prog(2, 48).prog(3, 0).prog(4, 47).prog(5, 49)
for nn in chord_notes('C', 1) + [midi('G4'), midi('C5')]: E.note(0.0, 0, nn, 112, 1.9); E.note(0.0, 1, nn, 100, 2.0)
piano_arp(E, 3, 2.6, 7.4, 84, ['Am', 'F', 'Dm', 'E'], vel=56)
pad(E, 5, 5.5, 7.4, 84, ['F', 'G'], 66, beats=2, oct_=1, swell=(40, 110))
for nn in chord_notes('Am', 1): E.note(7.5, 3, nn, 50, 1.6)
for i in range(18): E.note(9.28 + i * 0.05, 4, midi('A2'), 60 + i * 3, 0.15)
bpm = 120; bar = 2.0
for k, t in enumerate(np.arange(10.24, D - 0.2, bar)):
    c = ['F', 'G', 'C'][k % 3]
    for nn in chord_notes(c, 1): E.note(t, 0, nn, 118, bar * 0.95); E.note(t, 1, nn, 104, bar); E.note(t, 2, nn, 100, bar)
for nn in chord_notes('C', 1) + [midi('C5'), midi('E5')]: E.note(11.25, 0, nn, 125, 1.9); E.note(11.25, 1, nn, 112, 1.9)
E.note(11.25, 4, midi('C3'), 127, 1.5)
Dr = Part('drums', D, -1).prog(9, 48, 128).prog(8, 116)
for k, t in enumerate(np.arange(10.24, D - 0.3, 60 / bpm / 2)):
    Dr.note(t, 8, midi('C3') if k % 4 == 0 else midi('G3'), 120 if k % 4 == 0 else 85, 0.3)
for t in (0.0, 10.24, 11.25): Dr.note(t, 9, GM['crash'], 120, 1.5)
music = reverb(E.render(), 0.3, 2.6, 0.6) + Dr.render()
fx = FX(D)
fx.impact(0.0, 0.6, 50, 0.8)
fx.rewind(2.0, 0.65, 0.6); fx.tape_stop(2.0, 0.4, 0.4); fx.whoosh(2.4, 0.5, 0.5, 400, 3000, False)
fx.scrape(5.2, 3.1, 0.06)                                                                 # rain bed
fx.riser(6.64, 1.0, 0.25); fx.ding(6.64, 1318.5, 0.25, 0.8)
fx.ding(8.32, 659.3, 0.2, 1.4)
fx.riser(10.24, 0.95, 0.5); fx.impact(10.24, 1.0, 44, 1.0); fx.subdrop(10.24, 0.8)
for i in range(6): fx.thud(10.3 + i * 0.16, 0.25)
fx.impact(11.25, 1.2, 40, 1.6); fx.subdrop(11.25, 1.0); fx.chime(11.3, gain=0.26)
master(voice, music, fx.a, D, 'sound79.wav', music_db=-12, fx_db=-7)
print('ok')
