# Build a PH (caption phrase) JS array from an ASR word list + hand-written phrases.
# usage: python3 tools/mkph.py words.json phrases.txt [cuts]   cuts: "a-b,c-d" (seconds removed from the audio, in order)
# phrases.txt: one phrase per line; words carry * (key) or ! (stamp); a word prefixed with ~ is caption-only text with no audio match.
import json, re, sys
words = json.load(open(sys.argv[1]))['words']
cuts = [tuple(map(float, c.split('-'))) for c in sys.argv[3].split(',')] if len(sys.argv) > 3 and sys.argv[3] else []
def remap(t):
    off = 0
    for a, b in cuts:
        if t >= b: off += b - a
        elif t >= a: return None
    return round(t - off, 2)
W = [(remap(t), w) for t, w in words]; W = [(t, w) for t, w in W if t is not None]
norm = lambda s: re.sub(r"[^a-z0-9']", '', s.lower().replace('’', "'"))
i = 0; out = []
for line in open(sys.argv[2]):
    line = line.strip()
    if not line: continue
    ph = []
    for tok in line.split():
        if tok.startswith('~'): ph.append([ph[-1][0] if ph else W[i][0], tok[1:]]); continue
        n = norm(tok.rstrip('*!'))
        j = i
        while j < len(W) and norm(W[j][1]) != n and j < i + 3: j += 1
        if j >= len(W) or norm(W[j][1]) != n: sys.exit(f'no match for {tok!r} near {W[i]}')
        ph.append([W[j][0], tok]); i = j + 1
    out.append(ph)
print('const PH = [\n' + ',\n'.join('  [' + ', '.join(f"[{t}, {json.dumps(w)}]" for t, w in ph) + ']' for ph in out) + ',\n];')
print(f'// last word at {out[-1][-1][0]}', file=sys.stderr)
