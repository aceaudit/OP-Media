// 84. The 2-Minute Rule (v3 original, no voice) — SHOCK OPEN: a "Workout · 1 hour" reminder buzzes at him on the couch; he swipes
// it away. Don't commit to an hour — commit to 2 minutes: a 2:00 timer, shoes on, out the door. 0:00 DING — he's allowed to stop…
// he doesn't: the timer flips into a stopwatch racing up to 45:12 while he runs into the sunrise.
initCanvas('c');
const DUR = 15.0;
CAP.y = 430; CAP.end = 13.15;
ATMO = { tint: [255, 190, 120], tintA: 0.05, shafts: 0.06, bokeh: 0.8 };
const F = 1420, T_SWIPE = 1.55, T_HOUR = 2.6, T_TWO = 4.0, T_UP = 4.6, T_OUT = 7.4, T_ZERO = 8.2, T_FLIP = 9.2, T_END = 13.2;
const mmss = (sec) => { sec = Math.max(0, Math.floor(sec)); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); };
function timerVal(t) { if (t < T_ZERO) return 120 - 120 * clamp((t - T_TWO - 0.3) / (T_ZERO - T_TWO - 0.3)); if (t < T_FLIP) return 0; return 2712 * Math.pow(clamp((t - T_FLIP) / 3.0), 1.4); }
function couch(x) { ctx.save(); ctx.fillStyle = '#4a3f5c'; ctx.beginPath(); ctx.roundRect(x - 230, F - 250, 460, 120, 30); ctx.fill(); ctx.fillStyle = '#5b4e70'; ctx.beginPath(); ctx.roundRect(x - 250, F - 150, 500, 90, 24); ctx.fill();
  ctx.fillStyle = '#3d344d'; ctx.beginPath(); ctx.roundRect(x - 280, F - 190, 60, 150, 20); ctx.fill(); ctx.beginPath(); ctx.roundRect(x + 220, F - 190, 60, 150, 20); ctx.fill(); ctx.fillStyle = '#2b2436'; ctx.fillRect(x - 230, F - 60, 20, 60); ctx.fillRect(x + 210, F - 60, 20, 60); ctx.restore(); }
function door(x, open) { ctx.save(); ctx.fillStyle = 'rgba(255,214,140,' + (0.5 * open).toFixed(3) + ')'; ctx.fillRect(x - 70, F - 330, 140, 330); ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 10; ctx.strokeRect(x - 70, F - 330, 140, 330);
  ctx.fillStyle = '#6b5641'; ctx.beginPath(); ctx.moveTo(x - 70, F - 330); ctx.lineTo(x - 70 + 140 * (1 - 0.8 * open), F - 330 + 20 * open); ctx.lineTo(x - 70 + 140 * (1 - 0.8 * open), F - 20 * open); ctx.lineTo(x - 70, F); ctx.fill(); ctx.restore(); }
function notif(t) {
  const k = popK(t, 0.05, 0.22); if (k <= 0) return; const sw = clamp((t - T_SWIPE) / 0.35); if (sw >= 1) return;
  const buzz = t < T_SWIPE ? 6 * Math.sin(t * 70) * (Math.floor(t * 3) % 2) : 0;
  ctx.save(); ctx.translate(540 + buzz + 900 * easeIn(sw), 630); ctx.rotate(0.3 * sw); ctx.scale(k, k);
  panel(-300, -70, 600, 140, 30, 'rgba(255,201,94,0.6)', 'rgba(24,23,28,0.97)', 4);
  ctx.fillStyle = GOLDL; ctx.beginPath(); ctx.roundRect(-264, -34, 68, 68, 16); ctx.fill(); ctx.fillStyle = INK; ctx.fillRect(-250, -6, 40, 12); ctx.fillRect(-256, -16, 10, 32); ctx.fillRect(-214, -16, 10, 32);
  txt('Workout', -170, -22, 40, '#f4f2ee', 700, 'left'); txt('1 hour · starts now', -170, 24, 28, 'rgba(240,238,232,0.6)', 500, 'left'); txt('now', 270, -24, 22, 'rgba(240,238,232,0.45)', 500, 'right');
  ctx.restore();
}
const easeIn = (u) => u * u * u;
function hourCard(t) {
  const k = popK(t, T_HOUR, 0.25), out = smooth(T_TWO - 0.15, T_TWO + 0.1, t); if (k <= 0 || out >= 1) return;
  ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(540, 700); ctx.scale(k, k); panel(-210, -80, 420, 160, 34, 'rgba(255,255,255,0.3)', 'rgba(24,23,28,0.97)', 4);
  txt('1:00:00', 0, 6, 92, 'rgba(240,238,232,0.85)', 700); const st = clamp((t - T_HOUR - 0.55) / 0.2); if (st > 0) cross(0, 4, 90, RED, st, 14); ctx.restore();
}
function timer(t) {
  const k = popK(t, T_TWO, 0.25); if (k <= 0) return; const up = t >= T_FLIP, fl = clamp((t - T_FLIP) / 0.3), sx = Math.abs(Math.cos(fl * Math.PI)) + 0.02;
  const zero = t >= T_ZERO && t < T_FLIP, pulse = zero ? 1 + 0.06 * Math.sin((t - T_ZERO) * 20) * Math.exp(-(t - T_ZERO) * 3) : 1;
  ctx.save(); ctx.translate(540, 700); ctx.scale(k * sx * pulse, k * pulse);
  const gold = up && fl >= 0.5;
  panel(-250, -96, 500, 192, 40, gold ? GOLDL : zero ? '#7fd17f' : 'rgba(255,201,94,0.6)', 'rgba(20,19,24,0.96)', 5);
  txt(gold ? 'STOPWATCH' : 'JUST 2 MINUTES', 0, -56, 26, 'rgba(240,238,232,0.6)', 700, 'center', null, 6);
  const v = timerVal(t); txt(mmss(v), 0, 26, 104, gold ? GOLDL : zero ? '#9be29b' : '#f4f2ee', 700, 'center', gold ? 'rgba(255,170,50,0.7)' : null);
  ctx.restore();
}
function scene(t, c) {
  const outside = t >= T_OUT;
  if (!outside) {
    floorLine(F + 2, 0.22); couch(380); door(900, smooth(6.6, 7.1, t));
    setFigureScale(1.55);
    const stand = smooth(T_UP, T_UP + 0.5, t), walk = clamp((t - 5.9) / 1.3);
    let P, x = 380;
    if (t < T_UP) P = slumpSitPose(Math.sin(t * 2));
    else if (t < 5.9) P = mix(slumpSitPose(0), { ...bendPose(), t: 0.9 }, stand);      // bends down: shoes on
    else { P = walkPose(t * 6, 0.08); x = lerp(380, 880, easeInOut(walk)); }
    const J = solve(P, x, t < T_UP + 0.2 ? F - 130 * (1 - stand) : F, 0);
    const ex = t < T_SWIPE + 0.2 ? 'tired' : t < T_TWO ? 'sleep' : t < T_UP ? 'calm' : 'determined';
    hero(J, { expr: t < 0.9 ? 'shock' : ex, t, speed: 0.2, blur: 16 });
    // shoes glow on once they're on
    if (t > 5.2) { ctx.save(); ctx.fillStyle = GOLDL; ctx.shadowColor = 'rgba(255,180,60,0.9)'; ctx.shadowBlur = 16 * smooth(5.2, 5.6, t); [J.aN, J.aF].forEach((a) => { ctx.beginPath(); ctx.roundRect(a[0] - 14, a[1] - 14, 46, 20, 8); ctx.fill(); }); ctx.restore(); }
    if (t > T_UP + 0.1 && t < 5.9) { ctx.save(); ctx.globalAlpha *= smooth(T_UP + 0.1, T_UP + 0.3, t); txt('shoes on', x + 190, F - 40, 30, '#ffd98a', 700); ctx.restore(); }
  } else {
    // outside: the road at dawn, sun rising as the stopwatch climbs
    const sun = smooth(T_FLIP, T_END, t), sy = lerp(1300, 900, sun);
    ctx.save(); const g = ctx.createLinearGradient(0, 700, 0, F); g.addColorStop(0, 'rgba(255,170,80,0)'); g.addColorStop(1, `rgba(255,170,80,${(0.28 * sun).toFixed(3)})`); ctx.fillStyle = g; ctx.fillRect(-500, 700, 2080, F - 700); ctx.restore();
    glowDot(820, sy, 380, 0.25 + 0.3 * sun); ctx.save(); ctx.beginPath(); ctx.rect(-500, 0, 2080, F); ctx.clip(); ctx.fillStyle = '#ffd27a'; ctx.shadowColor = 'rgba(255,190,90,1)'; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(820, sy, 110, 0, TAU); ctx.fill(); ctx.restore();
    const spd = t < T_ZERO ? 260 : t < T_FLIP ? 300 : 300 + 420 * smooth(T_FLIP, T_FLIP + 0.6, t);
    floorLine(F + 2, 0.3); groundMarks(makeMarks.cache || (makeMarks.cache = makeMarks()), F, (t - T_OUT) * spd + (t > T_FLIP ? (t - T_FLIP) * 200 : 0));
    setFigureScale(1.5);
    const run = t > T_OUT + 0.3, fast = smooth(T_FLIP, T_FLIP + 0.5, t);
    const P = run ? runPose((t - T_OUT) * (9 + 5 * fast), 0.6 + 0.4 * fast, 0.18 + 0.1 * fast) : walkPose(t * 7, 0.08);
    const J = solve(P, 470, F, 0);
    const ex = t < T_ZERO ? 'determined' : t < T_FLIP ? 'calm' : t < T_FLIP + 2.4 ? 'joy' : 'proud';
    hero(J, { expr: ex, t, speed: 0.6 + fast, blur: 18 + 22 * fast });
    ctx.save(); ctx.fillStyle = GOLDL; ctx.shadowColor = 'rgba(255,180,60,0.9)'; ctx.shadowBlur = 16; [J.aN, J.aF].forEach((a) => { ctx.beginPath(); ctx.roundRect(a[0] - 14, a[1] - 14, 46, 20, 8); ctx.fill(); }); ctx.restore();
    if (t > T_FLIP) sweat(J.head[0] - 30, J.head[1] - 40, t, 3);
    if (t >= T_ZERO && t < T_FLIP + 0.2) { const k = popK(t, T_ZERO + 0.3, 0.25); bubble(700, 980, 90, k, J.head[0] + 30, J.head[1] - 30, 'rgba(22,21,26,0.95)', 'rgba(255,255,255,0.6)'); txt('stop?', 700, 980, 34 * k, '#f4f2ee', 700); }
  }
}
CAMK = [[0, 420, 1200, 1.9, 0.03], [0.4, 420, 1200, 1.75, 0], [2.4, 540, 1050, 1.0, 0], [4.5, 540, 1050, 1.0, 0], [5.9, 500, 1080, 1.12, 0], [7.3, 760, 1080, 1.15, 0],
        [7.4, 540, 1060, 1.0, 0], [9.1, 520, 1080, 1.08, 0], [9.3, 500, 1100, 1.25, 0], [11.5, 520, 1060, 1.05, 0], [DUR, 540, 1040, 1.0, 0]];
SHAKES = [[0.05, 16, 0.2], [T_TWO, 8, 0.15], [T_ZERO, 10, 0.2], [T_FLIP, 20, 0.25]];
PUNCHES = [[0.05, 0.08, 0.14], [T_HOUR + 0.55, 0.04, 0.1], [T_TWO, 0.06, 0.12], [T_ZERO, 0.05, 0.12], [T_FLIP, 0.1, 0.16], [T_END, 0.05, 0.12]];
function screen(t) {
  notif(t); hourCard(t); timer(t);
  impactLines(t, 0.05, 540, 630, 0.3); flash(t, 0.05, 0.2, 0.12); whipLines(t, T_SWIPE + 0.1, 0.18, 1); whipLines(t, T_OUT, 0.18, 1);
  impactLines(t, T_FLIP, 540, 700, 0.35); flash(t, T_FLIP, 0.3, 0.15);
  if (t > T_FLIP) speedLines(t, 1000, 1500, 10, -1, 0.2 * smooth(T_FLIP, T_FLIP + 0.4, t), 160);
  if (t >= T_ZERO) ringFlash(540, 700, t, T_ZERO, '127,209,127', 60, 420, 0.5, 8);
  if (t >= T_END) burst(540, 700, t, T_END, 50, ['#ffc95e', '#fff', '#f0ae36'], 1000, 1.2, 84);
}
window.renderFrame = (t) => frame3(t, { scenes: scene, screen, PH, hook: { lines: [[["Can't make yourself", 0]], [['start', 1], ['? Try this.', 0]]], tIn: 0, tOut: 2.5 },
  after: (t) => { if (t >= T_END) endText(t, T_END, [['Just start.', '#fff'], ['2 minutes.', GOLDL]], 80); } });
window.__allSteps = {};
window.sceneReady = FONTS_READY();
