# Shared sound helpers for Own Pace videos (46+). Each soundNN.py builds a dry mix from these and calls finish().
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

import os
SR, DUR = 48000, float(os.environ.get('DUR', 14))
t = np.arange(int(SR * DUR)) / SR
rng = np.random.default_rng(3)
WN = rng.standard_normal(len(t))


def smooth(a, b, x):
    y = np.clip((x - a) / (b - a), 0, 1)
    return y * y * (3 - 2 * y)


def tone(f, amp, detune=0.0018):
    out = np.zeros_like(t)
    ph = 0.0
    for d, ph in zip((-detune, 0, detune), rng.random(3) * 6.28):
        ff = f * (1 + d)
        out += np.sin(2 * np.pi * ff * t + ph) + 0.12 * np.sin(4 * np.pi * ff * t + ph)
    return amp * out / 3 * (0.85 + 0.15 * np.sin(2 * np.pi * (0.13 + f / 5000) * t + ph))


def chord(notes, scale=1.0):
    return sum(tone(f, a * scale) for f, a in notes)


A_MIN = [(55, .12), (110, .28), (164.81, .18), (220, .14), (261.63, .12), (329.63, .07)]
D_MAJ = [(73.42, .11), (146.83, .26), (220.0, .18), (293.66, .15), (369.99, .11), (440.0, .08), (587.33, .045)]
F_MAJ7 = [(87.31, .11), (174.61, .24), (261.63, .17), (329.63, .14), (440.0, .1), (523.25, .06)]
C_ADD9 = [(65.41, .11), (130.81, .26), (196.0, .18), (293.66, .13), (329.63, .12), (392.0, .08), (587.33, .04)]
E_MIN = [(41.2, .1), (82.41, .26), (123.47, .17), (164.81, .14), (196.0, .12), (246.94, .07)]
G_MAJ = [(49.0, .1), (98.0, .26), (146.83, .18), (196.0, .15), (246.94, .12), (293.66, .08), (493.88, .045)]


def lowpass(x, f, order=2):
    return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)


def band(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


class Fx:
    def __init__(self):
        self.a = np.zeros_like(t)

    def hit(self, ts, amp, f, d, noise=0.3, nd=0.006, dur=0.16, fdrop=0.0):
        n = int(dur * SR); i = int(ts * SR)
        if i < 0: return
        n = min(n, len(t) - i)
        if n <= 0: return
        tt = np.arange(n) / SR
        ph = 2 * np.pi * (f * tt - 0.5 * fdrop * tt * tt)
        self.a[i:i + n] += amp * (np.sin(ph) * np.exp(-tt / d) + noise * rng.standard_normal(n) * np.exp(-tt / nd))

    def ping(self, t0, f, amp, d, attack=0.01):
        m = t >= t0; tt = t[m] - t0
        self.a[m] += amp * np.sin(2 * np.pi * f * tt) * np.exp(-tt / d) * np.minimum(1, tt / attack)

    def bell(self, t0, f, amp, d=1.8):
        for k, (m, g) in enumerate(((1, 1), (2.01, 0.35), (3.03, 0.18), (4.2, 0.08))):
            self.ping(t0 + 0.002 * k, f * m, amp * g, d / (1 + 0.6 * k))

    def whoosh(self, ts, amp, w=0.12, lo=900, hi=4000):
        env = np.exp(-((t - ts) / w) ** 2)
        self.a += amp * env * band(WN, lo, hi)

    def noise_env(self, env, amp, lo, hi):
        self.a += amp * env * band(WN, lo, hi)

    def sweep(self, t0, t1, f0, f1, amp, kind='saw'):
        m = (t >= t0) & (t < t1); tt = t[m] - t0; T = t1 - t0
        f = f0 * (f1 / f0) ** (tt / T)
        ph = 2 * np.pi * np.cumsum(f) / SR
        w = (2 * ((ph / (2 * np.pi)) % 1) - 1) if kind == 'saw' else np.sin(ph)
        env = np.minimum(1, tt / 0.03) * np.minimum(1, (T - tt) / 0.06)
        self.a[m] += amp * w * env


def air_bed(amp=0.05):
    air = band(rng.standard_normal(len(t)), 150, 700) * amp
    return air * (0.6 + 0.4 * np.sin(2 * np.pi * 0.09 * t))


def finish(dry, name, fade=(13.2, 14.0), wet_amt=0.55):
    ir_len = int(2.6 * SR)
    ir = rng.standard_normal(ir_len) * np.exp(-np.arange(ir_len) / (0.55 * SR))
    ir = lowpass(ir, 4000, 1)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(dry, ir)[: len(t)]
    g = 1 - smooth(fade[0], fade[1], t)
    Lc = (0.7 * dry + wet_amt * wet) * g
    d = int(0.011 * SR)
    Rc = (0.7 * dry + wet_amt * np.concatenate([np.zeros(d), wet[:-d]])) * g
    st = np.stack([Lc, Rc], axis=1)
    st /= np.max(np.abs(st)) / 0.7
    wavfile.write(name, SR, (st * 32767).astype(np.int16))
    print('ok', name)


# ---------------- beat engine (v2 videos, 58+) ----------------
def _env(n, a, d):
    tt = np.arange(n) / SR
    return np.minimum(1, tt / max(a, 1e-4)) * np.exp(-tt / d), tt


KICKS = []


def kick(fx, ts, amp=0.5):
    n = int(0.45 * SR); i = int(ts * SR)
    if i < 0 or i >= len(t): return
    KICKS.append(ts)
    n = min(n, len(t) - i); env, tt = _env(n, 0.002, 0.16)
    f = 45 + 110 * np.exp(-tt / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    fx.a[i:i + n] += amp * env * np.sin(ph) + amp * 0.25 * np.exp(-tt / 0.004) * rng.standard_normal(n) * 0.3


def clap(fx, ts, amp=0.22):
    n = int(0.3 * SR); i = int(ts * SR)
    if i < 0 or i >= len(t): return
    n = min(n, len(t) - i); tt = np.arange(n) / SR
    burst = sum(np.exp(-np.maximum(0, tt - d) / 0.012) * (tt >= d) for d in (0, 0.011, 0.022))
    noise = band(rng.standard_normal(n), 900, 5000)
    fx.a[i:i + n] += amp * (0.6 * burst + 0.5 * np.exp(-tt / 0.09)) * noise + amp * 0.3 * np.sin(2 * np.pi * 190 * tt) * np.exp(-tt / 0.05)


def hat(fx, ts, amp=0.06, open_=False):
    n = int((0.25 if open_ else 0.06) * SR); i = int(ts * SR)
    if i < 0 or i >= len(t): return
    n = min(n, len(t) - i); tt = np.arange(n) / SR
    fx.a[i:i + n] += amp * sosfilt(butter(2, 7000, 'high', fs=SR, output='sos'), rng.standard_normal(n)) * np.exp(-tt / (0.08 if open_ else 0.015))


def sub(fx, ts, f, dur, amp=0.22):
    n = int(dur * SR); i = int(ts * SR)
    if i < 0 or i >= len(t): return
    n = min(n, len(t) - i); tt = np.arange(n) / SR
    env = np.minimum(1, tt / 0.01) * np.minimum(1, (dur - tt) / 0.05)
    # sub sine + a saturated octave so the bass line still reads on phone speakers
    fx.a[i:i + n] += amp * env * (0.8 * np.sin(2 * np.pi * f * tt) + 0.45 * np.tanh(2.5 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt / 0.6))


def riser(fx, t0, t1, amp=0.06):
    m = (t >= t0) & (t < t1); u = (t[m] - t0) / (t1 - t0)
    fx.a[m] += amp * u * u * band(rng.standard_normal(m.sum()), 1500, 9000)
    fx.sweep(t0, t1, 200, 1600, amp * 0.25, 'sin')


def impact(fx, ts, amp=0.35):
    kick(fx, ts, amp)
    n = int(1.2 * SR); i = int(ts * SR)
    if i < 0 or i >= len(t): return
    n = min(n, len(t) - i); tt = np.arange(n) / SR
    fx.a[i:i + n] += amp * 0.35 * lowpass(rng.standard_normal(n), 300) * np.exp(-tt / 0.35)


def drums(fx, bpm, t0, t1, style='lofi', amp=1.0, fills=()):
    """Lay a drum loop on fx between t0 and t1. style: 'lofi' (kick 1 & 3+, clap 2 & 4, swung hats),
    'drive' (four-on-the-floor + offbeat hats), 'half' (half-time, big clap on 3)."""
    beat = 60.0 / bpm; k = 0
    tt = t0
    while tt < t1 - 1e-6:
        pos = k % 16          # 16th-note grid within a bar of 4 beats
        s = tt
        if style == 'lofi':
            if pos in (0, 10): kick(fx, s, 0.45 * amp)
            if pos in (4, 12): clap(fx, s, 0.2 * amp)
            if pos % 2 == 0: hat(fx, s + (0.03 * beat if pos % 4 == 2 else 0), 0.05 * amp)
        elif style == 'drive':
            if pos % 4 == 0: kick(fx, s, 0.5 * amp)
            if pos in (4, 12): clap(fx, s, 0.22 * amp)
            if pos % 4 == 2: hat(fx, s, 0.07 * amp, open_=True)
            elif pos % 2 == 1: hat(fx, s, 0.03 * amp)
        elif style == 'half':
            if pos == 0: kick(fx, s, 0.5 * amp)
            if pos == 8: clap(fx, s, 0.26 * amp)
            if pos % 2 == 0: hat(fx, s, 0.045 * amp)
        k += 1; tt += beat / 4
    for f in fills:
        for j in range(4): clap(fx, f + j * beat / 4, (0.08 + 0.04 * j) * amp)


def bassline(fx, bpm, t0, t1, roots, amp=0.2):
    """One sustained sub note per bar cycling through roots (Hz)."""
    bar = 4 * 60.0 / bpm; k = 0; tt = t0
    while tt < t1 - 1e-6:
        sub(fx, tt, roots[k % len(roots)], min(bar, t1 - tt) * 0.95, amp); k += 1; tt += bar


def pluck(fx, ts, f, amp=0.05, d=0.22, harm=6):
    n = int(min(1.5, d * 6) * SR); i = int(ts * SR)
    if i < 0 or i >= len(t): return
    n = min(n, len(t) - i); tt = np.arange(n) / SR
    w = sum((0.8 ** (k - 1)) / k * np.sin(2 * np.pi * f * k * tt + k) * np.exp(-tt / (d / (1 + 0.6 * (k - 1)))) for k in range(1, harm + 1))
    fx.a[i:i + n] += amp * w * np.minimum(1, tt / 0.003)


# chord tones (Hz) for arps, bass roots (Hz) and pad voicings, all in A minor
ARP = {'Am': [220.0, 261.63, 329.63, 440.0, 523.25], 'F': [174.61, 220.0, 261.63, 349.23, 440.0],
       'C': [196.0, 261.63, 329.63, 392.0, 523.25], 'G': [196.0, 246.94, 293.66, 392.0, 493.88],
       'Em': [164.81, 196.0, 246.94, 329.63, 392.0], 'Dm': [146.83, 174.61, 220.0, 293.66, 349.23]}
ROOT = {'Am': 55.0, 'F': 43.65, 'C': 65.41, 'G': 49.0, 'Em': 41.2, 'Dm': 36.71}
PAD = {'Am': A_MIN, 'F': F_MAJ7, 'C': C_ADD9, 'G': G_MAJ, 'Em': E_MIN, 'Dm': [(73.42, .1), (146.83, .24), (174.61, .17), (220.0, .15), (293.66, .1), (349.23, .06)]}


def arp(fx, bpm, t0, t1, prog, amp=0.04, step=0.5, pattern=(0, 2, 1, 3, 2, 4, 3, 1), d=0.2, oct=2):
    bar = 4 * 60.0 / bpm; dt = step * 60.0 / bpm; k = 0; tt = t0
    while tt < t1 - 1e-6:
        c = prog[int((tt - t0 + 1e-6) // bar) % len(prog)]
        pluck(fx, tt, oct * ARP[c][pattern[k % len(pattern)]], amp * (1.0 if k % 2 == 0 else 0.75), d); k += 1; tt += dt


def pad_prog(bpm, t0, t1, prog, scale=0.7, cutoff=2200):
    bar = 4 * 60.0 / bpm; out = np.zeros_like(t); k = 0; tt = t0
    while tt < t1 - 1e-6:
        w = smooth(tt - 0.03, tt + 0.05, t) * (1 - smooth(tt + bar - 0.05, tt + bar + 0.05, t)) if k else (t >= t0) * (1 - smooth(tt + bar - 0.05, tt + bar + 0.05, t))
        out += chord(PAD[prog[k % len(prog)]], scale) * w; k += 1; tt += bar
    out *= (t < t1)
    return lowpass(out, cutoff)


def bass_prog(fx, bpm, t0, t1, prog, amp=0.2, rhythm=(0, 1.5, 2.5)):
    """Bass notes on the given beat offsets inside each bar, following the chord roots."""
    bar = 4 * 60.0 / bpm; b = 60.0 / bpm; k = 0; tt = t0
    while tt < t1 - 1e-6:
        r = ROOT[prog[k % len(prog)]] * 2
        offs = list(rhythm) + [4]
        for j in range(len(rhythm)):
            s = tt + offs[j] * b
            if s < t1: sub(fx, s, r, min((offs[j + 1] - offs[j]) * b * 0.9, t1 - s), amp)
        k += 1; tt += bar


def duck(depth=0.55, rel=0.16):
    env = np.ones_like(t)
    for k in KICKS:
        m = t >= k; env[m] *= 1 - depth * np.exp(-(t[m] - k) / rel)
    return env


def finish2(beat, music, name, wet_beat=0.12, wet_music=0.5, tail=0.04):
    """v2 mix: drums/bass nearly dry and punchy, music+fx in the room; no fade (videos loop), just a click-free tail."""
    ir_len = int(2.2 * SR)
    ir = rng.standard_normal(ir_len) * np.exp(-np.arange(ir_len) / (0.45 * SR)); ir = lowpass(ir, 4500, 1); ir /= np.sqrt(np.sum(ir ** 2))
    def room(x, wet):
        w = fftconvolve(x, ir)[: len(t)]; d = int(0.011 * SR)
        return np.stack([0.75 * x + wet * w, 0.75 * x + wet * np.concatenate([np.zeros(d), w[:-d]])], axis=1)
    st = room(beat, wet_beat) + room(music, wet_music)
    g = 1 - smooth(DUR - tail, DUR, t); g = np.minimum(g, smooth(0, 0.004, t) * 0 + 1)
    st *= g[:, None]
    st = np.tanh(1.6 * st / np.max(np.abs(st))) / np.tanh(1.6) * 0.75   # gentle glue/saturation
    wavfile.write(name, SR, (st * 32767).astype(np.int16))
    print('ok', name)


def music_bed(bpm, t0, t1, prog, style='drive', drums_amp=1.0, arp_amp=0.045, pad_amp=0.55, bass_amp=0.18, fills=(), arp_on=None):
    """Full beat bed: returns (beat, music, fx). Add your own fx hits to fx.a, then finish2(beat, music + fx.a, name)."""
    drum = Fx(); drums(drum, bpm, t0, t1, style, drums_amp, fills)
    bassline_fx = Fx(); bass_prog(bassline_fx, bpm, t0, t1, prog, bass_amp)
    lead = Fx()
    for a, b in (arp_on or [(t0, t1)]): arp(lead, bpm, a, b, prog, arp_amp)
    pad = pad_prog(bpm, t0, t1, prog, pad_amp)
    dk = duck()
    return drum.a + bassline_fx.a * dk, (pad + lead.a) * (0.55 + 0.45 * dk), Fx()
