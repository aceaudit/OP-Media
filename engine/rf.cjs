// Fast renderer for canvas-only pages (70+): CPU raster (--disable-gpu) + canvas.toDataURL, piped straight into ffmpeg.
// usage: node rf.cjs <page.html> <out.mp4> <audio.wav> <dur>          → full render + encode (watermark, -14 LUFS)
//        node rf.cjs <page.html> <outDir> stills t1,t2,...           → PNG stills at full size
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const ROOT = __dirname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (err, data) => { if (err) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); res.end(data); });
});
(async () => {
  const [pg, out, a3, a4] = process.argv.slice(2);
  const port = await new Promise((r) => server.listen(0, () => r(server.address().port)));
  const browser = await chromium.launch({ args: ['--disable-gpu'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
  page.on('pageerror', (e) => { console.log('[pageerror]', e.message); process.exitCode = 2; });
  await page.goto(`http://localhost:${port}/${pg}`);
  await page.waitForFunction(() => window.renderFrame && window.sceneReady);
  await page.evaluate(() => window.sceneReady);
  const grab = (t, type) => page.evaluate(([t, type]) => { window.renderFrame(t); const c = document.getElementById('c'); return type === 'png' ? c.toDataURL('image/png').slice(22) : c.toDataURL('image/jpeg', 0.95).slice(23); }, [t, type]);
  const t0 = Date.now();
  if (a3 === 'stills') {
    fs.mkdirSync(out, { recursive: true });
    for (const t of a4.split(',').map(Number)) fs.writeFileSync(path.join(out, `t${t.toFixed(2)}.png`), Buffer.from(await grab(t, 'png'), 'base64'));
  } else {
    const fps = 60, n = Math.round(Number(a4) * fps), tmp = out.replace(/\.mp4$/, '.part.mp4');
    const WM = '/home/claude/ownpace-logo/ownpace-video-watermark.png';
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-i', a3, '-i', WM,
      '-filter_complex', '[2]scale=252:-1,format=rgba,colorchannelmixer=aa=0.9[wm];[0][wm]overlay=(W-w)/2:1528,noise=alls=3:allf=t,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[v];[1]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]',
      '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', process.env.PRESET || 'slow', '-crf', '14', '-profile:v', 'high', '-level', '4.2', '-maxrate', '30M', '-bufsize', '60M', '-g', '120',
      '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
      '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-t', String(n / fps), '-movflags', '+faststart', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((r) => ff.on('close', r));
    for (let i = 0; i < n; i++) {
      const buf = Buffer.from(await grab(i / fps, 'jpg'), 'base64');
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      if (i % 300 === 0) console.log(`frame ${i}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end(); const code = await done;
    if (code !== 0) { console.log('ffmpeg failed', code); process.exitCode = 1; } else fs.renameSync(tmp, out);
  }
  await browser.close(); server.close();
  console.log('done', ((Date.now() - t0) / 1000).toFixed(1) + 's');
})();
