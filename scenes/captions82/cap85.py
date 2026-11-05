# captions + log for 85–87 (v3 originals, no voice, our own score — no credit line)
from cap82 import SUB, FOLLOW, STYLE
V = {
 86: dict(title='The Wrong Bus', dur=16.0, cover=0.4, slot='Fri Nov 6, 5:30 PM',
   desc='SHOCK OPEN on his face at a bus window, the world streaking past, the LED sign reads → SOMEDAY; a gold YOUR DREAM road sign flies past the other way; his ticket says PAID: 3 YEARS; he stands, pulls the cord (STOP REQUESTED), the bus brakes, he steps off and drops the ticket, and walks the other way toward a gold YOUR WAY sign and the sunrise while the bus leaves → "Wrong bus? Get off."',
   hook='On the wrong bus? Get off at the next stop. 🟡', msg="You already paid for the ticket, but that's not a reason to stay. Every stop just takes you further from where you want to be.", cta='Send this to someone who needs permission to change direction.',
   ig_tags='#ownpace #mindset #courage #motivation #newbeginnings',
   tt="If you're on the wrong path, the next stop is always the best time to get off, no matter how long you've been on it 🟡 What are you getting off of? 👇\n#mindset #lifeadvice #motivation #newbeginnings #fyp #ownpace",
   yt='On the Wrong Bus? Get Off at the Next Stop 🟡 #shorts', yt_desc="It doesn't matter how much you already paid for the ticket. The next stop is always the best time to get off.", yt_tags='#mindset #lifeadvice #motivation #newbeginnings #ownpace'),
 85: dict(title='Your Future Self Is Watching', dur=15.0, cover=11.6, slot='Sat Nov 7, 7:15 AM',
   desc='SHOCK OPEN on a glowing window: him, 5 years from now, looking straight at camera; pull back to present him on the couch, scrolling; with every scroll and skipped workout the future self dims and slumps; "Look up" — eye contact; phone down: a page, a mile, an early night, and the future self lights up gold and cheers → "Make him proud."',
   hook='Your future self is watching this. 🟡', msg='Every hour you scroll and every workout you skip, he feels it. Every page, every mile, every early night, he feels that too.', cta='Send this to someone you want to see win in 5 years.',
   ig_tags='#ownpace #selfimprovement #discipline #motivation #futureself',
   tt="Your future self feels every choice you make today, every scroll and every early night 🟡 What's one thing you're doing for future you? 👇\n#futureself #selfimprovement #discipline #motivation #fyp #ownpace",
   yt='Your Future Self Is Watching You Right Now 🟡 #shorts', yt_desc='Every scroll, every skipped workout, he feels it. Every page, every mile, every early night too. Make him proud.', yt_tags='#futureself #selfimprovement #discipline #motivation #ownpace'),
 87: dict(title='Pause Before You React', dur=15.0, cover=1.8, slot='Sat Nov 7, 12:15 PM',
   desc='SHOCK OPEN: "WHO ASKED YOU?" slams in; he winds up to fire back… PAUSED: the world goes grey and stops, only he can move; 3 · 2 · 1, he breathes and the anger drains; two cards, REACT (a fight, words you regret, a ruined day) or RESPOND (a calm answer, your peace intact, a better day); he picks RESPOND, the world plays again, "Let\'s talk when we\'re both calm," and the other side cools → "Pause. Then choose."',
   hook='Before you snap back, pause. 🟡', msg='3 seconds. Breathe in, breathe out. Then choose: react and lose the day, or respond and keep your peace.', cta='Save this for the next time someone tests you.',
   ig_tags='#ownpace #mentalhealth #selfcontrol #peace #mindset',
   tt="The 3-second pause: before you react to someone who pushes your buttons, breathe and choose to respond instead 🟡 Who tests your patience the most? 👇\n#selfcontrol #mentalhealth #anger #mindset #fyp #ownpace",
   yt='Before You Snap Back, Try This 3-Second Pause 🟡 #shorts', yt_desc='Pause. Breathe in, breathe out. Then choose: react, or respond. 3 seconds can save a whole day.', yt_tags='#selfcontrol #mentalhealth #anger #mindset #ownpace'),
}
def ig(n): v = V[n]; return '\n\n'.join([v['hook'], v['msg'], v['cta'], FOLLOW, v['ig_tags']])
def tt(n): return V[n]['tt']
def yt(n): v = V[n]; return f"{v['yt_desc']}\n\n{SUB}\n\n{v['yt_tags']}"
for n, v in V.items():
    assert len(v['yt']) <= 100 and len(v['ig_tags'].split()) == 5 and '#ownpace' in v['ig_tags']
    tags = [w for w in v['tt'].split() if w.startswith('#')]; assert len(tags) == 6 and '#fyp' in tags and '#ownpace' in tags, tags
    assert len(v['yt_tags'].split()) == 5
if __name__ == '__main__':
    p = '/home/claude/rat-race/content-log.md'; s = open(p).read()
    if '| 85 |' not in s:
        rows = '\n'.join(f"| {n} | {V[n]['title']} ({V[n]['dur']} s, original, our own score) | {STYLE} | proposed {V[n]['slot']} | {V[n]['cover']} | 🎬 Rendered Nov 5, awaiting approval |" for n in (85, 86, 87))
        i = s.index('\n', s.index('| 84 |')); s = s[:i] + '\n' + rows + s[i:]
        sec = ['', '## 85–87. Originals from the Nov 5 daily run (no new sounds in the folder; v3 style, restrained SFX)']
        for n in (86, 85, 87):
            v = V[n]; sec += ['', f"## {n}. {v['title']} ({STYLE}) — {v['dur']} s", v['desc'],
                f"- **IG:** {ig(n).replace(chr(10)+chr(10), ' / ')}", f"- **TikTok:** {tt(n).replace(chr(10), ' ')}", f"- **YouTube:** {v['yt']} — Description: {yt(n).replace(chr(10)+chr(10), ' / ')}"]
        s = s.rstrip('\n') + '\n' + '\n'.join(sec) + '\n'
        open(p, 'w').write(s)
    print('ok')
