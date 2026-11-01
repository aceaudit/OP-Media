// 80. Me vs Me — a race he's losing, until the other lanes disappear and the only runner left is his own ghost from yesterday.
// Last year vs now, three stats that grew, and a fighting-game VS screen: ME vs ME. New personal best.
initCanvas('c');
const DUR = 18.8;
CAP.end = 17.6;
const SC = [[0, 3.95], [3.95, 7.9], [7.9, 10.1], [10.1, 13.8], [13.8, 15.5], [15.5, 99]];
const marks = makeMarks();
function track(y0, y1, d, lanes) {
  ctx.save(); ctx.fillStyle = 'rgba(120,52,40,0.35)'; ctx.fillRect(0, y0, 1080, y1 - y0);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = 0; i <= lanes; i++) ctx.fillRect(0, lerp(y0, y1, i / lanes) - 2, 1080, 4);
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; for (let i = 0; i < 8; i++) { const x = ((i * 160 - d) % 1280 + 1280) % 1280 - 100; for (let l = 0; l < lanes; l++) ctx.fillRect(x, lerp(y0, y1, (l + 0.5) / lanes) + 18, 60, 4); }
  ctx.restore();
}
function tag(s, x, y, bg, fg = INK, size = 26) { ctx.font = `700 ${size}px Poppins`; const w = ctx.measureText(s).width + 30; panel(x - w / 2, y - size * 0.8, w, size * 1.6, size * 0.8, null, bg, 0); txt(s, x, y + 1, size, fg, 700); }
function ghost(J, a = 0.35) { ctx.save(); ctx.globalAlpha *= a; drawFigure(ctx, J, '#ffe2a6', '#c9a46a', 'rgba(255,220,150,0.5)', 10); ctx.restore(); }
// ---------------------------------------------------------------- 1. the race he's losing; the other lanes vanish
function s1(t) {
  const d = t * 520, Y0 = 900, Y1 = 1460, lanes = 4, ly = (l) => lerp(Y0, Y1, (l + 1) / lanes) - 6;
  track(Y0, Y1, d, lanes);
  setFigureScale(0.95);
  const gone = smooth(2.64, 3.4, t);
  [[0, 640], [1, 760], [3, 560]].forEach(([l, x0], i) => { const x = x0 + (t > 1.12 ? (t - 1.12) * (220 + i * 60) : 0) + 20 * Math.sin(t * 2 + i);
    ctx.save(); ctx.globalAlpha *= 1 - gone; figWhite(solve(runPose(t * 15 + i * 2, 1, 0.3), x, ly(l), 0), 0.65); ctx.restore(); });
  fig(solve(runPose(t * 15, 1, 0.3), 330, ly(2), 0), 20);
  // position tag over him
  const pos = t < 1.12 ? '4th' : t < 2.64 ? '4th' : '';
  if (pos) { ctx.save(); ctx.globalAlpha *= 1 - gone; tag(pos, 330, ly(2) - 270, RED, '#fff', 30); ctx.restore(); }
  // leaderboard fades when the competition disappears
  ctx.save(); ctx.globalAlpha *= 1 - gone; panel(700, 620, 330, 150, 20, 'rgba(255,255,255,0.2)');
  ['1. THEM', '2. THEM', '3. THEM', '4. YOU'].forEach((s, i) => txt(s, 730, 644 + i * 33, 24, i === 3 ? '#ff8a7e' : 'rgba(240,238,232,0.75)', 700, 'left', null, 3)); ctx.restore();
  if (t >= 2.64) { ctx.save(); ctx.globalAlpha *= smooth(2.9, 3.3, t); tag('YOUR LANE', 330, ly(2) - 270, GOLDL, INK, 28); ctx.restore(); }
}
// ---------------------------------------------------------------- 2. the only rival: yesterday's ghost
function s2(t) {
  const d = t * 560; track(1180, 1420, d, 1); setFigureScale(1.4);
  const close = smooth(7.0, 7.9, t);
  const gx = 640 - 140 * close + 10 * Math.sin(t * 1.5), x = 380;
  const k = clamp((t - 4.72) / 0.4);
  if (k > 0) { const Jg = solve(runPose(t * 13 + 1.2, 1, 0.3), gx, 1400, 0); ghost(Jg, 0.4 * k); ctx.save(); ctx.globalAlpha *= k; tag('GHOST', gx, Jg.head[1] - 70, 'rgba(255,226,166,0.85)', INK, 24); ctx.restore();
    if (t >= 7.04) { const kk = popK(t, 7.04, 0.25); ctx.save(); ctx.translate(gx, Jg.head[1] - 130); ctx.scale(kk, kk); tag('YESTERDAY', 0, 0, GOLDL, INK, 30); ctx.restore(); } }
  fig(solve(runPose(t * 13, 1, 0.3), x, 1400, 0), 20);
  // split timer like a racing game
  if (t >= 4.5) { const k2 = popK(t, 4.5, 0.25); ctx.save(); ctx.translate(540, 820); ctx.scale(k2, k2); panel(-200, -60, 400, 120, 24, 'rgba(255,255,255,0.22)'); txt('VS GHOST', 0, -24, 22, 'rgba(240,238,232,0.7)', 700, 'center', null, 6);
    const gap = lerp(0.42, 0.03, close); txt(`+${gap.toFixed(2)}s`, 0, 22, 54, gap > 0.2 ? '#ff8a7e' : GOLDL, 700); ctx.restore(); }
}
// ---------------------------------------------------------------- 3. last year I was different
function s3(t) {
  ctx.save(); ctx.fillStyle = 'rgba(140,120,90,0.08)'; ctx.fillRect(0, 660, 530, 780); ctx.fillStyle = 'rgba(255,201,94,0.06)'; ctx.fillRect(550, 660, 530, 780); ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(538, 660, 4, 780); ctx.restore();
  floorLine(1400, 0.2);
  txt('LAST YEAR', 270, 720, 34, 'rgba(240,238,232,0.6)', 700, 'center', null, 8); txt('NOW', 810, 720, 34, GOLDL, 700, 'center', 'rgba(255,170,50,0.6)', 8);
  // couch + slumped
  ctx.save(); ctx.fillStyle = '#3a3640'; ctx.beginPath(); ctx.roundRect(110, 1270, 320, 70, 18); ctx.fill(); ctx.beginPath(); ctx.roundRect(110, 1180, 60, 160, 18); ctx.fill(); ctx.fillRect(130, 1340, 14, 60); ctx.fillRect(396, 1340, 14, 60); ctx.restore();
  setFigureScale(1.2); const Jl = solve(slumpSitPose(Math.sin(t * 2)), 230, 1272, 0); drawFigure(ctx, Jl, GREY, GREY_FAR, GREY_GLOW, 4);
  ctx.save(); ctx.translate(Jl.wN[0] + 10, Jl.wN[1]); ctx.rotate(-0.5); ctx.fillStyle = '#2c2b31'; ctx.strokeStyle = '#6a6974'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-10, -30, 22, 40, 4); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(120,170,255,0.6)'; ctx.fillRect(-6, -26, 14, 32); ctx.restore();
  setFigureScale(1.45); const k = smooth(9.6, 9.85, t); fig(solve(mix(tallPose(Math.sin(t * 2)), cheerPose(Math.sin(t * 6)), k * 0), 810, 1400, 0), 20 + 20 * k);
  if (t >= 9.6) ringFlash(810, 1200, t, 9.6, '255,201,94', 60, 360, 0.5, 8);
}
// ---------------------------------------------------------------- 4. grown, learned, improved
const STATS = [['GROWN', 10.56, 0.32, 0.86], ['LEARNED', 11.68, 0.25, 0.8], ['IMPROVED', 12.88, 0.38, 0.92]];
function s4(t) {
  panel(90, 660, 900, 440, 30, 'rgba(255,255,255,0.18)');
  txt('ME · LAST YEAR vs ME · NOW', 540, 706, 24, 'rgba(240,238,232,0.6)', 700, 'center', null, 4);
  STATS.forEach(([lab, ts, a, b], i) => { const y = 785 + i * 110, on = t >= ts, u = easeOut(clamp((t - ts) / 0.5));
    txt(lab, 130, y, 32, on ? GOLDL : 'rgba(240,238,232,0.5)', 700, 'left', null, 4);
    bar(420, y - 34, 520, 22, a, 'rgba(160,160,160,0.7)', 'rgba(255,255,255,0.08)', false);
    bar(420, y + 2, 520, 26, on ? lerp(a, b, u) : a * 0.98, on ? GOLDL : 'rgba(255,201,94,0.25)');
    if (on) { txt(`+${Math.round((b - a) * 100 * u)}%`, 960, y + 50, 26, '#ffd98a', 700, 'right'); ringFlash(420 + 520 * b, y + 15, t, ts + 0.45, '255,201,94', 10, 80, 0.35, 5); } });
  setFigureScale(lerp(0.75, 1.0, smooth(10.56, 13.0, t)));
  fig(solve(tallPose(Math.sin(t * 2)), 540, 1440, 0), 20);
}
// ---------------------------------------------------------------- 5. what truly matters
function s5(t) {
  const k = popK(t, 13.95, 0.3); ctx.save(); ctx.translate(540, 980); ctx.scale(k, k);
  panel(-420, -150, 840, 300, 40, GOLDL, 'rgba(30,26,18,0.95)', 4);
  txt('ME', -250, -10, 96, GOLDL, 700, 'center', 'rgba(255,170,50,0.7)'); txt('TODAY', -250, 70, 24, '#ffd98a', 700, 'center', null, 6);
  txt('>', 0, -6, 120, '#fff', 700, 'center', 'rgba(255,255,255,0.6)');
  txt('ME', 250, -10, 96, 'rgba(240,238,232,0.45)', 700); txt('YESTERDAY', 250, 70, 24, 'rgba(240,238,232,0.45)', 700, 'center', null, 6);
  ctx.restore(); if (t >= 14.88) { ringFlash(540, 980, t, 14.88, '255,201,94', 200, 640, 0.55, 10); burst(290, 980, t, 14.88, 40, ['#ffc95e', '#fff'], 900, 1.0, 14); }
}
// ---------------------------------------------------------------- 6. ME vs ME (fighting-game screen) → new personal best
function s6(t) {
  const sl = easeOut(clamp((t - 15.55) / 0.35));
  ctx.save(); ctx.beginPath(); ctx.moveTo(0, 640); ctx.lineTo(lerp(-600, 600, sl), 640); ctx.lineTo(lerp(-600, 480, sl), 1460); ctx.lineTo(0, 1460); ctx.closePath(); ctx.fillStyle = 'rgba(70,70,80,0.55)'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.moveTo(1080, 640); ctx.lineTo(lerp(1680, 620, sl), 640); ctx.lineTo(lerp(1680, 500, sl), 1460); ctx.lineTo(1080, 1460); ctx.closePath(); ctx.fillStyle = 'rgba(255,201,94,0.22)'; ctx.fill(); ctx.restore();
  setFigureScale(1.45);
  const fight = { ...standPose(0), t: 0.1, h: -0.1, hipN: 0.45, kneeN: 0.4, hipF: -0.35, kneeF: 0.2, shN: 1.3, elN: 1.9, shF: 1.0, elF: 2.1 };
  const bob = Math.sin(t * 6) * 0.04;
  ctx.save(); ctx.translate(lerp(-400, 0, sl), 0); mirrorX(270, () => drawFigure(ctx, solve({ ...fight, t: fight.t + bob }, 270, 1400, 0), GREY, GREY_FAR, GREY_GLOW, 6)); ctx.restore();
  ctx.save(); ctx.translate(lerp(400, 0, sl), 0); fig(solve({ ...fight, t: fight.t - bob }, 810, 1400, 0), 24); ctx.restore();
  if (t >= 16.0) { const k = popK(t, 16.0, 0.2); ctx.save(); ctx.translate(270, 760); ctx.scale(k, k); txt('ME', 0, 0, 64, 'rgba(240,238,232,0.8)', 700); txt('YESTERDAY', 0, 52, 22, 'rgba(240,238,232,0.5)', 700, 'center', null, 6); ctx.restore(); }
  if (t >= 16.8) { const k = popK(t, 16.8, 0.2); ctx.save(); ctx.translate(810, 760); ctx.scale(k, k); txt('ME', 0, 0, 64, GOLDL, 700, 'center', 'rgba(255,170,50,0.7)'); txt('TODAY', 0, 52, 22, '#ffd98a', 700, 'center', null, 6); ctx.restore(); }
  stamp('VS', 540, 1020, t, 16.32, '#fff', 170, -0.1, false);
  if (t >= 16.32) { flash(t, 16.32, 0.18, 0.15); ringFlash(540, 1020, t, 16.32, '255,255,255', 60, 520, 0.4, 10); }
  if (t >= 17.6) { pill('NEW PERSONAL BEST', 540, 1250, t, 17.6, { size: 38 }); burst(810, 1100, t, 17.6, 70, ['#ffc95e', '#fff', '#f0ae36'], 1300, 1.3, 80); }
}
const SCENES = [s1, s2, s3, s4, s5, s6];
window.renderFrame = (t) => {
  background(t, W_DUST()); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const [sx, sy] = shakeXY(t, 16.32, 14, 0.18); ctx.save(); ctx.translate(sx, sy); runScenes(t, SC, SCENES); ctx.restore();
  setFigureScale(1); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; vignette(); captions(t, PH);
  if (t >= 17.6) endText(t, 17.6, [['Beat', '#fff'], ['yesterday.', GOLDL]], 82);
  return true;
};
window.__allSteps = { scenes: SC, vs: 16.32 };
window.sceneReady = FONTS_READY();
