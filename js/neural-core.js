/**
 * 3D-Projected Holographic Synthetic Mind Canvas (Zero dependencies)
 * Renders an interactive Fibonacci-sphere neural core with synaptic arcs & orbital rings.
 * - Morphs smoothly between Vision Mode (J.A.R.V.I.S. cyan / Mind Stone gold) and Ultron Mode (crimson / chrome)
 * - Reacts to pointer parallax
 * - Pauses automatically when offscreen or hidden; renders a single crisp frame under prefers-reduced-motion
 */

import { prefersReducedMotion, getTheme } from './hud.js';

export function initNeuralCore() {
  const canvas = document.getElementById('jarvis-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduced = prefersReducedMotion();
  const POINT_COUNT = 68;
  const points = [];

  // Golden-angle Fibonacci sphere distribution
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < POINT_COUNT; i++) {
    const y = 1 - (i / (POINT_COUNT - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    points.push({
      x: Math.cos(theta) * radiusAtY,
      y,
      z: Math.sin(theta) * radiusAtY,
      phase: (i * 0.47) % (Math.PI * 2)
    });
  }

  // Precompute neighbor synaptic edges for clean wireframe look
  const edges = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    for (let j = i + 1; j < POINT_COUNT; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dz = points[i].z - points[j].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 0.62) {
        edges.push([i, j, dist]);
      }
    }
  }

  let width = 360;
  let height = 360;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(220, Math.round(rect.width));
    height = Math.max(220, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  let rotY = 0.4;
  let rotX = 0.22;
  let targetTiltX = 0;
  let targetTiltY = 0;
  let isVisible = true;
  let rafId = null;

  const stage = canvas.parentElement;
  if (stage && !reduced) {
    stage.addEventListener(
      'pointermove',
      (e) => {
        const rect = stage.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        targetTiltY = nx * 0.55;
        targetTiltX = -ny * 0.45;
      },
      { passive: true }
    );
    stage.addEventListener(
      'pointerleave',
      () => {
        targetTiltX = 0;
        targetTiltY = 0;
      },
      { passive: true }
    );
  }

  const drawFrame = (time) => {
    const isUltron = getTheme() === 'ultron';
    const primary = isUltron ? [244, 63, 94] : [56, 189, 248];
    const secondary = isUltron ? [226, 232, 240] : [245, 192, 74];
    const coreGlow = isUltron ? 'rgba(244, 63, 94, 0.22)' : 'rgba(56, 189, 248, 0.2)';

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const R = Math.min(width, height) * 0.34;

    // Inner ambient core radiance
    const grad = ctx.createRadialGradient(cx, cy, R * 0.08, cx, cy, R * 1.25);
    grad.addColorStop(0, coreGlow);
    grad.addColorStop(0.55, isUltron ? 'rgba(244, 63, 94, 0.05)' : 'rgba(245, 192, 74, 0.05)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // Rotate 3D sphere points
    const curRotY = rotY + targetTiltY;
    const curRotX = rotX + targetTiltX;
    const cosY = Math.cos(curRotY);
    const sinY = Math.sin(curRotY);
    const cosX = Math.cos(curRotX);
    const sinX = Math.sin(curRotX);

    const projected = points.map((p, idx) => {
      // Subtle Ultron spike distortion vs Vision smooth harmonic breathing
      const pulse = reduced
        ? 1
        : isUltron
          ? 1 + Math.sin(time * 0.004 + p.phase * 3) * (idx % 5 === 0 ? 0.14 : 0.03)
          : 1 + Math.sin(time * 0.0018 + p.phase) * 0.045;

      const px = p.x * pulse;
      const py = p.y * pulse;
      const pz = p.z * pulse;

      const x1 = px * cosY - pz * sinY;
      const z1 = px * sinY + pz * cosY;
      const y2 = py * cosX - z1 * sinX;
      const z2 = py * sinX + z1 * cosX;

      const fov = 3.1;
      const scale = fov / (fov - z2);
      return {
        x: cx + x1 * R * scale,
        y: cy + y2 * R * scale,
        z: z2,
        scale,
        highlight: idx % 9 === 0
      };
    });

    // Draw geodesic synaptic connections
    ctx.lineWidth = 0.85;
    for (let k = 0; k < edges.length; k++) {
      const [i, j] = edges[k];
      const a = projected[i];
      const b = projected[j];
      const avgZ = (a.z + b.z) * 0.5;
      const alpha = Math.max(0.04, Math.min(0.42, (avgZ + 1.15) * 0.22));
      ctx.strokeStyle = `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // Draw equatorial holographic scan ring
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(curRotY * 0.35);
    ctx.scale(1, 0.34);
    ctx.strokeStyle = `rgba(${secondary[0]}, ${secondary[1]}, ${secondary[2]}, 0.42)`;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([10, 8, 3, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Draw neural nodes back-to-front
    projected.sort((a, b) => a.z - b.z);
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const alpha = Math.max(0.18, Math.min(1, (p.z + 1.2) * 0.52));
      const col = p.highlight ? secondary : primary;
      const r = (p.highlight ? 2.6 : 1.7) * p.scale;

      ctx.fillStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center diamond Mind-Stone / Ultron core spark
    const diamondR = R * 0.14;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = `rgba(${secondary[0]}, ${secondary[1]}, ${secondary[2]}, 0.92)`;
    ctx.beginPath();
    ctx.moveTo(0, -diamondR * 1.35);
    ctx.lineTo(diamondR * 0.82, 0);
    ctx.lineTo(0, diamondR * 1.35);
    ctx.lineTo(-diamondR * 0.82, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  if (reduced) {
    drawFrame(0);
    // Redraw static frame when theme changes
    const mo = new MutationObserver(() => drawFrame(0));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return;
  }

  const tick = (now) => {
    if (!isVisible || document.hidden) {
      rafId = null;
      return;
    }
    rotY += getTheme() === 'ultron' ? 0.0068 : 0.0038;
    rotX = 0.22 + Math.sin(now * 0.0005) * 0.14;
    drawFrame(now);
    rafId = requestAnimationFrame(tick);
  };

  const startLoop = () => {
    if (!rafId && isVisible && !document.hidden) {
      rafId = requestAnimationFrame(tick);
    }
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) startLoop();
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) startLoop();
  });

  // Start after initial paint so LCP/FCP is completely unblocked
  requestAnimationFrame(startLoop);
}
