# 81. Restart (v3) — separated voice + an 8-bit game score: GAME OVER sting + glitch → power-up on RESTART → chiptune beat for the
# attempts (boing on every fail, coin on the landing) → calm build on the blueprint → heartbeat tension at GIVE UP → drop on "up".
import numpy as np
from score import *
from voedit import load
D = 14.6
voice = load('/home/claude/sep/s12.voice.wav')
G = Part('game', D, -4).prog(0, 80).prog(1, 81).prog(2, 38).prog(3, 89).prog(4, 61).prog(5, 52)
for i, n in enumerate(['G4', 'F#4', 'F4', 'E4']): G.note(0.0 + i * 0.12, 0, midi(n), 95, 0.12 if i < 3 else 0.5)     # game over sting
for i, n in enumerate(['C5', 'E5', 'G5', 'C6', 'E6', 'G6']): G.note(0.22 + i * 0.045, 0, midi(n), 92, 0.08)          # power-up
for i, n in enumerate(['A4', 'C5', 'E5', 'A5']): G.note(1.3 + i * 0.1, 1, midi(n), 80, 0.12)
bpm = 150; bar = 60 / bpm * 4; prog = ['Am', 'F', 'C', 'G']
for k, t in enumerate(np.arange(3.6, 5.85, 60 / bpm / 2)): G.note(t, 2, chord_notes(prog[int(k // 8) % 4], -1)[0] + (12 if k % 2 else 0), 100, 0.18)
for k, t in enumerate(np.arange(3.6, 5.85, 60 / bpm / 4)):
    c = chord_notes(prog[int(k // 16) % 4], 2); G.note(t, 0, c[k % 3], 60, 0.08)
ATT = [(3.65, False), (4.05, False), (4.4, False), (4.7, False), (5.0, True)]
for t0, ok in ATT:
    if ok: [G.note(t0 + 0.55 + j * 0.07, 1, midi(n), 100, 0.15) for j, n in enumerate(['B5', 'E6'])]
    else: [G.note(t0 + 0.55 + j * 0.06, 1, midi(n), 85, 0.07) for j, n in enumerate(['E5', 'C5', 'A4', 'E4'])]
pad(G, 3, 5.9, 9.0, 80, ['Fmaj7', 'Cadd9'], 62, beats=4, oct_=1, swell=(50, 105))
for k, t in enumerate(np.arange(5.9, 9.0, 60 / 120 / 2)): G.note(t, 1, chord_notes(['Fmaj7', 'Cadd9'][int(k // 8) % 2], 2)[k % 4], 55, 0.12)
pad(G, 3, 9.0, 11.5, 60, ['Am'], 50, beats=4, oct_=0)
for k, t in enumerate(np.arange(12.24, D - 0.2, bar / 2)): G.note(t, 2, chord_notes(prog[int(k // 2) % 4], -1)[0], 112, bar / 2 * 0.9)
for k, t in enumerate(np.arange(12.24, D - 0.2, 60 / bpm / 4)): c = chord_notes(prog[int(k // 16) % 4], 2); G.note(t, 0, c[k % 3], 72, 0.08)
for nn in chord_notes('Am', 1) + [midi('E4')]: G.note(12.24, 4, nn, 122, 0.7); G.note(12.24, 5, nn, 105, 2.2)
Dr = Part('drums', D, -1).prog(9, 25, 128)
drums(Dr, 9, 3.6, 5.85, bpm, 'pop', 100); drums(Dr, 9, 5.9, 9.0, 120, 'pulse', 80); drums(Dr, 9, 12.24, D - 0.2, bpm, 'pop', 112)
for t in (3.6, 12.24): Dr.note(t, 9, GM['crash'], 118, 1.2)
music = reverb(G.render(), 0.2, 1.8, 0.4) + Dr.render()
fx = FX(D)
fx.glitch(0.0, 0.45, 0.6); fx.impact(0.0, 0.8, 50, 0.8)
fx.tick(0.12, 0.5, 1800); fx.impact(0.2, 0.6, 60, 0.6)
for a in (1.25, 2.4, 3.6, 5.9, 9.0): fx.whoosh(a, 0.3, 0.6, 600, 8000)
fx.riser(1.9, 0.6, 0.3); fx.ding(1.9, 1760, 0.3, 0.5)
fx.tick(2.5, 0.4, 2600); fx.tick(2.62, 0.4, 2600); fx.ding(2.75, 2093, 0.35, 0.5); fx.shutter(2.64, 0.4)
for t0, ok in ATT:
    fx.swish(t0 + 0.27, 0.35)
    if not ok: fx.thud(t0 + 0.62, 0.35)
fx.ding(7.6, 1318.5, 0.25, 1.0)
for k in range(3): fx.heartbeat(9.6 + k * 0.85, 0.6)
fx.riser(12.24, 0.72, 0.5); fx.shatter(12.0, 0.8); fx.whoosh(12.05, 0.35, 0.5, 4000, 300, False)
fx.impact(12.24, 1.2, 42, 1.4); fx.subdrop(12.24, 1.0); fx.chime(12.3, gain=0.25)
for i in range(10): fx.thud(12.4 + i * 0.2, 0.22)
master(voice, music, fx.a, D, 'sound81.wav', music_db=-12, fx_db=-7)
print('ok')
