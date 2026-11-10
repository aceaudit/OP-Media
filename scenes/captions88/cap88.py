# captions + log for 88–89 (v3 originals, no voice, our own score — no credit line)
import sys; sys.path.insert(0, '/home/claude/batch82')
from cap82 import SUB, FOLLOW
STYLE = '2D character · cinematic camera · music + restrained SFX · original (no voice)'
V = {
 88: dict(title='47 Tabs Open', dur=15.0, cover=5.0, slot='Wed Nov 11, 5:30 PM',
   desc='SHOCK OPEN: a browser window floats over his head (his brain) and tabs keep spawning until there are 47 (rent, emails, the gym plan, "Am I behind?"…), memory at 99%; "(Not Responding)" and a dialog: Wait or Close tabs; he clicks Close tabs and they collapse, 47 → 4; one tab is still playing, Overthinking ("What if…?"); he mutes it and closes it; the three that were buried all along, Today · Rest · People you love, turn gold, memory drops to 12% and he leans back → "Close a few tabs."',
   hook="Your brain has 47 tabs open. No wonder you're tired. 🟡", msg="Rent, emails, the gym plan, the text you still haven't answered. Close what isn't for today, mute the overthinking, and keep the three that matter.", cta='Save this for the next time your brain says "Not Responding."',
   ig_tags='#ownpace #overthinking #mentalload #burnout #mindset',
   tt="Your brain has 47 tabs open and that's why you're so tired: close what isn't for today and mute the overthinking 🟡 How many tabs do you have open right now? 👇\n#overthinking #mentalload #burnout #anxietyrelief #fyp #ownpace",
   yt="Your Brain Has 47 Tabs Open (That's Why You're Tired) 🟡 #shorts", yt_desc="Every worry is another open tab. Close what isn't for today, mute the overthinking, keep what matters.", yt_tags='#overthinking #mentalload #burnout #mindset #ownpace'),
 89: dict(title='Crabs in a Bucket', dur=16.0, cover=1.0, slot='Thu Nov 12, 12:15 PM',
   desc='SHOCK OPEN inside a tin bucket: one gold crab gets its claws over the rim and the others drag it back down; cut to people in a pit: he starts up the stone steps toward the sunrise; the ones at the bottom start talking ("You\'ve changed." / "Who do you think you are?" / "That\'ll never work."), one runs up behind him, grabs his ankle and yanks him back a step; he looks down, calm, steps out of the grip and keeps climbing, each step lighting gold; at the top he turns, kneels and reaches back down, and the quiet one who was watching all along climbs up and takes his hand → "Keep climbing. Reach back."',
   hook='When you start growing, watch who pulls you back. 🟡', msg="Crabs in a bucket drag down any crab that tries to climb out. People do it too. It's not about you, it's their fear. Keep climbing, and when you make it, reach back.", cta="Send this to someone who's climbing right now.",
   ig_tags='#ownpace #growth #mindset #motivation #selfimprovement',
   tt="Crab mentality: when you start growing, some people pull you back. Keep climbing, then reach back for the ones who want to come 🟡 Have you seen this happen? 👇\n#crabmentality #growth #mindset #motivation #fyp #ownpace",
   yt='Crab Mentality: Why People Pull You Back When You Grow 🟡 #shorts', yt_desc="Crabs in a bucket pull down any crab that tries to climb out. People do it too. Keep climbing, and when you make it, reach back.", yt_tags='#crabmentality #growth #mindset #motivation #ownpace'),
}
def ig(n): v = V[n]; return '\n\n'.join([v['hook'], v['msg'], v['cta'], FOLLOW, v['ig_tags']])
def tt(n): return V[n]['tt']
def yt(n): v = V[n]; return f"{v['yt_desc']}\n\n{SUB}\n\n{v['yt_tags']}"
for n, v in V.items():
    assert len(v['yt']) <= 100 and '🟡' in v['yt'] and '#shorts' in v['yt']
    assert len(v['ig_tags'].split()) == 5 and '#ownpace' in v['ig_tags']
    tags = [w for w in v['tt'].split() if w.startswith('#')]; assert len(tags) == 6 and '#fyp' in tags and '#ownpace' in tags, tags
    assert len(v['yt_tags'].split()) == 5
if __name__ == '__main__':
    p = '/home/claude/rat-race/content-log.md'; s = open(p).read()
    if '| 88 |' not in s:
        rows = '\n'.join(f"| {n} | {V[n]['title']} ({V[n]['dur']} s, original, our own score) | {STYLE} | proposed {V[n]['slot']} | {V[n]['cover']} | 🎬 Rendered Nov 10, awaiting approval |" for n in (88, 89))
        i = s.index('\n', s.index('| 87 |')); s = s[:i] + '\n' + rows + s[i:]
        sec = ['', '## 88–89. Originals from the Nov 10 daily run (no new sounds in the folder; 2 a day from Nov 9; v3 style, restrained SFX)']
        for n in (88, 89):
            v = V[n]; sec += ['', f"## {n}. {v['title']} ({STYLE}) — {v['dur']} s", v['desc'],
                f"- **IG:** {ig(n).replace(chr(10)+chr(10), ' / ')}", f"- **TikTok:** {tt(n).replace(chr(10), ' ')}", f"- **YouTube:** {v['yt']} — Description: {yt(n).replace(chr(10)+chr(10), ' / ')}"]
        s = s.rstrip('\n') + '\n' + '\n'.join(sec) + '\n'
        open(p, 'w').write(s)
    print('ok')
