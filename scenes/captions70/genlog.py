# rewrite the 70–81 rows and sections of content-log.md from captions.py (v3 rebuild)
import re, sys
sys.path.insert(0, '/home/claude/batch70')
import captions as C
COVER = {70: 8.6, 71: 13.6, 72: 12.6, 73: 34.3, 74: 9.9, 75: 1.0, 76: 0.3, 77: 4.9, 78: 1.6, 79: 0.6, 80: 17.5, 81: 0.3}
STATUS = '🎬 v3 rebuilt Nov 1, awaiting approval'
slot = dict(C.SLOTS)
p = '/home/claude/rat-race/content-log.md'; L = open(p).read().split('\n')
for i, l in enumerate(L):
    m = re.match(r'^\| (7\d|8[01]) \|', l)
    if m:
        n = int(m.group(1)); v = C.V[n]
        L[i] = f"| {n} | {v['title']} ({v['dur']} s, creator's voice + our own score) | {v['style']} | proposed {slot[n]} | {COVER[n]} | {STATUS} |"
start = [i for i, l in enumerate(L) if l.startswith('## 70–81.')][0]
head = L[:start]
sec = ['## 70–81. Voiceover batch from 12 reels the user shared on Oct 31, rebuilt as v3 on Nov 1',
 'Request 1 (Oct 31): "Create videos for all these sounds… make the first few seconds extremely interesting… extend the animation beyond the sound if it helps." Request 2 (Oct 31, after v1): "make sure the videos are extremely interesting with extremely strong hooks and interesting animations and sound effects… we need to stand out." User picked: a recurring character + cinematic camera; a mix of shock opens, ending-first cold opens, text hooks and challenges/games; music + heavy SFX; rebuild all 12.',
 'v3 approach: the creator\'s voice separated from their music (UVR-MDX vocal model) and laid over our own score (soundfont orchestra/synths, ducked under the voice) with designed SFX on every beat (impacts, whooshes, risers, record scratch, tape stop, glitches). The gold hero now has a face that acts (17 expressions, blinks, tears) and a cream scarf; side characters are white with simple faces. Keyframed camera (push-ins, whip pans, shakes, punch-zooms, slow motion), a text-hook box for the first 2–3 s, atmosphere (light shafts, bokeh, tint). 73 and 75 were trimmed for pace (73: two sentences; 75: one passage plus the profanity line); 76 keeps the profanity aside cut. Every mix checked with speech recognition so no word is masked. One reel was a duplicate (13 files → 12 sounds). Creator handles weren\'t visible in the reels; captions say "Original audio from a creator\'s reel" until the user shares handles (only on-screen name seen: "Unpublished diary" on 79\'s reel; 70\'s file name ends in "verbav"). v1 renders kept in "v1 70-81".', '']
for n in range(70, 82):
    v = C.V[n]
    sec += [f"## {n}. {v['title']} ({v['style']}) — {v['dur']} s — sound {v['src']}", v['desc'],
            f"- **IG:** {C.ig(n)}", f"- **TikTok:** {C.tt(n)}", f"- **YouTube:** {v['yt']} — Description: {C.yt_desc(n)}", '']
open(p, 'w').write('\n'.join(head + sec).rstrip('\n') + '\n')
print('ok', len(head), len(sec))
