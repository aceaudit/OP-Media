// 89. Crabs in a Bucket (v3 original, no voice) — SHOCK OPEN inside a bucket: one crab gets its claws over the rim and the others
// drag it back down. Cut to people in a pit: he starts up the stone steps toward the light; the ones at the bottom start talking
// ("You've changed." / "Who do you think you are?" / "That'll never work.") and one runs up and grabs his ankle and yanks him back a
// step. He looks down, calm, steps out of the grip and keeps climbing. At the top, in the sun, he turns, kneels and reaches back down;
// the quiet one who was watching all along climbs up and takes his hand.
initCanvas('c');
const DUR = 16.0;
CAP.y = 430; CAP.end = 13.7;
ATMO = { tint: [255, 190, 120], tintA: 0.05, shafts: 0.06, bokeh: 0.6 };
const T_CUT = 2.6, T_UP = 3.2, T_GRAB = 6.0, T_YANK = 6.2, T_FREE = 7.75, T_GO = 8.2, T_TOP = 10.0, T_TURN = 10.6, T_B = 10.9, T_MEET = 12.95, T_JOIN = 13.25, T_END = 13.8;
// ---------------------------------------------------------------- the bucket
const BR = 900, BB = 1400, BXL0 = 230, BXR0 = 850, BXL1 = 300, BXR1 = 780;
const wallR = (y) => lerp(BXR0, BXR1, (y - BR) / (BB - BR)), wallL = (y) => lerp(BXL0, BXL1, (y - BR) / (BB - BR));
const CORAL = ['#e0704f', '#a94a33'], GOLDC = ['#f0ae36', '#b07418'];
function claw(x0, y0, x1, y1, sgn, col, open) {
  const ex = lerp(x0, x1, 0.5) + sgn * 14, ey = lerp(y0, y1, 0.5) - 10;
  ctx.strokeStyle = col[1]; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(ex, ey, x1, y1); ctx.stroke();
  const a = Math.atan2(y1 - ey, x1 - ex); ctx.save(); ctx.translate(x1, y1); ctx.rotate(a); ctx.fillStyle = col[0];
  ctx.beginPath(); ctx.ellipse(10, 0, 26, 18, 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.rotate(-0.35 - open); ctx.beginPath(); ctx.ellipse(34, -4, 18, 8, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.save(); ctx.rotate(0.3 + open * 0.5); ctx.beginPath(); ctx.ellipse(32, 4, 16, 7, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.restore();
}
// front-view crab; reach = [[x,y] or null, [x,y] or null] world targets for the (left, right) claws
function crab(x, y, s, rot, col, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (o.glow) { ctx.shadowColor = 'rgba(255,180,60,0.8)'; ctx.shadowBlur = 30; }
  const ph = t * (o.speed || 6) + (o.seed || 0);
  ctx.strokeStyle = col[1]; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const sg of [-1, 1]) for (let i = 0; i < 3; i++) { const w = 6 * Math.sin(ph + i * 1.3 + (sg > 0 ? 1 : 0));
    ctx.beginPath(); ctx.moveTo(sg * 44, -2 + 13 * i); ctx.lineTo(sg * (82 + 4 * i), -24 + 18 * i + w); ctx.lineTo(sg * (102 + 6 * i), 26 + 12 * i + w * 0.5); ctx.stroke(); }
  for (const [k, sg] of [[0, -1], [1, 1]]) { let tx = sg * 92, ty = -104; if (o.reach && o.reach[k]) { const [wx, wy] = o.reach[k]; const dx = wx - x, dy = wy - y, c = Math.cos(-rot), si = Math.sin(-rot); tx = (dx * c - dy * si) / s; ty = (dx * si + dy * c) / s; }
    claw(sg * 34, -24, tx, ty, sg, col, o.open ? o.open[k] : 0.25 + 0.15 * Math.sin(ph * 0.7 + k)); }
  ctx.fillStyle = col[0]; ctx.beginPath(); ctx.ellipse(0, 0, 64, 44, 0, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.ellipse(-8, -14, 40, 18, -0.1, 0, TAU); ctx.fill();
  ctx.strokeStyle = col[1]; ctx.lineWidth = 6; for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * 15, -38); ctx.lineTo(sg * 20, -60); ctx.stroke(); }
  const lk = o.look || [0, 0];
  for (const sg of [-1, 1]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sg * 21, -66, 10, 0, TAU); ctx.fill(); ctx.fillStyle = '#1a1612'; ctx.beginPath(); ctx.arc(sg * 21 + lk[0] * 4, -66 + lk[1] * 4, 5, 0, TAU); ctx.fill();
    if (o.sad) { ctx.strokeStyle = col[1]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sg * 10, -78 + (sg > 0 ? 4 : -2) * 0); ctx.lineTo(sg * 32, -82 + 6); ctx.stroke(); } }
  ctx.strokeStyle = col[1]; ctx.lineWidth = 4; ctx.beginPath(); if (o.sad) ctx.arc(0, 22, 12, 1.15 * Math.PI, 1.85 * Math.PI); else ctx.arc(0, 4, 12, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  ctx.restore();
}
function climberPos(t) {
  if (t < 1.6) { const y = lerp(1060, 1015, smooth(0, 1.2, t)); return [wallR(y) - 92, y, 0.18, 0]; }
  const u = clamp((t - 1.6) / 0.42), y = lerp(1015, 1268, u * u); return [lerp(wallR(1015) - 92, 690, u * u), y, 0.18 - 0.5 * u, u];
}
function bucketScene(t) {
  // table + bucket interior
  ctx.save(); ctx.fillStyle = '#16141a'; ctx.fillRect(-600, BB, 2400, 600); ctx.restore(); floorLine(BB + 2, 0.25);
  ctx.save(); ctx.beginPath(); ctx.moveTo(BXL0, BR); ctx.lineTo(BXR0, BR); ctx.lineTo(BXR1, BB); ctx.lineTo(BXL1, BB); ctx.closePath();
  const g = ctx.createLinearGradient(0, BR, 0, BB); g.addColorStop(0, '#2b2e36'); g.addColorStop(1, '#16171c'); ctx.fillStyle = g; ctx.fill(); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(200,210,225,0.18)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(540, BR, 310, 34, 0, Math.PI, TAU); ctx.stroke(); ctx.restore();
  // the pile
  const [cx, cy, cr, fall] = climberPos(t), yank = t >= 1.6;
  const pile = [[380, 1342, 0.95, -0.1, 1], [492, 1350, 1.0, 0.05, 2], [604, 1346, 0.95, -0.05, 3], [700, 1340, 0.9, 0.12, 4]];
  pile.forEach(([x, y, s, r, sd]) => crab(x, y, s, r, CORAL, t, { seed: sd, look: [0.3, -1] }));
  crab(470, 1262, 0.9, -0.15, CORAL, t, { seed: 6, look: [0.6, -1] });
  // the grabber on top of the pile, reaching for the climber's leg
  const legY = cy + 70, legX = cx + 70, reach = smooth(0.7, 1.2, t);
  const gx = 655, gy = 1250, tgt = [lerp(gx + 60, legX, reach), lerp(gy - 110, legY, reach)];
  crab(gx, gy, 0.95, 0.1, CORAL, t, { seed: 7, look: [1, -1], reach: [null, tgt], open: [0.3, yank ? 0.0 : 0.5 * (1 - reach)] });
  // the climber
  crab(cx, cy, 1.0, cr, GOLDC, t, { seed: 0, speed: t < 1.6 ? 14 : 4, glow: true, look: t < 1.6 ? [0, -1] : [0, 1], sad: fall > 0.95,
    reach: fall < 0.2 ? [[cx - 40, BR - 8], [Math.min(wallR(BR) + 6, cx + 120), BR - 14]] : null, open: [0.1, 0.1] });
  // walls + rim drawn last so the claws hook over them
  ctx.save(); ctx.strokeStyle = '#8f99a6'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(BXL0, BR); ctx.lineTo(BXL1, BB); ctx.lineTo(BXR1, BB); ctx.lineTo(BXR0, BR); ctx.stroke();
  ctx.fillStyle = '#b6bfca'; [BXL0, BXR0].forEach((x) => { ctx.beginPath(); ctx.roundRect(x - 18, BR - 12, 36, 24, 10); ctx.fill(); }); ctx.restore();
}
// ---------------------------------------------------------------- the pit
const F = 1440, GND = 820, S0 = 480, RUN = 52.5, RISE = 77.5, NST = 8, TOPX = S0 + NST * RUN;
const floorAt = (x) => F - RISE * clamp((x - S0 + 26) / RUN, 0, NST);
function heroX(t) {
  if (t < T_UP) return 470; if (t < T_GRAB) return lerp(470, 650, smooth(T_UP, T_GRAB, t) * 0.4 + 0.6 * clamp((t - T_UP) / (T_GRAB - T_UP)));
  if (t < T_YANK) return 650; if (t < T_GO) return lerp(650, 600, Math.pow(clamp((t - T_YANK) / 0.3), 0.5));
  if (t < T_TOP) return lerp(600, 965, clamp((t - T_GO) / (T_TOP - T_GO))); if (t < T_TURN) return 965; return 985;
}
function stepLit(k, t) { const x = S0 + (k - 0.5) * RUN; let tl = 1e9; for (let s = T_UP; s < T_TOP + 0.05; s += 0.05) if (heroX(s) >= x) { tl = s; break; } return smooth(tl, tl + 0.3, t); }
function pitWorld(t) {
  // sky + sun
  ctx.save(); const g = ctx.createLinearGradient(0, 200, 0, GND); g.addColorStop(0, '#231d33'); g.addColorStop(0.7, '#6b4a4a'); g.addColorStop(1, '#d99a58'); ctx.fillStyle = g; ctx.fillRect(-800, -400, 2800, GND + 400); ctx.restore();
  const sun = 0.7 + 0.3 * smooth(T_TOP - 0.3, T_TOP + 0.4, t);
  glowDot(1050, GND - 10, 560, 0.4 * sun); ctx.save(); ctx.fillStyle = '#ffd27a'; ctx.shadowColor = 'rgba(255,190,90,1)'; ctx.shadowBlur = 60; ctx.beginPath(); ctx.arc(1090, GND, 120, Math.PI, 0); ctx.fill(); ctx.restore();
  // pit interior
  ctx.save(); const p = ctx.createLinearGradient(0, GND, 0, F); p.addColorStop(0, '#24202c'); p.addColorStop(1, '#100f14'); ctx.fillStyle = p; ctx.fillRect(-800, GND, 2800, F - GND + 600); ctx.restore();
  // light spilling into the pit from the top right
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(1000, GND, 500, F); lg.addColorStop(0, `rgba(255,190,110,${(0.16 * sun).toFixed(3)})`); lg.addColorStop(1, 'rgba(255,190,110,0)');
  ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(TOPX, GND); ctx.lineTo(1300, GND); ctx.lineTo(700, F); ctx.lineTo(220, F); ctx.closePath(); ctx.fill(); ctx.restore();
  // ground on both sides + the staircase
  ctx.save(); ctx.fillStyle = '#2c2733'; ctx.beginPath(); ctx.moveTo(S0, F + 600); ctx.lineTo(S0, F);
  for (let k = 1; k <= NST; k++) { const x = S0 + (k - 1) * RUN, y = F - k * RISE; ctx.lineTo(x, y); ctx.lineTo(x + RUN, y); }
  ctx.lineTo(1800, GND); ctx.lineTo(1800, F + 600); ctx.closePath(); ctx.fill();
  ctx.fillRect(-800, GND, 840, F - GND + 600); ctx.restore();
  ctx.save(); ctx.lineCap = 'round'; for (let k = 1; k <= NST; k++) { const x = S0 + (k - 1) * RUN, y = F - k * RISE, lit = stepLit(k, t);
    ctx.strokeStyle = lit > 0 ? `rgba(255,201,94,${(0.25 + 0.65 * lit).toFixed(3)})` : 'rgba(255,255,255,0.14)'; ctx.lineWidth = 5; if (lit > 0) { ctx.shadowColor = 'rgba(255,180,60,0.8)'; ctx.shadowBlur = 16 * lit; }
    ctx.beginPath(); ctx.moveTo(x + 3, y + 2); ctx.lineTo(x + RUN - 3, y + 2); ctx.stroke(); ctx.shadowBlur = 0; }
  ctx.strokeStyle = 'rgba(255,214,150,0.5)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(TOPX, GND + 2); ctx.lineTo(1800, GND + 2); ctx.moveTo(-800, GND + 2); ctx.lineTo(40, GND + 2); ctx.stroke(); ctx.restore();
  floorLine(F + 2, 0.2);
  // rocks
  ctx.save(); ctx.fillStyle = '#3a3440'; [[150, F - 26], [295, F - 26]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y, 66, 32, 0, 0, TAU); ctx.fill(); }); ctx.restore();
}
function bubbleBox(x, y, w, h, k, tailX, tailY, lines, size = 36) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
  ctx.fillStyle = 'rgba(236,233,226,0.97)'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 26); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 24, y + h / 2 - 2); ctx.lineTo(tailX, tailY); ctx.lineTo(x + 20, y + h / 2 - 2); ctx.closePath(); ctx.fill();
  lines.forEach((s, i) => txt(s, x, y - (lines.length - 1) * size * 0.6 + i * size * 1.2, size, '#1d1b22', 700)); ctx.restore();
}
const cX = (t) => { if (t < 5.4) return 400; if (t < T_GRAB) return lerp(400, 520, smooth(5.4, T_GRAB, t)); if (t < T_YANK) return 520; if (t < 8.5) return lerp(520, 470, Math.pow(clamp((t - T_YANK) / 0.3), 0.5)); return lerp(470, 390, smooth(8.5, 9.4, t)); };
const bX = (t) => (t < T_B + 0.2 ? 295 : t < T_MEET ? lerp(295, 790, clamp((t - T_B - 0.2) / (T_MEET - T_B - 0.2))) : lerp(790, 905, smooth(T_JOIN, T_JOIN + 0.5, t)));
function people(t) {
  setFigureScale(1.3);
  const A = 150; const fade = 1 - smooth(6.1, 6.3, t);
  // A, sitting on a rock
  { const J = solve({ ...sitPose(Math.sin(t * 2)), h: t > T_MEET ? 0.0 : 0.35 }, A, F - 50, 0); hero(J, { expr: t < 4.4 ? 'neutral' : t < 7.0 ? 'smug' : t < T_MEET ? 'neutral' : 'worried', t, col: GREYC, blur: 4, seed: 3 });
    bubbleBox(250, 1040, 360, 88, popK(t, 4.6, 0.22) * fade, A + 26, J.head[1] - 34, ["You've changed."]);
    bubbleBox(270, 790, 420, 88, popK(t, 5.6, 0.22) * fade, A + 40, 1000, ["That'll never work."]); }
  // B, the quiet one: watches, then climbs and takes his hand
  { const x = bX(t), fl = floorAt(x); let J;
    if (t < T_B) J = solve({ ...sitPose(Math.sin(t * 2 + 1)), h: t > T_TOP ? -0.25 : 0.2 }, x, F - 50, 0);
    else if (t < T_B + 0.25) J = solve(mix(sitPose(0), standPose(0), smooth(T_B, T_B + 0.25, t)), x, lerp(F - 50, F, smooth(T_B, T_B + 0.25, t)), 0);
    else if (t < T_MEET - 0.1) J = solve({ ...walkPose(t * 7, 0.1), h: -0.2 }, x, fl, 0);
    else { let P = { ...standPose(0), h: -0.3 }; J = solve(P, x, fl, 0); const [s, e] = armIK(J.sh, MEET); P = { ...P, shN: s, elN: e }; J = solve(P, x, fl, 0); }
    const warm = smooth(T_MEET, T_MEET + 0.6, t), e = t < T_TOP ? 'neutral' : t < T_B + 0.3 ? 'shock' : t < T_MEET ? 'determined' : 'joy';
    if (warm > 0) { ctx.save(); ctx.globalAlpha *= 1 - warm; hero(J, { expr: e, t, col: WHITEC, blur: 6, seed: 5 }); ctx.restore(); ctx.save(); ctx.globalAlpha *= warm; hero(J, { expr: e, t, col: ['#ffe2a8', '#c9a46a', 'rgba(255,200,110,0.7)'], blur: 18, seed: 5 }); ctx.restore(); }
    else hero(J, { expr: e, t, col: WHITEC, blur: 6, seed: 5 }); }
  // C: talks, runs up behind him, grabs his ankle, lets go, walks back down
  { const x = cX(t), fl = floorAt(x), down = t > 8.5 && t < 9.4; let P;
    if (t < 5.4) P = { ...standPose(Math.sin(t * 2)), h: -0.1 };
    else if (t < T_GRAB || down) P = walkPose(t * 9, 0.12);
    else if (t < T_FREE) P = { ...standPose(0), t: t < T_YANK ? 0.12 : 0.12 - 0.3 * smooth(T_YANK, T_YANK + 0.2, t) * (1 - smooth(6.6, 7.0, t)), h: -0.1 };
    else P = { ...standPose(Math.sin(t * 2)), t: 0.1, h: 0.45 };
    let J = solve(P, x, fl, 0);
    const holding = t >= T_GRAB - 0.05 && t < T_FREE;
    if (holding) { const [s, e] = armIK(J.sh, HJ.aF); P = { ...P, shN: s, elN: e }; J = solve(P, x, fl, 0); }
    const e = t < 4.4 ? 'neutral' : t < T_GRAB ? 'smug' : t < T_FREE ? 'angry' : 'sad', dr = () => hero(J, { expr: e, t, col: GREYC, blur: 4, seed: 8 });
    if (down) mirrorX(x, dr); else dr();
    bubbleBox(330, 905, 520, 88, popK(t, 5.1, 0.22) * fade, 400 + 10, 1010, ['Who do you think you are?']); }
}
let HJ = null; const MEET = [905, 650];
function heroFig(t) {
  setFigureScale(1.3);
  const x = heroX(t), fl = t < T_TOP ? floorAt(x) : GND; let P, flip = false;
  if (t < T_UP) P = { ...standPose(Math.sin(t * 2)), h: -0.35 * smooth(T_CUT, T_CUT + 0.4, t) };
  else if (t < T_GRAB) P = { ...walkPose(t * 5, 0.14), kneeN: walkPose(t * 5).kneeN * 1.3, kneeF: walkPose(t * 5).kneeF * 1.3, h: -0.15 };
  else if (t < T_GO) {
    const yank = smooth(T_YANK, T_YANK + 0.15, t) * (1 - smooth(6.6, 7.0, t)), free = smooth(T_FREE - 0.15, T_FREE + 0.15, t);
    P = mix({ ...standPose(0), hipN: 0.5, kneeN: 0.75, hipF: -0.25, kneeF: 0.1, h: -0.1 }, stumblePose(), 0.45 * yank);
    P = { ...P, h: t > 6.7 ? lerp(P.h, 0.45, smooth(6.7, 7.0, t) * (1 - free)) : P.h, hipF: lerp(P.hipF, 0.5, free), kneeF: lerp(P.kneeF, 0.75, free) };
  } else if (t < T_TOP) P = { ...walkPose(t * 5.5, 0.14), kneeN: walkPose(t * 5.5).kneeN * 1.3, kneeF: walkPose(t * 5.5).kneeF * 1.3, h: -0.15 };
  else if (t < T_TURN) P = t > T_TOP + 0.15 ? cheerPose(Math.sin(t * 5)) : tallPose(0);
  else if (t < T_JOIN) { flip = true; const k = smooth(T_TURN, T_TURN + 0.3, t); P = mix(tallPose(0), { ...kneelPose(0), t: 0.75, h: 0.35 }, k); }
  else { flip = true; P = mix({ ...kneelPose(0), t: 0.75, h: 0.35 }, cheerPose(Math.sin(t * 5)), smooth(T_JOIN, T_JOIN + 0.35, t)); }
  let J = solve(P, x, fl, 0);
  if (flip && t < T_JOIN + 0.2) { // reach down: IK in mirrored space
    const m = [2 * x - MEET[0], MEET[1]]; const [s, e] = armIK(J.sh, t < T_TURN + 0.4 ? [lerp(J.sh[0] + 40, m[0], smooth(T_TURN, T_TURN + 0.4, t)), lerp(J.sh[1] + 90, m[1], smooth(T_TURN, T_TURN + 0.4, t))] : m);
    P = { ...P, shN: s, elN: e }; J = solve(P, x, fl, 0); }
  HJ = J;
  const e = t < T_UP ? 'determined' : t < 4.5 ? 'determined' : t < T_YANK ? 'worried' : t < 6.7 ? 'shock' : t < 7.3 ? 'sad' : t < T_GO ? 'calm' : t < T_TOP ? 'determined' : t < T_TURN ? 'joy' : t < T_MEET ? 'happy' : 'proud';
  const dr = () => hero(J, { expr: e, t, speed: t > T_GO && t < T_TOP ? 0.8 : 0.3, blur: 18 + 16 * smooth(T_TOP - 0.3, T_TOP + 0.3, t) });
  if (flip) mirrorX(x, dr); else dr();
}
function pitScene(t) {
  pitWorld(t);
  heroFig(t);      // first, so C can grab his ankle (HJ)
  people(t);
  if (t >= T_MEET) ringFlash(MEET[0], MEET[1], t, T_MEET, '255,201,94', 30, 300, 0.55, 8);
  if (t >= T_TOP) { rays(1090, GND, 140, 900, 14, t, 0.08 * smooth(T_TOP, T_TOP + 0.5, t)); }
}
function scene(t, c) { if (t < T_CUT) bucketScene(t); else { pitScene(t); } }
CAMK = [[0, 720, 1050, 1.45, 0.02], [0.7, 700, 1060, 1.38, 0], [1.3, 540, 1150, 1.0, 0], [T_CUT - 0.01, 540, 1150, 1.02, 0],
        [T_CUT, 470, 1130, 1.55, 0], [T_UP + 0.1, 560, 1150, 1.0, 0], [6.15, 560, 1150, 1.02, 0], [T_YANK + 0.15, 570, 1160, 1.3, 0], [T_GO - 0.1, 575, 1150, 1.35, 0],
        [8.6, 650, 1080, 1.05, 0], [T_TOP, 820, 830, 1.1, 0], [T_TURN, 820, 860, 1.08, 0], [T_B + 0.4, 700, 960, 1.0, 0], [T_MEET - 0.4, 820, 880, 1.1, 0], [T_JOIN + 0.4, 840, 840, 1.1, 0], [DUR, 800, 800, 1.02, 0]];
SHAKES = [[0, 8, 0.15], [1.95, 14, 0.3], [T_CUT, 8, 0.15], [T_YANK, 14, 0.3]];
PUNCHES = [[0, 0.05, 0.12], [1.95, 0.06, 0.14], [T_CUT, 0.05, 0.12], [T_YANK, 0.07, 0.14], [T_TOP, 0.05, 0.12], [T_MEET, 0.05, 0.12]];
function screen(t) { whipLines(t, T_CUT, 0.18, 1); whipLines(t, T_TOP, 0.15, -1); }
window.renderFrame = (t) => frame3(t, { scenes: scene, screen, PH, hook: { lines: [[['When you start growing,', 0]], [['watch who ', 0], ['pulls you back', 1], ['.', 0]]], tIn: 0, tOut: 2.5 },
  after: (t) => { if (t >= T_END) endText(t, T_END, [['Keep climbing.', '#fff'], ['Reach back.', GOLDL]], 84); } });
window.__allSteps = {};
window.sceneReady = FONTS_READY();
