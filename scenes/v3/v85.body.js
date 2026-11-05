// 85. Your Future Self Is Watching (v3 original, no voice) — SHOCK OPEN on a glowing window: future him, 5 years from now, looking
// straight at camera. Pull back: present him on the couch, scrolling. Every scroll and skipped workout, the future self dims and
// slumps. Present him looks up — eye contact. Phone down: a page, a mile, an early night, and the future self lights up gold.
initCanvas('c');
const DUR = 15.0;
CAP.y = 430; CAP.end = 12.55;
ATMO = { tint: [255, 196, 130], tintA: 0.05, shafts: 0.07, bokeh: 0.8 };
const F = 1420, PX = 300, WX = 735, WY = 905, WW = 430, WH = 540, WF = WY + WH / 2 - 30;
const T_SCROLL = 2.6, T_SKIP = 4.5, T_LOOK = 6.2, T_UP = 7.4, T_RUN = 8.5, T_BED = 9.6, T_PROUD = 10.8, T_END = 12.6;
function brightAt(t) { const K = [[0, 0.7], [T_SCROLL, 0.45], [T_SKIP, 0.22], [T_UP, 0.42], [T_RUN, 0.62], [T_BED, 0.82], [T_PROUD, 1]]; let v = 0.7;
  for (const [ts, b] of K) if (t >= ts) v = lerp(v, b, smooth(ts, ts + 0.5, t)); return v; }
function futureExpr(t) { if (t < T_SCROLL) return 'calm'; if (t < T_SKIP) return 'sad'; if (t < T_LOOK) return 'tired'; if (t < T_UP) return 'worried'; if (t < T_RUN) return 'calm'; if (t < T_PROUD) return 'happy'; return 'proud'; }
function couch(x) { ctx.save(); ctx.fillStyle = '#4a3f5c'; ctx.beginPath(); ctx.roundRect(x - 210, F - 250, 420, 120, 30); ctx.fill(); ctx.fillStyle = '#5b4e70'; ctx.beginPath(); ctx.roundRect(x - 230, F - 150, 460, 90, 24); ctx.fill();
  ctx.fillStyle = '#3d344d'; ctx.beginPath(); ctx.roundRect(x - 260, F - 190, 60, 150, 20); ctx.fill(); ctx.beginPath(); ctx.roundRect(x + 200, F - 190, 60, 150, 20); ctx.fill(); ctx.fillStyle = '#2b2436'; ctx.fillRect(x - 210, F - 60, 20, 60); ctx.fillRect(x + 190, F - 60, 20, 60); ctx.restore(); }
function phone(x, y, s = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = '#1b1a20'; ctx.strokeStyle = '#8f8c86'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-24, -42, 48, 84, 9); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(150,190,255,0.55)'; ctx.beginPath(); ctx.roundRect(-18, -35, 36, 68, 5); ctx.fill(); ctx.restore(); }
function book(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#e9e4d6'; ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(-44, -34); ctx.lineTo(-44, 22); ctx.lineTo(0, 30); ctx.lineTo(44, 22); ctx.lineTo(44, -34); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#8a8478'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(0, 30); ctx.stroke(); ctx.restore(); }
function windowFuture(t) {
  const b = brightAt(t), k = popK(t, 0.0, 0.25);
  ctx.save(); ctx.translate(WX, WY); ctx.scale(k, k); ctx.translate(-WX, -WY);
  // frame + glow
  ctx.save(); ctx.shadowColor = `rgba(255,190,90,${(0.8 * b).toFixed(3)})`; ctx.shadowBlur = 50 * b; ctx.fillStyle = '#0d0c10'; ctx.beginPath(); ctx.roundRect(WX - WW / 2, WY - WH / 2, WW, WH, 28); ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(WX - WW / 2, WY - WH / 2, WW, WH, 28); ctx.clip();
  const g = ctx.createLinearGradient(0, WY - WH / 2, 0, WY + WH / 2); g.addColorStop(0, `rgba(255,190,110,${(0.05 + 0.3 * b).toFixed(3)})`); g.addColorStop(1, 'rgba(40,36,44,0.9)'); ctx.fillStyle = g; ctx.fillRect(WX - WW / 2, WY - WH / 2, WW, WH);
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(WX - WW / 2, WF + 2, WW, 3);
  setFigureScale(1.15);
  const P = mix({ ...standPose(Math.sin(t * 2)), t: 0.18, h: 0.42, shN: 0.05, shF: -0.05 }, t > T_PROUD + 0.3 ? cheerPose(Math.sin(t * 5)) : tallPose(Math.sin(t * 2)), clamp((b - 0.2) / 0.8));
  const J = solve(P, WX, WF, 0);
  ctx.save(); ctx.globalAlpha *= 1 - b; hero(J, { expr: futureExpr(t), t, col: GREYC, blur: 6, seed: 9 }); ctx.restore();
  ctx.save(); ctx.globalAlpha *= b; hero(J, { expr: futureExpr(t), t, blur: 10 + 30 * b, seed: 9, speed: 0.2 }); ctx.restore();
  ctx.restore();
  ctx.strokeStyle = `rgba(255,201,94,${(0.35 + 0.6 * b).toFixed(3)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(WX - WW / 2, WY - WH / 2, WW, WH, 28); ctx.stroke();
  ctx.save(); ctx.translate(WX, WY - WH / 2 + 38); panel(-150, -20, 300, 40, 20, 'rgba(255,201,94,0.5)', 'rgba(14,13,18,0.85)', 2); txt('YOU · IN 5 YEARS', 0, 1, 20, '#ffd98a', 700, 'center', null, 4); ctx.restore();
  // meter
  ctx.save(); ctx.translate(WX, WY + WH / 2 + 50); bar(-WW / 2 + 20, -11, WW - 40, 22, b, b > 0.55 ? GOLDL : '#9c9993'); ctx.restore();
  ctx.restore();
}
function presentScene(t) {
  setFigureScale(1.45);
  if (t < T_UP) {
    couch(PX);
    const look = smooth(T_LOOK, T_LOOK + 0.25, t);
    let P = { ...slumpSitPose(Math.sin(t * 2)), h: lerp(0.55, -0.35, look) };
    let J = solve(P, PX, F - 125, 0);
    const [s, e] = armIK(J.sh, [J.head[0] + 60, J.head[1] + 70 + 50 * look]); P = { ...P, shN: s, elN: e }; J = solve(P, PX, F - 125, 0);
    hero(J, { expr: t < T_SKIP ? 'tired' : t < T_LOOK ? 'sleep' : 'shock', t, speed: 0.1, blur: 14 });
    phone(J.wN[0], J.wN[1] - 18, 1, -0.25);
    if (t > T_SKIP && t < T_LOOK) { const k = popK(t, T_SKIP, 0.25) * (1 - smooth(T_LOOK - 0.3, T_LOOK, t)); ctx.save(); ctx.globalAlpha *= k; ctx.translate(PX + 30, F - 520); panel(-150, -40, 300, 80, 24, 'rgba(255,255,255,0.25)', 'rgba(22,21,26,0.95)'); txt('Workout', -20, -10, 28, '#f4f2ee', 700); txt('SKIPPED', -20, 22, 22, '#ff8a7e', 700, 'center', null, 4); cross(110, 0, 26, RED, 1, 7); ctx.restore(); }
    return;
  }
  // montage: a page, a mile, an early night, then he stands tall facing the window
  if (t < T_RUN) { const P0 = { ...standPose(Math.sin(t * 2)), h: 0.32 }; let J = solve(P0, PX, F, 0);
    const [s1, e1] = armIK(J.sh, [J.sh[0] + 70, J.sh[1] + 40]); const P = { ...P0, shN: s1, elN: e1, shF: s1 - 0.1, elF: e1 }; J = solve(P, PX, F, 0);
    hero(J, { expr: 'calm', t, blur: 18 }); book(J.wN[0] + 6, J.wN[1] - 6, 1.1); return; }
  if (t < T_BED) { floorLine(F + 2, 0.2); groundMarks(makeMarks.cache || (makeMarks.cache = makeMarks()), F, (t - T_RUN) * 520);
    hero(solve(runPose((t - T_RUN) * 12, 0.9, 0.25), PX, F, 0), { expr: 'determined', t, speed: 1.2, blur: 22 }); speedLines(t, 1150, 1400, 8, -1, 0.15, 140); return; }
  if (t < T_PROUD) { bed(PX + 20, F - 60, 400); const P = { ...standPose(0), shN: 0.3, elN: 0.5, shF: 0.1, elF: 0.4 }; const px = PX + 60, py = F - 100; const J = solve(P, px, 0, 0, false, py);
    rotated(px, py, -Math.PI / 2, () => hero(J, { expr: 'sleep', t, blur: 14 })); blanket(PX + 20, F - 60, 400, '#43597a'); clockFace(PX + 230, F - 380, 46, 10, 0, 0, t); return; }
  const J = solve(t > T_PROUD + 0.4 ? { ...tallPose(Math.sin(t * 2)), h: -0.25 } : standPose(0), PX + 40, F, 0); hero(J, { expr: 'proud', t, blur: 30 });
}
function scene(t, c) { floorLine(F + 2, 0.2); windowFuture(t); presentScene(t); }
CAMK = [[0, WX, WY, 1.6, 0], [0.5, WX, WY, 1.5, 0], [2.2, 540, 1010, 1.0, 0], [T_LOOK - 0.1, 520, 1020, 1.04, 0], [T_LOOK + 0.05, PX + 30, 1180, 1.7, 0],
        [T_LOOK + 0.6, PX + 30, 1180, 1.75, 0], [T_LOOK + 0.75, WX, WY, 1.6, 0], [T_UP - 0.1, WX, WY, 1.65, 0], [T_UP, 540, 1010, 1.0, 0], [T_PROUD, 560, 990, 1.05, 0], [DUR, 540, 1000, 1.0, 0]];
SHAKES = [[0, 10, 0.18], [T_UP, 12, 0.2]]; PUNCHES = [[0, 0.06, 0.12], [T_LOOK + 0.05, 0.05, 0.12], [T_UP, 0.07, 0.14], [T_PROUD, 0.05, 0.12]];
function screen(t) { whipLines(t, T_LOOK + 0.7, 0.18, 1); whipLines(t, T_UP, 0.18, -1); whipLines(t, T_RUN, 0.15, 1); whipLines(t, T_BED, 0.15, 1); whipLines(t, T_PROUD, 0.15, -1);
  if (t >= T_PROUD + 0.3) ringFlash(WX, WY, t, T_PROUD + 0.3, '255,201,94', 80, 520, 0.7, 8); }
window.renderFrame = (t) => frame3(t, { scenes: scene, screen, PH, hook: { lines: [[['Your ', 0], ['future self', 1]], [['is watching this.', 0]]], tIn: 0, tOut: 2.4 },
  after: (t) => { if (t >= T_END) endText(t, T_END, [['Make him', '#fff'], ['proud.', GOLDL]], 84); } });
window.__allSteps = {};
window.sceneReady = FONTS_READY();
