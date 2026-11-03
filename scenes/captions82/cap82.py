# captions + log for 82–84 (v3 originals, no voice, our own score — no credit line)
SUB = 'Subscribe for short animated reminders for overthinkers and burnt-out achievers. 🟡'
FOLLOW = 'Follow @ownpace.daily for daily reminders.'
STYLE = '2D character · cinematic camera · music + heavy SFX · original (no voice)'
V = {
 82: dict(title='86,400', dur=16.5, cover=8.1, slot='Thu Nov 5, 5:30 PM',
   desc='SHOCK OPEN: a bank deposit slams in, "+$86,400", with a cash-register hit; one rule: whatever is left at midnight is gone (a clock ticks); "you\'d spend every cent, right?"; everything dims… then the $ balance flips into a clock: 86,400 SECONDS on a huge drop; the counter drains on SCROLLING, OVERTHINKING and WAITING FOR MONDAY while he slumps over his phone; he drops the phone and pours the rest into a gold jar labelled YOU → "Spend today on you." with a midnight bell.',
   hook='Every morning you get $86,400. 🟡', msg="One rule: whatever you don't spend by midnight is gone. You'd spend every cent, right? You already get it, in seconds. Spend today on what grows you.", cta="Send this to someone who keeps saying \"tomorrow\".",
   ig_tags='#ownpace #timemanagement #motivation #mindset #selfimprovement',
   tt="Every morning you get 86,400 seconds, and at midnight whatever you didn't use is gone 🟡 Where did yours go today? 👇\n#timemanagement #productivity #motivation #mindset #fyp #ownpace",
   yt="Every Morning You Get $86,400 🟡 (It's Not Money) #shorts", yt_desc="86,400 seconds a day, and whatever you don't use is gone at midnight. Spend today on you.", yt_tags='#timemanagement #productivity #motivation #mindset #ownpace'),
 84: dict(title='The 2-Minute Rule', dur=15.0, cover=8.4, slot='Fri Nov 6, 7:15 AM',
   desc='SHOCK OPEN: a "Workout · 1 hour" reminder buzzes at him slumped on the couch; he swipes it away; a 1:00:00 card gets a red X; "commit to 2 minutes": a 2:00 timer beeps, he gets up, shoes on (they glow), door opens, out on the road at dawn; 0:00 DING, "stop?"… a held breath, then the drop: the timer flips into a stopwatch racing to 45:12 while he sprints into the sunrise → "Just start. 2 minutes."',
   hook="Can't make yourself start? Try the 2-minute rule. 🟡", msg="Don't commit to an hour. Commit to 2 minutes: shoes on, door open. When the timer hits zero you're allowed to stop. You almost never will. Starting is the hard part.", cta="Save this for the next time you're stuck on the couch.",
   ig_tags='#ownpace #motivation #discipline #productivity #habits',
   tt="The 2-minute rule: when you can't make yourself start, commit to just 2 minutes and you're allowed to stop after 🟡 What are you starting today? 👇\n#productivity #discipline #motivation #habits #fyp #ownpace",
   yt="Can't Make Yourself Start? Try the 2-Minute Rule 🟡 #shorts", yt_desc="Don't commit to an hour. Commit to 2 minutes, then you're allowed to stop. You won't. Starting is the hard part.", yt_tags='#productivity #discipline #motivation #habits #ownpace'),
 83: dict(title='Year 4. Still Nothing.', dur=18.0, cover=0.3, slot='Fri Nov 6, 12:15 PM',
   desc='ENDING FIRST: a giant gold bamboo towers over him (THE ENDING), then rewinds into the dirt; YEAR 1–3 he kneels and waters an empty patch through snow and sun while two others laugh; YEAR 4 a storm, he sits down, defeated… then gets up and waters again; X-ray under the soil: a huge glowing root network; YEAR 5 it erupts (WEEK 1→6) and the camera chases it up into the sky while the laughers stare → "You\'re not behind. You\'re building roots."',
   hook='Would you have quit in year 4? 🟡', msg="Year 1, nothing. Year 2, nothing. Year 3, still nothing. Underground, the bamboo was building roots. Then it shot up in weeks. Slow years aren't wasted years.", cta="Send this to someone who's still in year 4.",
   ig_tags='#ownpace #patience #keepgoing #motivation #growth',
   tt="The bamboo story: years of nothing above ground, then it shoots up in weeks because it was building roots the whole time 🟡 What year are you in? 👇\n#patience #keepgoing #motivation #growthmindset #fyp #ownpace",
   yt="Would You Quit in Year 4? 🟡 The Bamboo Story #shorts", yt_desc="Years of nothing above ground while the roots grow. Then it shoots up in weeks. You're not behind, you're building roots.", yt_tags='#patience #keepgoing #motivation #growthmindset #ownpace'),
}
def ig(n): v = V[n]; return '\n\n'.join([v['hook'], v['msg'], v['cta'], FOLLOW, v['ig_tags']])
def tt(n): return V[n]['tt']
def yt(n): v = V[n]; return f"{v['yt_desc']}\n\n{SUB}\n\n{v['yt_tags']}"
for n, v in V.items():
    assert len(v['yt']) <= 100 and len(v['ig_tags'].split()) == 5 and '#ownpace' in v['ig_tags']
    tags = [w for w in v['tt'].split() if w.startswith('#')]; assert len(tags) == 6 and '#fyp' in tags and '#ownpace' in tags, tags
    assert len(v['yt_tags'].split()) == 5
if __name__ == '__main__':
    import re
    p = '/home/claude/rat-race/content-log.md'; s = open(p).read()
    if '| 82 |' not in s:
        rows = '\n'.join(f"| {n} | {V[n]['title']} ({V[n]['dur']} s, original, our own score) | {STYLE} | proposed {V[n]['slot']} | {V[n]['cover']} | 🎬 Rendered Nov 3, awaiting approval |" for n in (82, 83, 84))
        i = s.index('\n', s.index('| 81 |')); s = s[:i] + '\n' + rows + s[i:]
        sec = ['', '## 82–84. Originals from the Nov 3 daily run (desktop offline, no new reels; v3 style, no voice)']
        for n in (82, 83, 84):
            v = V[n]; sec += ['', f"## {n}. {v['title']} ({STYLE}) — {v['dur']} s", v['desc'],
                f"- **IG:** {ig(n).replace(chr(10)+chr(10), ' / ')}", f"- **TikTok:** {tt(n).replace(chr(10), ' ')}", f"- **YouTube:** {v['yt']} — Description: {yt(n).replace(chr(10)+chr(10), ' / ')}"]
        s = s.rstrip('\n') + '\n' + '\n'.join(sec) + '\n'
        open(p, 'w').write(s)
    print('ok')
