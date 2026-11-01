# 72. Only Focus (v3) — separated voice + score: notification chaos at frame 0 → everything muffles on "focus" (one heartbeat) →
# a focused piano pulse that builds attempt by attempt (a ding when the circle gets rounder) → the noise crowds back (dissonant
# strings) → glass shatter on "waste" → x50 time-lapse ticking → choir + strings chord on the perfect circle.
import numpy as np
from score import *
from voedit import load
D = 13.7; T_FOCUS, T_PUSH, T_WASTE, T_MONT, T_PERFECT = 0.72, 8.24, 9.68, 10.6, 12.35
voice = load('/home/claude/sep/s03.voice.wav')
AT = [[1.3, 2.85], [3.04, 3.75], [3.85, 4.56], [5.2, 5.8], [5.9, 6.5], [6.6, 7.1], [7.15, 7.7], [8.3, 10.3]]
M = Part('m', D, -3).prog(0, 0).prog(1, 49).prog(2, 52).prog(3, 48).prog(4, 8)
bpm = 100; e8 = 60 / bpm / 2
for k, t in enumerate(np.arange(1.0, T_PUSH, e8)): M.note(t, 0, [midi('A4'), midi('E5'), midi('C5'), midi('E5')][k % 4] + (5 if (k // 16) % 2 else 0), 52 + min(30, k), 0.3)
for k, t in enumerate(np.arange(1.0, T_PUSH, e8 * 8)): M.note(t, 0, [midi('A2'), midi('F2'), midi('C3'), midi('G2')][k % 4], 70, e8 * 8)
pad(M, 1, 3.0, T_PUSH, bpm, ['Am', 'F', 'C', 'G'], 60, beats=4, oct_=1, swell=(40, 100))
for k, t in enumerate(np.arange(T_PUSH, T_WASTE, 0.12)): M.note(t, 3, midi('A3') + (1 if k % 2 else 0), 70 + k * 2, 0.11)   # crowding back: trembling strings
for k, t in enumerate(np.arange(T_MONT, T_PERFECT, 0.08)): M.note(t, 4, chord_notes(['Am', 'F', 'C', 'G'][int(k // 4) % 4], 2)[k % 3], 70, 0.1)
for nn in chord_notes('C', 1) + [midi('E5'), midi('G5')]: M.note(T_PERFECT, 2, nn, 115, 1.4); M.note(T_PERFECT, 3, nn, 110, 1.4)
Dr = Part('dr', D, -2).prog(9, 25, 128)
drums(Dr, 9, 3.0, T_PUSH, bpm, 'pulse', 85); drums(Dr, 9, 5.2, T_PUSH, bpm, 'half', 85); drums(Dr, 9, T_MONT, T_PERFECT, 150, 'pop', 100)
Dr.note(T_PERFECT, 9, GM['crash'], 118, 1.4)
music = reverb(M.render(), 0.26, 2.2, 0.5) + Dr.render()
fx = FX(D)
for i in range(13): fx.ding(i * 0.055, [1318.5, 1760.0, 1174.7, 2093.0][i % 4], 0.12, 0.08)          # notification chatter
fx.glitch(0.0, 0.3, 0.4); fx.impact(T_FOCUS, 1.0, 46, 1.0); fx.heartbeat(T_FOCUS + 0.15, 0.8); fx.whoosh(T_FOCUS, 0.4, 0.5, 6000, 300, False)
for a, b in AT[:7]:
    fx.scrape(a, b - a, 0.06)
for i, (a, b) in enumerate(AT[:7]): fx.ding(b, 659.25 * 2 ** (i / 12 * 2), 0.18, 0.4)
fx.ding(7.76, 1318.5, 0.3, 0.5); fx.ding(7.82, 1760, 0.25, 0.5)
fx.shatter(T_WASTE, 0.9); fx.impact(T_WASTE, 1.0, 50, 1.0)
for i in range(20): fx.tick(T_MONT + i * 0.043, 0.18, 2600)
fx.riser(T_PERFECT, 1.0, 0.4); fx.impact(T_PERFECT, 1.1, 42, 1.4); fx.subdrop(T_PERFECT, 0.9); fx.chime(T_PERFECT + 0.05, gain=0.26)
master(voice, music, fx.a, D, 'sound72.wav', music_db=-12, fx_db=-7)
print('ok')
