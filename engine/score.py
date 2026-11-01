# score.py — Own Pace sound engine v3 (rebuild of 70–81): real-instrument score (GeneralUser GS soundfont via tinysoundfont),
# designed cinematic SFX, and a mix that puts the creator's separated voice on top with the music ducked under it.
import numpy as np, tinysoundfont
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000
SF2 = '/home/claude/sf/GeneralUser-GS.sf2'
_rng = np.random.default_rng(7)
NOTE = {n: i for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}
def midi(n):  # 'A3' → 57
    name, octv = n[:-1], int(n[-1]); return 12 * (octv + 1) + NOTE[name]
# chords as (root midi in octave 3, quality)
CH = {'Am': ('A2', [0, 3, 7]), 'F': ('F2', [0, 4, 7]), 'C': ('C3', [0, 4, 7]), 'G': ('G2', [0, 4, 7]), 'Em': ('E2', [0, 3, 7]), 'Dm': ('D3', [0, 3, 7]),
      'Fmaj7': ('F2', [0, 4, 7, 11]), 'Cadd9': ('C3', [0, 4, 7, 14]), 'Gsus': ('G2', [0, 5, 7]), 'E': ('E2', [0, 4, 7]), 'Bb': ('A#2', [0, 4, 7]), 'Am7': ('A2', [0, 3, 7, 10]),
      'Dm7': ('D3', [0, 3, 7, 10]), 'Esus': ('E2', [0, 5, 7]), 'Ab': ('G#2', [0, 4, 7]), 'Eb': ('D#2', [0, 4, 7]), 'Cm': ('C3', [0, 3, 7]), 'Fm': ('F2', [0, 3, 7]), 'Gm': ('G2', [0, 3, 7])}
def chord_notes(name, octave_shift=0):
    r, iv = CH[name]; base = midi(r) + 12 * octave_shift; return [base + i for i in iv]

def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x, axis=0)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x, axis=0)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)

class Part:
    """one instrument group rendered by its own synth: events are (t, kind, chan, a, b)"""
    def __init__(self, name, dur, gain=0.0):
        self.name, self.dur, self.gain, self.ev, self.progs = name, dur, gain, [], {}
    def prog(self, chan, preset, bank=0): self.progs[chan] = (bank, preset); return self
    def note(self, t, chan, key, vel, d):
        if t >= self.dur or d <= 0: return
        self.ev.append((max(0, t), 1, chan, int(key), int(np.clip(vel, 1, 127)))); self.ev.append((min(self.dur, t + d), 0, chan, int(key), 0))
    def cc(self, t, chan, ctl, val): self.ev.append((t, 2, chan, ctl, int(np.clip(val, 0, 127))))
    def ramp(self, t0, t1, chan, ctl, v0, v1, steps=24):
        for i in range(steps + 1): self.cc(t0 + (t1 - t0) * i / steps, chan, ctl, v0 + (v1 - v0) * i / steps)
    def render(self):
        s = tinysoundfont.Synth(samplerate=SR, gain=self.gain); sf = s.sfload(SF2)
        for ch, (bank, pr) in self.progs.items(): s.program_select(ch, sf, bank, pr, is_drums=(bank == 128))
        n = int(self.dur * SR); out = np.zeros((n, 2), np.float32); pos = 0
        for t, kind, ch, a, b in sorted(self.ev, key=lambda e: (e[0], e[1])):
            i = min(n, int(t * SR))
            if i > pos: out[pos:i] = np.frombuffer(s.generate(i - pos), np.float32).reshape(-1, 2); pos = i
            if kind == 1: s.noteon(ch, a, b)
            elif kind == 0: s.noteoff(ch, a)
            else: s.control_change(ch, a, b)
        if pos < n: out[pos:] = np.frombuffer(s.generate(n - pos), np.float32).reshape(-1, 2)
        return out.astype(float)

# ---------------------------------------------------------------- arrangement helpers (all times in seconds)
def beat_times(t0, t1, bpm, sub=1): step = 60 / bpm / sub; return list(np.arange(t0, t1 - 1e-6, step))
def human(v, a=8): return v + _rng.integers(-a, a + 1)

def piano_arp(P, ch, t0, t1, bpm, prog, pattern=(0, 2, 1, 2, 3, 2, 1, 2), vel=58, oct_=1, bars_per_chord=1):
    step = 60 / bpm / 2; per = 8 * bars_per_chord; i = 0
    for k, t in enumerate(np.arange(t0, t1 - 1e-6, step)):
        c = prog[(k // per) % len(prog)]; ns = chord_notes(c, oct_); ns = ns + [ns[0] + 12, ns[1] + 12]
        P.note(t, ch, ns[pattern[k % len(pattern)] % len(ns)], human(vel - (6 if k % 2 else 0)), step * 2.2)
        if k % per == 0: P.note(t, ch, chord_notes(c, 0)[0], human(vel + 6), step * per * 0.95)   # left hand root
def piano_chords(P, ch, t0, t1, bpm, prog, vel=62, beats=4, oct_=1):
    bar = 60 / bpm * beats
    for k, t in enumerate(np.arange(t0, t1 - 1e-6, bar)):
        c = prog[k % len(prog)]
        for j, nn in enumerate(chord_notes(c, oct_)): P.note(t + j * 0.012, ch, nn, human(vel), bar * 0.98)
        P.note(t, ch, chord_notes(c, -1)[0], human(vel + 4), bar * 0.98)
def pad(P, ch, t0, t1, bpm, prog, vel=70, beats=4, oct_=1, swell=None):
    bar = 60 / bpm * beats
    for k, t in enumerate(np.arange(t0, t1 - 1e-6, bar)):
        for nn in chord_notes(prog[k % len(prog)], oct_): P.note(t, ch, nn, vel, min(bar, t1 - t) + 0.05)
    if swell: P.ramp(t0, t1, ch, 11, swell[0], swell[1])
def bassline(P, ch, t0, t1, bpm, prog, vel=90, pattern=(0,), beats=4, oct_=-1, d=None):
    bar = 60 / bpm * beats
    for k, t in enumerate(np.arange(t0, t1 - 1e-6, bar)):
        root = chord_notes(prog[k % len(prog)], oct_)[0]
        for p in pattern: P.note(t + p * 60 / bpm, ch, root, human(vel, 4), d or 60 / bpm * 0.9)
GM = dict(kick=36, kick2=35, snare=38, clap=39, rim=37, hat=42, ohat=46, pedal=44, crash=49, ride=51, tomL=45, tomM=47, tomH=50, splash=55, china=52, rev=57)
def drums(P, ch, t0, t1, bpm, style='pop', vel=100, fill_at=None):
    sp = 60 / bpm
    for k, t in enumerate(np.arange(t0, t1 - 1e-6, sp / 4)):   # 16th grid
        s16 = k % 16
        if style == 'pop':
            if s16 in (0, 8, 10): P.note(t, ch, GM['kick'], human(vel), 0.2)
            if s16 in (4, 12): P.note(t, ch, GM['snare'], human(vel - 10), 0.2); P.note(t, ch, GM['clap'], human(vel - 30), 0.2)
            if s16 % 2 == 0: P.note(t, ch, GM['hat'], human(vel - 45 + (8 if s16 % 4 == 0 else 0)), 0.1)
        elif style == 'trap':
            if s16 in (0, 6, 10): P.note(t, ch, GM['kick'], human(vel), 0.3)
            if s16 == 8: P.note(t, ch, GM['clap'], human(vel - 5), 0.2); P.note(t, ch, GM['snare'], human(vel - 25), 0.2)
            roll = (k // 16) % 2 == 1 and s16 >= 12
            P.note(t, ch, GM['hat'], human(vel - 40), 0.05)
            if roll: P.note(t + sp / 8, ch, GM['hat'], human(vel - 50), 0.05)
        elif style == 'half':
            if s16 == 0: P.note(t, ch, GM['kick'], human(vel), 0.3)
            if s16 == 8: P.note(t, ch, GM['snare'], human(vel - 10), 0.3)
            if s16 % 4 == 0: P.note(t, ch, GM['hat'], human(vel - 50), 0.1)
        elif style == 'pulse':
            if s16 % 4 == 0: P.note(t, ch, GM['kick'], human(vel - 15), 0.3)
        elif style == 'tom':
            if s16 in (0, 3, 6, 8, 11, 14): P.note(t, ch, [GM['tomL'], GM['tomM'], GM['tomL'], GM['tomH'], GM['tomL'], GM['tomM']][[0, 3, 6, 8, 11, 14].index(s16)], human(vel - 10), 0.3)
    if fill_at is not None:
        for j in range(8): P.note(fill_at - sp * 2 + j * sp / 4, ch, [GM['tomH'], GM['tomM'], GM['tomL']][j % 3] if j < 6 else GM['snare'], vel - 10 + j * 3, 0.2)

# ---------------------------------------------------------------- designed SFX (numpy, mono → spread later)
class FX:
    def __init__(self, dur): self.n = int(dur * SR); self.a = np.zeros(self.n); self.t = np.arange(self.n) / SR
    def add(self, t0, sig, gain=1.0):
        i = int(t0 * SR); j = max(0, -i); i = max(0, i); m = min(len(sig) - j, self.n - i)
        if m > 0: self.a[i:i + m] += gain * sig[j:j + m]
    @staticmethod
    def env(n, a, d, s=0.0):
        t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * (s + (1 - s) * np.exp(-t / d))
    def whoosh(self, tc, dur=0.45, gain=0.5, lo=300, hi=6000, up=True):
        n = int(dur * SR); t = np.arange(n) / SR; nz = _rng.standard_normal(n)
        e = np.sin(np.pi * t / dur) ** 2; out = np.zeros(n)
        for k in range(6):   # sweeping band
            u0, u1 = k / 6, (k + 1) / 6; seg = slice(int(u0 * n), int(u1 * n)); f = lo * (hi / lo) ** ((u0 if up else 1 - u0))
            out[seg] = bp(nz, max(60, f * 0.7), min(18000, f * 1.6))[seg]
        self.add(tc - dur / 2, out * e, gain)
    def swish(self, tc, gain=0.4): self.whoosh(tc, 0.22, gain, 1500, 9000)
    def impact(self, t0, gain=1.0, sub=48, tail=1.2, bright=1.0):
        n = int((tail + 0.3) * SR); t = np.arange(n) / SR
        boom = np.sin(2 * np.pi * (sub * t + 30 * (1 - np.exp(-t / 0.05)) * 0.05 / 0.05 * 0.0) ) * np.exp(-t / (tail * 0.45))
        boom = np.sin(2 * np.pi * np.cumsum(sub + 60 * np.exp(-t / 0.04)) / SR) * np.exp(-t / (tail * 0.45))
        crack = bp(_rng.standard_normal(n), 800, 9000) * np.exp(-t / 0.03) * bright
        body = lp(_rng.standard_normal(n), 900) * np.exp(-t / 0.18) * 0.7
        self.add(t0, np.tanh(1.6 * (boom * 1.0 + crack * 0.5 + body)), gain)
    def subdrop(self, t0, gain=0.9, f0=90, f1=32, dur=1.4):
        n = int(dur * SR); t = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-t / 0.35)
        self.add(t0, np.tanh(1.4 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t / (dur * 0.5)) * np.minimum(1, t / 0.005), gain)
    def riser(self, t_end, dur=1.6, gain=0.35, f0=200, f1=2400):
        n = int(dur * SR); t = np.arange(n) / SR; u = t / dur
        nz = _rng.standard_normal(n); out = np.zeros(n)
        for k in range(8):
            seg = slice(int(k / 8 * n), int((k + 1) / 8 * n)); f = 400 * (8000 / 400) ** (k / 8); out[seg] = bp(nz, f * 0.6, min(18000, f * 1.8))[seg]
        tone = np.sin(2 * np.pi * np.cumsum(f0 * (f1 / f0) ** u) / SR) * 0.35
        self.add(t_end - dur, (out * 0.8 + tone) * u ** 2.2, gain)
    def tape_stop(self, t0, dur=0.45, gain=0.5, f0=420):
        n = int(dur * SR); t = np.arange(n) / SR; f = f0 * (1 - t / dur) ** 2 + 20
        sig = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.3 + lp(_rng.standard_normal(n), 2000) * 0.3
        self.add(t0, sig * (1 - t / dur), gain)
    def rewind(self, t0, dur=0.8, gain=0.45):
        n = int(dur * SR); t = np.arange(n) / SR; f = 300 + 2600 * (t / dur) ** 1.5
        chirps = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 18 * t)))
        self.add(t0, (chirps * 0.35 + bp(_rng.standard_normal(n), 2000, 8000) * 0.4) * np.sin(np.pi * t / dur), gain)
    def glitch(self, t0, dur=0.25, gain=0.4):
        n = int(dur * SR); sig = bp(_rng.standard_normal(n), 1000, 10000) * (np.floor(np.arange(n) / 900) % 2) + np.sign(np.sin(2 * np.pi * 180 * np.arange(n) / SR)) * 0.2 * (np.floor(np.arange(n) / 1400) % 2)
        self.add(t0, sig, gain)
    def pop(self, t0, f=900, gain=0.35):
        n = int(0.12 * SR); t = np.arange(n) / SR; self.add(t0, np.sin(2 * np.pi * np.cumsum(f * (1 + 1.5 * np.exp(-t / 0.01))) / SR) * np.exp(-t / 0.035), gain)
    def tick(self, t0, gain=0.25, f=3200):
        n = int(0.03 * SR); t = np.arange(n) / SR; self.add(t0, (np.sin(2 * np.pi * f * t) + bp(_rng.standard_normal(n), 2000, 8000)) * np.exp(-t / 0.006), gain)
    def ding(self, t0, f=1318.5, gain=0.3, d=1.2):
        n = int((d + 0.1) * SR); t = np.arange(n) / SR; sig = sum(g * np.sin(2 * np.pi * f * m * t) * np.exp(-t / (d / (1 + k))) for k, (m, g) in enumerate(((1, 1), (2.0, 0.4), (3.01, 0.2), (4.2, 0.1))))
        self.add(t0, sig * np.minimum(1, t / 0.003), gain)
    def chime(self, t0, freqs=(880, 1108.7, 1318.5, 1760), gain=0.22, gap=0.05):
        for i, f in enumerate(freqs): self.ding(t0 + i * gap, f, gain, 1.6)
    def heartbeat(self, t0, gain=0.7):
        for dt, g in ((0, 1), (0.18, 0.7)): self.subdrop(t0 + dt, gain * g, 70, 40, 0.25)
    def shutter(self, t0, gain=0.4): self.tick(t0, gain, 1800); self.tick(t0 + 0.06, gain * 0.8, 1200)
    def thud(self, t0, gain=0.6): self.impact(t0, gain, 60, 0.35, 0.3)
    def scrape(self, t0, dur, gain=0.15): n = int(dur * SR); t = np.arange(n) / SR; self.add(t0, bp(_rng.standard_normal(n), 1500, 6000) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * t)) * np.sin(np.pi * t / dur), gain)
    def shatter(self, t0, gain=0.6):
        self.impact(t0, gain * 0.6, 120, 0.4, 1.5)
        for k in range(14): self.ding(t0 + 0.02 + k * 0.025 + _rng.random() * 0.03, 2500 + _rng.random() * 4000, gain * 0.08, 0.15)
    def record_scratch(self, t0, gain=0.5):
        n = int(0.35 * SR); t = np.arange(n) / SR; f = 600 + 900 * np.sin(2 * np.pi * 3 * t)
        self.add(t0, bp(_rng.standard_normal(n), 400, 5000) * 0.5 * np.abs(np.sin(2 * np.pi * np.cumsum(f) / SR / 40)) + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.2 * np.exp(-t / 0.2), gain)

# ---------------------------------------------------------------- mix
def reverb_ir(sec=2.4, decay=0.5, damp=5000):
    n = int(sec * SR); ir = _rng.standard_normal((n, 2)) * np.exp(-np.arange(n) / (decay * SR))[:, None]
    ir = lp(ir, damp, 1); ir[:int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]; return ir / np.sqrt((ir ** 2).sum() / 2)
def reverb(x, wet=0.25, sec=2.4, decay=0.5):
    if x.ndim == 1: x = np.stack([x, x], 1)
    ir = reverb_ir(sec, decay); w = np.stack([fftconvolve(x[:, 0], ir[:, 0])[:len(x)], fftconvolve(x[:, 1], ir[:, 1])[:len(x)]], 1)
    return x * (1 - wet * 0.5) + w * wet
def envelope(x, att=0.01, rel=0.25):
    a = np.abs(x if x.ndim == 1 else x.mean(1)); out = np.zeros_like(a); g = 0.0
    ka, kr = np.exp(-1 / (att * SR)), np.exp(-1 / (rel * SR))
    # block-wise (fast) envelope follower
    B = 240; blocks = a[:len(a) // B * B].reshape(-1, B).max(1); e = np.zeros_like(blocks)
    for i, v in enumerate(blocks): g = v if v > g else g * kr ** B; e[i] = g
    out[:len(e) * B] = np.repeat(e, B); out[len(e) * B:] = e[-1] if len(e) else 0; return out
def duck(music, voice, depth_db=-9.0, thresh=0.02):
    e = envelope(voice); g = np.where(e > thresh, 10 ** (depth_db / 20), 1.0)
    k = int(0.08 * SR); g = np.convolve(g, np.ones(k) / k, mode='same')
    return music * g[:, None]
def master(voice, music, fx, dur, out, music_db=-14, fx_db=-8, voice_db=0, fade=0.06):
    n = int(dur * SR)
    def fit(x, st=True):
        y = np.zeros((n, 2) if st else n); m = min(n, len(x)); y[:m] = x[:m]; return y
    v = fit(voice, False); v = v / (np.max(np.abs(v)) + 1e-9) * 10 ** (voice_db / 20)
    mu = fit(music); mu = mu / (np.max(np.abs(mu)) + 1e-9) * 10 ** (music_db / 20); mu = duck(mu, v)
    f = fit(fx, False); f = f / (np.max(np.abs(f)) + 1e-9) * 10 ** (fx_db / 20); f = reverb(f, 0.18, 1.6, 0.35)
    v2 = reverb(hp(v, 70), 0.06, 1.0, 0.25)
    mix = v2 + mu + f
    mix = np.tanh(mix * 1.15) / np.tanh(1.15)
    nf = int(fade * SR); mix[-nf:] *= np.linspace(1, 0, nf)[:, None]
    mix /= np.max(np.abs(mix)) / 0.9
    wavfile.write(out, SR, (mix * 32767).astype(np.int16)); return mix
