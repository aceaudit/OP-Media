# 74. Lazy vs Winners (v3) — separated voice + score: lazy lo-fi (electric piano, soft kit) → whip + drop on "But winners"
# (808 trap kit, bass, brass stabs) → heartbeat tension on "still worry" → scoreboard hit with applause.
import numpy as np
from score import *
from voedit import load
D = 11.2; T_SWAP, T_POSS, T_WORRY, T_END = 4.48, 5.92, 7.04, 8.95
voice = load('/home/claude/sep/s05.voice.wav')
bpm_l = 78; prog_l = ['Fmaj7', 'Em', 'Dm7', 'Cadd9']
Lz = Part('lofi', D, -4).prog(0, 4).prog(1, 89).prog(9, 0, 128)
piano_chords(Lz, 0, 0.0, T_SWAP - 0.05, bpm_l, prog_l, 58, beats=4, oct_=1)
drums(Lz, 9, 0.0, T_SWAP - 0.05, bpm_l, 'half', 70)
bpm = 140; bar = 60 / bpm * 4; prog = ['Am', 'F', 'C', 'G']
Dr = Part('drums', D, -1).prog(9, 25, 128)
drums(Dr, 9, T_SWAP + 0.1, T_WORRY, bpm, 'trap', 110); drums(Dr, 9, T_WORRY, T_END - 0.05, bpm, 'half', 80); drums(Dr, 9, T_END + 0.3, D - 0.2, bpm, 'trap', 112)
for t in (T_SWAP + 0.1, T_POSS, T_END + 0.3): Dr.note(t, 9, GM['crash'], 120, 1.5); Dr.note(t, 9, GM['kick'], 127, 0.4)
B = Part('bass', D, -2).prog(2, 38)
for k, t in enumerate(np.arange(T_SWAP + 0.1, D - 0.2, bar / 2)):
    if T_WORRY < t < T_END + 0.2: continue
    B.note(t, 2, chord_notes(prog[int(k // 2) % 4], -1)[0], 115, bar / 2 * 0.9)
Kx = Part('keys', D, -3).prog(3, 0).prog(4, 61).prog(5, 49).prog(6, 126)
for k, t in enumerate(np.arange(T_SWAP + 0.1, T_WORRY, bar / 4)):
    for nn in chord_notes(prog[int(k // 4) % 4], 1): Kx.note(t, 3, nn, 90 if k % 2 == 0 else 66, 0.16)
for ts in (T_SWAP + 0.1, T_POSS): [Kx.note(ts, 4, nn, 122, 0.45) for nn in chord_notes('Am', 0)]
pad(Kx, 5, T_WORRY, T_END - 0.05, 60, ['Dm'], 60, beats=4, oct_=1, swell=(50, 110))
for nn in chord_notes('C', 1) + [midi('G4')]: Kx.note(T_END + 0.3, 4, nn, 125, 1.0); Kx.note(T_END + 0.3, 5, nn, 100, 1.8)
Kx.note(T_END + 0.35, 6, 60, 100, 1.6)                                          # applause on the reveal
music = Lz.render() * 0.9 + Dr.render() + B.render() + reverb(Kx.render(), 0.22, 2.0, 0.5)
fx = FX(D)
fx.impact(0.0, 0.7, 50, 0.8); fx.whoosh(1.15, 0.4, 0.6, 300, 6000, False)
for r in (1.4, 2.0): fx.thud(r + 0.5, 0.35)
fx.thud(2.55, 0.6)                                                               # lazy flops
fx.ding(2.9, 1318.5, 0.3, 0.9); fx.ding(2.95, 1760, 0.2, 0.9)                     # trophy dream
fx.record_scratch(T_SWAP - 0.05, 0.6); fx.whoosh(T_SWAP + 0.05, 0.3, 0.8, 500, 9000)
fx.impact(T_SWAP + 0.1, 1.0, 44, 1.0); fx.subdrop(T_SWAP + 0.1, 0.9)
rep = []; tt = 0.15
while tt < T_END:
    rep.append(tt); rate = 1.6 if tt < T_SWAP else min(3.4, 1.6 + (tt - T_SWAP) * 1.0); tt += 1 / rate
for r in rep:
    if r > T_SWAP: fx.thud(r + 0.3, 0.22); fx.tick(r + 0.32, 0.12, 2400)
fx.impact(T_POSS, 0.9, 50, 0.8)
for k in range(5): fx.heartbeat(T_WORRY + k * 0.9, 0.7)
fx.riser(T_END + 0.3, 1.0, 0.45); fx.impact(T_END + 0.3, 1.1, 42, 1.4); fx.subdrop(T_END + 0.3, 0.9); fx.chime(T_END + 0.35, gain=0.25)
master(voice, music, fx.a, D, 'sound74.wav', music_db=-12, fx_db=-7)
print('ok')
