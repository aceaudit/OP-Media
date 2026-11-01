# assemble vNN.html from the shared head, a PH file and a body file: python3 tools/assemble.py NN ph.js body.js
import sys
n, ph, body = sys.argv[1:4]
head = open('v1batch/v74.html').read().split('<script src="vo.js"></script>')[0] + '<script src="vo.js"></script>\n<script src="cine.js"></script>\n<script>\n'
open(f'v{n}.html', 'w').write(head + open(ph).read() + '\n' + open(body).read() + '</script>\n</body>\n</html>\n')
