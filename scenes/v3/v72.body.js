// 72. Only Focus — distractions orbit him, the spotlight snaps shut on "focus", every attempt at the circle gets rounder,
// everything else shatters on "waste", and attempt #247 is perfect.
initCanvas('c');
const DUR = 13.7;
ATMO = { tint: [200, 190, 255], tintA: 0.05, shafts: 0.06, bokeh: 0.8 };
CAP.y = 430;

CAP.end = 11.3;
const FLOOR = 1420, FX = 330, CX = 660, CY = 1030, R = 120;
const T_FOCUS = 0.72, T_PUSH = 8.24, T_WASTE = 9.68;
// attempts: [start, end, wobble, number]
const AT = [[1.3, 2.85, 0.34, 1], [3.04, 3.75, 0.25, 2], [3.85, 4.56, 0.18, 3], [5.2, 5.8, 0.12, 4], [5.9, 6.5, 0.08, 5], [6.6, 7.1, 0.055, 6], [7.15, 7.7, 0.035, 7], [8.3, 10.3, 0.022, 8], [11.45, 12.35, 0, 247]];
const T_MONT = 10.6, T_PERFECT = 12.35;
function wob(n, th, w) { return 1 + w * (0.55 * Math.sin(2 * th + n * 1.7) + 0.35 * Math.sin(3 * th + n * 2.9) + 0.25 * Math.sin(5 * th + n)); }
function circlePath(x, y, r, w, n, u, closeErr) {
  ctx.beginPath(); const N = 90, end = TAU * (1 + closeErr) * u;
  for (let i = 0; i <= N; i++) { const th = -Math.PI / 2 + end * i / N, rr = r * wob(n, th, w) * (1 + closeErr * 0.6 * i / N); const px = x + rr * Math.cos(th), py = y + rr * Math.sin(th); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  return [x + r * wob(n, -Math.PI / 2 + end, w) * (1 + closeErr * 0.6) * Math.cos(-Math.PI / 2 + end), y + r * wob(n, -Math.PI / 2 + end, w) * (1 + closeErr * 0.6) * Math.sin(-Math.PI / 2 + end)];
}
const closeErr = (w) => (w > 0 ? w * 0.5 * (w > 0.2 ? 1 : -1) : 0);
// ---------------------------------------------------------------- distractions
seed = 72;
const DIS = Array.from({ length: 12 }, (_, i) => ({ a: i / 12 * TAU + rand() * 0.3, r: lerp(390, 470, rand()), sp: lerp(0.25, 0.5, rand()) * (i % 2 ? 1 : -1), kind: i % 8, ph: rand() * 6 }));
function disIcon(kind, t, ph) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (kind === 0) { panel(-30, -50, 60, 100, 12, 'rgba(255,255,255,0.5)', '#1d1c22', 4); ctx.fillStyle = '#3a8bff'; ctx.fillRect(-20, -36, 40, 64); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(28, -46, 18, 0, TAU); ctx.fill(); txt('99+', 28, -45, 15, '#fff', 700); }
  else if (kind === 1) { heart(0, 0, 54, RED, 16); txt('+1K', 0, 52, 22, '#ffb1a8', 700); }
  else if (kind === 2) { speech(0, 0, 110, 66, 1, -26, 50, '#f4f2ee'); for (let i = -1; i <= 1; i++) { ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(i * 24, 0, 7 + 2 * Math.sin(t * 8 + i), 0, TAU); ctx.fill(); } }
  else if (kind === 3) { clockFace(0, 0, 40, 10, (t * 120 + ph * 10) % 60, 0, t); }
  else if (kind === 4) { ctx.fillStyle = '#c9ccd2'; ctx.beginPath(); ctx.moveTo(-28, -36); ctx.lineTo(28, -36); ctx.lineTo(20, 4); ctx.quadraticCurveTo(0, 22, -20, 4); ctx.fill(); ctx.fillRect(-6, 14, 12, 18); ctx.fillRect(-20, 30, 40, 10); txt('THEM', 0, 62, 18, 'rgba(240,238,232,0.7)', 700, 'center', null, 3); }
  else if (kind === 5) { txt('$', 0, 0, 80, '#7fd17f', 700, 'center', 'rgba(120,220,120,0.6)'); }
  else if (kind === 6) { panel(-70, -30, 140, 60, 14, 'rgba(255,255,255,0.35)', '#1d1c22', 3); txt('RANK #48', 0, 2, 22, '#f4f2ee', 700); }
  else { ctx.fillStyle = '#f4f2ee'; ctx.beginPath(); ctx.ellipse(0, 0, 50, 28, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#2b5fae'; ctx.beginPath(); ctx.arc(10 * Math.sin(t * 2 + ph), 0, 17, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(10 * Math.sin(t * 2 + ph), 0, 8, 0, TAU); ctx.fill(); }
}
function distractions(t) {
  DIS.forEach((d, i) => {
    let a = d.a + d.sp * t, r = d.r;
    const push = smooth(T_PUSH, T_PUSH + 1.1, t);                     // they crowd back in on "everything else"
    const out = smooth(T_FOCUS, T_FOCUS + 0.35, t) * (1 - push);
    r = r + 120 * out - 70 * push + 10 * Math.sin(t * 8 + i) * push;
    const x = 540 + r * Math.cos(a), y = CY - 30 + r * 0.82 * Math.sin(a);
    const dimA = t < T_FOCUS ? 1 : lerp(1, 0.28, smooth(T_FOCUS, T_FOCUS + 0.3, t)) + 0.4 * push;
    if (t < T_WASTE) { ctx.save(); ctx.globalAlpha *= dimA; ctx.translate(x, y); const s = 1 + 0.06 * Math.sin(t * 9 + i); ctx.rotate(0.15 * Math.sin(t * 3 + i)); ctx.scale(s, s); disIcon(d.kind, t, d.ph); ctx.restore(); }
    else { // shatter into falling shards
      const dt = t - T_WASTE; if (dt > 1.3) return;
      ctx.save(); ctx.globalAlpha *= clamp(1 - dt / 1.3);
      for (let k = 0; k < 7; k++) { const ang = k / 7 * TAU + i, v = 260 + 90 * ((k * 37 + i * 11) % 5); const px = x + Math.cos(ang) * v * dt, py = y + Math.sin(ang) * v * dt + 900 * dt * dt;
        ctx.save(); ctx.translate(px, py); ctx.rotate(dt * (6 + k)); ctx.fillStyle = ['#f4f2ee', RED, '#9aa0ad', '#3a8bff'][(k + i) % 4]; ctx.beginPath(); ctx.moveTo(-10, -8); ctx.lineTo(12, -4); ctx.lineTo(0, 12); ctx.fill(); ctx.restore(); }
      ctx.restore();
    }
  });
}
// ---------------------------------------------------------------- the board + him
function currentAttempt(t) { let cur = null; for (const a of AT) if (t >= a[0]) cur = a; return cur; }
function scene(t) {
  floorLine(FLOOR + 2, 0.2);
  // spotlight mask (drawn under distractions so they get dimmed by their own alpha)
  const foc = smooth(T_FOCUS, T_FOCUS + 0.25, t);
  if (foc > 0) spotlight(540, FLOOR, 0.16 * foc, 330);
  distractions(t);
  if (foc > 0) { ctx.save(); const g = ctx.createRadialGradient(540, CY, lerp(900, 360, foc), 540, CY, lerp(1000, 520, foc)); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${0.55 * foc})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
  if (t >= T_FOCUS) ringFlash(540, CY, t, T_FOCUS, '255,201,94', 900, 380, 0.35, 8);
  // easel + board
  ctx.save(); ctx.strokeStyle = '#6b5236'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(CX - 130, FLOOR); ctx.lineTo(CX - 40, CY - 220); ctx.moveTo(CX + 130, FLOOR); ctx.lineTo(CX + 40, CY - 220); ctx.moveTo(CX, CY + 150); ctx.lineTo(CX + 30, FLOOR); ctx.stroke(); ctx.restore();
  const perfect = smooth(T_PERFECT, T_PERFECT + 0.2, t);
  panel(CX - 175, CY - 175, 350, 350, 14, perfect > 0 ? `rgba(255,201,94,${perfect})` : 'rgba(255,255,255,0.3)', '#f4f2ee', 6);
  // the drawing
  const A = currentAttempt(t); let tip = null;
  const mont = t >= T_MONT && t < AT[8][0];
  if (mont) { // time-lapse of hundreds of circles
    const k = Math.floor((t - T_MONT) * 22), w = lerp(0.03, 0.004, (t - T_MONT) / 0.85);
    ctx.save(); ctx.strokeStyle = '#222'; ctx.lineWidth = 7; circlePath(CX, CY, R, w, k + 9, 1, 0); ctx.stroke(); ctx.restore();
  } else if (A) {
    const [a, b, w, num] = A, u = clamp((t - a) / (b - a));
    ctx.save(); ctx.strokeStyle = perfect > 0 ? '#c88a1c' : '#222'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (perfect > 0) { ctx.shadowColor = 'rgba(255,180,60,1)'; ctx.shadowBlur = 30 * perfect; }
    tip = circlePath(CX, CY, R, w, num, easeInOut(u), closeErr(w)); ctx.stroke(); ctx.restore();
    if (u >= 1 && num < 247 && w > 0.1) { ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.globalAlpha *= 0.8; ctx.beginPath(); ctx.arc(CX + R * 0.9, CY - R * 0.9, 18, 0, TAU); ctx.stroke(); ctx.restore(); }
    if (u >= 1 && w < 0.1 && num < 247) check(CX + R + 20, CY - R - 10, 40, '#5fbf6a', popK(t, b, 0.18), 8);
  }
  const num = mont ? 9 + Math.floor(Math.pow(clamp((t - T_MONT) / 0.85), 2) * 238) : A ? A[3] : 1;
  txt(`ATTEMPT #${num}`, CX, CY + 210, 26, num === 247 ? '#ffd98a' : 'rgba(240,238,232,0.75)', 700, 'center', null, 4);
  // past attempts pinned above the board
  AT.slice(0, 7).forEach((a, i) => { if (t < a[1] + 0.05) return; const k = popK(t, a[1] + 0.05, 0.2), x = 250 + i * 96, y = 720;
    ctx.save(); ctx.globalAlpha *= 1 - smooth(T_MONT - 0.2, T_MONT, t); ctx.translate(x, y); ctx.scale(k, k); panel(-38, -38, 76, 76, 8, 'rgba(255,255,255,0.2)', '#e9e6df', 2);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 3; circlePath(0, 0, 26, a[2], a[3], 1, closeErr(a[2])); ctx.stroke(); ctx.restore(); });
  // skill bar
  const done = AT.filter((a) => t >= a[1]).length, skill = mont ? lerp(0.62, 0.9, (t - T_MONT) / 0.85) : t >= T_PERFECT ? 1 : t >= AT[8][0] ? 0.92 : [0.04, 0.12, 0.2, 0.3, 0.38, 0.46, 0.53, 0.6, 0.62][Math.min(8, done)];
  if (t >= 1.2) { ctx.save(); ctx.globalAlpha *= smooth(1.2, 1.5, t) * (1 - smooth(8.2, 8.5, t)) + smooth(10.6, 10.9, t); txt('SKILL', 250, 818, 22, 'rgba(240,238,232,0.7)', 700, 'left', null, 5); bar(370, 806, 450, 22, skill, GOLDL); txt(`${Math.round(skill * 100)}%`, 860, 818, 26, '#ffd98a', 700, 'center'); ctx.restore(); }
  if (t >= 7.76 && t < 8.6) pill('LEVEL UP', 790, 900, t, 7.76, { size: 32 });
  // him: arm mirrors the pen, head turns toward the noise before "focus"
  setFigureScale(1.45);
  let P = { ...standPose(Math.sin(t * 2)), t: 0.06, h: t < T_FOCUS ? 0.5 * Math.sin(t * 9) - 0.3 : 0.12 };
  let J = solve(P, FX, FLOOR, 0);
  const pen = tip || [CX - R * 0.6, CY - R * 0.4];
  const hand = [J.sh[0] + 92 + (pen[0] - CX) * 0.3, J.sh[1] + 28 + (pen[1] - CY) * 0.3];
  const cheer = smooth(T_PERFECT + 0.1, T_PERFECT + 0.35, t);
  let [s1, e1] = armIK(J.sh, hand);
  if (cheer > 0) { const up = armIK(J.sh, [J.sh[0] + 40, J.sh[1] - 120]); s1 = lerp(s1, up[0], cheer); e1 = lerp(e1, up[1], cheer); }
  P = { ...P, shN: s1, elN: e1, shF: 0.25, elF: 0.5, h: lerp(P.h, -0.2, cheer) }; J = solve(P, FX, FLOOR, 0);
  const A2 = currentAttempt(t), fin = A2 && t >= A2[1] && t < A2[1] + 0.45;
  const e = t < T_FOCUS ? 'worried' : t >= T_PERFECT ? 'joy' : t >= 7.76 && t < 8.3 ? 'happy' : t >= T_PUSH && t < T_WASTE ? 'determined' : fin ? (A2[2] > 0.1 ? 'sad' : 'happy') : 'determined';
  hero(J, { expr: e, t, speed: 0.2, blur: 20 + 24 * perfect });
  // pencil in hand
  ctx.save(); ctx.translate(J.wN[0], J.wN[1]); ctx.rotate(Math.atan2(pen[1] - J.wN[1], pen[0] - J.wN[0])); ctx.fillStyle = '#ffd98a'; ctx.fillRect(-4, -5, 56, 10); ctx.fillStyle = '#333'; ctx.beginPath(); ctx.moveTo(52, -5); ctx.lineTo(66, 0); ctx.lineTo(52, 5); ctx.fill(); ctx.restore();
  if (tip && !mont) glowDot(tip[0], tip[1], 26, 0.7);
  if (t >= T_PERFECT) { burst(CX, CY, t, T_PERFECT, 80, ['#ffc95e', '#fff', '#f0ae36'], 1400, 1.3, 72); ringFlash(CX, CY, t, T_PERFECT, '255,201,94', R, 640, 0.7, 14); }
}
CAMK = [[0, 470, 1080, 1.35, 0.02], [0.7, 520, 1050, 1.1, 0], [0.85, 540, 1010, 1.25, 0], [2.9, 545, 1005, 1.22, 0], [3.05, 580, 1000, 1.28, 0], [7.7, 580, 1000, 1.25, 0],
        [8.2, 540, 1000, 1.0, 0], [9.7, 540, 1000, 1.06, 0], [10.6, 580, 1010, 1.3, 0], [11.4, 590, 1010, 1.42, 0], [12.35, 580, 1015, 1.35, 0], [13.7, 570, 1015, 1.28, 0]];
SHAKES = [[0, 14, 0.25], [0.3, 10, 0.2], [T_FOCUS, 18, 0.2], [T_WASTE, 24, 0.25], [T_PERFECT, 18, 0.25]];
PUNCHES = [[T_FOCUS, 0.08, 0.12], [7.76, 0.05, 0.1], [T_WASTE, 0.08, 0.12], [T_PERFECT, 0.1, 0.15]];
function screen(t) {
  if (t < T_FOCUS) { ctx.save(); ctx.globalAlpha = 0.35 * (1 - t / T_FOCUS); for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,60,60,0.5)' : 'rgba(60,200,255,0.4)'; ctx.fillRect(0, (i * 241 + t * 3000) % 1920, 1080, 8 + (i % 3) * 6); } ctx.restore(); }
  impactLines(t, T_FOCUS, 540, 1060, 0.3); impactLines(t, T_WASTE, 540, 1000, 0.35); impactLines(t, T_PERFECT, 540, 1040, 0.4); flash(t, T_PERFECT, 0.2, 0.15);
  if (t >= T_MONT && t < AT[8][0]) { ctx.save(); ctx.globalAlpha = 0.9; txt('▶▶ x50', 960, 270, 34, '#fff', 700, 'right', 'rgba(0,0,0,0.9)', 2); ctx.restore(); }
}
window.renderFrame = (t) => frame3(t, { scenes: scene, screen, PH, hook: { lines: [[['Can you draw a', 0]], [['perfect circle', 1], ['?', 0]]], tIn: 0, tOut: 2.9 },
  after: (t) => { if (t >= 11.3) endText(t, 11.3, [['Get better at', '#fff'], ['what you do.', GOLDL]], 72); } });
window.__allSteps = { focus: T_FOCUS, push: T_PUSH, waste: T_WASTE, montage: T_MONT, perfect: T_PERFECT };
window.sceneReady = FONTS_READY();
