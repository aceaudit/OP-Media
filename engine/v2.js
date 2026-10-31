// v2 helpers (58+): hook on screen at frame 0, snappy pops instead of fades, beat grid, bursts, loop-friendly endings.
const easeOutBack = (u, c1 = 1.70158) => { u = clamp(u); const c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
const easeOut = (u) => 1 - Math.pow(1 - clamp(u), 3);
const easeInOut = (u) => { u = clamp(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
// HTML caption: hard in (with a small overshoot pop), hard out. tIn <= 0 → fully on screen at frame 0.
function pop(el, tIn, tOut, t, d = 0.2) {
  if (t < tIn || t >= tOut) { el.style.opacity = '0'; return 0; }
  const u = tIn <= 0 ? 1 : clamp((t - tIn) / d);
  el.style.opacity = (tIn <= 0 ? 1 : clamp(u * 3)).toFixed(3);
  el.style.transform = `scale(${(tIn <= 0 ? 1 : lerp(0.72, 1, easeOutBack(u))).toFixed(4)})`;
  el.style.filter = 'none';
  return u;
}
// canvas pop scale for drawn things
const popK = (t, t0, d = 0.22) => (t < t0 ? 0 : lerp(0.6, 1, easeOutBack((t - t0) / d)));
// camera punch on a beat: 1 + amp, decaying
const punch = (t, t0, amp = 0.035, d = 0.18) => (t < t0 ? 1 : 1 + amp * Math.exp(-(t - t0) / d));
const shakeXY = (t, t0, amp = 14, d = 0.25) => { if (t < t0) return [0, 0]; const e = amp * Math.exp(-(t - t0) / d); return [e * Math.sin((t - t0) * 83), e * Math.cos((t - t0) * 71)]; };
// deterministic particle burst
function burst(x, y, t, t0, n = 26, cols = ['#ffc95e', '#ffffff', '#f0ae36'], spd = 900, life = 1.1, sd = 7) {
  if (t < t0 || t > t0 + life) return;
  let s = sd * 7919 + 13; const r = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const dt = t - t0;
  ctx.save();
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, v = spd * (0.35 + 0.65 * r()), sz = 5 + 9 * r(), c = cols[Math.floor(r() * cols.length)], spin = (r() - 0.5) * 14;
    const px = x + Math.cos(a) * v * dt * (1 - 0.35 * dt), py = y + Math.sin(a) * v * dt * (1 - 0.35 * dt) + 900 * dt * dt;
    ctx.globalAlpha = clamp(1 - dt / life) ; ctx.fillStyle = c;
    ctx.translate(px, py); ctx.rotate(spin * dt); ctx.fillRect(-sz / 2, -sz / 4, sz, sz / 2); ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  ctx.restore();
}
// expanding ring flash
function ringFlash(x, y, t, t0, col = '255,201,94', r0 = 40, r1 = 420, d = 0.55, w = 10) {
  if (t < t0 || t > t0 + d) return; const u = (t - t0) / d;
  ctx.save(); ctx.globalAlpha = (1 - u) * 0.9; ctx.strokeStyle = `rgb(${col})`; ctx.lineWidth = w * (1 - u) + 1;
  ctx.shadowColor = `rgba(${col},1)`; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(x, y, lerp(r0, r1, easeOut(u)), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}
// white flash over the whole frame
function flash(t, t0, a = 0.35, d = 0.25) { if (t < t0 || t > t0 + d) return; ctx.save(); ctx.globalAlpha = a * (1 - (t - t0) / d); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
// countdown timer bar with seconds left
function timerBar(x, y, w, t0, t1, t, col = '#ffc95e') {
  if (t < t0 - 0.01 || t > t1 + 0.25) return;
  const u = clamp((t - t0) / (t1 - t0)), left = Math.max(0, Math.ceil(t1 - t - 1e-6));
  ctx.save(); ctx.globalAlpha = 1 - smooth(t1, t1 + 0.25, t);
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 9, w, 18, 9); ctx.fill();
  const hot = left <= 1 && t < t1;
  ctx.fillStyle = hot ? '#ff6b5e' : col; ctx.shadowColor = hot ? 'rgba(255,90,80,0.8)' : 'rgba(255,180,60,0.7)'; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - 9, Math.max(18, w * (1 - u)), 18, 9); ctx.fill(); ctx.shadowBlur = 0;
  const pulse = 1 + 0.18 * Math.exp(-((t - t0) % 1) * 7);
  if (left > 0) { ctx.translate(x, y + 62); ctx.scale(pulse, pulse); label(String(left), 0, 0, hot ? '#ff8a7e' : '#ffe2a6', 46, 2, 700); } ctx.restore();
}
// rounded pill tag drawn on canvas
function pill(text, x, y, t, t0, opts = {}) {
  const k = popK(t, t0, opts.d || 0.22); if (k <= 0) return;
  const size = opts.size || 34; ctx.save(); ctx.font = `700 ${size}px Poppins`; const w = ctx.measureText(text).width + size * 1.4, h = size * 1.75;
  ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha = opts.alpha ?? 1;
  ctx.fillStyle = opts.bg || '#ffc95e'; ctx.shadowColor = opts.glow || 'rgba(255,180,60,0.55)'; ctx.shadowBlur = 24;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = opts.fg || '#1a1408'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, size * 0.06); ctx.restore();
}
// v2 caption CSS (inject once)
(() => { const s = document.createElement('style'); s.textContent = `
  .hook { position: absolute; left: 40px; right: 40px; text-align: center; font-family: 'Poppins'; font-weight: 700; font-size: 66px; line-height: 1.16;
    letter-spacing: -0.5px; color: #ffffff; opacity: 0; transform-origin: 50% 50%;
    text-shadow: 0 0 2px #000, 0 3px 0 rgba(0,0,0,0.55), 0 0 26px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.6); }
  .hook.mid { font-size: 54px; } .hook.small { font-size: 42px; font-weight: 500; line-height: 1.3; }
  .hook .g, .g { color: #ffc95e; text-shadow: 0 0 2px #000, 0 3px 0 rgba(0,0,0,0.55), 0 0 26px rgba(243,170,50,0.55), 0 0 50px rgba(0,0,0,0.7); }
  .hook .r { color: #ff7a6e; } .hook .b { color: #8fc8ff; }
  .tag { display: inline-block; background: #ffc95e; color: #1a1408; padding: 6px 26px 4px; border-radius: 40px; text-shadow: none; box-shadow: 0 0 28px rgba(255,180,60,0.45); }
  .tagw { display: inline-block; background: #f4f2ee; color: #121214; padding: 6px 26px 4px; border-radius: 40px; text-shadow: none; }
`; document.head.appendChild(s); })();
