# 78. Turtle Theory (v3) — separated voice + score: a shark lunge hit at frame 0 (dissonant brass + sub) that the turtle shrugs off,
# then a calm ocean score (warm pads, gentle piano, celesta glints) with bubbles; storm swell on "chaos", calm on "calm",
# strings rise from "speed means nothing", a pressure gauge bursts and a choir resolves on "outlast pressure".
import numpy as np
from score import *
from voedit import load
D = 35.4
voice = load('/home/claude/sep/s09.voice.wav')
M = Part('m', D, -3).prog(0, 0).prog(1, 89).prog(2, 94).prog(3, 8).prog(4, 61).prog(5, 49).prog(6, 52)
for nn in [midi('C2'), midi('C#3'), midi('G3'), midi('F#4')]: M.note(0.0, 4, nn, 120, 0.7)
prog = ['Dmaj7', 'Bm7', 'Gmaj7', 'A']
CH.update({'Dmaj7': ('D3', [0, 4, 7, 11]), 'Bm7': ('B2', [0, 3, 7, 10]), 'Gmaj7': ('G2', [0, 4, 7, 11]), 'A': ('A2', [0, 4, 7]), 'Em7': ('E3', [0, 3, 7, 10])})
bpm = 76; bar = 60 / bpm * 4
pad(M, 1, 1.0, 12.2, bpm, prog, 64, beats=4, oct_=1, swell=(50, 100)); pad(M, 2, 2.6, 12.2, bpm, prog, 48, beats=4, oct_=1)
piano_arp(M, 0, 2.6, 12.2, bpm, prog, vel=50)
pad(M, 5, 12.2, 13.9, 120, ['Bm7', 'Em7'], 85, beats=2, oct_=0, swell=(70, 127))                     # chaos swell
pad(M, 1, 13.9, 19.4, bpm, ['Dmaj7', 'Gmaj7'], 66, beats=4, oct_=1); piano_arp(M, 0, 14.2, 19.4, bpm, ['Dmaj7', 'Gmaj7', 'Bm7', 'A'], vel=54)
for k, t in enumerate(np.arange(1.0, D - 0.5, 1.7)): M.note(t + 0.3 * (k % 3), 3, midi('A6') + [0, 2, 4, 7, 9][k % 5], 50, 0.6)
pad(M, 5, 19.4, 31.4, bpm, ['Gmaj7', 'A', 'Bm7', 'A'], 70, beats=4, oct_=1, swell=(50, 115)); piano_arp(M, 0, 19.4, 31.4, bpm * 1.1, ['Gmaj7', 'A', 'Bm7', 'A'], vel=56)
pad(M, 6, 31.4, D - 0.3, 60, ['Gmaj7', 'Dmaj7'], 72, beats=4, oct_=1, swell=(50, 120)); pad(M, 1, 31.4, D - 0.3, 60, ['Gmaj7', 'Dmaj7'], 70, beats=4, oct_=1)
for nn in chord_notes('Dmaj7', 1) + [midi('A5')]: M.note(33.4, 6, nn, 110, 2.0); M.note(33.4, 5, nn, 100, 2.0)
Dr = Part('dr', D, -2).prog(9, 0, 128)
drums(Dr, 9, 19.4, 31.4, bpm * 1.1, 'half', 70); Dr.note(33.4, 9, GM['crash'], 105, 1.6)
music = reverb(M.render(), 0.35, 3.0, 0.7) + Dr.render() * 0.8
music = lp(music, 5200, 1)
fx = FX(D)
fx.impact(0.0, 1.1, 40, 1.4); fx.subdrop(0.05, 0.9); fx.whoosh(0.4, 0.8, 0.6, 200, 2000, False); fx.ding(0.95, 1318.5, 0.18, 0.5)   # shark… blink
for i in range(40): fx.pop(0.6 + i * 0.83 + 0.2 * np.sin(i), 700 + 300 * ((i * 7) % 5), 0.06)
for ts in (2.6, 4.45, 6.3, 8.8, 12.2, 15.6, 19.4, 23.8, 28.7, 31.4): fx.whoosh(ts, 0.35, 0.35, 400, 4000)
for i in range(4): fx.ding(8.8 + i / 0.9, 659.25 * 2 ** (i / 6), 0.15, 0.4)
fx.impact(12.64, 0.9, 45, 1.2); fx.scrape(12.2, 1.7, 0.12)
fx.ding(14.24, 1046.5, 0.2, 1.4)
fx.scrape(17.0, 2.4, 0.05); fx.ding(18.24, 1318.5, 0.22, 0.9)
fx.shatter(20.64, 0.35)
for i in range(9): fx.pop(21.0 + i / 6, 400, 0.12)
for i in range(7): fx.thud(23.85 + i * 0.18, 0.2)
fx.thud(25.2, 0.45)
for i in range(4): fx.tick(27.1 + i * 0.4, 0.2, 2400)
for i in range(3): fx.ding(29.5 + i * 0.6, 987.8 + 60 * i, 0.15, 0.3)
fx.riser(32.76, 1.3, 0.3); fx.shatter(32.76, 0.6); fx.impact(32.76, 0.8, 50, 0.8)
fx.chime(33.4, gain=0.22)
master(voice, music, fx.a, D, 'sound78.wav', music_db=-12, fx_db=-8)
print('ok')
