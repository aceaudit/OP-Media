const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const ROOT = '/home/claude/rat-race';
const server = http.createServer((req, res) => { const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': p.endsWith('.html') ? 'text/html' : p.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); res.end(d); }); });
(async () => {
  await new Promise((r) => server.listen(+(process.env.PORT||8401), r));
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('http://localhost:' + (process.env.PORT||8401) + '/' + process.argv[2]);
  await p.waitForFunction(() => window.__allSteps);
  console.log(JSON.stringify(await p.evaluate(() => window.__allSteps)));
  await b.close(); server.close();
})();
