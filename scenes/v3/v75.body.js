// 75. Expect Less, Demand More — his mood is a battery wired to other people. They drain it, one let-down at a time.
// He unplugs, charges himself through every "you'll…", cuts the cords, and walks on inside his own peace.
initCanvas('c');
const DUR = 47.34;
ATMO = { tint: [255, 190, 120], tintA: 0.05, shafts: 0.06, bokeh: 0.8 }; CAP.y = 430;
CAP.end = 46.49;
const FLOOR = 1400;
const SC = [[0, 5.3], [5.3, 8.7], [8.7, 12.6], [12.6, 15.99], [15.99, 18.43], [18.43, 22.9], [22.9, 24.1], [24.1, 29.7], [29.7, 32.7], [32.7, 35.0], [35.0, 37.1], [37.1, 41.5], [41.5, 45.0], [45.0, 48.4], [48.4, 99]];
// ---------------------------------------------------------------- battery
const PLUGS = [0.3, 0.88, 1.44];
const LEVELS = [[0, 100], [0.3, 94], [0.88, 88], [1.44, 82], [7.92, 62], [16.72, 35], [18.0, 22], [21.91, 6]];
function levelAt(t) { let v = 100, pt = 0; for (const [ts, lv] of LEVELS) { if (t >= ts) { const u = clamp((t - ts) / 0.35); v = lerp(v, lv, u); } } return v; }
function battery(x, y, lv, k = 1, blink = false, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const col = lv > 50 ? GOLDL : lv > 25 ? '#ff9d4d' : RED, off = blink && lv < 12 && Math.floor(t * 4) % 2;
  ctx.strokeStyle = '#f4f2ee'; ctx.lineWidth = 6; ctx.fillStyle = 'rgba(20,19,24,0.95)'; ctx.beginPath(); ctx.roundRect(-80, -40, 160, 80, 14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f4f2ee'; ctx.fillRect(80, -16, 12, 32);
  if (!off) { ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.beginPath(); ctx.roundRect(-70, -30, 140 * clamp(lv / 100), 60, 8); ctx.fill(); ctx.shadowBlur = 0; }
  txt(`${Math.round(lv)}%`, 0, 72, 34, col, 700); ctx.restore();
}
function cable(x0, y0, x1, y1, sag = 120, col = 'rgba(200,205,215,0.75)', w = 5, cut = -1) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0);
  if (cut < 0) ctx.quadraticCurveTo((x0 + x1) / 2, Math.max(y0, y1) + sag, x1, y1);
  else { const mx = (x0 + x1) / 2, my = Math.max(y0, y1) + sag; ctx.quadraticCurveTo(lerp(x0, mx, 0.5), lerp(y0, my, 0.5) + cut * 200, lerp(x0, mx, 0.9), lerp(y0, my, 0.9) + cut * 400); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(lerp(x1, mx, 0.5), lerp(y1, my, 0.5) + cut * 200, lerp(x1, mx, 0.9), lerp(y1, my, 0.9) + cut * 400); }
  ctx.stroke(); ctx.restore();
}
function plug(x, y) { ctx.save(); ctx.fillStyle = '#c9ccd2'; ctx.fillRect(x - 10, y - 8, 20, 16); ctx.fillRect(x + 10, y - 6, 8, 3); ctx.fillRect(x + 10, y + 3, 8, 3); ctx.restore(); }
function me(x, P, expr, t, blur = 18) { const J = solve(P, x, FLOOR, 0); hero(J, { expr, t, blur }); return J; }
function white(x, P, a = 0.6, flip = false, expr = 'neutral', t = 0) { const J = solve(P, x, FLOOR, 0); const d = () => { ctx.save(); ctx.globalAlpha *= Math.min(1, a / 0.6); hero(J, { expr, t, col: WHITEC, blur: 6, seed: x }); ctx.restore(); }; if (flip) mirrorX(x, d); else d(); return J; }
// ---------------------------------------------------------------- 1. wired to other people
function s1(t) {
  floorLine(FLOOR + 2, 0.2); setFigureScale(1.45);
  const J = me(320, { ...standPose(Math.sin(t * 2)), h: -0.05 }, t < 3.28 ? 'happy' : 'worried', t);
  const bx = 320, by = J.head[1] - 150; battery(bx, by, levelAt(t), 1);
  setFigureScale(1.15);
  const others = [[640, 0], [800, 1], [950, 2]];
  others.forEach(([x, i]) => { const Jw = solve({ ...standPose(Math.sin(t * 2 + i)), shN: 1.0, elN: 0.6 }, x, FLOOR, 0);
    const pulse = 0.55 + 0.4 * Math.max(0, Math.sin(t * 6 - i)), on = popK(t, PLUGS[i], 0.2); const hx = 2 * x - Jw.wN[0];
    if (on > 0) { ctx.save(); ctx.globalAlpha *= clamp(on); cable(bx + 92, by, hx, Jw.wN[1], 220 + i * 60, `rgba(255,201,94,${pulse.toFixed(3)})`); plug(hx, Jw.wN[1]); ctx.restore(); burst(bx + 92, by, t, PLUGS[i], 14, ['#fff', '#ffc95e'], 500, 0.4, 3 + i); }
    mirrorX(x, () => hero(Jw, { expr: t > 2.0 ? 'smug' : 'neutral', t, col: WHITEC, blur: 6, seed: i })); });
  // expectations gauge on "expectations"
  const k = popK(t, 3.28, 0.3); if (k > 0) { ctx.save(); ctx.translate(760, 860); ctx.scale(k, k); panel(-200, -50, 400, 100, 24, 'rgba(255,255,255,0.25)'); txt('EXPECTATIONS', -60, -18, 22, 'rgba(240,238,232,0.7)', 700, 'center', null, 4); bar(-170, 6, 260, 22, clamp((t - 3.3) / 0.5), RED, 'rgba(255,255,255,0.12)'); txt('HIGH', 140, 16, 30, RED, 700); ctx.restore(); }
}
// ---------------------------------------------------------------- 2. somebody didn't show up
function s2(t) {
  floorLine(FLOOR + 2, 0.2);
  ctx.save(); ctx.fillStyle = '#4a3a2c'; ctx.fillRect(400, 1220, 280, 18); ctx.fillStyle = '#3b2e24'; ctx.fillRect(530, 1238, 20, 162); ctx.restore();
  const chair = (x, flip, hl) => { ctx.save(); ctx.translate(x, 0); if (flip) ctx.scale(-1, 1); ctx.fillStyle = hl ? 'rgba(255,201,94,0.9)' : '#5a4636'; ctx.fillRect(-50, 1270, 100, 14); ctx.fillRect(40, 1150, 12, 134); ctx.fillRect(-46, 1284, 10, 116); ctx.fillRect(36, 1284, 10, 116); ctx.restore(); };
  const hl = t > 7.92 && Math.floor((t - 7.92) * 4) % 2 === 0; chair(330, false, false); chair(760, true, hl);
  setFigureScale(1.4); const J = solve({ ...sitPose(Math.sin(t * 2)), h: 0.2 }, 300, 1270, 0); hero(J, { expr: t < 7.92 ? 'worried' : 'sad', t, blur: 18 });
  battery(330, 760, levelAt(t), 0.8);
  clockFace(860, 860, 56, 7, (t - 5.3) * 40 % 60, 0, t);
  if (t > 7.92) { ctx.save(); const k = popK(t, 7.92, 0.25); ctx.translate(760, 1080); ctx.scale(k, k); txt('?', 0, 0, 120, GOLDL, 700, 'center', 'rgba(255,170,50,0.8)'); ctx.restore(); flash(t, 7.92, 0.08, 0.15); }
  // a faint outline of who should be there
  ctx.save(); ctx.globalAlpha *= 0.15 * (1 - smooth(6.0, 7.5, t)); setFigureScale(1.4); mirrorX(780, () => hero(solve(sitPose(0), 780, 1270, 0), { expr: 'happy', t, col: WHITEC, blur: 0 })); ctx.restore();
}
// ---------------------------------------------------------------- 3. angry they didn't work as hard
function s3(t) {
  floorLine(FLOOR + 2, 0.2);
  const desk = (x) => { ctx.save(); ctx.fillStyle = '#4a3a2c'; ctx.fillRect(x - 130, 1210, 260, 16); ctx.fillStyle = '#3b2e24'; ctx.fillRect(x - 110, 1226, 14, 174); ctx.fillRect(x + 96, 1226, 14, 174); ctx.fillStyle = '#c9ccd2'; ctx.fillRect(x - 60, 1202, 120, 8); ctx.restore(); };
  desk(350); desk(790);
  setFigureScale(1.35);
  // him typing hard
  let P = { t: 0.2, h: 0.15, hipN: 1.52, kneeN: 1.5, hipF: 1.45, kneeF: 1.45, shN: 0, elN: 0, shF: 0, elF: 0 }; let J = solve(P, 210, FLOOR, 0);
  const [a1, b1] = armIK(J.sh, [340 + 8 * Math.sin(t * 26), 1198]), [a2, b2] = armIK(J.sh, [315 + 8 * Math.sin(t * 26 + 1.7), 1198]); P = { ...P, shN: a1, elN: b1, shF: a2, elF: b2 }; J = solve(P, 210, FLOOR, 0); hero(J, { expr: 'angry', t, blur: 18 });
  // coworker leaning back, feet up
  const Pw = { t: -0.45, h: -0.2, hipN: 1.75, kneeN: 0.3, hipF: 1.7, kneeF: 0.4, shN: 2.6, elN: 2.4, shF: 2.5, elF: 2.5 }; white(900, Pw, 0.55, true);
  txt('z', 980, 980, 40, 'rgba(240,238,232,0.4)', 700);
  // steam on "angry"
  const ang = smooth(9.36, 9.6, t);
  if (ang > 0) { for (let i = 0; i < 4; i++) { const u = ((t * 1.5 + i / 4) % 1); ctx.save(); ctx.globalAlpha *= ang * (1 - u); ctx.fillStyle = 'rgba(255,120,100,0.8)'; ctx.beginPath(); ctx.arc(J.head[0] + (i % 2 ? 20 : -20) + 10 * Math.sin(u * 8), J.head[1] - 50 - u * 120, 14 + 16 * u, 0, TAU); ctx.fill(); ctx.restore(); } }
  battery(560, 790, levelAt(t), 0.8);
}
// ---------------------------------------------------------------- 4. didn't keep their word / didn't care as much
function s4(t) {
  floorLine(FLOOR + 2, 0.2); setFigureScale(1.35);
  const J = me(250, standPose(Math.sin(t * 2)), 'sad', t);
  const Jw = white(830, standPose(Math.sin(t * 2 + 1)), 0.6, true);
  // "I promise" shatters on "word"
  const sh = clamp((t - 13.76) / 0.6);
  if (t < 14.4) { if (sh <= 0) { speech(760, 960, 300, 110, popK(t, 12.75, 0.25), 810, 1060); txt('I promise', 760, 958, 42, '#1a1a1a', 700); }
    else { for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, v = 300; ctx.save(); ctx.globalAlpha *= 1 - sh; ctx.translate(760 + Math.cos(a) * v * sh, 960 + Math.sin(a) * v * sh + 400 * sh * sh); ctx.rotate(sh * 5 + i); ctx.fillStyle = '#f4f2ee'; ctx.beginPath(); ctx.moveTo(-30, -20); ctx.lineTo(34, -6); ctx.lineTo(-4, 28); ctx.fill(); ctx.restore(); } } }
  // hearts: his big, theirs small
  if (t >= 14.5) { const k = popK(t, 14.6, 0.3); heart(J.head[0] + 20, 980, 120, RED, 20, k); heart(Jw.head[0] - 10, 1010, 40, 'rgba(255,138,126,0.7)', 0, popK(t, 14.75, 0.3)); }
  battery(540, 790, levelAt(t), 0.8);
}
// ---------------------------------------------------------------- 5. people will disappoint you
function s5(t) {
  floorLine(FLOOR + 2, 0.2); setFigureScale(1.4);
  const J = me(540, { ...standPose(Math.sin(t * 2)), h: 0.35 }, t < 16.6 ? 'worried' : 'sad', t);
  const bx = 540, by = J.head[1] - 185; battery(bx, by, levelAt(t), 0.9, true, t);
  setFigureScale(1.1);
  [[-1, 0], [1, 1], [-1, 2], [1, 3]].forEach(([dir, i]) => { const go = clamp((t - 16.3 - i * 0.25) / 1.6), x = 540 + dir * (180 + i * 40) + dir * 520 * easeInOut(go);
    const P = go > 0 && go < 1 ? walkPose(t * 6 + i, 0.05) : standPose(0); const Jw = solve(P, x, FLOOR, 0);
    cable(bx, by + 30, dir < 0 ? 2 * x - Jw.wN[0] : Jw.wN[0], Jw.wN[1], 160, 'rgba(200,205,215,0.55)', 4);
    const d = () => { ctx.save(); ctx.globalAlpha *= 0.9 * (1 - go * 0.5); hero(Jw, { expr: 'neutral', t, col: WHITEC, blur: 6, seed: i }); ctx.restore(); }; if (dir < 0) mirrorX(x, d); else d(); });
}
// ---------------------------------------------------------------- 6. even the person you'd do anything for
function s6(t) {
  floorLine(FLOOR + 2, 0.2); setFigureScale(1.45);
  const give = smooth(19.8, 20.6, t), turn = t >= 21.9;
  let P = standPose(Math.sin(t * 2)); let J = solve(P, 330, FLOOR, 0);
  const box = [lerp(J.sh[0] + 40, J.sh[0] + 170, give), lerp(J.sh[1] + 90, J.sh[1] + 10, give)];
  const drop = clamp((t - 22.5) / 0.4);
  const bp = drop > 0 ? [box[0] + 30 * drop, lerp(box[1], FLOOR - 40, drop * drop)] : box;
  if (drop <= 0) { const [s1, e1] = armIK(J.sh, [box[0] - 30, box[1] + 10]), [s2, e2] = armIK(J.sh, [box[0] - 10, box[1] + 20]); P = { ...P, shN: s1, elN: e1, shF: s2, elF: e2 }; }
  else P = { ...P, h: 0.4, t: 0.1 };
  J = solve(P, 330, FLOOR, 0); hero(J, { expr: t < 21.9 ? 'happy' : t < 22.5 ? 'shock' : 'sad', t, blur: 20 });
  ctx.save(); ctx.translate(bp[0], bp[1]); ctx.rotate(drop * 0.5); ctx.fillStyle = GOLDL; ctx.shadowColor = 'rgba(255,180,60,0.8)'; ctx.shadowBlur = 24 * (1 - drop); ctx.fillRect(-46, -40, 92, 80); ctx.shadowBlur = 0; ctx.fillStyle = RED; ctx.fillRect(-8, -40, 16, 80); ctx.fillRect(-46, -8, 92, 16); heart(0, -54, 30, RED, 0, 1); ctx.restore();
  setFigureScale(1.45);
  const wx = turn ? 720 + 500 * easeInOut(clamp((t - 22.0) / 1.2)) : 720; const Pw = turn && t > 22.0 ? walkPose(t * 6, 0.05) : standPose(Math.sin(t * 2 + 1));
  white(wx, Pw, 0.65, !turn, t < 21.9 ? 'happy' : 'neutral', t);
  battery(540, 790, levelAt(t), 0.8, true, t);
  if (t >= 21.95) { const k = popK(t, 21.95, 0.25); ctx.save(); ctx.translate(790, 790); ctx.scale(k, k); panel(-160, -34, 320, 68, 34, 'rgba(255,107,94,0.8)', 'rgba(40,16,18,0.95)', 3); txt('LOW BATTERY', 0, 2, 30, RED, 700, 'center', null, 4); ctx.restore(); }
}
// ---------------------------------------------------------------- 7. it's fine (shrug)
function s7(t) {
  floorLine(FLOOR + 2, 0.2); setFigureScale(1.6);
  const sh = smooth(23.4, 23.7, t); const P = mix(standPose(0), { ...standPose(0), shN: 0.5, elN: 1.9, shF: 0.4, elF: 2.0, h: -0.15 }, sh);
  const J = me(540, P, t < 23.4 ? 'tired' : 'smug', t, 20); const k = 1 - smooth(23.4, 23.8, t); if (k > 0) battery(540, J.head[1] - 150, 6, 0.9 * k, true, t);
}
// ---------------------------------------------------------------- 8. expectations: people low, yourself high
function slider(x, label, val, t, col) {
  panel(x - 150, 700, 300, 640, 30, 'rgba(255,255,255,0.18)');
  txt(label, x, 750, 26, 'rgba(240,238,232,0.8)', 700, 'center', null, 4);
  txt('HIGH', x, 810, 22, 'rgba(240,238,232,0.45)', 700, 'center', null, 4); txt('LOW', x, 1290, 22, 'rgba(240,238,232,0.45)', 700, 'center', null, 4);
  ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.roundRect(x - 10, 840, 20, 420, 10); ctx.fill();
  const y = lerp(1250, 850, val); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.beginPath(); ctx.roundRect(x - 10, y, 20, 1260 - y, 10); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, 38, 0, TAU); ctx.fill(); ctx.restore();
}
function s8(t) {
  const vp = lerp(0.85, 0.06, easeInOut(clamp((t - 26.2) / 0.6))), vy = lerp(0.35, 0.97, easeInOut(clamp((t - 28.6) / 0.7)));
  slider(320, 'FROM PEOPLE', vp, t, vp < 0.3 ? 'rgba(240,238,232,0.8)' : RED); slider(760, 'FROM YOURSELF', vy, t, GOLDL);
  if (t >= 26.79) check(320, 1370, 50, 'rgba(240,238,232,0.85)', popK(t, 26.79, 0.2));
  if (t >= 29.27) { check(760, 1370, 50, GOLDL, popK(t, 29.27, 0.2)); burst(760, 850, t, 29.27, 50, ['#ffc95e', '#fff'], 1000, 1.1, 29); ringFlash(760, 850, t, 29.27, '255,201,94', 40, 360, 0.5, 8); }
}
// ---------------------------------------------------------------- 9–12: "you'll…" (he plugs into himself and charges)
const SELF = [[29.7, 10], [32.39, 35], [34.71, 60], [36.63, 80], [40.0, 100]];
function selfLevel(t) { let v = 10; for (const [ts, lv] of SELF) if (t >= ts) v = lerp(v, lv, clamp((t - ts) / 0.4)); return v; }
function selfBattery(t) { battery(900, 760, selfLevel(t), 0.7); txt('SELF', 900, 700, 22, '#ffd98a', 700, 'center', null, 6); }
function s9(t) { // puzzle: figure it out
  floorLine(FLOOR + 2, 0.2); selfBattery(t);
  const PX = 650, PY = 1020;
  ctx.save(); for (let i = 0; i < 9; i++) { const r = Math.floor(i / 3), c = i % 3; if (i === 4 && t < 32.39) continue; const x = PX - 130 + c * 130, y = PY - 130 + r * 130; ctx.fillStyle = i === 4 ? GOLDL : 'rgba(80,78,90,0.95)'; ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 60, y - 60, 120, 120, 12); ctx.fill(); ctx.stroke(); } ctx.restore();
  if (t < 32.39) { ctx.save(); ctx.setLineDash([10, 10]); ctx.strokeStyle = 'rgba(255,201,94,0.6)'; ctx.lineWidth = 4; ctx.strokeRect(PX - 60, PY - 60, 120, 120); ctx.restore(); }
  setFigureScale(1.35); const u = easeInOut(clamp((t - 31.6) / 0.75)); let P = standPose(Math.sin(t * 2)); let J = solve(P, 300, FLOOR, 0);
  const piece = t < 32.39 ? [lerp(J.sh[0] + 90, PX, u), lerp(J.sh[1] + 40, PY, u)] : null;
  if (piece) { const [s1, e1] = armIK(J.sh, [Math.min(piece[0], J.sh[0] + 140) - 20, Math.max(piece[1], J.sh[1] - 60)]); P = { ...P, shN: s1, elN: e1 }; J = solve(P, 300, FLOOR, 0);
    ctx.save(); ctx.fillStyle = GOLDL; ctx.shadowColor = 'rgba(255,180,60,0.8)'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.roundRect(piece[0] - 60, piece[1] - 60, 120, 120, 12); ctx.fill(); ctx.restore(); }
  hero(J, { expr: t < 32.39 ? 'determined' : 'proud', t, blur: 20 });
  if (t >= 32.39) { ringFlash(PX, PY, t, 32.39, '255,201,94', 60, 300, 0.4, 8); check(PX, PY, 60, INK, popK(t, 32.39, 0.2), 12); }
}
function s10(t) { // a wall — handle it
  floorLine(FLOOR + 2, 0.2); selfBattery(t);
  const wallH = 300 * easeOut(clamp((t - 33.2) / 0.4)), WX = 620;
  ctx.save(); ctx.fillStyle = '#3d3c46'; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 3; for (let r = 0; r < 6; r++) for (let c = 0; c < 2; c++) { const y = FLOOR - (r + 1) * 50; if (FLOOR - y > wallH) continue; ctx.beginPath(); ctx.rect(WX - 70 + c * 70 + (r % 2 ? 35 : 0) * 0, y, 70, 50); ctx.fill(); ctx.stroke(); } ctx.restore();
  setFigureScale(1.3);
  let x, y = FLOOR, P;
  const v0 = 34.2, v1 = 34.75;
  if (t < v0) { x = lerp(220, 470, clamp((t - 32.7) / 1.4)); P = t < 34.1 ? walkPose(t * 6.5, 0.08) : crouchPose(); }
  else if (t < v1) { const u = (t - v0) / (v1 - v0); x = lerp(470, 790, u); y = FLOOR - 340 * Math.sin(Math.PI * u); P = jumpPose(); }
  else { x = 790; P = t < v1 + 0.2 ? crouchPose() : cheerPose(Math.sin(t * 7)); }
  hero(solve(P, x, y, 0), { expr: t < v1 ? 'determined' : 'joy', t, blur: 20 });
  if (t >= v1) burst(790, FLOOR - 200, t, v1, 40, ['#ffc95e', '#fff'], 900, 1.0, 34);
}
function s11(t) { // somebody leaves — keep moving
  const d = (t - 35.0) * 230; floorLine(FLOOR + 2, 0.2); groundMarks(makeMarks.cache || (makeMarks.cache = makeMarks()), FLOOR, d); selfBattery(t);
  setFigureScale(1.3);
  const go = clamp((t - 35.4) / 1.3); white(560 - 600 * easeIn(go), walkPose(t * 6.5, 0.05), 0.55 * (1 - go * 0.6), true, 'neutral', t);
  hero(solve(walkPose(t * 6.5, 0.08), 470, FLOOR, 0), { expr: t < 36.63 ? 'calm' : 'determined', t, speed: 0.8, blur: 20 });
  if (t > 36.63) { ctx.save(); ctx.globalAlpha *= smooth(36.63, 36.9, t); arrowLine(620, 1180, 860, 1180, GOLDL, 10, 30); ctx.restore(); }
}
const easeIn = (u) => u * u * u;
function s12(t) { // nobody believes — he believes for all of them
  floorLine(FLOOR + 2, 0.2); selfBattery(t);
  // empty seats
  const seats = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) seats.push([520 + c * 105 + r * 40, 1180 + r * 110]);
  seats.forEach(([x, y], i) => { const fill = t >= 39.7 + i * 0.13; ctx.save(); ctx.fillStyle = fill ? 'rgba(255,201,94,0.25)' : '#2c2b33'; ctx.fillRect(x - 36, y, 72, 16); ctx.fillRect(x + 28, y - 60, 10, 76); ctx.restore();
    if (fill) { ctx.save(); const k = popK(t, 39.7 + i * 0.13, 0.25); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = GOLDL; ctx.shadowColor = 'rgba(255,180,60,0.9)'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(0, -70, 18, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-20, -48, 40, 50, 12); ctx.fill(); ctx.restore(); } });
  // the tower he's building
  const nB = Math.min(7, 1 + Math.floor((t - 37.1) * 2.2));
  for (let i = 0; i < nB; i++) { ctx.save(); ctx.fillStyle = i === nB - 1 && t < 39.3 ? 'rgba(255,201,94,0.7)' : 'rgba(255,201,94,0.9)'; ctx.shadowColor = 'rgba(255,180,60,0.6)'; ctx.shadowBlur = 12; ctx.fillRect(290 - 60 + (i % 2) * 6, FLOOR - (i + 1) * 62, 120, 56); ctx.restore(); }
  setFigureScale(1.2); const P = t < 39.35 ? { ...standPose(0), shN: 1.4 + 0.3 * Math.sin(t * 5), elN: 0.6 } : cheerPose(Math.sin(t * 6)); hero(solve(P, 140, FLOOR, 0), { expr: t < 39.35 ? 'determined' : 'joy', t, blur: 20 + 20 * smooth(39.6, 40.0, t) });
}
// ---------------------------------------------------------------- 13. stop giving everyone the power (cut the cords)
function s13(t) {
  floorLine(FLOOR + 2, 0.2); setFigureScale(1.45);
  const J = me(330, { ...standPose(Math.sin(t * 2)), h: -0.1 }, t < 43.59 ? 'angry' : 'proud', t);
  setFigureScale(1.1);
  [[700, 0], [840, 1], [970, 2]].forEach(([x, i]) => { const Jw = solve({ ...standPose(0), shN: 1.4, elN: 0.3 }, x, FLOOR, 0);
    const cutT = 43.59 + i * 0.12, cu = clamp((t - cutT) / 0.5);
    const zap = t < cutT ? 0.5 + 0.5 * Math.sin(t * 20 + i) : 0;
    cable(J.head[0] + 10, J.head[1], 2 * x - Jw.wN[0], Jw.wN[1], 60 + 50 * i, `rgba(255,107,94,${(0.5 + 0.4 * zap).toFixed(3)})`, 5, t >= cutT ? cu : -1);
    if (t >= cutT) { burst((J.head[0] + 2 * x - Jw.wN[0]) / 2, (J.head[1] + Jw.wN[1]) / 2 + 60, t, cutT, 16, ['#fff', '#ffc95e'], 500, 0.6, 43 + i); }
    mirrorX(x, () => hero(Jw, { expr: t < 43.59 + i * 0.12 ? 'smug' : 'shock', t, col: WHITEC, blur: 6, seed: i })); });
  if (t >= 43.59) { glowDot(J.head[0], J.head[1], 160 * smooth(43.6, 44.0, t), 0.5); ringFlash(J.head[0], J.head[1], t, 43.59, '255,201,94', 30, 300, 0.5, 8); }
}
// ---------------------------------------------------------------- 14. expect less from the world, demand more from yourself
function s14(t) {
  // globe
  const gk = popK(t, 45.11, 0.3); if (gk > 0) { ctx.save(); ctx.translate(290, 1000); ctx.scale(gk, gk); ctx.fillStyle = '#2b5fae'; ctx.beginPath(); ctx.arc(0, 0, 130, 0, TAU); ctx.fill(); ctx.fillStyle = '#5f9a63'; ctx.beginPath(); ctx.ellipse(-30, -40, 60, 40, 0.4, 0, TAU); ctx.ellipse(50, 50, 50, 30, -0.3, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 130, 50, 0, 0, TAU); ctx.stroke(); ctx.restore();
    const a = smooth(45.5, 45.9, t); ctx.save(); ctx.globalAlpha *= a; arrowLine(290, 1170, 290, 1330, 'rgba(240,238,232,0.8)', 12, 34); txt('LESS', 290, 1390, 40, 'rgba(240,238,232,0.85)', 700, 'center', null, 6); ctx.restore(); }
  setFigureScale(1.5); const fk = smooth(46.8, 47.1, t); const J = solve(mix(standPose(Math.sin(t * 2)), cheerPose(Math.sin(t * 6)), smooth(47.47, 47.7, t)), 770, 1330, 0); ctx.save(); ctx.globalAlpha *= 0.3 + 0.7 * fk; hero(J, { expr: t < 47.47 ? 'determined' : 'joy', t, blur: 20 + 30 * smooth(47.47, 47.8, t) }); ctx.restore();
  if (t >= 47.47) { const a = smooth(47.47, 47.7, t); ctx.save(); ctx.globalAlpha *= a; arrowLine(950, 1260, 950, 900, GOLDL, 14, 40); ctx.restore(); txt('MORE', 950, 840, 48, GOLDL, 700, 'center', 'rgba(255,170,50,0.7)', 6); burst(770, 1000, t, 47.47, 50, ['#ffc95e', '#fff'], 1100, 1.1, 47); }
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(540, 720); ctx.lineTo(540, 1400); ctx.stroke(); ctx.restore();
}
// ---------------------------------------------------------------- 15. they can't touch your peace; he keeps pushing forward
function s15(t) {
  const d = (t - 48.4) * (200 + 160 * smooth(51.8, 52.4, t)); floorLine(FLOOR + 2, 0.2); groundMarks(makeMarks.cache || (makeMarks.cache = makeMarks()), FLOOR, d);
  setFigureScale(1.45); const fast = smooth(51.8, 52.4, t);
  const P = fast > 0.5 ? runPose((t - 48.4) * 12, 0.9, 0.3) : walkPose((t - 48.4) * 6.5, 0.08); const J = solve(P, 480, FLOOR, 0);
  // shield of peace
  const cx = J.pel[0] + 10, cy = J.pel[1] - 40, r = 250;
  ctx.save(); const g = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r); g.addColorStop(0, 'rgba(255,201,94,0)'); g.addColorStop(1, 'rgba(255,201,94,0.22)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); ctx.strokeStyle = `rgba(255,201,94,${0.5 + 0.2 * Math.sin(t * 4)})`; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
  // darts thrown at him bounce off the shield
  [49.6, 49.95, 50.3, 50.6, 50.9].forEach((ts, i) => { const a = t - ts; if (a < -0.5 || a > 0.9) return; const ang = [-2.6, -0.5, 2.7, -1.2, 0.4][i], sx = cx + 700 * Math.cos(ang), sy = cy + 700 * Math.sin(ang), hx = cx + r * Math.cos(ang), hy = cy + r * Math.sin(ang);
    let p; if (a < 0) { const u = (a + 0.5) / 0.5; p = [lerp(sx, hx, u), lerp(sy, hy, u)]; } else { p = [hx + Math.cos(ang) * 500 * a, hy + Math.sin(ang) * 500 * a + 600 * a * a]; }
    ctx.save(); ctx.globalAlpha *= a > 0 ? 1 - a / 0.9 : 1; ctx.translate(p[0], p[1]); ctx.rotate(ang + (a > 0 ? a * 10 : Math.PI)); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(-26, -8); ctx.lineTo(26, 0); ctx.lineTo(-26, 8); ctx.fill(); ctx.restore();
    if (a >= 0 && a < 0.25) ringFlash(hx, hy, t, ts, '255,201,94', 10, 80, 0.25, 5); });
  hero(J, { expr: fast > 0.5 ? 'determined' : 'calm', t, speed: 0.6 + fast, blur: 20 + 20 * fast });
  if (fast > 0) { ctx.save(); ctx.globalAlpha *= fast; speedLines(t, 900, 1380, 10, 1, 0.2, 150); ctx.restore(); }
  battery(880, 760, 100, 0.7); txt('SELF', 880, 700, 22, '#ffd98a', 700, 'center', null, 6);
}
const SCENES = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
// trimmed edit: "Why are you angry … as much as you did." removed (8.73–15.99 of the v1 timeline); scenes keep v1 story times
const storyT = (t) => (t < 8.73 ? t : t + 7.26);
CAMK = [[0, 420, 840, 2.4, 0], [0.3, 425, 845, 2.25, 0], [1.5, 470, 900, 1.6, 0], [2.6, 540, 1000, 1.05, 0], [5.25, 540, 1000, 1.08, 0],
  [5.3, 540, 1000, 1.0, 0], [7.9, 560, 990, 1.12, 0], [8.7, 560, 990, 1.18, 0], [8.73, 540, 980, 1.15, 0], [11.1, 540, 1000, 1.0, 0],
  [11.17, 540, 1000, 1.0, 0], [14.6, 560, 1050, 1.1, 0], [15.6, 520, 1080, 1.15, 0], [15.64, 540, 1000, 1.3, 0], [16.8, 540, 1000, 1.15, 0],
  [16.84, 540, 1020, 1.0, 0], [22.4, 540, 1020, 1.05, 0], [22.44, 500, 1050, 1.0, 0], [25.4, 560, 1050, 1.1, 0], [25.44, 540, 1080, 1.0, 0], [27.7, 600, 1050, 1.08, 0],
  [27.74, 540, 1050, 1.05, 0], [29.8, 540, 1050, 1.0, 0], [29.84, 540, 1050, 1.0, 0], [34.2, 540, 1050, 1.08, 0], [34.24, 540, 1000, 1.0, 0], [36.3, 420, 1000, 1.15, 0], [37.7, 540, 1000, 1.02, 0],
  [37.74, 540, 1050, 1.0, 0], [41.1, 600, 1000, 1.1, 0], [41.14, 520, 1080, 1.0, 0], [44.5, 520, 1080, 1.1, 0], [47.34, 540, 1050, 1.0, 0]];
SHAKES = [[0.3, 6, 0.12], [0.88, 6, 0.12], [1.44, 6, 0.12], [7.92, 10, 0.2], [15.24, 10, 0.2], [26.94, 6, 0.15], [36.33, 12, 0.25]];
PUNCHES = [[0.3, 0.04, 0.1], [0.88, 0.04, 0.1], [1.44, 0.04, 0.1], [7.92, 0.05, 0.12], [14.65, 0.05, 0.12], [16.49, 0.05, 0.12], [19.53, 0.03, 0.1], [22.01, 0.05, 0.12], [25.13, 0.04, 0.1], [27.49, 0.05, 0.12], [32.44, 0.05, 0.12], [36.33, 0.07, 0.15], [40.21, 0.07, 0.15], [44.54, 0.05, 0.12]];
function screen(t) { whipLines(t, 8.73, 0.18, 1); impactLines(t, 36.33, 330, 760, 0.3); impactLines(t, 40.21, 770, 900, 0.35); flash(t, 40.21, 0.12, 0.15); }
window.renderFrame = (t) => frame3(t, { scenes: (t) => runScenes(storyT(t), SC, SCENES), screen, PH, hook: { lines: [[["Who's draining", 0]], [['your ', 0], ['battery', 1], ['?', 0]]], tIn: 0, tOut: 2.6 },
  after: (t) => { if (t >= 46.49) endText(t, 46.49, [['Expect less.', '#fff'], ['Demand more.', GOLDL]], 76); } });
window.__allSteps = { scenes: SC };
window.sceneReady = FONTS_READY();
