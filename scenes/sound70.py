# 70. Two Choices (v3) — separated voice + our score: alarm shock open → music-box lullaby while he snoozes → record scratch
# on "or" → beat drops on "wake" (808 kit, bass, piano + brass stabs) → slow-mo muffle on the leap → full hit with choir on the catch.
import numpy as np
from score import *
from voedit import load
D = 10.4
T_OR, T_EYE, T_WAKE, T_UP, T_LEAP, T_CATCH = 4.88, 4.98, 5.12, 5.32, 7.72, 8.25
voice = load('/home/claude/sep/s01.voice.wav')
# ---- lullaby (music box + warm pad), 1.0 → 4.86
L = Part('lull', D, -3).prog(0, 10).prog(1, 89)
mel = ['E5', 'G5', 'C6', 'G5', 'A5', 'G5', 'E5', 'D5', 'E5', 'G5', 'A5', 'C6', 'B5', 'G5', 'D5', 'G5']
for i, n in enumerate(mel):
    t = 1.0 + i * 0.24
    if t < T_OR - 0.05: L.note(t, 0, midi(n), 70 - (i % 2) * 8, 0.5)
for t, c in ((1.0, 'C'), (2.92, 'Am')): pad(L, 1, t, min(t + 1.92, T_OR - 0.02), 125, [c], 55, beats=4, oct_=1)
# ---- the drop (808 kit, bass, piano stabs, brass), from "wake"
bpm = 140; bar = 60 / bpm * 4; prog = ['Am', 'F', 'C', 'G']
Dr = Part('drums', D, -1).prog(9, 25, 128)
drums(Dr, 9, T_WAKE, T_LEAP, bpm, 'trap', 108)
drums(Dr, 9, T_CATCH, D - 0.3, bpm, 'trap', 112)
for t in (T_WAKE, T_CATCH): Dr.note(t, 9, GM['crash'], 120, 1.5); Dr.note(t, 9, GM['kick'], 127, 0.4)
B = Part('bass', D, -2).prog(2, 38)
for k, t in enumerate(np.arange(T_WAKE, D - 0.3, bar / 2)):
    if T_LEAP - 0.02 < t < T_CATCH - 0.02: continue
    B.note(t, 2, chord_notes(prog[int(k // 2) % 4], -1)[0], 112, bar / 2 * 0.9)
Kx = Part('keys', D, -3).prog(3, 0).prog(4, 61).prog(5, 52).prog(6, 48).prog(7, 47)
for k, t in enumerate(np.arange(T_WAKE, D - 0.3, bar / 4)):
    if T_LEAP - 0.02 < t < T_CATCH - 0.02: continue
    c = prog[int(k // 4) % 4]
    for j, nn in enumerate(chord_notes(c, 1)): Kx.note(t, 3, nn, 86 if k % 2 == 0 else 64, 0.18)
for nn in chord_notes('Am', 0): Kx.note(T_WAKE, 4, nn, 120, 0.5)
for nn in chord_notes('C', 1) + [midi('C4'), midi('G4')]: Kx.note(T_CATCH, 4, nn, 125, 0.9); Kx.note(T_CATCH, 5, nn, 110, 2.1); Kx.note(T_CATCH, 6, nn, 105, 2.1)
for i in range(10): Kx.note(T_LEAP + i * 0.05, 7, midi('A2'), 70 + i * 5, 0.2)       # timpani roll into the catch
Kx.note(T_CATCH, 7, midi('C3'), 127, 1.5)
music = reverb(L.render(), 0.45, 3.0, 0.8) + Dr.render() + B.render() + reverb(Kx.render(), 0.25, 2.2, 0.5)
# slow-mo muffle: crossfade to a low-passed copy during the leap
m_lp = lp(music, 500, 2); w = np.clip((np.arange(len(music)) / SR - T_LEAP) / 0.12, 0, 1) * np.clip((T_CATCH - np.arange(len(music)) / SR) / 0.05, 0, 1)
music = music * (1 - w[:, None]) + m_lp * w[:, None] * 1.4
# ---- SFX
fx = FX(D)
for i in range(int(0.95 / 0.055)): fx.ding(i * 0.055, 2093 if i % 2 else 1760, 0.22 * (1 if i < 12 else 0.5), 0.05)   # alarm bell
fx.impact(0.0, 1.0, 46, 1.0); fx.subdrop(0.0, 0.8)
fx.whoosh(1.0, 0.5, 0.7, 300, 5000, False)
fx.pop(1.92, 700, 0.5); fx.pop(2.16, 900, 0.5)
for i in range(20): fx.tick(3.15 + i * 0.08, 0.25)
fx.record_scratch(T_OR, 0.9); fx.tape_stop(T_OR, 0.3, 0.4)
fx.ding(T_EYE, 2637, 0.35, 0.6); fx.swish(T_EYE, 0.5)
fx.riser(T_WAKE, 0.25, 0.4); fx.impact(T_WAKE, 1.0, 44, 1.2); fx.subdrop(T_WAKE, 0.9)
fx.whoosh(T_UP, 0.35, 0.6, 600, 8000)
for i in range(10): fx.thud(5.75 + i * 0.2, 0.25)
fx.riser(T_CATCH, 1.3, 0.5); fx.whoosh(T_LEAP + 0.05, 0.6, 0.6, 2000, 200, False)
fx.impact(T_CATCH, 1.2, 40, 1.6); fx.subdrop(T_CATCH, 1.0); fx.chime(T_CATCH + 0.05, gain=0.28)
for k in range(10): fx.ding(T_CATCH + 0.1 + k * 0.06, 3000 + 300 * k, 0.05, 0.3)
master(voice, music, fx.a, D, 'sound70.wav', music_db=-12, fx_db=-7)
print('ok')
