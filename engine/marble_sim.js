// Deterministic 2D marble race physics (shared by v59.html and the Node tuner).
(function (root) {
  const R = 26, G = 3200, DT = 1 / 480;
  function course(jit = 0) {
    const segs = [], pegs = [];
    let s = 1234 + jit * 7919; const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    const W0 = 60, W1 = 1020, H = 3500;
    segs.push([W0, 0, W0, H], [W1, 0, W1, H]);
    // start funnel + gate (gate removed at release)
    segs.push([W0, 250, 330, 430], [W1, 250, 750, 430]);
    const gate = [330, 432, 750, 432];
    // peg field 1
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) {
      const x = 120 + c * 140 + (r % 2 ? 70 : 0) + (rnd() - 0.5) * 10, y = 545 + r * 105;
      if (x > W0 + 82 && x < W1 - 82) pegs.push([x, y, 13]);
    }
    // zigzag ramps (gaps alternate right / left)
    const ramps = [[W0, 1080, 870, 1310], [W1, 1430, 210, 1660], [W0, 1780, 870, 2010], [W1, 2130, 210, 2360]];
    for (const q of ramps) segs.push(q);
    // bumps on ramps
    // peg field 2
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
      const x = 120 + c * 140 + (r % 2 ? 70 : 0) + (rnd() - 0.5) * 10, y = 2490 + r * 105;
      if (x > W0 + 82 && x < W1 - 82) pegs.push([x, y, 13]);
    }
    // funnel + chute + finish
    segs.push([W0, 2900, 474, 3150], [W1, 2900, 606, 3150], [474, 3150, 474, 3500], [606, 3150, 606, 3500], [474, 3480, 606, 3480]);
    return { segs, pegs, gate, ramps, finishY: 3240, H };
  }
  function simulate(opts = {}) {
    const T_GO = opts.go ?? 1.0, DUR = opts.dur ?? 15, fps = opts.fps ?? 60;
    const C = course(opts.jit || 0);
    const xs = opts.xs || [405, 485, 565, 645];
    const M = xs.map((x, i) => ({ x, y: 432 - R - 0.5, vx: 0, vy: 0, ang: i, fin: null }));
    const EVT = []; let curT = 0; const frames = [], steps = Math.round(DUR / DT), per = Math.round(1 / (fps * DT));
    const collideSeg = (m, x0, y0, x1, y1, e, fr) => {
      const dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy;
      let u = ((m.x - x0) * dx + (m.y - y0) * dy) / L2; u = Math.max(0, Math.min(1, u));
      const px = x0 + u * dx, py = y0 + u * dy, ex = m.x - px, ey = m.y - py, d = Math.hypot(ex, ey);
      if (d < R && d > 1e-6) {
        const nx = ex / d, ny = ey / d; m.x += nx * (R - d); m.y += ny * (R - d);
        const vn = m.vx * nx + m.vy * ny;
        if (vn < -220) EVT.push([curT, 0, -vn, m.x, m.y]);
        if (vn < 0) { const tx = -ny, ty = nx, vt = m.vx * tx + m.vy * ty; const vn2 = -vn * e, vt2 = vt * (1 - fr);
          m.vx = vn2 * nx + vt2 * tx; m.vy = vn2 * ny + vt2 * ty; }
      }
    };
    for (let i = 0; i <= steps; i++) {
      const t = i * DT; curT = t;
      if (i % per === 0) frames.push(M.map((m) => [m.x, m.y, m.ang]));
      for (const m of M) {
        m.vy += G * DT; m.vx *= 0.9996; m.vy *= 0.9996;
        const sp = Math.hypot(m.vx, m.vy); if (sp > 2300) { m.vx *= 2300 / sp; m.vy *= 2300 / sp; }
        m.x += m.vx * DT; m.y += m.vy * DT; m.ang += (m.vx / R) * DT;
      }
      for (const m of M) {
        for (const q of C.segs) collideSeg(m, q[0], q[1], q[2], q[3], 0.28, 0.0005);
        if (t < T_GO) collideSeg(m, ...C.gate, 0.1, 0.2);
        for (const [px, py, pr] of C.pegs) {
          const ex = m.x - px, ey = m.y - py, d = Math.hypot(ex, ey), rr = R + pr;
          if (d < rr && d > 1e-6) { const nx = ex / d, ny = ey / d; m.x += nx * (rr - d); m.y += ny * (rr - d);
            const vn = m.vx * nx + m.vy * ny; if (vn < -220) EVT.push([t, 1, -vn, px, py]); if (vn < 0) { m.vx -= 1.5 * vn * nx; m.vy -= 1.5 * vn * ny; } }
        }
      }
      for (let a = 0; a < M.length; a++) for (let b = a + 1; b < M.length; b++) {
        const A = M[a], B = M[b], ex = B.x - A.x, ey = B.y - A.y, d = Math.hypot(ex, ey);
        if (d < 2 * R && d > 1e-6) { const nx = ex / d, ny = ey / d, o = (2 * R - d) / 2; A.x -= nx * o; A.y -= ny * o; B.x += nx * o; B.y += ny * o;
          const vr = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny; if (vr < -220) EVT.push([t, 2, -vr, A.x, A.y]); if (vr < 0) { const j = -(1 + 0.75) * vr / 2; A.vx -= j * nx; A.vy -= j * ny; B.vx += j * nx; B.vy += j * ny; } }
      }
      M.forEach((m, k) => { if (m.fin === null && m.y > C.finishY) m.fin = t; });
    }
    return { frames, fin: M.map((m) => m.fin), course: C, go: T_GO, events: EVT };
  }
  // leader per frame with hysteresis
  function leaders(sim) {
    let lead = -1; const out = [];
    sim.frames.forEach((f, i) => {
      const t = i / 60; let best = 0; f.forEach((p, k) => { if (p[1] > f[best][1]) best = k; });
      if (t < sim.go + 0.3) { out.push(-1); return; }
      if (lead < 0) lead = best;
      else if (best !== lead && f[best][1] > f[lead][1] + 25) lead = best;
      const done = sim.fin.map((x, k) => [x, k]).filter((q) => q[0] !== null && q[0] <= t).sort((a, b) => a[0] - b[0]);
      out.push(done.length ? done[0][1] : lead);
    });
    return out;
  }
  const api = { simulate, leaders, R, course };
  if (typeof module !== 'undefined') module.exports = api; else root.MarbleSim = api;
})(this);
