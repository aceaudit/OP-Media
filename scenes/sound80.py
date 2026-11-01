# 80. Me vs Me (v3) — separated voice + score: starting pistol → driving race beat → breakdown on "the only rival" (pad, heartbeat)
# → rising hits on grown / learned / improved → VS slam drop on "versus" → slow-motion photo finish → big hit.
import numpy as np
from score import *
from voedit import load
D = 20.0; T_VS, SLOW0, T_FIN = 16.32, 17.9, 18.35
voice = load('/home/claude/sep/s11.voice.wav')
bpm = 128; bar = 60 / bpm * 4; prog = ['Am', 'F', 'C', 'G']
Dr = Part('drums', D, -1).prog(9, 25, 128)
drums(Dr, 9, 0.0, 3.9, bpm, 'pop', 108); drums(Dr, 9, 7.9, 13.8, bpm, 'pulse', 90); drums(Dr, 9, T_VS, SLOW0, bpm, 'trap', 112); drums(Dr, 9, T_FIN, D - 0.4, bpm, 'pop', 112)
for t in (0.0, 7.9, T_VS, T_FIN): Dr.note(t, 9, GM['crash'], 120, 1.5)
B = Part('bass', D, -2).prog(2, 38)
for a, b in ((0.0, 3.9), (10.1, 13.8), (T_VS, SLOW0), (T_FIN, D - 0.4)):
    for k, t in enumerate(np.arange(a, b, bar / 2)): B.note(t, 2, chord_notes(prog[int(k // 2) % 4], -1)[0], 110, bar / 2 * 0.9)
Kx = Part('keys', D, -3).prog(3, 0).prog(4, 61).prog(5, 49).prog(6, 52).prog(7, 47)
for a, b in ((0.0, 3.9), (T_VS, SLOW0), (T_FIN, D - 0.4)):
    for k, t in enumerate(np.arange(a, b, bar / 4)): [Kx.note(t, 3, nn, 88 if k % 2 == 0 else 64, 0.16) for nn in chord_notes(prog[int(k // 4) % 4], 1)]
pad(Kx, 5, 3.95, 10.1, 64, ['Am', 'F'], 62, beats=4, oct_=1, swell=(40, 100))
piano_arp(Kx, 3, 7.9, 13.8, 96, ['Am', 'F', 'C', 'G'], vel=58)
for ts, c in ((10.56, 'F'), (11.68, 'C'), (12.88, 'G')): [Kx.note(ts + 0.4, 4, nn, 110, 0.5) for nn in chord_notes(c, 0)]
pad(Kx, 6, 13.8, 15.5, 60, ['F'], 70, beats=4, oct_=1, swell=(60, 120))
for nn in chord_notes('Am', 0) + [midi('E4')]: Kx.note(T_VS, 4, nn, 125, 0.6)
for i in range(9): Kx.note(SLOW0 + i * 0.05, 7, midi('A2'), 70 + i * 6, 0.2)
for nn in chord_notes('C', 1) + [midi('G4')]: Kx.note(T_FIN, 4, nn, 125, 1.0); Kx.note(T_FIN, 6, nn, 110, 1.6)
music = Dr.render() + B.render() + reverb(Kx.render(), 0.25, 2.2, 0.5)
m_lp = lp(music, 450, 2); tt = np.arange(len(music)) / SR; w = np.clip((tt - SLOW0) / 0.1, 0, 1) * np.clip((T_FIN - tt) / 0.05, 0, 1)
music = music * (1 - w[:, None]) + m_lp * w[:, None] * 1.4
fx = FX(D)
fx.impact(0.0, 1.2, 70, 0.5, 2.0)                                                     # starting pistol
for i in range(18): fx.thud(0.15 + i * 0.21, 0.18)
fx.whoosh(2.8, 0.6, 0.5, 4000, 300, False); fx.ding(3.0, 1046.5, 0.25, 0.8)
for a in (3.95, 7.9, 10.1, 13.8, 15.5, 17.15): fx.whoosh(a, 0.3, 0.5, 600, 8000)
for k in range(3): fx.heartbeat(5.0 + k * 0.85, 0.5)
fx.ding(7.04, 1318.5, 0.28, 0.6); fx.ding(9.6, 987.8, 0.22, 0.8)
for ts in (10.56, 11.68, 12.88): fx.impact(ts + 0.4, 0.45, 70, 0.4)
fx.impact(14.88, 0.6, 55, 0.7)
fx.riser(T_VS, 1.0, 0.45); fx.impact(T_VS, 1.2, 42, 1.4); fx.subdrop(T_VS, 1.0)
fx.whoosh(SLOW0 + 0.05, 0.5, 0.5, 3000, 200, False); fx.riser(T_FIN, 0.45, 0.4)
fx.shutter(T_FIN, 0.6); fx.impact(T_FIN, 1.2, 40, 1.6); fx.subdrop(T_FIN, 1.0); fx.chime(T_FIN + 0.05, gain=0.28)
master(voice, music, fx.a, D, 'sound80.wav', music_db=-12, fx_db=-7)
print('ok')
