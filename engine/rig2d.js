// Shared 2D character rig for Own Pace "character style" videos.
// Side-view pictogram figure: angles in radians; limbs measured from straight down (+ = toward facing direction),
// knee bends the shin back, elbow bends the forearm forward/up.
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a, b, t) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const lerp = (a, b, x) => a + (b - a) * x;
const $ = (id) => document.getElementById(id);
let seed = 21; const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const S = Math.sin, C = Math.cos;

const BASE = { thigh: 64, shin: 64, torso: 94, upper: 52, fore: 50, neck: 10, head: 23, w: 15 };
let L = { ...BASE };
function setFigureScale(k) { for (const key in BASE) L[key] = BASE[key] * k; }
const KEYS = ['t', 'h', 'hipN', 'kneeN', 'hipF', 'kneeF', 'shN', 'elN', 'shF', 'elF'];
const mix = (a, b, w) => { if (w <= 0) return a; if (w >= 1) return b; const o = {}; for (const k of KEYS) o[k] = lerp(a[k], b[k], w); return o; };

function runPose(p, amp = 1, lean = 0.22, el = 1.65, head = -0.06) {
  const leg = (ph) => [0.2 + 0.74 * amp * S(ph), 0.3 + 1.4 * amp * Math.max(0, C(ph))];
  const [hN, kN] = leg(p), [hF, kF] = leg(p + Math.PI);
  return { t: lean, h: head, hipN: hN, kneeN: kN, hipF: hF, kneeF: kF, shN: 0.15 - 0.9 * amp * S(p), elN: el, shF: 0.15 + 0.9 * amp * S(p), elF: el };
}
function walkPose(p, lean = 0.05, head = 0) {
  const leg = (ph) => [0.04 + 0.42 * S(ph), 0.08 + 0.72 * Math.max(0, C(ph))];
  const [hN, kN] = leg(p), [hF, kF] = leg(p + Math.PI);
  return { t: lean, h: head, hipN: hN, kneeN: kN, hipF: hF, kneeF: kF, shN: 0.05 - 0.42 * S(p), elN: 0.35, shF: 0.05 + 0.42 * S(p), elF: 0.35 };
}
const sitPose = (b = 0) => ({ t: -0.1 + 0.03 * b, h: 0.3, hipN: 2.6, kneeN: 2.1, hipF: 2.5, kneeF: 2.02, shN: 0.92, elN: 0.42, shF: 0.8, elF: 0.55 });
const slumpSitPose = (b = 0) => ({ t: 0.35 + 0.03 * b, h: 0.55, hipN: 2.6, kneeN: 2.1, hipF: 2.5, kneeF: 2.02, shN: 0.6, elN: 0.6, shF: 0.5, elF: 0.7 });
const kneelPose = (b = 0) => ({ t: 1.12 + 0.05 * b, h: 0.6, hipN: 0.14, kneeN: 1.57, hipF: 0.04, kneeF: 1.57, shN: 0.28, elN: 0.0, shF: 0.16, elF: 0.05 });
const standPose = (b = 0) => ({ t: 0.0 + 0.01 * b, h: 0.0, hipN: 0.04, kneeN: 0.05, hipF: -0.04, kneeF: 0.05, shN: 0.1, elN: 0.25, shF: -0.05, elF: 0.25 });
const tallPose = (b = 0) => ({ t: -0.04 + 0.01 * b, h: -0.18, hipN: 0.06, kneeN: 0.03, hipF: -0.06, kneeF: 0.03, shN: 0.06, elN: 0.12, shF: -0.08, elF: 0.12 });
const cheerPose = (b = 0) => ({ t: -0.06, h: -0.28, hipN: 0.1, kneeN: 0.08, hipF: -0.12, kneeF: 0.06, shN: 2.8 + 0.06 * b, elN: 0.22, shF: 2.6 + 0.06 * b, elF: 0.3 });
const stumblePose = () => ({ t: 0.95, h: -0.45, hipN: 0.55, kneeN: 0.7, hipF: -0.7, kneeF: 0.5, shN: 1.5, elN: 0.25, shF: 1.25, elF: 0.4 });
const pronePose = (b = 0) => ({ t: 1.5 + 0.02 * b, h: -0.42, hipN: -1.42, kneeN: 0.1, hipF: -1.5, kneeF: 0.25, shN: 1.25, elN: 0.6, shF: 1.05, elF: 0.8 });
const pushUpPose = (b = 0) => ({ t: 1.05 + 0.03 * b, h: 0.2, hipN: 0.1, kneeN: 1.57, hipF: -0.05, kneeF: 1.6, shN: 0.12, elN: 0.0, shF: 0.0, elF: 0.05 });
const lungePose = () => ({ t: 0.35, h: 0.0, hipN: 1.25, kneeN: 1.35, hipF: -0.25, kneeF: 1.65, shN: 0.9, elN: 0.6, shF: 0.4, elF: 0.4 });
const crouchPose = () => ({ t: 0.55, h: -0.2, hipN: 1.35, kneeN: 2.2, hipF: 1.25, kneeF: 2.1, shN: -0.7, elN: 0.3, shF: -0.8, elF: 0.3 });
const jumpPose = () => ({ t: 0.1, h: -0.3, hipN: 0.3, kneeN: 0.3, hipF: -0.15, kneeF: 0.6, shN: 2.9, elN: 0.15, shF: 2.7, elF: 0.2 });
const bendPose = () => ({ t: 1.25, h: 0.35, hipN: 0.25, kneeN: 0.5, hipF: -0.05, kneeF: 0.45, shN: 0.05, elN: 0.25, shF: -0.05, elF: 0.3 });
const carryPose = (p = 0) => ({ t: 0.06, h: 0.05, hipN: 0.04 + 0.3 * S(p), kneeN: 0.08 + 0.5 * Math.max(0, C(p)), hipF: 0.04 - 0.3 * S(p), kneeF: 0.08 + 0.5 * Math.max(0, -C(p)), shN: 0.75, elN: 0.95, shF: 0.7, elF: 1.0 });

// forward kinematics; the lowest point is placed on the floor
function solve(P, x0, floorY, lift = 0, grounded = true, y0 = 0) {
  const pel = [0, 0];
  const tor = [S(P.t), -C(P.t)];
  const neck = [L.torso * tor[0], L.torso * tor[1]];
  const sh = [(L.torso - 8 * L.torso / 94) * tor[0], (L.torso - 8 * L.torso / 94) * tor[1]];
  const ha = P.t + P.h;
  const head = [neck[0] + (L.neck + L.head) * S(ha), neck[1] - (L.neck + L.head) * C(ha)];
  const leg = (hip, knee) => { const k = [L.thigh * S(hip), L.thigh * C(hip)]; const sa = hip - knee; return [k, [k[0] + L.shin * S(sa), k[1] + L.shin * C(sa)]]; };
  const arm = (s, e) => { const el = [sh[0] + L.upper * S(s), sh[1] + L.upper * C(s)]; const fa = s + e; return [el, [el[0] + L.fore * S(fa), el[1] + L.fore * C(fa)]]; };
  const [kN, aN] = leg(P.hipN, P.kneeN), [kF, aF] = leg(P.hipF, P.kneeF);
  const [eN, wN] = arm(P.shN, P.elN), [eF, wF] = arm(P.shF, P.elF);
  let low = -1e9; for (const q of [pel, kN, aN, kF, aF, wN, wF, neck, [head[0], head[1] + L.head - L.w / 2]]) low = Math.max(low, q[1]);
  const dy = grounded ? floorY - L.w / 2 - low - lift : y0;
  const T = (q) => [q[0] + x0, q[1] + dy];
  return { pel: T(pel), neck: T(neck), sh: T(sh), head: T(head), kN: T(kN), aN: T(aN), kF: T(kF), aF: T(aF), eN: T(eN), wN: T(wN), eF: T(eF), wF: T(wF), dy };
}
function seg(g, pts, w) { g.lineWidth = w; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.stroke(); }
function drawFigure(g, J, col, far, glow, blur, extra) {
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  g.shadowColor = glow; g.shadowBlur = blur;
  g.strokeStyle = far; g.fillStyle = far;
  seg(g, [J.sh, J.eF, J.wF], L.w); seg(g, [J.pel, J.kF, J.aF], L.w * 1.07);
  g.strokeStyle = col; g.fillStyle = col;
  seg(g, [J.pel, J.neck], L.w * 1.2);
  g.beginPath(); g.arc(J.head[0], J.head[1], L.head, 0, 7); g.fill();
  seg(g, [J.pel, J.kN, J.aN], L.w * 1.07);
  if (extra) extra(g);
  g.strokeStyle = col; g.fillStyle = col; g.shadowColor = glow; g.shadowBlur = blur;
  seg(g, [J.sh, J.eN, J.wN], L.w);
  g.restore();
}
let ctx, octx, off;
function initCanvas(id = 'c') {
  ctx = $(id).getContext('2d');
  off = document.createElement('canvas'); off.width = 1080; off.height = 1920; octx = off.getContext('2d');
}
// draw anything (fn(g)) plus its faded mirror image below floorY
function withReflection(floorY, fn, strength = 0.3, depth = 230) {
  fn(ctx, 22);
  octx.setTransform(1, 0, 0, 1, 0, 0); octx.globalCompositeOperation = 'source-over'; octx.clearRect(0, floorY - 10, 1080, depth + 80);
  octx.setTransform(1, 0, 0, -1, 0, 2 * floorY + 4);
  fn(octx, 10);
  octx.setTransform(1, 0, 0, 1, 0, 0);
  octx.globalCompositeOperation = 'destination-in';
  const gr = octx.createLinearGradient(0, floorY, 0, floorY + depth);
  gr.addColorStop(0, `rgba(0,0,0,${strength})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
  octx.fillStyle = gr; octx.fillRect(0, floorY, 1080, depth + 70);
  octx.globalCompositeOperation = 'source-over';
  ctx.drawImage(off, 0, floorY, 1080, depth + 70, 0, floorY, 1080, depth + 70);
}
function background(t, dust) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const bg = ctx.createRadialGradient(540, 1100, 100, 540, 1100, 1300);
  bg.addColorStop(0, '#131215'); bg.addColorStop(1, '#060608');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1920);
  for (const d of dust) {
    const y = ((d.y - t * 14 * d.s) % 1920 + 1920) % 1920, x = d.x + 12 * Math.sin(t * 0.4 + d.ph);
    ctx.fillStyle = `rgba(232,214,170,${(d.a * (0.6 + 0.4 * Math.sin(t * 1.3 + d.ph))).toFixed(3)})`; ctx.beginPath(); ctx.arc(x, y, d.r, 0, 7); ctx.fill();
  }
}
function makeDust(n = 60) { const a = []; for (let i = 0; i < n; i++) a.push({ x: rand() * 1080, y: rand() * 1920, s: lerp(0.3, 1, rand()), r: lerp(1, 2.6, rand()), a: lerp(0.06, 0.22, rand()), ph: rand() * 6.28 }); return a; }
function vignette() {
  const vg = ctx.createRadialGradient(540, 960, 600, 540, 960, 1250);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, 1080, 1920);
}
function floorLine(y, a = 0.32) {
  const g = ctx.createLinearGradient(60, 0, 1020, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, `rgba(255,255,255,${a})`); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(60, y, 960, 2);
}
function makeMarks() { const m = []; for (let i = 0; i < 14; i++) m.push({ x: i * 86 + rand() * 30, w: lerp(6, 20, rand()), a: lerp(0.08, 0.2, rand()) }); return m; }
function groundMarks(marks, y, dist) {
  for (const m of marks) {
    const x = ((m.x - dist) % 1200 + 1200) % 1200 - 60;
    const edge = clamp(Math.min(x - 60, 1020 - x) / 140);
    ctx.fillStyle = `rgba(255,255,255,${(m.a * edge).toFixed(3)})`; ctx.fillRect(x, y + 6, m.w, 2);
  }
}
function label(text, x, y, col, size = 30, spacing = 7, weight = 500, align = 'center') {
  ctx.save(); ctx.font = `${weight} ${size}px Poppins`; ctx.letterSpacing = spacing + 'px'; ctx.fillStyle = col; ctx.textAlign = align; ctx.fillText(text, x, y); ctx.restore();
}
function bigNumber(text, x, y, col, glow, scale = 1, size = 104, align = 'center') {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.font = `500 ${size}px Poppins`; ctx.fillStyle = col; ctx.textAlign = align; ctx.shadowColor = glow; ctx.shadowBlur = 18;
  ctx.fillText(text, 0, 0); ctx.restore();
}
function cap(el, tIn, tOut, t) {
  const a = smooth(tIn, tIn + 0.6, t) * (1 - smooth(tOut, tOut + 0.5, t));
  el.style.opacity = a.toFixed(3);
  el.style.transform = `translateY(${((1 - smooth(tIn, tIn + 0.7, t)) * 14).toFixed(2)}px)`;
  el.style.filter = `blur(${((1 - a) * 6).toFixed(2)}px)`;
}
const GOLD = '#f0ae36', GOLD_FAR = '#a8711c', GOLD_GLOW = 'rgba(255,180,60,0.6)';
const WHITE = '#eeece8', WHITE_FAR = '#96948f', WHITE_GLOW = 'rgba(255,255,255,0.5)';
const FONTS_READY = () => document.fonts.ready.then(() => Promise.all(['500 104px Poppins', '400 40px Poppins', '700 22px Poppins', '500 30px Poppins'].map((f) => document.fonts.load(f)))).then(() => true);
