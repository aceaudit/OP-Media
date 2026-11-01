// cine.js — Own Pace v3 (rebuild of 70–81): the recurring character (expressive face + cream scarf), a cinematic camera,
// depth/light atmosphere, impact effects and hook tools (text hook, shock open, flash-forward + rewind, whip cuts).
// Load after rig2d.js, v2.js and vo.js.
const SCARF = '#f4efe3', SCARF_D = '#c9c1b0', FACE_INK = '#2a1606';
// ---------------------------------------------------------------- expressions
const EXPR = {
  neutral: { brow: 0.0, browY: 0.0, eye: 1.0, mouth: 0.15, open: 0.0, blush: 0 },
  calm: { brow: 0.05, browY: 0.02, eye: 0.7, mouth: 0.35, open: 0.0, blush: 0.2 },
  happy: { brow: -0.05, browY: -0.06, eye: 0.85, mouth: 0.75, open: 0.15, blush: 0.5 },
  joy: { brow: -0.1, browY: -0.14, eye: -1.0, mouth: 1.0, open: 0.75, blush: 0.8 },     // eye < 0 → happy ^ arcs
  proud: { brow: -0.1, browY: -0.04, eye: -0.8, mouth: 0.7, open: 0.0, blush: 0.6 },
  sad: { brow: 0.55, browY: 0.02, eye: 0.75, mouth: -0.6, open: 0.0, blush: 0 },
  cry: { brow: 0.7, browY: 0.0, eye: 0.55, mouth: -0.8, open: 0.25, blush: 0, tears: 1 },
  angry: { brow: -0.7, browY: 0.08, eye: 0.8, mouth: -0.45, open: 0.1, blush: 0 },
  determined: { brow: -0.45, browY: 0.06, eye: 0.7, mouth: -0.1, open: 0.0, blush: 0 },
  shock: { brow: 0.15, browY: -0.28, eye: 1.35, mouth: 0.0, open: 1.0, blush: 0 },
  worried: { brow: 0.5, browY: -0.04, eye: 1.0, mouth: -0.35, open: 0.15, blush: 0 },
  tired: { brow: 0.3, browY: 0.06, eye: 0.38, mouth: -0.25, open: 0.0, blush: 0 },
  sleep: { brow: 0.1, browY: 0.04, eye: 0.0, mouth: 0.15, open: 0.1, blush: 0.2 },
  smug: { brow: -0.2, browY: 0.0, eye: 0.55, mouth: 0.55, open: 0.0, blush: 0.2 },
  strain: { brow: -0.55, browY: 0.08, eye: 0.25, mouth: -0.3, open: 0.5, blush: 0.3 },
  ko: { brow: 0.0, browY: 0.0, eye: 9, mouth: -0.2, open: 0.3, blush: 0 },   // eye 9 → X X
};
function exprMix(a, b, u) { const A = typeof a === 'string' ? EXPR[a] : a, B = typeof b === 'string' ? EXPR[b] : b; if (u <= 0) return A; if (u >= 1) return B; const o = {}; for (const k of ['brow', 'browY', 'eye', 'mouth', 'open', 'blush']) o[k] = lerp(A[k] || 0, B[k] || 0, u); o.tears = lerp(A.tears || 0, B.tears || 0, u); if ((A.eye === 9) !== (B.eye === 9)) o.eye = u < 0.5 ? A.eye : B.eye; return o; }
// expression track: [[t, 'name'], …] with 0.15 s blends
function exprAt(track, t) { let cur = track[0][1], prevT = -9, prev = cur; for (const [ts, e] of track) { if (t >= ts) { prev = cur; cur = e; prevT = ts; } } return exprMix(prev, cur, clamp((t - prevT) / 0.15)); }
const blinkAt = (t, seed = 0) => { const p = ((t + seed * 1.7) % 3.3); return p < 0.12 ? Math.abs(Math.cos(p / 0.12 * Math.PI)) : 1; };
// draws the face on a head at (hx, hy), radius r, facing +x, tilted by ang
function face(hx, hy, r, ang, E, t = 0, seed = 0) {
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowBlur = 0;
  if (E.blush > 0.01) { ctx.fillStyle = `rgba(255,120,90,${(0.32 * E.blush).toFixed(3)})`; ctx.beginPath(); ctx.ellipse(0.22 * r, 0.22 * r, 0.16 * r, 0.1 * r, 0, 0, TAU); ctx.fill(); }
  const ex = 0.36 * r, ey = -0.08 * r;
  ctx.fillStyle = FACE_INK; ctx.strokeStyle = FACE_INK; ctx.lineWidth = Math.max(2, 0.08 * r);
  if (E.eye === 9) { const s = 0.13 * r; ctx.beginPath(); ctx.moveTo(ex - s, ey - s); ctx.lineTo(ex + s, ey + s); ctx.moveTo(ex + s, ey - s); ctx.lineTo(ex - s, ey + s); ctx.stroke(); }
  else if (E.eye < 0) { ctx.beginPath(); ctx.arc(ex, ey + 0.06 * r, 0.12 * r, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  else { const open = E.eye * blinkAt(t, seed); if (open < 0.12) { ctx.beginPath(); ctx.arc(ex, ey - 0.04 * r, 0.12 * r, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
    else { ctx.beginPath(); ctx.ellipse(ex, ey, 0.115 * r * (E.eye > 1.1 ? 1.15 : 1), 0.19 * r * Math.min(1.4, open), 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + 0.035 * r, ey - 0.07 * r * Math.min(1, open), 0.045 * r, 0, TAU); ctx.fill(); ctx.fillStyle = FACE_INK; } }
  // brow: positive = front end raised (sad/worried), negative = front end lowered (angry/determined)
  const by = ey - 0.33 * r + E.browY * r; ctx.lineWidth = Math.max(2, 0.085 * r);
  ctx.beginPath(); ctx.moveTo(ex - 0.17 * r, by + E.brow * 0.08 * r); ctx.lineTo(ex + 0.17 * r, by - E.brow * 0.14 * r); ctx.stroke();
  // mouth
  const m0 = [0.2 * r, 0.42 * r], m1 = [0.66 * r, 0.3 * r], mc = [(m0[0] + m1[0]) / 2, (m0[1] + m1[1]) / 2 + E.mouth * 0.2 * r];
  if (E.open > 0.2) { ctx.beginPath(); ctx.moveTo(...m0); ctx.quadraticCurveTo(mc[0], mc[1] + E.open * 0.22 * r, ...m1); ctx.quadraticCurveTo(mc[0], mc[1] - E.open * 0.12 * r * (E.mouth > 0.5 ? 0 : 1), ...m0); ctx.fill(); }
  else { ctx.lineWidth = Math.max(2, 0.075 * r); ctx.beginPath(); ctx.moveTo(...m0); ctx.quadraticCurveTo(...mc, ...m1); ctx.stroke(); }
  if (E.tears > 0.05) { ctx.fillStyle = `rgba(143,200,255,${(0.9 * E.tears).toFixed(3)})`; for (let i = 0; i < 2; i++) { const u = ((t * 1.3 + i * 0.5) % 1); ctx.beginPath(); ctx.ellipse(ex - 0.02 * r, ey + 0.2 * r + u * 0.9 * r, 0.05 * r, 0.08 * r, 0, 0, TAU); ctx.fill(); } }
  ctx.restore();
}
// the scarf: anchored at the neck, trailing behind (−x), flutter grows with speed
function scarf(J, t, speed = 0.3, flip = false) {
  const nx = lerp(J.neck[0], J.sh[0], 0.4), ny = lerp(J.neck[1], J.sh[1], 0.4) + 2, s = L.torso / 94;
  const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8, back = (34 + 70 * speed) * u * 1.6 * s, droop = (1 - speed) * 70 * u * u * s; pts.push([nx - back, ny + droop + Math.sin(t * (6 + 10 * speed) - i * 0.9) * (4 + 12 * speed) * u * s]); }
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8;
  for (let i = 0; i < 8; i++) { ctx.strokeStyle = i % 2 ? SCARF : '#ede6d6'; ctx.lineWidth = (16 - i * 1.1) * s; ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(...pts[i + 1]); ctx.stroke(); }
  ctx.restore();
  ctx.save(); ctx.fillStyle = SCARF; ctx.beginPath(); ctx.ellipse(nx + 2, ny, 13 * s, 9 * s, 0.2, 0, TAU); ctx.fill(); ctx.restore();
}
// THE hero: gold figure + scarf + bigger head + face. opts: {expr, t, speed, blur, headK, glow}
function hero(J, opts = {}) {
  const t = opts.t || 0, E = opts.expr ? (typeof opts.expr === 'string' ? EXPR[opts.expr] : opts.expr) : EXPR.neutral;
  const C = opts.col || [GOLD, GOLD_FAR, GOLD_GLOW];
  if (opts.scarf !== false && !opts.col) scarf(J, t, opts.speed ?? 0.3);
  drawFigure(ctx, J, C[0], C[1], C[2], opts.blur ?? 20);
  const r = L.head * (opts.headK || 1.28), ang = Math.atan2(J.head[0] - J.neck[0], -(J.head[1] - J.neck[1]));
  ctx.save(); ctx.fillStyle = C[0]; ctx.shadowColor = C[2]; ctx.shadowBlur = opts.blur ?? 20; ctx.beginPath(); ctx.arc(J.head[0], J.head[1], r, 0, TAU); ctx.fill();
  const hl = ctx.createRadialGradient(J.head[0] - r * 0.3, J.head[1] - r * 0.4, 1, J.head[0], J.head[1], r); hl.addColorStop(0, opts.col ? 'rgba(255,255,255,0.35)' : 'rgba(255,240,200,0.55)'); hl.addColorStop(1, 'rgba(255,240,200,0)'); ctx.shadowBlur = 0; ctx.fillStyle = hl; ctx.fill(); ctx.restore();
  face(J.head[0], J.head[1], r, ang, E, t, opts.seed || 0);
  return r;
}
// white side characters get simple faces too (dot eye + line mouth)
function extra(J, a = 0.6, mood = 0, t = 0, flip = false) {
  figWhite(J, a); const r = L.head; const ang = Math.atan2(J.head[0] - J.neck[0], -(J.head[1] - J.neck[1]));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(J.head[0], J.head[1]); ctx.rotate(ang); ctx.fillStyle = '#26252b'; ctx.strokeStyle = '#26252b'; ctx.lineWidth = Math.max(2, 0.1 * r); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0.38 * r, -0.08 * r, 0.11 * r * blinkAt(t, 3), 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0.2 * r, 0.42 * r); ctx.quadraticCurveTo(0.43 * r, 0.36 * r + mood * 0.2 * r, 0.66 * r, 0.3 * r); ctx.stroke(); ctx.restore();
}
// ---------------------------------------------------------------- camera
// keys: [[t, x, y, zoom, rot?], …] eased; shakes: [[t, amp, dur]]; punches: [[t, amount, dur]]
let CAMK = [[0, 540, 1000, 1]], SHAKES = [], PUNCHES = [];
function camAt(t) {
  let i = 0; while (i < CAMK.length - 1 && t >= CAMK[i + 1][0]) i++;
  const a = CAMK[i], b = CAMK[Math.min(i + 1, CAMK.length - 1)]; const u = a === b ? 0 : easeInOut(clamp((t - a[0]) / Math.max(0.001, b[0] - a[0])));
  let x = lerp(a[1], b[1], u), y = lerp(a[2], b[2], u), z = lerp(a[3], b[3], u), r = lerp(a[4] || 0, b[4] || 0, u);
  for (const [ts, amt, d] of PUNCHES) if (t >= ts && t < ts + d * 5) z *= 1 + amt * Math.exp(-(t - ts) / d);
  let sx = 0, sy = 0; for (const [ts, amp, d] of SHAKES) { const [a1, b1] = shakeXY(t, ts, amp, d); sx += a1; sy += b1; }
  return { x, y, z, r, sx, sy };
}
function applyCam(c) { ctx.translate(540 + c.sx, 1000 + c.sy); ctx.rotate(c.r); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); }
// ---------------------------------------------------------------- atmosphere (depth + light)
let ATMO = { tint: [255, 200, 120], tintA: 0.06, shafts: 0.10, bokeh: 1, floorGlow: 0.0 };
seed = 913; const BOKEH = Array.from({ length: 16 }, () => ({ x: rand() * 1300 - 110, y: rand() * 1500 + 300, r: lerp(30, 110, rand()), a: lerp(0.03, 0.09, rand()), s: lerp(0.15, 0.45, rand()), ph: rand() * 6 }));
function atmosphere(t, cam) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const bg = ctx.createRadialGradient(540, 1050, 80, 540, 1050, 1350); bg.addColorStop(0, '#16141a'); bg.addColorStop(1, '#050507'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1920);
  const [r, g, b] = ATMO.tint; if (ATMO.tintA > 0) { const tg = ctx.createRadialGradient(540, 900, 50, 540, 900, 1100); tg.addColorStop(0, `rgba(${r},${g},${b},${ATMO.tintA})`); tg.addColorStop(1, `rgba(${r},${g},${b},0)`); ctx.fillStyle = tg; ctx.fillRect(0, 0, 1080, 1920); }
  // far bokeh, with parallax against the camera
  if (ATMO.bokeh) for (const d of BOKEH) { const px = d.x - (cam.x - 540) * d.s * 0.5 + 30 * Math.sin(t * 0.2 + d.ph), py = d.y - (cam.y - 1000) * d.s * 0.5 - t * 6 * d.s; const yy = ((py % 1700) + 1700) % 1700 + 200;
    glowDot(px, yy, d.r * (0.8 + 0.4 * cam.z), d.a * ATMO.bokeh * (0.7 + 0.3 * Math.sin(t + d.ph)), `${r},${g},${b}`); }
  // light shafts from the top
  if (ATMO.shafts > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const x = 180 + i * 250 + 60 * Math.sin(t * 0.25 + i); const gr = ctx.createLinearGradient(0, 0, 0, 1600); gr.addColorStop(0, `rgba(${r},${g},${b},${ATMO.shafts * 0.9})`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 50, 0); ctx.lineTo(x + 260, 1600); ctx.lineTo(x + 40, 1600); ctx.closePath(); ctx.fill(); } ctx.restore(); }
  for (const d of W_DUST()) { const y = ((d.y - t * 14 * d.s) % 1920 + 1920) % 1920, x = d.x + 12 * Math.sin(t * 0.4 + d.ph); ctx.fillStyle = `rgba(232,214,170,${(d.a * (0.6 + 0.4 * Math.sin(t * 1.3 + d.ph))).toFixed(3)})`; ctx.beginPath(); ctx.arc(x, y, d.r, 0, 7); ctx.fill(); }
}
// big soft foreground particles drifting past the lens (screen space)
function foreground(t, a = 1) { for (let i = 0; i < 4; i++) { const x = ((i * 433 + t * (40 + i * 25)) % 1500) - 200, y = 700 + ((i * 271) % 900); glowDot(x, y, 70 + i * 25, 0.05 * a); } }
// ---------------------------------------------------------------- impact + transition effects (screen space)
function impactLines(t, t0, cx = 540, cy = 1000, d = 0.28, col = '255,240,210') {
  if (t < t0 || t > t0 + d) return; const u = (t - t0) / d; if (u >= 0.999) return; ctx.save(); ctx.globalAlpha = (1 - u) * 0.7; ctx.strokeStyle = `rgb(${col})`; ctx.lineCap = 'round';
  for (let i = 0; i < 36; i++) { const a = i / 36 * TAU + (i % 3) * 0.05, r0 = 260 + 500 * u + (i % 5) * 30, r1 = r0 + 160 + (i % 4) * 60; ctx.lineWidth = 3 + (i % 3) * 2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke(); }
  ctx.restore();
}
function whipLines(t, tc, d = 0.16, dir = 1) {
  const u = 1 - Math.abs(t - tc) / d; if (u <= 0) return; ctx.save(); ctx.globalAlpha = 0.55 * u; ctx.fillStyle = '#fff';
  for (let i = 0; i < 26; i++) { const y = (i * 137) % 1920, w = 200 + (i * 53) % 500, x = ((i * 311 + t * 6000 * dir) % 1600) - 300; ctx.fillRect(x, y, w, 3 + (i % 3) * 2); } ctx.restore();
}
// VHS-style rewind overlay
function rewindFX(t, a = 1) {
  ctx.save(); ctx.globalAlpha = 0.85 * a; ctx.fillStyle = 'rgba(255,255,255,0.08)'; for (let i = 0; i < 9; i++) { const y = ((i * 211 + t * 2600) % 1920); ctx.fillRect(0, y, 1080, 6 + (i % 3) * 5); }
  ctx.globalAlpha = a; txt('◀◀  REWIND', 70, 268, 40, '#ffffff', 700, 'left', 'rgba(0,0,0,0.9)', 4); ctx.restore();
}
// REC / flash-forward badge
function recBadge(t, label = 'THE ENDING', a = 1, y = 268) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = Math.floor(t * 3) % 2 ? RED : 'rgba(255,107,94,0.4)'; ctx.beginPath(); ctx.arc(90, y - 2, 14, 0, TAU); ctx.fill(); txt(label, 118, y, 34, '#ffffff', 700, 'left', 'rgba(0,0,0,0.9)', 4); ctx.restore(); }
// ---------------------------------------------------------------- text hook (native-style box at the very top)
function hookBox(lines, t, tIn, tOut, y = 150) {
  if (t < tIn || t >= tOut + 0.2) return; const kin = tIn <= 0 ? 1 : easeOutBack(clamp((t - tIn) / 0.25)), kout = 1 - easeInOut(clamp((t - tOut) / 0.2));
  ctx.save(); ctx.translate(540, y); ctx.scale(kin * kout, kin * kout); ctx.rotate(-0.012 + 0.006 * Math.sin(t * 3));
  ctx.font = '700 50px Poppins'; const lh = 62, W = Math.max(...lines.map((ln) => ctx.measureText(ln.map((s) => s[0]).join('')).width)) + 70, H = lines.length * lh + 34;
  ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(-W / 2, -H / 2, W, H, 22); ctx.fill(); ctx.shadowBlur = 0;
  lines.forEach((ln, li) => { const w = ctx.measureText(ln.map((s) => s[0]).join('')).width; let x = -w / 2; const yy = -H / 2 + 17 + lh * li + lh / 2;
    ln.forEach(([s, hl]) => { const sw = ctx.measureText(s).width; if (hl) { ctx.fillStyle = GOLDL; ctx.beginPath(); ctx.roundRect(x - 6, yy - 30, sw + 12, 58, 10); ctx.fill(); } ctx.fillStyle = '#111014'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(s, x, yy + 2); x += sw; }); });
  ctx.restore();
}
// ---------------------------------------------------------------- frame (v3). opts: {scenes(t,c), PH, after(t), hook:{lines,tIn,tOut}, capOffset}
function frame3(t, opts) {
  const c = camAt(t);
  atmosphere(t, c);
  ctx.save(); applyCam(c); opts.scenes(t, c); ctx.restore();
  setFigureScale(1); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (opts.fg !== false) foreground(t, 1);
  vignette();
  if (opts.screen) opts.screen(t, c);
  if (opts.PH && t >= (opts.capOffset || 0) - 0.05) captions(t - (opts.capOffset || 0), opts.PH);
  if (opts.hook) hookBox(opts.hook.lines, t, opts.hook.tIn ?? 0, opts.hook.tOut, opts.hook.y);
  if (opts.after) opts.after(t, c);
  return true;
}

const GREYC = ['#9c9993', '#6b6964', 'rgba(170,170,170,0.25)'], WHITEC = ['#e6e3dc', '#9a978f', 'rgba(255,255,255,0.35)'];
