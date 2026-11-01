// 73. Proud of You — a gentle reminder. He carries a heavy sack through every hard line, sets it down on "okay to rest",
// a message arrives on "I'm proud of you", and the sun comes up on "that's enough".
initCanvas('c');
const DUR = 47.2;
ATMO = { tint: [255, 175, 120], tintA: 0.06, shafts: 0.07, bokeh: 0.9 }; CAP.y = 430;
const FORCED = { brow: 0.55, browY: 0.0, eye: 0.85, mouth: 0.6, open: 0, blush: 0.1 };

const FLOOR = 1400;
const SC = [[0, 3.6], [3.6, 6.5], [6.5, 10.2], [10.2, 14.9], [14.9, 17.8], [17.8, 20.6], [20.6, 23.7], [23.7, 25.2], [25.2, 31.6], [31.6, 34.5], [34.5, 40.8], [40.8, 45.9], [45.9, 49.8], [49.8, 54.5], [54.5, 99]];
const marks = makeMarks();
// heavy sack behind his back
function sack(J, k = 1, sw = 0) {
  const bx = J.neck[0] - 46 * k * L.torso / 94, by = J.neck[1] + 20 * k * L.torso / 94;
  ctx.save(); ctx.translate(bx, by); ctx.rotate(-0.2 + sw); ctx.scale(k * L.torso / 94, k * L.torso / 94);
  ctx.fillStyle = '#4a3b2b'; ctx.strokeStyle = '#2a2018'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, 10, 58, 72, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a2e22'; ctx.beginPath(); ctx.ellipse(0, -58, 22, 14, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, -10); ctx.quadraticCurveTo(0, 6, 28, -14); ctx.stroke(); ctx.restore();
}
const bentWalk = (t, sp = 4.5) => ({ ...walkPose(t * sp, 0.32), h: 0.32 });
function lightning(x, y0, y1, t, t0, d = 0.25) { if (t < t0 || t > t0 + d) return; const a = 1 - (t - t0) / d; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; ctx.shadowColor = '#bcd6ff'; ctx.shadowBlur = 40; ctx.beginPath(); ctx.moveTo(x, y0); let yy = y0, xx = x; let s = Math.round(t0 * 100); while (yy < y1) { s = (s * 16807) % 2147483647; xx += ((s % 100) / 100 - 0.5) * 90; yy += 70; ctx.lineTo(xx, yy); } ctx.stroke(); ctx.restore(); }
// ---------------------------------------------------------------- 1. remind (walking bent under the sack; a reminder pops)
function s1(t) {
  floorLine(FLOOR + 2, 0.2); const stop = smooth(2.2, 2.6, t);
  groundMarks(marks, FLOOR, t * 160 * (1 - stop) + 2.4 * 160 * stop);
  setFigureScale(1.5);
  const P = mix(bentWalk(t), { ...standPose(0), t: 0.12, h: -0.45 }, smooth(2.3, 2.8, t));
  const J = solve(P, 520, FLOOR, 0); sack(J, 2.1, 0.04 * Math.sin(t * 9) * (1 - stop)); hero(J, { expr: t < 2.0 ? 'strain' : t < 2.6 ? 'shock' : 'tired', t, speed: 0.2, blur: 18 });
  const k = popK(t, 2.0, 0.3); if (k > 0) { ctx.save(); ctx.translate(560, 800); ctx.scale(k, k); panel(-280, -80, 560, 160, 34, 'rgba(255,201,94,0.6)', 'rgba(30,29,34,0.97)', 4);
    ctx.save(); ctx.translate(-200, 0); ctx.rotate(0.35 * Math.sin(t * 30) * Math.exp(-(t - 2.0) * 1.5)); ctx.fillStyle = GOLDL; ctx.beginPath(); ctx.moveTo(-26, 22); ctx.quadraticCurveTo(-26, -34, 0, -34); ctx.quadraticCurveTo(26, -34, 26, 22); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(0, 30, 8, 0, TAU); ctx.fill(); ctx.restore();
    txt('Reminder', -130, -18, 40, '#f4f2ee', 700, 'left'); txt('now', 240, -18, 26, 'rgba(240,238,232,0.5)', 500, 'right'); txt('You forgot again.', -130, 30, 30, 'rgba(240,238,232,0.7)', 500, 'left');
    ctx.restore(); ringFlash(560, 800, t, 2.64, '255,201,94', 200, 420, 0.5, 6); }
}
// ---------------------------------------------------------------- 2. made it through (storm, ground cracks, he keeps walking)
function s2(t) {
  floorLine(FLOOR + 2, 0.2); const d = t * 160; groundMarks(marks, FLOOR, d);
  cloud(350, 720, 1.5, 'rgba(60,63,78,0.95)'); cloud(720, 700, 1.7, 'rgba(70,74,90,0.95)'); rain(80, 760, 920, 640, t, 40, 'rgba(150,180,230,0.5)', 3);
  lightning(820, 760, 1380, t, 4.5, 0.22); lightning(300, 760, 1380, t, 5.6, 0.3); flash(t, 5.6, 0.18, 0.18);
  // crack runs past under his feet
  if (t >= 5.6) { const c0 = 900 - (t - 5.6) * 160; ctx.save(); ctx.strokeStyle = '#d9d4c8'; ctx.lineWidth = 5; ctx.shadowColor = '#fff'; ctx.shadowBlur = 10; ctx.beginPath(); const len = Math.min(1, (t - 5.6) / 0.25) * 340; ctx.moveTo(c0, FLOOR + 3); for (let i = 1; i <= 8; i++) ctx.lineTo(c0 - len * i / 8, FLOOR + 3 + (i % 2 ? 14 : -4) + i * 2); ctx.stroke(); ctx.restore(); }
  setFigureScale(1.5); const J = solve(bentWalk(t), 500, FLOOR, 0); sack(J, 2.1, 0.04 * Math.sin(t * 9)); hero(J, { expr: t > 5.6 ? 'determined' : 'strain', t, speed: 0.5, blur: 18 });
}
// ---------------------------------------------------------------- 3. alone in a room
function s3(t) {
  ctx.save(); panel(70, 680, 940, 720, 8, 'rgba(255,255,255,0.08)', 'rgba(26,25,30,0.9)', 3); ctx.fillStyle = 'rgba(255,240,200,0.06)'; ctx.fillRect(640, 760, 220, 240); ctx.restore();
  floorLine(FLOOR + 2, 0.2);
  setFigureScale(1.15);
  // two chatting pairs
  [[560, 1, 0], [690, -1, 1], [820, 1, 2], [950, -1, 3]].forEach(([x, dir, i]) => {
    let P = { ...standPose(Math.sin(t * 2 + i)), h: dir > 0 ? 0.0 : 0.0 }; if (i === 2 && t > 8.56 && t < 9.1) P.h = -0.6;   // one glance… and back
    const J = solve(P, x, FLOOR, 0); const dw = () => hero(J, { expr: 'happy', t, col: WHITEC, blur: 6, seed: i }); if (dir < 0) mirrorX(x, dw); else dw();
    if (i % 2 === 0) { const on = Math.floor(t * 1.3 + i) % 2 === 0; speech(x + 60, J.head[1] - 70, 90, 50, on ? 1 : 0.85, x + 30, J.head[1] - 30, 'rgba(240,238,232,0.35)'); }
  });
  // him, alone, with his own rain cloud
  const P = { ...standPose(Math.sin(t * 2)), t: 0.1, h: 0.5, shN: 0.05, shF: -0.05 }; setFigureScale(1.35); const J = solve(P, 210, FLOOR, 0);
  const ck = popK(t, 8.1, 0.3); if (ck > 0) { ctx.save(); ctx.translate(215, J.head[1] - 120); ctx.scale(ck, ck); cloud(0, 0, 0.75, 'rgba(70,74,90,0.95)'); ctx.restore(); rain(150, J.head[1] - 90, 140, 380, t, t > 9.36 ? 14 : 7, 'rgba(150,180,230,0.6)', 7); }
  hero(J, { expr: 'sad', t, blur: 16 });
}
// ---------------------------------------------------------------- 4. smiled with a heavy heart
function s4(t) {
  floorLine(FLOOR + 2, 0.2);
  // the others, comfortable
  setFigureScale(1.1);
  [[230, 13.04], [860, 13.28]].forEach(([x, ts]) => { const k = popK(t, ts, 0.3); if (k <= 0) return; const J = solve(standPose(Math.sin(t * 2 + x)), x, FLOOR, 0); ctx.save(); ctx.globalAlpha *= clamp((k - 0.6) / 0.4); hero(J, { expr: 'happy', t, col: WHITEC, blur: 6, seed: x });
    ctx.restore(); heart(J.head[0] + 50, J.head[1] - 40, 26, '#ff8a7e', 10, popK(t, ts + 0.2, 0.2)); });
  setFigureScale(2.0);
  const drop = clamp((t - 11.2) / 0.35), yank = t > 11.55 ? Math.exp(-(t - 11.55) * 4) * Math.sin((t - 11.55) * 22) : 0;
  const P = { ...standPose(Math.sin(t * 2)), t: 0.04 + 0.1 * smooth(11.5, 11.9, t), h: 0.12 * smooth(11.5, 11.9, t), shN: 0.08, shF: -0.06 };
  const J = solve(P, 540, FLOOR, 0); hero(J, { expr: t < 10.72 ? 'sad' : t < 11.55 ? FORCED : exprMix(FORCED, 'cry', smooth(11.55, 11.9, t)), t, blur: 22 });
  // smile drawn on his face
  // (the forced smile is his face now)
  // the heart + the weight chained to it
  const hx = lerp(J.neck[0], J.pel[0], 0.3) + 4, hy = lerp(J.neck[1], J.pel[1], 0.3);
  heart(hx, hy, 64, t > 11.36 ? '#c84a3e' : RED, 20, 1);
  if (t > 11.2) { const wy = lerp(700, hy + 330, easeOut(drop)) + 12 * yank, wx = hx + 8 * yank;
    ctx.save(); ctx.strokeStyle = '#9aa0ad'; ctx.lineWidth = 5; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.moveTo(hx, hy + 14); ctx.lineTo(wx, wy - 60); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(wx, wy); ctx.fillStyle = '#3d3c44'; ctx.strokeStyle = '#6a6974'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-60, 40); ctx.lineTo(60, 40); ctx.lineTo(44, -40); ctx.lineTo(-44, -40); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -52, 18, Math.PI, 0); ctx.stroke(); ctx.restore(); }
}
// ---------------------------------------------------------------- 5. days survived (tear-off calendar under a day/night sky)
function s5(t) {
  const u = clamp((t - 14.9) / 2.9), day = 1 + Math.floor(Math.pow(u, 1.4) * 47);
  const cyc = (t - 14.9) * 2.2; const sunA = Math.PI + (cyc % 1) * Math.PI, night = Math.floor(cyc) % 2;
  ctx.save(); ctx.globalAlpha *= 0.5; ctx.fillStyle = night ? 'rgba(30,40,80,0.35)' : 'rgba(255,190,110,0.18)'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
  const ox = 540 + 380 * Math.cos(sunA), oy = 1240 + 420 * Math.sin(sunA);
  if (night) { ctx.fillStyle = '#e8ecf6'; ctx.beginPath(); ctx.arc(ox, oy, 34, 0, TAU); ctx.fill(); } else { glowDot(ox, oy, 120, 0.5); ctx.fillStyle = GOLDL; ctx.beginPath(); ctx.arc(ox, oy, 38, 0, TAU); ctx.fill(); }
  floorLine(1240, 0.2);
  // calendar
  panel(450, 820, 340, 380, 22, 'rgba(255,255,255,0.3)', '#f4f2ee', 4); ctx.fillStyle = RED; ctx.beginPath(); ctx.roundRect(450, 820, 340, 90, [22, 22, 0, 0]); ctx.fill(); txt('DAY', 620, 866, 34, '#fff', 700, 'center', null, 8);
  txt(String(day), 620, 1060, 150, '#1d1c22', 700);
  // tearing pages fly off
  for (let k = 1; k <= 3; k++) { const ft = (t * 16 + k / 3) % 1; if (u >= 1) break; ctx.save(); ctx.globalAlpha *= 1 - ft; ctx.globalAlpha *= 0.7; ctx.translate(620 + ft * 380, 1000 - ft * 260 + 500 * ft * ft); ctx.rotate(ft * 3); ctx.fillStyle = '#e9e6df'; ctx.fillRect(-70, -80, 140, 160); ctx.restore(); }
  setFigureScale(0.95); const J = solve(bentWalk(t, 5), 230, 1240, 0); sack(J, 2.0); hero(J, { expr: 'tired', t, speed: 0.3, blur: 14 });
}
// ---------------------------------------------------------------- 6. nights the mind would not stop racing
function s6(t) {
  ctx.save(); ctx.fillStyle = '#10141f'; ctx.fillRect(130, 720, 240, 260); ctx.fillStyle = '#e8ecf6'; ctx.beginPath(); ctx.arc(280, 790, 28, 0, TAU); ctx.fill(); ctx.fillStyle = '#10141f'; ctx.beginPath(); ctx.arc(294, 780, 26, 0, TAU); ctx.fill(); ctx.strokeStyle = '#3a3a44'; ctx.lineWidth = 10; ctx.strokeRect(130, 720, 240, 260); ctx.restore();
  floorLine(FLOOR + 2, 0.2); bed(560, 1300, 520);
  setFigureScale(1.3); const P = { ...standPose(0), shN: 0.3, elN: 0.5, shF: 0.1, elF: 0.4, h: 0.1 }; const px = 620, py = 1300 - 40; const J = solve(P, px, 0, 0, false, py);
  rotated(px, py, -Math.PI / 2, () => hero(J, { expr: 'worried', t, speed: 0.1, blur: 16 })); blanket(560, 1300, 520, '#43597a');
  // the head after rotation: pelvis + (head offset rotated −90°)
  const hx = px + (J.head[1] - py), hy = py - (J.head[0] - px);
  // racing thoughts orbiting the head, faster on "racing"
  const sp = 2 + 6 * smooth(19.2, 19.8, t);
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) { const a = t * sp * (i % 2 ? 1 : -1.2) + i, cx = hx + 40 + 130 * Math.cos(a * 0.7 + i), cy = hy - 170 + 70 * Math.sin(a * 0.9 + i * 2);
    ctx.strokeStyle = ['rgba(255,217,138,0.8)', 'rgba(255,255,255,0.6)', 'rgba(255,138,126,0.7)'][i % 3]; ctx.lineWidth = 5; ctx.beginPath();
    for (let k = 0; k <= 30; k++) { const th = k / 30 * TAU * 1.6 + a * 2, r = 26 + 10 * Math.sin(th * 3 + i); const xx = cx + r * Math.cos(th), yy = cy + r * 0.7 * Math.sin(th); k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  ctx.restore();
  panel(830, 1150, 170, 70, 18, 'rgba(255,107,94,0.6)'); txt('3:47', 915, 1186, 40, RED, 700);
}
// ---------------------------------------------------------------- 7. too much (blocks pile on his back)
const BL = [20.8, 21.28, 21.52, 21.84, 22.24, 22.56];
function s7(t) {
  floorLine(FLOOR + 2, 0.2); setFigureScale(1.5);
  const n = BL.filter((b) => t >= b).length, down = smooth(22.88, 23.15, t);
  let P = { ...standPose(Math.sin(t * 2)), t: 0.12 + n * 0.08, h: 0.2 + n * 0.05, hipN: 0.04 + n * 0.08, kneeN: 0.05 + n * 0.14, hipF: -0.04 + n * 0.06, kneeF: 0.05 + n * 0.12, shN: 2.9, elN: 0.5, shF: 2.7, elF: 0.6 };
  P = mix(P, { ...kneelPose(0), t: 0.75, shN: 2.8, elN: 0.6, shF: 2.6, elF: 0.6, h: 0.5 }, down);
  const J = solve(P, 540, FLOOR, 0);
  // stack balanced on his raised hands
  const top = [lerp(J.wN[0], J.wF[0], 0.5), Math.min(J.wN[1], J.wF[1]) - 6];
  BL.forEach((b, i) => { if (t < b) return; const u = clamp((t - b) / 0.22), y = lerp(top[1] - 900, top[1] - 34 - i * 66, easeOut(u)) + (u >= 1 ? 4 * Math.exp(-(t - b - 0.22) * 8) : 0), w = [190, 170, 200, 150, 180, 140][i];
    ctx.save(); ctx.translate(top[0] + Math.sin(t * 3 + i) * 3 * i, y); ctx.rotate((i % 2 ? 0.05 : -0.04) * i * 0.6); ctx.fillStyle = ['#4a4955', '#3d3c46', '#55535f', '#45444e', '#5a5866', '#3f3e48'][i]; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-w / 2, -32, w, 64, 8); ctx.fill(); ctx.stroke(); ctx.restore(); });
  hero(J, { expr: t > 22.88 ? 'cry' : t > 21.8 ? 'strain' : 'tired', t, speed: 0.2, blur: 16 });
  if (t >= 22.88) { ctx.save(); ctx.globalAlpha *= 0.5 * (1 - smooth(23.0, 23.6, t)); ctx.fillStyle = '#d9d4c8'; for (let i = 0; i < 10; i++) { const a = Math.PI + i / 9 * Math.PI, r = 60 + (t - 22.88) * 300; ctx.beginPath(); ctx.arc(540 + r * Math.cos(a), FLOOR - 4 + 0.2 * r * Math.sin(a), 6, 0, TAU); ctx.fill(); } ctx.restore(); }
}
// ---------------------------------------------------------------- 8. but here you are (map pin)
function s8(t) {
  floorLine(FLOOR + 2, 0.2); spotlight(540, FLOOR, 0.2 * smooth(23.75, 24.1, t), 260);
  setFigureScale(1.6); const P = mix({ ...kneelPose(0), h: 0.4 }, tallPose(Math.sin(t * 2)), smooth(23.8, 24.3, t)); const J = solve(P, 540, FLOOR, 0); hero(J, { expr: t < 24.2 ? 'sad' : t < 24.56 ? 'calm' : 'proud', t, blur: 22 + 20 * smooth(24.5, 24.8, t) });
  const u = clamp((t - 24.25) / 0.31), py = lerp(380, J.head[1] - 150, easeOutBack(u));
  if (t >= 24.25) { ctx.save(); ctx.translate(540, py); ctx.fillStyle = RED; ctx.shadowColor = 'rgba(255,107,94,0.8)'; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(0, -40, 46, Math.PI * 0.8, Math.PI * 0.2); ctx.lineTo(0, 40); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -42, 18, 0, TAU); ctx.fill(); ctx.restore(); }
  pill('YOU ARE HERE', 540, J.head[1] - 300, t, 24.56, { size: 34 });
  if (t >= 24.56) ringFlash(540, FLOOR, t, 24.56, '255,201,94', 40, 420, 0.6, 8);
}
// ---------------------------------------------------------------- 9. the strong one (holding the roof up for everyone)
function s9(t) {
  floorLine(FLOOR + 2, 0.2); rain(60, 640, 960, 380, t, 34, 'rgba(150,180,230,0.45)', 9);
  setFigureScale(1.5);
  const strain = 0.04 * Math.sin(t * 7);
  let P = { ...standPose(0), t: 0.02, h: -0.15 + strain, hipN: 0.2, kneeN: 0.35, hipF: -0.15, kneeF: 0.3, shN: 3.05, elN: 0.12, shF: 2.95, elF: 0.15 };
  const turn = smooth(29.7, 30.3, t); P.h = lerp(P.h, 0.75, turn);
  const J = solve(P, 540, FLOOR, 0); const slabY = Math.min(J.wN[1], J.wF[1]) - 18;
  // others sheltering, then stepping out to offer a hand
  setFigureScale(1.0);
  [[330, -1], [420, -1], [700, 1], [780, 1]].forEach(([x0, side], i) => { const out = smooth(28.4 + i * 0.1, 29.0 + i * 0.1, t), x = x0 + side * 230 * out;
    let Pw = out > 0 && out < 1 ? walkPose(t * 6 + i, 0.05) : { ...standPose(Math.sin(t * 2 + i)), t: 0.15 * (1 - out) };
    let Jw = solve(Pw, x, FLOOR, 0);
    const offer = smooth(29.0 + i * 0.1, 29.4 + i * 0.1, t) * (1 - 0.6 * smooth(30.4, 31.0, t));
    if (offer > 0) { const tgt = [x - side * 160, Jw.sh[1] + 20]; const [s, e] = armIK(Jw.sh, side < 0 ? [x + 160 * offer, Jw.sh[1] + 30 - 30 * offer] : [x + 160 * offer, Jw.sh[1] + 30 - 30 * offer]); Pw = { ...Pw, shN: lerp(Pw.shN, s, offer), elN: lerp(Pw.elN, e, offer) }; Jw = solve(Pw, x, FLOOR, 0); }
    const dw = () => hero(Jw, { expr: 'happy', t, col: WHITEC, blur: 6, seed: i }); if (side > 0) mirrorX(x, dw); else dw();
  });
  setFigureScale(1.5);
  ctx.save(); ctx.fillStyle = '#4a4955'; ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(170, slabY - 52, 740, 52, 10); ctx.fill(); ctx.stroke(); ctx.restore();
  hero(J, { expr: 'strain', t, blur: 20 });
}
// ---------------------------------------------------------------- 10. how far you've come (the road behind him)
function pathPt(u) { // winding road from bottom-left to the top-right
  const x = lerp(110, 860, u) + 170 * Math.sin(u * Math.PI * 2.2), y = lerp(1430, 800, u) + 40 * Math.sin(u * 9); return [x, y];
}
function s10(t) {
  const draw = clamp((t - 31.7) / 1.4), lit = clamp((t - 33.4) / 0.6);
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 14; ctx.setLineDash([2, 26]); ctx.beginPath(); for (let i = 0; i <= 120; i++) { const p = pathPt(i / 120 * draw); i ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke();
  if (lit > 0) { ctx.setLineDash([]); ctx.strokeStyle = GOLDL; ctx.lineWidth = 8; ctx.shadowColor = 'rgba(255,180,60,0.9)'; ctx.shadowBlur = 20; ctx.beginPath(); for (let i = 0; i <= 120; i++) { const p = pathPt(i / 120 * lit); i ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); }
  ctx.restore();
  // milestones of what he walked through
  const MS = [[0.12, 'storm'], [0.3, 'room'], [0.48, 'heart'], [0.66, 'moon'], [0.82, 'blocks']];
  MS.forEach(([u, kind], i) => { if (draw < u) return; const [x, y] = pathPt(u), k = popK(t, 31.7 + u * 1.4, 0.2), on = lit >= u;
    ctx.save(); ctx.translate(x, y - 70); ctx.scale(k * 0.8, k * 0.8); panel(-50, -50, 100, 100, 24, on ? GOLDL : 'rgba(255,255,255,0.25)', 'rgba(26,25,30,0.95)', 4);
    const c = on ? GOLDL : 'rgba(240,238,232,0.6)';
    if (kind === 'storm') { cloud(-4, -6, 0.4, c); } else if (kind === 'room') { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.strokeRect(-28, -26, 56, 52); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(-12, 0, 6, 0, TAU); ctx.fill(); }
    else if (kind === 'heart') heart(0, 6, 34, c); else if (kind === 'moon') { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(26,25,30,1)'; ctx.beginPath(); ctx.arc(12, -8, 22, 0, TAU); ctx.fill(); }
    else { ctx.fillStyle = c; ctx.fillRect(-26, 8, 52, 18); ctx.fillRect(-20, -12, 40, 18); ctx.fillRect(-14, -30, 28, 16); }
    ctx.restore(); });
  txt('DAY 1', 110, 1490, 26, 'rgba(240,238,232,0.6)', 700, 'center', null, 4);
  const [ex, ey] = pathPt(1);
  setFigureScale(1.0); const look = smooth(32.2, 32.6, t); let P = { ...standPose(Math.sin(t * 2)), h: 0.2 }; const J = solve(P, ex, ey, 0);
  const dr = () => hero(J, { expr: lit > 0.5 ? 'proud' : 'calm', t, blur: 20 + 20 * lit }); if (look > 0.5) mirrorX(ex, dr); else dr();
  if (lit >= 1) pill('TODAY', ex, ey + 60, t, 34.0, { size: 26 });
}
// ---------------------------------------------------------------- 11. okay to rest (sets the sack down; others share it)
function bench(x) { ctx.save(); ctx.fillStyle = '#5a4330'; ctx.fillRect(x - 150, 1290, 300, 18); ctx.fillRect(x - 150, 1220, 300, 14); ctx.fillStyle = '#3b2e24'; ctx.fillRect(x - 130, 1308, 14, 92); ctx.fillRect(x + 116, 1308, 14, 92); ctx.fillRect(x - 140, 1234, 10, 60); ctx.fillRect(x + 130, 1234, 10, 60); ctx.restore(); }
function s11(t) {
  floorLine(FLOOR + 2, 0.2);
  // lamp
  ctx.save(); ctx.fillStyle = '#2e2d33'; ctx.fillRect(842, 860, 12, 540); ctx.beginPath(); ctx.roundRect(810, 840, 76, 34, 10); ctx.fill(); ctx.restore(); glowDot(848, 880, 260, 0.35);
  bench(620);
  setFigureScale(1.4);
  const sitT = 36.6, dropT = 36.44;
  let x, P;
  if (t < 35.7) { x = lerp(160, 470, clamp((t - 34.5) / 1.2)); P = bentWalk(t, 5.5); }
  else if (t < sitT) { x = 470; P = { ...standPose(0), t: 0.3 * (1 - smooth(36.2, 36.5, t)), h: 0.3 }; }
  else { x = lerp(470, 600, smooth(sitT, sitT + 0.5, t)); P = mix(standPose(0), sitPose(Math.sin(t * 2)), smooth(sitT, sitT + 0.5, t)); }
  const sitting = t >= sitT + 0.3;
  const J = solve(P, x, sitting ? 1290 : FLOOR, sitting ? 0 : 0);
  // the sack: on his back, dropped on "rest", split three ways on "carry it all"
  const split = smooth(38.84, 39.1, t);
  if (t < dropT) sack(J, 1.9, 0.04 * Math.sin(t * 9));
  else {
    const u = clamp((t - dropT) / 0.25), gx = 380, gy = FLOOR - 60;
    const pos = [lerp(J.neck[0] - 46, gx, u), lerp(J.neck[1] + 40, gy, u * u)];
    const carriers = [[1000, 38.95], [1060, 39.15]];
    for (let i = 0; i < 3; i++) {
      let px = pos[0] + split * (i - 1) * 110, py = pos[1] - 40 * (1 - split) + split * 30, sc = lerp(1.9, 0.6, split);
      if (i > 0 && t > 39.3) { const c = carriers[i - 1], w = clamp((t - 39.3 - (i - 1) * 0.15) / 1.0); px = lerp(px, 1200, easeInOut(Math.max(0, (w - 0.35) / 0.65))); py = lerp(py, 1180, smooth(0, 0.3, w)); }
      if (i === 0 || split > 0) { ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc); ctx.fillStyle = '#4a3b2b'; ctx.strokeStyle = '#2a2018'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, 0, 58, 64, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#3a2e22'; ctx.beginPath(); ctx.ellipse(0, -62, 22, 14, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    }
    if (t >= dropT) { ctx.save(); ctx.globalAlpha *= 0.5 * (1 - smooth(dropT + 0.25, dropT + 0.8, t)); ctx.fillStyle = '#d9d4c8'; for (let i = 0; i < 8; i++) { const a = Math.PI + i / 7 * Math.PI, r = 30 + (t - dropT) * 220; ctx.beginPath(); ctx.arc(gx + r * Math.cos(a), FLOOR - 2 + 0.25 * r * Math.sin(a), 5, 0, TAU); ctx.fill(); } ctx.restore(); }
    // friends come and take two of them
    setFigureScale(1.15);
    [[38.85, 0], [39.05, 1]].forEach(([ts, i]) => { if (t < ts) return; const w = clamp((t - ts) / 1.5), xx = lerp(1180, 380 + i * 110, smooth(0, 0.35, w)) + (w > 0.55 ? (w - 0.55) / 0.45 * 820 : 0);
      const back = w > 0.55; let Pw = walkPose(t * 6 + i, 0.05); const Jw = solve(Pw, xx, FLOOR, 0); const dw = () => hero(Jw, { expr: 'happy', t, col: WHITEC, blur: 6, seed: i + 5 }); if (!back) mirrorX(xx, dw); else dw(); });
    setFigureScale(1.4);
  }
  hero(J, { expr: t < 36.44 ? 'tired' : t < 38.84 ? exprMix('tired', 'calm', smooth(36.6, 37.4, t)) : 'happy', t, speed: 0.2 });
  // breathing ring once he sits
  if (t > sitT + 0.6) { const b = 0.5 + 0.5 * Math.sin((t - sitT) * 1.6); ctx.save(); ctx.strokeStyle = `rgba(255,201,94,${0.25 + 0.2 * b})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(J.head[0], J.head[1] + 40, 120 + 40 * b, 0, TAU); ctx.stroke(); ctx.restore(); }
}
// ---------------------------------------------------------------- 12. a message: I'm proud of you
function s12(t) {
  const PX = 540, PY = 1030, PW = 520, PHh = 760;
  ctx.save(); ctx.shadowColor = 'rgba(255,180,60,0.6)'; ctx.shadowBlur = 50 * smooth(44.5, 44.9, t); panel(PX - PW / 2, PY - PHh / 2, PW, PHh, 56, 'rgba(255,255,255,0.25)', '#121116', 6); ctx.restore();
  panel(PX - PW / 2 + 18, PY - PHh / 2 + 18, PW - 36, 110, 38, null, '#1c1b21', 0);
  ctx.fillStyle = GOLDL; ctx.beginPath(); ctx.arc(PX - 170, PY - PHh / 2 + 73, 30, 0, TAU); ctx.fill(); txt('Own Pace', PX - 120, PY - PHh / 2 + 62, 30, '#f4f2ee', 700, 'left'); txt('online', PX - 120, PY - PHh / 2 + 96, 22, '#7fd17f', 500, 'left');
  // typing… then the message
  const typing = t >= 41.56 && t < 44.45;
  if (typing) { const k = popK(t, 41.56, 0.25); ctx.save(); ctx.translate(PX - 120, PY + 210); ctx.scale(k, k); panel(-70, -36, 140, 72, 36, null, '#2a2930', 0); for (let i = -1; i <= 1; i++) { ctx.fillStyle = `rgba(240,238,232,${0.4 + 0.5 * Math.max(0, Math.sin(t * 7 - i))})`; ctx.beginPath(); ctx.arc(i * 30, 0, 9, 0, TAU); ctx.fill(); } ctx.restore(); }
  if (t >= 44.45) { const k = popK(t, 44.45, 0.3); ctx.save(); ctx.translate(PX - 30, PY + 130); ctx.scale(k, k); ctx.shadowColor = 'rgba(255,180,60,0.7)'; ctx.shadowBlur = 30; panel(-200, -110, 400, 220, 40, null, GOLDL, 0); ctx.shadowBlur = 0; txt("I'm proud", 0, -46, 48, INK, 700); txt('of you.', 0, 14, 48, INK, 700); heart(130, 66, 40, '#c84a3e', 0, popK(t, 45.4, 0.25)); ctx.restore();
    burst(PX, PY + 130, t, 44.52, 50, ['#ffc95e', '#fff', '#ff8a7e'], 1000, 1.2, 44); }
  txt(t < 41.56 ? 'Today' : 'Today', PX, PY - 200, 22, 'rgba(240,238,232,0.4)', 500);
}
// ---------------------------------------------------------------- 13. holding on, still trying (rope up a steep hill)
const HILL = (x) => 1450 - (x - 60) * 0.62;
function s13(t) {
  ctx.save(); ctx.fillStyle = 'rgba(40,38,46,0.95)'; ctx.beginPath(); ctx.moveTo(60, 1450); ctx.lineTo(1080, HILL(1080)); ctx.lineTo(1080, 1500); ctx.lineTo(60, 1500); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(60, 1450); ctx.lineTo(1080, HILL(1080)); ctx.stroke(); ctx.restore();
  speedLines(t * 0.5, 700, 1300, 8, -1, 0.12, 120);
  // rope from the top
  const anchor = [1000, HILL(1000) - 10];
  const slip = t > 46.6 && t < 47.4 ? -30 * Math.sin(Math.PI * (t - 46.6) / 0.8) : 0, step = smooth(48.4, 48.9, t) * 70 + smooth(47.6, 48.0, t) * 30;
  const fx = 440 + step + slip, fy = HILL(fx);
  setFigureScale(1.35);
  let P = { ...walkPose(step * 0.05, 0.45), h: -0.25 };
  let J = solve(P, fx, fy, 0);
  const g1 = [J.sh[0] + 90, J.sh[1] - 40], g2 = [J.sh[0] + 60, J.sh[1] - 20];
  const [s1, e1] = armIK(J.sh, g1), [s2, e2] = armIK(J.sh, g2); P = { ...P, shN: s1, elN: e1, shF: s2, elF: e2 }; J = solve(P, fx, fy, 0);
  ctx.save(); ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(...anchor); ctx.quadraticCurveTo((anchor[0] + J.wN[0]) / 2, (anchor[1] + J.wN[1]) / 2 + 20, J.wN[0], J.wN[1]); ctx.lineTo(J.wN[0] - 140, J.wN[1] + 170); ctx.stroke(); ctx.fillStyle = '#6b5236'; ctx.fillRect(anchor[0] - 8, anchor[1] - 70, 16, 80); ctx.restore();
  hero(J, { expr: t > 46.6 && t < 47.4 ? 'strain' : 'determined', t, speed: 0.6 });
  star(anchor[0], anchor[1] - 110, 34, GOLDL, 30, 1, t * 0.5);
}
// ---------------------------------------------------------------- 14. not behind, not weak — human
function tag(s, x, y, t, tIn, tStrike, side) {
  const k = popK(t, tIn, 0.25); if (k <= 0) return; const fall = clamp((t - tStrike - 0.35) / 0.6);
  ctx.save(); ctx.globalAlpha *= 1 - fall; ctx.translate(x, y + 500 * fall * fall); ctx.rotate(side * 0.6 * fall); ctx.scale(k, k);
  ctx.font = '700 40px Poppins'; const w = ctx.measureText(s).width + 50; panel(-w / 2, -36, w, 72, 36, 'rgba(255,255,255,0.3)', '#2a2930', 3); txt(s, 0, 2, 40, 'rgba(240,238,232,0.85)', 700);
  const st = clamp((t - tStrike) / 0.18); if (st > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-w / 2 + 10, 0); ctx.lineTo(-w / 2 + 10 + (w - 20) * st, 0); ctx.stroke(); }
  ctx.restore();
}
function s14(t) {
  floorLine(FLOOR + 2, 0.2); const hum = smooth(53.5, 53.8, t);
  if (hum > 0) rays(540, 1080, 120, 700, 14, t, 0.14 * hum);
  setFigureScale(1.6); const J = solve(mix({ ...standPose(Math.sin(t * 2)), h: 0.35 }, tallPose(Math.sin(t * 2)), smooth(52.0, 53.6, t)), 540, FLOOR, 0); hero(J, { expr: t < 52.0 ? 'sad' : t < 53.52 ? 'calm' : 'proud', t, blur: 18 + 30 * hum });
  tag('BEHIND', 260, 960, t, 51.68, 52.08, -1); tag('WEAK', 830, 1000, t, 52.56, 52.88, 1);
  if (t >= 53.52) { const hx = lerp(J.neck[0], J.pel[0], 0.3) + 4, hy = lerp(J.neck[1], J.pel[1], 0.3); glowDot(hx, hy, 220 * hum, 0.5); heart(hx, hy, 50, GOLDL, 30, popK(t, 53.52, 0.3) * (1 + 0.06 * Math.sin(t * 6))); ringFlash(hx, hy, t, 53.52, '255,201,94', 40, 520, 0.7, 10); }
}
// ---------------------------------------------------------------- 15. that's enough (sunrise)
function s15(t) {
  const up = easeOut(clamp((t - 54.5) / 2.0)), sy = lerp(1330, 1060, up);
  ctx.save(); const sky = ctx.createLinearGradient(0, 640, 0, 1250); sky.addColorStop(0, 'rgba(255,170,80,0)'); sky.addColorStop(1, `rgba(255,170,80,${0.32 * up})`); ctx.fillStyle = sky; ctx.fillRect(0, 640, 1080, 610); ctx.restore();
  glowDot(540, sy, 520, 0.45 * up + 0.1); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1080, 1250); ctx.clip(); ctx.fillStyle = '#ffd27a'; ctx.shadowColor = 'rgba(255,190,90,1)'; ctx.shadowBlur = 60; ctx.beginPath(); ctx.arc(540, sy, 150, 0, TAU); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#0b0a0d'; ctx.fillRect(0, 1250, 1080, 300); floorLine(1250, 0.35);
  setFigureScale(1.3); const J = solve(mix(standPose(Math.sin(t * 2)), tallPose(0), smooth(55.2, 55.7, t)), 540, 1250, 0);
  ctx.save(); drawFigure(ctx, J, '#1a1408', '#140f06', 'rgba(255,190,90,0.9)', 30); ctx.restore();
  if (t >= 55.36) { ringFlash(540, sy, t, 55.36, '255,201,94', 150, 700, 1.0, 10); }
}
const SCENES = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
// trimmed edit: two sentences removed (6.45–10.40 and 25.0–31.85 of the original); scenes keep their original story times
const storyT = (t) => (t < 6.45 ? t : t < 21.05 ? t + 3.95 : t + 10.8);
CAMK = [[0, 640, 1040, 1.9, 0.02], [0.5, 630, 1040, 1.75, 0], [1.9, 540, 1060, 1.12, 0], [3.55, 540, 1040, 1.0, 0], [3.6, 540, 1040, 1.0, 0], [6.4, 540, 1080, 1.12, 0],
  [6.45, 540, 1000, 1.0, 0], [7.6, 540, 1050, 1.12, 0], [10.9, 540, 1050, 1.18, 0], [10.95, 540, 1050, 1.0, 0], [13.8, 540, 1050, 1.08, 0],
  [13.85, 560, 1050, 1.12, 0], [16.6, 600, 1020, 1.28, 0], [16.65, 540, 950, 1.0, 0], [18.9, 540, 960, 1.05, 0], [19.7, 540, 1000, 1.15, 0],
  [19.75, 540, 1100, 1.25, 0], [21.0, 540, 1050, 1.05, 0], [21.05, 520, 960, 1.0, 0], [23.65, 540, 980, 1.03, 0], [23.7, 500, 1100, 1.05, 0], [30.0, 560, 1100, 1.12, 0],
  [30.05, 540, 980, 1.0, 0], [33.65, 540, 930, 1.06, 0], [35.05, 540, 940, 1.1, 0], [35.1, 600, 1050, 1.0, 0], [38.95, 650, 1000, 1.1, 0],
  [39.0, 540, 1050, 1.0, 0], [42.72, 540, 1050, 1.12, 0], [43.65, 540, 1050, 1.15, 0], [43.7, 540, 1150, 1.25, 0], [47.2, 540, 1060, 1.0, 0]];
SHAKES = [[4.5, 6, 0.15], [5.6, 14, 0.25], [7.6, 10, 0.2], [18.93, 14, 0.25], [35.8, 6, 0.2]];
PUNCHES = [[2.0, 0.05, 0.12], [7.25, 0.04, 0.12], [20.61, 0.05, 0.12], [25.64, 0.04, 0.12], [33.72, 0.07, 0.16], [41.28, 0.03, 0.1], [42.08, 0.03, 0.1], [42.72, 0.06, 0.15], [44.56, 0.06, 0.15]];
function screen(t) { whipLines(t, 6.45, 0.18, 1); whipLines(t, 21.05, 0.18, 1); impactLines(t, 18.93, 540, 1300, 0.3); impactLines(t, 33.72, 540, 1250, 0.35); }
window.renderFrame = (t) => frame3(t, { scenes: (t) => runScenes(storyT(t), SC, SCENES), screen, PH, hook: { lines: [[["If you're ", 0], ['exhausted', 1]], [['watch this.', 0]]], tIn: 0, tOut: 2.6 } });
window.__allSteps = { scenes: SC };
window.sceneReady = FONTS_READY();
