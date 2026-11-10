# build vNN.html from batch88/pNN.py (PHRASES) + rat-race/vNN.body.js, using v87.html's head
import sys
sys.path.insert(0, '/home/claude/batch82')
from mkph_text import ph
RR = '/home/claude/rat-race/'
n = sys.argv[1]
head = open(RR + 'v87.html').read()
head = head[:head.index('<script>\nconst PH')]
ns = {}; exec(open(f'/home/claude/batch88/p{n}.py').read(), ns)
body = open(RR + f'v{n}.body.js').read()
open(RR + f'v{n}.html', 'w').write(head + '<script>\n' + ph(ns['PHRASES']) + body + '</script>\n</body>\n</html>\n')
print('built', n)
