# helpers for voiceover videos (70+): load the creator's audio, cut segments with tiny fades, place it on the timeline
import numpy as np
from scipy.io import wavfile
SR = 48000
def load(path):
    sr, x = wavfile.read(path); x = x.astype(float) / (32768 if x.dtype == np.int16 else 1)
    if x.ndim > 1: x = x.mean(1)
    assert sr == SR, sr
    return x
def fade(x, a=0.015, b=0.015):
    x = x.copy(); na, nb = int(a * SR), int(b * SR)
    if na: x[:na] *= np.linspace(0, 1, na)
    if nb: x[-nb:] *= np.linspace(1, 0, nb)
    return x
def splice(x, segs, gap_fade=0.02):
    """segs: [(a, b) | ('sil', dur)] → one array, each piece faded in/out over gap_fade s"""
    out = []
    for s in segs:
        if s[0] == 'sil': out.append(np.zeros(int(s[1] * SR))); continue
        a, b = s; out.append(fade(x[int(a * SR):int(b * SR)], gap_fade, gap_fade))
    return np.concatenate(out)
def place(v, n, at=0.0):
    y = np.zeros(n); i = int(at * SR); m = min(len(v), n - i); y[i:i + m] = v[:m]; return y
def xsplice(x, segs, xf=0.04):
    """segs: [(a, b), …] joined with equal-power crossfades of xf seconds (each later segment starts xf earlier)"""
    n = int(xf * SR); out = x[int(segs[0][0] * SR):int(segs[0][1] * SR)].copy()
    for a, b in segs[1:]:
        seg = x[int((a - xf / 2) * SR):int(b * SR)].copy(); fo = np.cos(np.linspace(0, np.pi / 2, n)); fi = np.sin(np.linspace(0, np.pi / 2, n))
        out[-n:] = out[-n:] * fo + seg[:n] * fi; out = np.concatenate([out, seg[n:]])
    return out
