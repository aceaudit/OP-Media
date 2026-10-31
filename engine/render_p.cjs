// usage: node render.cjs <outDir> <fps> [t1,t2,...]   (times list = preview stills)
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/npm-tools/node_modules/playwright');

const ROOT = __dirname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
    res.end(data);
  });
});

(async () => {
  const [outDir, fpsArg, list] = process.argv.slice(2);
  const fps = Number(fpsArg || 30);
  fs.mkdirSync(outDir, { recursive: true });
  await new Promise((r) => server.listen(+(process.env.PORT || 8123), r));
  const browser = await chromium.launch({
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto('http://localhost:' + (process.env.PORT || 8123) + '/' + (process.env.PAGE || 'scene.html'));
  await page.waitForFunction(() => window.renderFrame && window.sceneReady);
  await page.evaluate(() => window.sceneReady);

  const times = list ? list.split(',').map(Number) : Array.from({ length: Math.round(Number(process.env.DUR || 14) * fps) }, (_, i) => i / fps);
  const t0 = Date.now();
  for (let i = +(process.env.START || 0); i < times.length; i++) {
    await page.evaluate((t) => window.renderFrame(t), times[i]);
    const ext = (!list && process.env.FMT === 'jpg') ? 'jpg' : 'png';
    const name = list ? `t${times[i].toFixed(2)}.png` : `f${String(i).padStart(4, '0')}.${ext}`;
    await page.screenshot(ext === 'jpg' ? { path: path.join(outDir, name), type: 'jpeg', quality: 95 } : { path: path.join(outDir, name) });
    if (i % 20 === 0) console.log(`frame ${i}/${times.length}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  await browser.close();
  server.close();
  console.log('done', ((Date.now() - t0) / 1000).toFixed(1) + 's');
})();
