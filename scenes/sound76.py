# 76. The Work You're Avoiding (v3) — cold open: the rock bursting (choir + brass hit) → tape rewind → the story: tense low strings
# while he digs, a light hum when the rock glows on "work", each pickaxe swing a taiko hit, a build through the second quote,
# a huge choir/brass drop when it breaks open.
import numpy as np
from score import *
from voedit import load
FF = 1.3; D = 11.6 + FF
x = load('/home/claude/sep/s07.voice.wav'); SRr = 48000
a = x[:int(5.75 * SRr)].copy(); b = x[int(7.62 * SRr):].copy()
a[-int(0.06 * SRr):] *= np.linspace(1, 0, int(0.06 * SRr)); b[:int(0.08 * SRr)] *= np.linspace(0, 1, int(0.08 * SRr))
voice = np.zeros(int(D * SR)); voice[int(FF * SR):int(FF * SR) + len(a)] = a; i0 = int((FF + 6.85) * SR); voice[i0:i0 + len(b)] = b[:len(voice) - i0]
HITS = [6.0, 6.45, 6.9, 7.4, 7.9, 8.35, 8.83, 9.23]; T_BREAK = 9.23; T_LIGHT = 4.88
S = lambda tt: FF + tt
M = Part('m', D, -3).prog(0, 48).prog(1, 52).prog(2, 61).prog(3, 42).prog(4, 47).prog(5, 91)
for nn in chord_notes('C', 1) + [midi('G4'), midi('E5')]: M.note(0.0, 1, nn, 110, 0.8); M.note(0.0, 2, nn, 118, 0.6)
for k, t in enumerate(np.arange(S(0.1), S(4.85), 0.25)): M.note(t, 3, [midi('A2'), midi('A2'), midi('C3'), midi('B2')][k % 4], 70 + (k % 2) * 10, 0.22)   # cello ostinato
pad(M, 0, S(2.8), S(4.85), 60, ['Am'], 52, beats=4, oct_=1, swell=(40, 90))
for nn in chord_notes('Am', 1): M.note(S(T_LIGHT), 5, nn, 90, 1.0)
for nn in chord_notes('Am', 0): M.note(S(T_LIGHT), 2, nn, 115, 0.4)
for k, t in enumerate(np.arange(S(6.85), S(T_BREAK), 0.25)): M.note(t, 3, [midi('A2'), midi('C3'), midi('E3'), midi('F3')][k % 4] + (k // 8) * 2, 80 + k, 0.22)
pad(M, 0, S(6.85), S(T_BREAK), 60, ['Am', 'F'], 70, beats=2, oct_=1, swell=(50, 125))
for nn in chord_notes('C', 1) + [midi('C5'), midi('G4'), midi('E5')]: M.note(S(T_BREAK), 1, nn, 120, 2.6); M.note(S(T_BREAK), 2, nn, 125, 1.4); M.note(S(T_BREAK), 0, nn, 110, 2.8)
M.note(S(T_BREAK), 4, midi('C3'), 127, 1.5)
Dr = Part('dr', D, -1).prog(8, 116).prog(9, 48, 128)
for h in HITS: Dr.note(S(h), 8, midi('C3'), 127 if h == T_BREAK else 110, 0.4)
for t in (0.0, S(T_BREAK)): Dr.note(t, 9, GM['crash'], 120, 1.6)
music = reverb(M.render(), 0.3, 2.6, 0.6) + Dr.render()
fx = FX(D)
fx.impact(0.0, 1.1, 42, 1.2); fx.shatter(0.02, 0.6); fx.chime(0.05, gain=0.2)
fx.rewind(0.8, FF - 0.8, 0.6); fx.tape_stop(FF - 0.2, 0.2, 0.3)
for h0, h1 in ((0.1, 0.75), (0.8, 1.5), (1.55, 2.25), (2.3, 2.75)):
    for k in range(int((h1 - h0) / 0.35) + 1): fx.scrape(S(h0 + k * 0.35), 0.2, 0.18)
    fx.pop(S(h1), 520, 0.25)
for i in range(3): fx.ding(S(2.96 + i * 0.07), 1568 + 200 * i, 0.12, 0.25)
fx.ding(S(T_LIGHT), 659.3, 0.3, 1.6); fx.whoosh(S(5.2), 0.3, 0.4)
for i, h in enumerate(HITS[:-1]): fx.impact(S(h), 0.55 + 0.04 * i, 160, 0.25, 1.5); fx.tick(S(h), 0.3, 2600)
fx.riser(S(T_BREAK), 1.2, 0.45); fx.impact(S(T_BREAK), 1.3, 40, 1.6); fx.subdrop(S(T_BREAK), 1.0); fx.shatter(S(T_BREAK) + 0.02, 0.7); fx.chime(S(T_BREAK) + 0.05, gain=0.25)
master(voice, music, fx.a, D, 'sound76.wav', music_db=-12, fx_db=-7)
print('ok')
