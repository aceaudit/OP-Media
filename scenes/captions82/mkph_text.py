# timed on-screen text (no voice): phrases = [(t0, "words …", step)] → PH js
import sys, json
def ph(phrases):
    out = []
    for t0, s, *rest in phrases:
        step = rest[0] if rest else 0.11
        out.append([[round(t0 + i * step, 2), w] for i, w in enumerate(s.split())])
    return 'const PH = [\n' + ',\n'.join('  ' + json.dumps(p, ensure_ascii=False) for p in out) + '\n];\n'
if __name__ == '__main__':
    exec(open(sys.argv[1]).read()); open(sys.argv[2], 'w').write(ph(PHRASES)); print(open(sys.argv[2]).read())
