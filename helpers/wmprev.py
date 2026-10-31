import sys
from PIL import Image
d, out, ts = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
wm = Image.open('/home/claude/ownpace-logo/ownpace-video-watermark.png').convert('RGBA')
wm = wm.resize((252, round(wm.height * 252 / wm.width)))
ims = []
for t in ts:
    im = Image.open(f'{d}/t{float(t):.2f}.png').convert('RGBA'); im.alpha_composite(wm, ((1080 - 252) // 2, 1528))
    ims.append(im.convert('RGB').resize((540, 960)))
W = Image.new('RGB', (540 * len(ims), 960))
for i, im in enumerate(ims): W.paste(im, (540 * i, 0))
W.save(out)
