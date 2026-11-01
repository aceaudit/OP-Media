// 77. Same Letters — letter tiles. Each bad word drops in, its letters get counted, then every tile flips into the good word
// with the same count. The pairs stack into a ledger; on "choose the better side" he steps to the gold column.
initCanvas('c');
const DUR = 26.4;
ATMO = { tint: [255, 200, 130], tintA: 0.05, shafts: 0.07, bokeh: 0.8 };
CAP.y = 430;

CAP.end = 25.35;
// [bad, good, tBad, tHas, tLetters, tGood]
const PAIRS = [['HATE', 'LOVE', 1.68, 2.0, 2.48, 4.48], ['ENEMIES', 'FRIENDS', 5.44, 6.0, 6.48, 7.92], ['LYING', 'TRUTH', 8.8, 9.28, 9.68, 10.88], ['FAILURE', 'SUCCESS', 12.08, 12.72, 13.28, 14.56], ['CRY', 'JOY', 15.44, 15.92, 16.32, 17.52], ['NEGATIVITY', 'POSITIVITY', 18.8, 19.36, 19.76, 20.96]];
const PTS = { A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10 };
const ROWY = 860, TW = 120, GAPX = 10, T_CHOICE = 22.32;
function tile(ch, x, y, s, style, glow = 0, sx = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sx, s);
  const gold = style === 'good', bad = style === 'bad', dim = style === 'dim';
  ctx.fillStyle = gold ? GOLDL : bad ? '#3a2326' : dim ? '#26252b' : '#e9e4d6';
  if (gold && glow) { ctx.shadowColor = 'rgba(255,180,60,0.9)'; ctx.shadowBlur = 26 * glow; }
  ctx.beginPath(); ctx.roundRect(-TW / 2, -TW / 2, TW, TW, 14); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = gold ? '#fff0c4' : bad ? '#ff6b5e' : 'rgba(255,255,255,0.25)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.font = '700 72px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = gold ? INK : bad ? '#ff8a7e' : dim ? 'rgba(240,238,232,0.5)' : '#2a2620'; ctx.fillText(ch, 0, 3);
  ctx.font = '700 22px Poppins'; ctx.fillText(String(PTS[ch] || 1), TW / 2 - 17, TW / 2 - 17); ctx.restore();
}
function rowX(n, i) { const W = n * TW + (n - 1) * GAPX, s = Math.min(1, 1000 / W); return [540 - W * s / 2 + (i * (TW + GAPX) + TW / 2) * s, s]; }
function activePair(t) { let p = -1; for (let i = 0; i < PAIRS.length; i++) if (t >= PAIRS[i][2] - 0.05) p = i; return p; }
function ledger(t) {
  const fin = smooth(T_CHOICE, T_CHOICE + 0.4, t), pick = smooth(24.4, 24.7, t);
  PAIRS.forEach(([bad, good, tb, th, tl, tg], i) => {
    const tIn = i < PAIRS.length - 1 ? PAIRS[i + 1][2] - 0.3 : T_CHOICE - 0.4; if (t < tIn) return;
    const k = popK(t, tIn, 0.25), y = lerp(1070, 720, smooth(T_CHOICE - 0.45, T_CHOICE - 0.05, t)) + i * 66;
    ctx.save(); ctx.globalAlpha *= clamp((k - 0.6) / 0.4);
    txt(bad, 300, y, 44, `rgba(255,138,126,${(0.9 - 0.65 * fin).toFixed(3)})`, 700, 'center', null, 3);
    txt(good, 780, y, 44, GOLDL, 700, 'center', pick > 0 ? `rgba(255,170,50,${0.8 * pick})` : null, 3);
    txt(`${bad.length}`, 540, y, 32, 'rgba(240,238,232,0.45)', 700);
    if (fin > 0) { ctx.strokeStyle = `rgba(255,107,94,${0.8 * fin})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(300 - bad.length * 16 - 10, y); ctx.lineTo(300 - bad.length * 16 - 10 + (bad.length * 32 + 20) * clamp((t - T_CHOICE - i * 0.06) / 0.25), y); ctx.stroke(); }
    ctx.restore();
  });
}
function scene(t) {
  const p = activePair(t);
  // frame 0: four tiles shuffling like a slot machine until "Hate"
  if (p < 0) { const L = 'ABCDEFGHIJKLMNOPRSTUWY'; for (let i = 0; i < 4; i++) { const [x, s] = rowX(4, i), ch = L[Math.floor(t * 18 + i * 7) % L.length]; tile(ch, x, ROWY + 8 * Math.sin(t * 20 + i), s * 1.1, 'plain'); }
    txt('?', 540, ROWY + 150, 60, 'rgba(240,238,232,0.4)', 700); }
  if (p >= 0 && t < T_CHOICE - 0.4) {
    const [bad, good, tb, th, tl, tg] = PAIRS[p], n = bad.length, out = p < PAIRS.length - 1 ? PAIRS[p + 1][2] - 0.3 : T_CHOICE - 0.4;
    const leave = clamp((t - out + 0.25) / 0.25);
    let counted = 0;
    for (let i = 0; i < n; i++) {
      const [x, s] = rowX(n, i), tin = tb + i * 0.045, k = popK(t, tin, 0.18); if (k <= 0) continue;
      const tc = th + (i + 0.5) * (tl + 0.25 - th) / n, isCounted = t >= tc; if (isCounted) counted++;
      const tf = tg + i * 0.06, u = clamp((t - tf) / 0.2), sx = Math.abs(Math.cos(u * Math.PI)) + 0.02;
      const ch = u < 0.5 ? bad[i] : good[i], style = u < 0.5 ? 'bad' : 'good';
      const lift = isCounted && t < tc + 0.18 && u === 0 ? -16 * Math.sin(Math.PI * (t - tc) / 0.18) : 0;
      ctx.save(); ctx.globalAlpha *= 1 - leave; tile(ch, x, ROWY + lift - 40 * leave, s * k, style, u >= 1 ? 1 : 0, sx); ctx.restore();
      if (u > 0 && u < 1 && i === n - 1) {}
    }
    // count badge
    ctx.save(); ctx.globalAlpha *= 1 - leave;
    if (t >= th) { const done = t >= tg + n * 0.06 + 0.15; const label = done ? `SAME ${n} LETTERS` : `${counted} LETTER${counted === 1 ? '' : 'S'}`;
      const k2 = done ? popK(t, tg + n * 0.06 + 0.15, 0.25) : 1; ctx.translate(540, ROWY + 130); ctx.scale(k2, k2); ctx.translate(-540, -(ROWY + 130));
      ctx.font = '700 32px Poppins'; const w = ctx.measureText(label).width + 60; panel(540 - w / 2, ROWY + 101, w, 58, 29, done ? GOLDL : 'rgba(255,255,255,0.25)', done ? 'rgba(255,201,94,0.15)' : 'rgba(26,25,30,0.95)');
      txt(label, 540, ROWY + 131, 32, done ? GOLDL : '#f4f2ee', 700, 'center', null, 3); }
    ctx.restore();
    if (t >= tg) { const [xe] = rowX(n, n - 1); if (t >= tg + n * 0.06 + 0.15) { burst(540, ROWY, t, tg + n * 0.06 + 0.15, 40, ['#ffc95e', '#fff', '#f0ae36'], 1000, 1.0, 77 + p); ringFlash(540, ROWY, t, tg + n * 0.06 + 0.15, '255,201,94', 60, 520, 0.5, 8); } }
  }
  ledger(t);
  if (t < T_CHOICE - 0.3) { const p2 = activePair(t); let e = 'neutral';
    if (p2 >= 0) { const [bad, good, tb, th, tl, tg] = PAIRS[p2], done = tg + bad.length * 0.06 + 0.15; e = t < tg ? (t < th ? 'worried' : 'sad') : t < done ? 'shock' : 'happy'; }
    setFigureScale(0.95); const cheer = p2 >= 0 && t > PAIRS[p2][5] + 0.4 && t < PAIRS[p2][5] + 1.2;
    ctx.save(); ctx.globalAlpha *= 1 - smooth(T_CHOICE - 0.6, T_CHOICE - 0.3, t); hero(solve(cheer ? cheerPose(Math.sin(t * 8)) : standPose(Math.sin(t * 2)), 130, 1470, 0), { expr: e, t, speed: 0.2 }); ctx.restore(); }
  // the choice: he steps over to the gold side
  if (t >= T_CHOICE - 0.3) {
    const k = smooth(T_CHOICE - 0.3, T_CHOICE, t); txt('CHOOSE', 540, 660, 26, `rgba(240,238,232,${(0.6 * k).toFixed(3)})`, 700, 'center', null, 8);
    setFigureScale(1.25); const go = smooth(24.08, 24.6, t), x = lerp(540, 780, go), F = 1470;
    const P = go > 0 && go < 1 ? walkPose(t * 7, 0.05) : t > 24.7 ? cheerPose(Math.sin(t * 6)) : standPose(Math.sin(t * 2));
    ctx.save(); ctx.globalAlpha *= k; hero(solve(P, x, F, 0), { expr: t > 24.4 ? 'joy' : go > 0 ? 'determined' : 'calm', t, speed: 0.4, blur: 20 + 20 * go }); ctx.restore();
    ctx.save(); ctx.globalAlpha *= 0.3 * k; ctx.fillStyle = '#fff'; ctx.fillRect(540 - 1, 690, 2, 400); ctx.restore();
    if (t >= 24.4) { glowDot(780, 880, 320, 0.25 * smooth(24.4, 24.7, t)); burst(780, 880, t, 24.4, 60, ['#ffc95e', '#fff', '#f0ae36'], 1200, 1.3, 24); }
  }
}
const FLIPS = PAIRS.map(([b, g, tb, th, tl, tg]) => tg + b.length * 0.06 + 0.15);
PUNCHES = FLIPS.map((f) => [f, 0.05, 0.12]).concat([[24.4, 0.08, 0.15]]); SHAKES = FLIPS.map((f) => [f, 8, 0.15]).concat([[24.4, 16, 0.2]]);
CAMK = [[0, 540, 980, 1.12], [1.6, 540, 980, 1.06], [T_CHOICE - 0.5, 540, 1000, 1.0], [T_CHOICE, 560, 1000, 1.0], [26.4, 600, 980, 1.08]];
function screen(t) { FLIPS.forEach((f) => impactLines(t, f, 540, 860, 0.25)); impactLines(t, 24.4, 780, 900, 0.35); flash(t, 24.4, 0.15, 0.15); }
window.renderFrame = (t) => frame3(t, { scenes: scene, screen, PH, hook: { lines: [[['Same letters.', 0]], [['Different ', 0], ['life', 1], ['.', 0]]], tIn: 0, tOut: 3.3 },
  after: (t) => { if (t >= 25.35) endText(t, 25.35, [['Same letters.', '#fff'], ['Choose the better side.', GOLDL]], 64); } });
window.__allSteps = { pairs: PAIRS };
window.sceneReady = FONTS_READY();
