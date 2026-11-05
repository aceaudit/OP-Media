// 87. Pause Before You React (v3 original, no voice) — SHOCK OPEN: "WHO ASKED YOU?" slams in; he winds up to fire back… FREEZE.
// The world goes grey and stops; only he can move. 3 · 2 · 1 — he breathes and the anger drains. Two cards: REACT (a fight, a
// ruined day) or RESPOND. He picks RESPOND, the world plays again, he says "Let's talk when we're both calm" and the other side cools.
initCanvas('c');
const DUR = 15.0;
CAP.y = 430; CAP.end = 12.7;
ATMO = { tint: [255, 190, 130], tintA: 0.05, shafts: 0.06, bokeh: 0.7 };
const F = 1420, HX = 330, OX = 760, T_FIRE = 0.9, T_PAUSE = 1.5, T_PLAY = 8.0, T_CARDS = 5.9, T_PICK = 7.4, T_END = 12.8;
const CNT = [[2.6, '3'], [3.7, '2'], [4.8, '1']];
const frozen = (t) => t >= T_PAUSE && t < T_PLAY;
const wt = (t) => (t < T_PAUSE ? t : t < T_PLAY ? T_PAUSE : t - (T_PLAY - T_PAUSE));   // world time stops during the pause
function bubbleBox(x, y, w, h, k, tailX, tailY, fill, stroke, lines, col, size = 38) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
  ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 28); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 30, y + h / 2 - 2); ctx.lineTo(tailX, tailY); ctx.lineTo(x + 20, y + h / 2 - 2); ctx.closePath(); ctx.fill();
  lines.forEach((s, i) => txt(s, x, y - (lines.length - 1) * size * 0.6 + i * size * 1.2, size, col, 700)); ctx.restore();
}
function other(t) {
  const w = wt(t), cool = smooth(9.2, 10.0, w + (T_PLAY - T_PAUSE)) ;
  setFigureScale(1.5);
  const P = t < T_PLAY + 1.2 ? { ...standPose(Math.sin(w * 2)), t: 0.12, h: -0.1, shN: 1.2, elN: 0.6 } : { ...standPose(Math.sin(w * 2)), h: 0.25 };
  const J = solve(P, OX, F, 0); const ex = t < T_PLAY + 1.2 ? 'angry' : t < T_PLAY + 2.0 ? 'shock' : 'calm';
  mirrorX(OX, () => hero(J, { expr: ex, t: w, col: WHITEC, blur: 6, seed: 4 }));
  // the insult
  const k = popK(w, 0.0, 0.22) * (1 - smooth(T_PLAY + 1.0, T_PLAY + 1.5, t));
  bubbleBox(740, 880, 440, 110, k, OX - 30, J.head[1] - 40, 'rgba(60,18,18,0.97)', '#ff6b5e', ['WHO ASKED YOU?'], '#ff8a7e', 40);
}
function heroScene(t) {
  setFigureScale(1.5);
  const lean = smooth(T_FIRE - 0.2, T_FIRE + 0.3, wt(t)) * (1 - smooth(4.0, 5.0, t)), calm = smooth(3.0, 5.2, t);
  const P = { ...standPose(Math.sin(t * 2)), t: 0.22 * lean, h: -0.2 * lean + 0.05 * calm, shN: 0.9 * lean + 0.1, elN: 1.2 * lean + 0.25 };
  const J = solve(P, HX, F, 0);
  let ex = t < 0.45 ? 'shock' : t < 3.0 ? 'angry' : exprMix('angry', 'calm', calm);
  if (t > T_PLAY) ex = t < 10.0 ? 'calm' : 'proud';
  hero(J, { expr: ex, t, speed: 0.2, blur: 18 + 14 * calm });
  // his reply that never gets sent: red, typing, frozen, then fading as he breathes
  const typed = 'WELL, MAYBE IF Y—', n = Math.floor(clamp((wt(t) - T_FIRE) / 0.6) * typed.length), kr = popK(wt(t), T_FIRE, 0.2) * (1 - smooth(3.6, 4.6, t));
  if (n > 0) bubbleBox(380, 755, 470, 100, kr, HX + 40, J.head[1] - 40, 'rgba(60,18,18,0.97)', '#ff6b5e', [typed.slice(0, n)], '#ff8a7e', 36);
  // breathing ring
  if (t > 2.5 && t < 6.0) { const br = 0.5 - 0.5 * Math.cos((t - 2.5) * Math.PI / 1.1); ctx.save(); ctx.globalAlpha *= smooth(2.5, 2.8, t) * (1 - smooth(5.6, 6.0, t)); ctx.strokeStyle = 'rgba(160,210,255,0.7)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(J.neck[0], J.neck[1] + 30, 130 + 70 * br, 0, TAU); ctx.stroke(); ctx.restore(); }
  // the calm reply
  const kg = popK(t, T_PLAY + 0.4, 0.25);
  if (kg > 0) bubbleBox(400, 760, 500, 140, kg, HX + 40, J.head[1] - 40, 'rgba(30,26,14,0.97)', GOLDL, ["Let's talk when", "we're both calm."], '#ffd98a', 36);
}
function cards(t) {
  const k1 = popK(t, T_CARDS, 0.25), k2 = popK(t, T_CARDS + 0.15, 0.25); if (k1 <= 0 || t > T_PLAY + 0.3) return;
  const pick = smooth(T_PICK, T_PICK + 0.3, t), out = smooth(T_PLAY - 0.1, T_PLAY + 0.3, t);
  // REACT
  ctx.save(); ctx.globalAlpha *= (1 - 0.75 * pick) * (1 - out); ctx.translate(300, 860); ctx.scale(k1 * (1 - 0.1 * pick), k1 * (1 - 0.1 * pick)); ctx.rotate(-0.04);
  panel(-200, -150, 400, 300, 30, '#ff6b5e', 'rgba(40,14,14,0.97)', 5); txt('REACT', 0, -98, 44, '#ff8a7e', 700, 'center', null, 6);
  txt('a fight', 0, -20, 32, 'rgba(255,200,190,0.85)', 600); txt('words you regret', 0, 26, 32, 'rgba(255,200,190,0.85)', 600); txt('a ruined day', 0, 72, 32, 'rgba(255,200,190,0.85)', 600);
  if (pick > 0) { ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-60, -150); ctx.lineTo(-10, -40); ctx.lineTo(-50, 40); ctx.lineTo(10, 150); ctx.stroke(); }
  ctx.restore();
  // RESPOND
  ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(780, 860); const sc = k2 * (1 + 0.08 * pick); ctx.scale(sc, sc); ctx.rotate(0.04);
  ctx.shadowColor = 'rgba(255,180,60,0.9)'; ctx.shadowBlur = 40 * pick; panel(-200, -150, 400, 300, 30, GOLDL, 'rgba(30,26,14,0.97)', 5); ctx.shadowBlur = 0;
  txt('RESPOND', 0, -98, 44, GOLDL, 700, 'center', null, 6);
  txt('a calm answer', 0, -20, 32, '#ffe6b0', 600); txt('your peace intact', 0, 26, 32, '#ffe6b0', 600); txt('a better day', 0, 72, 32, '#ffe6b0', 600);
  ctx.restore();
}
function scene(t, c) {
  floorLine(F + 2, 0.22);
  other(t);
  // freeze: grey the world out (he stays in colour)
  const fz = smooth(T_PAUSE, T_PAUSE + 0.15, t) * (1 - smooth(T_PLAY, T_PLAY + 0.25, t));
  if (fz > 0) { ctx.save(); ctx.fillStyle = `rgba(16,20,30,${(0.55 * fz).toFixed(3)})`; ctx.fillRect(-1000, -1000, 3200, 4000); ctx.restore(); }
  heroScene(t);
}
CAMK = [[0, 560, 960, 1.55, 0.03], [0.4, 560, 965, 1.45, 0], [T_PAUSE, 520, 980, 1.2, 0], [2.4, 420, 1080, 1.35, 0], [5.6, 400, 1090, 1.45, 0], [T_CARDS, 540, 1000, 1.0, 0],
        [T_PLAY, 540, 1000, 1.0, 0], [T_PLAY + 0.6, 500, 980, 1.1, 0], [11.0, 540, 1000, 1.02, 0], [DUR, 540, 1000, 1.0, 0]];
SHAKES = [[0, 14, 0.18], [T_PAUSE, 6, 0.12], [T_PLAY, 6, 0.12]];
PUNCHES = [[0, 0.07, 0.12], [T_PAUSE, 0.06, 0.12], ...CNT.map(([ts]) => [ts, 0.03, 0.1]), [T_PICK, 0.05, 0.12], [T_PLAY, 0.05, 0.12]];
function screen(t) {
  impactLines(t, 0, 740, 880, 0.25); flash(t, 0, 0.2, 0.12);
  if (t >= T_PAUSE && t < T_PLAY) {
    const k = popK(t, T_PAUSE, 0.25) * (1 - smooth(2.3, 2.6, t)); if (k > 0) { ctx.save(); ctx.translate(540, 600); ctx.scale(0.62 * k, 0.62 * k); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.beginPath(); ctx.roundRect(-70, -90, 50, 180, 14); ctx.roundRect(20, -90, 50, 180, 14); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.globalAlpha *= smooth(T_PAUSE, T_PAUSE + 0.2, t); ctx.fillStyle = Math.floor(t * 2) % 2 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'; ctx.fillRect(80, 252, 12, 36); ctx.fillRect(100, 252, 12, 36); txt('PAUSED', 128, 270, 34, '#ffffff', 700, 'left', 'rgba(0,0,0,0.9)', 4); ctx.restore();
    CNT.forEach(([ts, s]) => { const kk = popK(t, ts, 0.25) * (1 - smooth(ts + 0.8, ts + 1.05, t)); if (kk > 0 && t < ts + 1.05) { ctx.save(); ctx.globalAlpha *= clamp(kk); ctx.translate(780, 900); ctx.scale(kk, kk); txt(s, 0, 0, 230, 'rgba(160,210,255,0.95)', 700, 'center', 'rgba(120,180,255,0.6)'); ctx.restore(); } });
    cards(t);
  }
  if (t >= T_PLAY && t < T_PLAY + 0.8) { const k = popK(t, T_PLAY, 0.2) * (1 - smooth(T_PLAY + 0.5, T_PLAY + 0.8, t)); ctx.save(); ctx.translate(540, 600); ctx.scale(0.62 * k, 0.62 * k); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.beginPath(); ctx.moveTo(-60, -90); ctx.lineTo(90, 0); ctx.lineTo(-60, 90); ctx.closePath(); ctx.fill(); ctx.restore(); }
  if (t >= T_PICK) ringFlash(780, 860, t, T_PICK, '255,201,94', 80, 420, 0.5, 8);
}
window.renderFrame = (t) => frame3(t, { scenes: scene, screen, PH, hook: { lines: [[['Before you snap back,', 0]], [['watch this', 1], ['.', 0]]], tIn: 0, tOut: 2.4 },
  after: (t) => { if (t >= T_END) endText(t, T_END, [['Pause.', '#fff'], ['Then choose.', GOLDL]], 84); } });
window.__allSteps = {};
window.sceneReady = FONTS_READY();
