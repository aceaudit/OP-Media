// vo.js — voiceover video engine (70+): the creator's audio, word-synced captions, our own 2D scenes acting out each line.
// Needs rig2d.js + v2.js first. Pages are canvas-only (rendered by rf.cjs).
const TAU = Math.PI * 2;
const fig = (J, blur = 20) => drawFigure(ctx, J, GOLD, GOLD_FAR, GOLD_GLOW, blur);
const figWhite = (J, a = 0.6, blur = 8) => { ctx.save(); ctx.globalAlpha *= a; drawFigure(ctx, J, WHITE, WHITE_FAR, WHITE_GLOW, blur); ctx.restore(); };
const figCol = (J, col, far, glow, blur = 12) => drawFigure(ctx, J, col, far, glow, blur);
const GREY = '#8d8a85', GREY_FAR = '#5c5a56', GREY_GLOW = 'rgba(160,160,160,0.25)';
const RED = '#ff6b5e', GOLDL = '#ffc95e', INK = '#1a1408';
function armIK(S, T) {
  const dx = T[0] - S[0], dy = T[1] - S[1], l1 = L.upper, l2 = L.fore;
  const d = Math.max(1, Math.min(Math.hypot(dx, dy), (l1 + l2) * 0.999)), a = Math.atan2(dx, dy);
  const c1 = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)), th = Math.acos(clamp((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2), -1, 1));
  return [a - c1, Math.PI - th];
}
// pose with both hands placed by IK (targets may be null to keep the pose's arm)
function reach(P, x, floor, tN, tF, lift = 0) {
  let J = solve(P, x, floor, lift); const Q = { ...P };
  if (tN) { const [s, e] = armIK(J.sh, tN(J)); Q.shN = s; Q.elN = e; }
  if (tF) { const [s, e] = armIK(J.sh, tF(J)); Q.shF = s; Q.elF = e; }
  return [Q, solve(Q, x, floor, lift)];
}
// draw any figure rotated about a pivot (lying in bed, falling…)
function rotated(px, py, ang, fn) { ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.translate(-px, -py); fn(); ctx.restore(); }
const mirrorX = (cx, fn) => { ctx.save(); ctx.translate(cx, 0); ctx.scale(-1, 1); ctx.translate(-cx, 0); fn(); ctx.restore(); };

// ---------------------------------------------------------------- captions
// PH: [[ [t,'word'], … ], …]   word suffix * = key (gold), ! = stamp (big, own line)
let CAP = { y: 400, gap: 24, size: 62, big: 104, wrap: 920, end: 1e9, back: true };
function captions(t, PH) {
  if (t >= CAP.end) return;
  let k = -1; for (let i = 0; i < PH.length; i++) if (t >= PH[i][0][0] - 0.05) k = i; if (k < 0) k = 0;
  if (PH[k].hideAt && t >= PH[k].hideAt) return;
  const words = PH[k].map(([ts, w]) => ({ ts, big: w.endsWith('!'), key: w.endsWith('*') || w.endsWith('!'), w: w.replace(/[*!]$/, '') }));
  const lines = []; let cur = [], cw = 0;
  words.forEach((x) => {
    x.sz = x.big ? CAP.big : CAP.size; ctx.font = `700 ${x.sz}px Poppins`; x.wd = ctx.measureText(x.w).width;
    if (x.big && x.wd > 1000) { x.sz *= 1000 / x.wd; x.wd = 1000; }
    if (x.big) { if (cur.length) lines.push(cur); lines.push([x]); cur = []; cw = 0; return; }
    const sp = cur.length ? CAP.gap : 0; if (cw + sp + x.wd > CAP.wrap && cur.length) { lines.push(cur); cur = []; cw = 0; }
    cur.push(x); cw += (cur.length > 1 ? CAP.gap : 0) + x.wd;
  });
  if (cur.length) lines.push(cur);
  const lh = lines.map((ln) => (ln[0].big ? CAP.big * 1.14 : CAP.size * 1.23)), H = lh.reduce((a, b) => a + b, 0);
  let y = CAP.y - H / 2;
  if (CAP.back) { ctx.save(); const g = ctx.createLinearGradient(0, CAP.y - 240, 0, CAP.y + 220); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.35, 'rgba(0,0,0,0.42)'); g.addColorStop(0.65, 'rgba(0,0,0,0.42)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, CAP.y - 240, 1080, 460); ctx.restore(); }
  lines.forEach((ln, li) => {
    const W = ln.reduce((a, x, i) => a + x.wd + (i ? CAP.gap : 0), 0); let x = 540 - W / 2; y += lh[li];
    ln.forEach((wd) => {
      const on = t >= wd.ts, age = t - wd.ts, cx = x + wd.wd / 2, base = y - wd.sz * 0.29;
      ctx.save(); ctx.translate(cx, base);
      const sc = on ? (wd.big ? lerp(0.55, 1, easeOutBack(clamp(age / 0.25))) : 1 + 0.06 * Math.exp(-age / 0.12)) : 1;
      if (wd.big && on) { const [sx, sy] = shakeXY(t, wd.ts + 0.15, 6, 0.2); ctx.translate(sx, sy); }
      ctx.scale(sc, sc);
      ctx.font = `700 ${wd.sz}px Poppins`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.globalAlpha = on ? 1 : (wd.big ? 0 : 0.4);
      ctx.fillStyle = on && wd.key ? GOLDL : '#ffffff';
      ctx.shadowColor = on && wd.key ? 'rgba(255,170,50,0.75)' : 'rgba(0,0,0,0.9)'; ctx.shadowBlur = on && wd.key ? 28 : 16;
      ctx.fillText(wd.w, 0, 0); ctx.restore();
      x += wd.wd + CAP.gap;
    });
  });
}
// two-line end text in the caption area: lines = [['white text','#fff'], ['gold text', GOLDL]]
function endText(t, t0, lines, size = 66) {
  if (t < t0) return; const k = popK(t, t0, 0.3);
  ctx.save(); ctx.translate(540, CAP.y); ctx.scale(k, k); ctx.font = `700 ${size}px Poppins`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const lh = size * 1.2, y0 = -(lines.length - 1) * lh / 2;
  lines.forEach(([s, c], i) => { ctx.fillStyle = c; ctx.shadowColor = c === '#fff' ? 'rgba(0,0,0,0.9)' : 'rgba(255,170,50,0.75)'; ctx.shadowBlur = c === '#fff' ? 18 : 26; ctx.fillText(s, 0, y0 + i * lh); });
  ctx.restore();
}

// ---------------------------------------------------------------- scenes
// SC = [[t0,t1], …], SCENES = [fn, …]; crossfade + slight scale-in at each cut
function runScenes(t, SC, SCENES, cx = 540, cy = 1000) {
  SCENES.forEach((fn, i) => {
    const [a, b] = SC[i]; const al = (a <= 0 ? 1 : smooth(a - 0.05, a + 0.15, t)) * (1 - smooth(b - 0.12, b + 0.05, t));
    if (al <= 0.001) return;
    ctx.save(); ctx.globalAlpha = al;
    const k = a <= 0 ? 1 : lerp(0.94, 1, easeOut(clamp((t - a) / 0.25)));
    ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy);
    fn(t, t - a); ctx.restore();
  });
}

// ---------------------------------------------------------------- props
function panel(x, y, w, h, r = 26, stroke = 'rgba(255,255,255,0.18)', fill = 'rgba(22,21,26,0.95)', lw = 3) {
  ctx.save(); ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); if (stroke) ctx.stroke(); ctx.restore();
}
function txt(s, x, y, size = 40, col = '#f4f2ee', weight = 700, align = 'center', glow = null, spacing = 0) {
  ctx.save(); ctx.font = `${weight} ${size}px Poppins`; ctx.letterSpacing = spacing + 'px'; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = col;
  if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 24; } ctx.fillText(s, x, y); ctx.restore();
}
function counter(x, y, lab, val, col = '#f4f2ee', w = 280, h = 150) {
  const gold = col === GOLDL; panel(x - w / 2, y - h / 2, w, h, 26, gold ? 'rgba(255,201,94,0.6)' : 'rgba(255,255,255,0.18)');
  txt(lab, x, y - h / 2 + 38, 24, gold ? '#ffd98a' : 'rgba(240,238,232,0.75)', 700, 'center', null, 6);
  txt(String(val), x, y + 22, Math.min(80, h * 0.52), col, 700);
}
function star(x, y, r, col = GOLDL, glow = 30, k = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k); ctx.fillStyle = col; ctx.shadowColor = 'rgba(255,180,60,1)'; ctx.shadowBlur = glow; ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.43 : r; ctx.lineTo(rr * Math.cos(a), rr * Math.sin(a)); } ctx.closePath(); ctx.fill(); ctx.restore();
}
function glowDot(x, y, r, a = 0.6, col = '255,200,110') { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.save(); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); }
function heart(x, y, s, col = RED, glow = 0, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * k / 50, s * k / 50); ctx.fillStyle = col; if (glow) { ctx.shadowColor = col; ctx.shadowBlur = glow; }
  ctx.beginPath(); ctx.moveTo(0, 18); ctx.bezierCurveTo(-50, -14, -26, -50, 0, -26); ctx.bezierCurveTo(26, -50, 50, -14, 0, 18); ctx.fill(); ctx.restore();
}
function check(x, y, s = 40, col = GOLDL, k = 1, lw = 10) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.beginPath(); ctx.moveTo(-s * 0.5, 0); ctx.lineTo(-s * 0.15, s * 0.35); ctx.lineTo(s * 0.55, -s * 0.4); ctx.stroke(); ctx.restore();
}
function cross(x, y, s = 40, col = RED, k = 1, lw = 10) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-s / 2, -s / 2); ctx.lineTo(s / 2, s / 2); ctx.moveTo(s / 2, -s / 2); ctx.lineTo(-s / 2, s / 2); ctx.stroke(); ctx.restore();
}
function cloud(x, y, s = 1, col = 'rgba(120,124,140,0.95)') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.beginPath();
  ctx.arc(-50, 10, 34, 0, TAU); ctx.arc(-10, -14, 46, 0, TAU); ctx.arc(40, 4, 38, 0, TAU); ctx.arc(70, 18, 24, 0, TAU); ctx.fill();
  ctx.fillRect(-70, 10, 160, 34); ctx.restore();
}
function rain(x, y, w, h, t, n = 14, col = 'rgba(150,180,230,0.7)', sd = 1) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const ph = ((i * 0.618 + sd * 0.37) % 1), xx = x + ((i * 53 + sd * 17) % w), yy = y + ((t * 900 + ph * h) % h); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx - 6, yy + 22); ctx.stroke(); }
  ctx.restore();
}
function bubble(x, y, r, k, hx, hy, fill = 'rgba(22,21,26,0.95)', stroke = GOLDL) {
  if (k <= 0) return;
  ctx.save(); ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 4;
  [[0.78, 0.13], [0.9, 0.08]].forEach(([u, rr]) => { ctx.beginPath(); ctx.arc(lerp(x, hx, u), lerp(y, hy, u), r * rr * k, 0, TAU); ctx.fill(); ctx.stroke(); });
  ctx.translate(x, y); ctx.scale(k, k); ctx.shadowColor = 'rgba(255,180,60,0.35)'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
}
function speech(x, y, w, h, k, tailX, tailY, fill = '#f4f2ee') {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2.4); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-14, h / 2 - 4); ctx.lineTo((tailX - x) / k, (tailY - y) / k); ctx.lineTo(14, h / 2 - 4); ctx.fill(); ctx.restore();
}
function zzz(x, y, t, a = 1) { for (let i = 0; i < 3; i++) { const u = ((t * 0.6 + i / 3) % 1); txt('z', x + u * 60, y - u * 120, 30 + u * 26, `rgba(255,217,138,${(a * Math.sin(Math.PI * u)).toFixed(3)})`, 700); } }
function sweat(x, y, t, n = 3) { for (let i = 0; i < n; i++) { const u = ((t * 1.4 + i / n) % 1); ctx.save(); ctx.globalAlpha *= 1 - u; ctx.fillStyle = '#8fc8ff'; ctx.beginPath(); const xx = x + (i - 1) * 24 + u * (i - 1) * 30, yy = y + u * 70; ctx.arc(xx, yy, 6, 0, TAU); ctx.moveTo(xx - 6, yy); ctx.lineTo(xx, yy - 14); ctx.lineTo(xx + 6, yy); ctx.fill(); ctx.restore(); } }
function speedLines(t, y0, y1, n = 10, dir = -1, a = 0.25, len = 140) {
  ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const y = lerp(y0, y1, (i * 0.618) % 1), x = ((i * 397 - dir * t * 1600) % 1300 + 1300) % 1300 - 110; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - dir * len * (0.6 + 0.4 * ((i * 0.37) % 1)), y); ctx.stroke(); }
  ctx.restore();
}
function bar(x, y, w, h, u, col = GOLDL, back = 'rgba(255,255,255,0.12)', glow = true) {
  ctx.save(); ctx.fillStyle = back; ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();
  if (u > 0) { ctx.fillStyle = col; if (glow) { ctx.shadowColor = col; ctx.shadowBlur = 16; } ctx.beginPath(); ctx.roundRect(x, y, Math.max(h, w * clamp(u)), h, h / 2); ctx.fill(); } ctx.restore();
}
// big stamped word that slams in (scale down from 1.6) with shake
function stamp(s, x, y, t, t0, col = GOLDL, size = 90, rot = -0.08, box = true, tOut = 1e9) {
  if (t < t0 || t >= tOut) return; const u = clamp((t - t0) / 0.16), sc = lerp(1.7, 1, easeOut(u)), [sx, sy] = shakeXY(t, t0 + 0.16, 8, 0.15);
  ctx.save(); ctx.translate(x + sx, y + sy); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(u * 2);
  ctx.font = `700 ${size}px Poppins`; const w = ctx.measureText(s).width;
  if (box) { ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-w / 2 - 30, -size * 0.72, w + 60, size * 1.44, 18); ctx.stroke(); }
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.fillText(s, 0, size * 0.05); ctx.restore();
}
function arrowLine(x0, y0, x1, y1, col = GOLDL, w = 8, head = 26) {
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  const a = Math.atan2(y1 - y0, x1 - x0); ctx.translate(x1, y1); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(head * 0.4, 0); ctx.lineTo(-head, -head * 0.7); ctx.lineTo(-head, head * 0.7); ctx.fill(); ctx.restore();
}
function clockFace(x, y, r, hh, mm, ring = 0, t = 0, col = '#f4f1ea') {
  ctx.save(); ctx.translate(x, y); if (ring > 0) ctx.rotate(0.12 * ring * Math.sin(t * 60));
  // bells
  ctx.fillStyle = '#d9d4c8'; [-1, 1].forEach((s) => { ctx.beginPath(); ctx.arc(s * r * 0.62, -r * 0.88, r * 0.3, Math.PI, 0); ctx.fill(); });
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2a2622'; ctx.lineWidth = r * 0.09; ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.fillStyle = '#2a2622'; ctx.fillRect(Math.sin(a) * r * 0.78 - 2, -Math.cos(a) * r * 0.78 - 2, 5, 5); }
  const ha = ((hh % 12) + mm / 60) / 12 * TAU, ma = mm / 60 * TAU; ctx.strokeStyle = '#2a2622'; ctx.lineCap = 'round';
  ctx.lineWidth = r * 0.08; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(ha) * r * 0.48, -Math.cos(ha) * r * 0.48); ctx.stroke();
  ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(ma) * r * 0.7, -Math.cos(ma) * r * 0.7); ctx.stroke();
  ctx.fillStyle = '#d4553d'; ctx.beginPath(); ctx.arc(0, 0, r * 0.07, 0, TAU); ctx.fill();
  ctx.restore();
  if (ring > 0) { ctx.save(); ctx.strokeStyle = `rgba(255,217,138,${0.8 * ring})`; ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (const s of [-1, 1]) for (let j = 0; j < 3; j++) { const rr = r * (1.25 + 0.22 * j) + 8 * Math.sin(t * 30 + j); ctx.beginPath(); ctx.arc(x, y, rr, s > 0 ? -0.5 : Math.PI - 0.5 + 1, s > 0 ? 0.5 : Math.PI + 0.5 - 1 + 1); ctx.stroke(); } ctx.restore(); }
}
function bed(x, y, w = 420) { ctx.save(); ctx.fillStyle = '#3c3326'; ctx.fillRect(x - w / 2, y - 70, 22, 130); ctx.fillRect(x + w / 2 - 22, y - 30, 22, 90); ctx.fillStyle = '#5a4a36'; ctx.fillRect(x - w / 2, y, w, 34); ctx.fillStyle = '#e9e4da'; ctx.beginPath(); ctx.roundRect(x - w / 2 + 24, y - 26, w - 48, 30, 10); ctx.fill(); ctx.fillStyle = '#f6f3ec'; ctx.beginPath(); ctx.roundRect(x - w / 2 + 30, y - 52, 100, 30, 14); ctx.fill(); ctx.restore(); }
function blanket(x, y, w = 420, col = '#6f8fb3') { ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - w / 2 + 120, y - 46, w - 150, 50, 18); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(x - w / 2 + 120, y - 46, 18, 50); ctx.restore(); }
function sparkle(x, y, s, t, ph = 0, col = '#fff') { const k = 0.5 + 0.5 * Math.sin(t * 6 + ph); ctx.save(); ctx.translate(x, y); ctx.scale(s * k, s * k); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(3, -3); ctx.lineTo(12, 0); ctx.lineTo(3, 3); ctx.lineTo(0, 12); ctx.lineTo(-3, 3); ctx.lineTo(-12, 0); ctx.lineTo(-3, -3); ctx.fill(); ctx.restore(); }
function rays(x, y, r0, r1, n, t, a = 0.2, col = '255,201,94') { ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.2); for (let i = 0; i < n; i++) { ctx.rotate(TAU / n); const g = ctx.createLinearGradient(r0, 0, r1, 0); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(r0, -8); ctx.lineTo(r1, -36); ctx.lineTo(r1, 36); ctx.lineTo(r0, 8); ctx.fill(); } ctx.restore(); }
// soft spotlight cone from above onto (x, floor)
function spotlight(x, floor, a = 0.18, w = 220) { ctx.save(); const g = ctx.createLinearGradient(0, floor - 900, 0, floor); g.addColorStop(0, `rgba(255,230,180,0)`); g.addColorStop(1, `rgba(255,230,180,${a})`); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 40, floor - 900); ctx.lineTo(x + 40, floor - 900); ctx.lineTo(x + w, floor); ctx.lineTo(x - w, floor); ctx.fill(); ctx.fillStyle = `rgba(255,230,180,${a * 0.8})`; ctx.beginPath(); ctx.ellipse(x, floor + 4, w, 26, 0, 0, TAU); ctx.fill(); ctx.restore(); }

// ---------------------------------------------------------------- frame
let DUST; const W_DUST = () => (DUST = DUST || makeDust(40));
function frame(t, fnScenes, PH, after) {
  background(t, W_DUST());
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  fnScenes(t);
  setFigureScale(1); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  vignette();
  if (PH) captions(t, PH);
  if (after) after(t);
  return true;
}
