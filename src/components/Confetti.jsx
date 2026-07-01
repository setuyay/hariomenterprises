'use client';
import { useRef, useEffect } from 'react';

// Lightweight dependency-free confetti burst. Re-fires whenever `fire` changes.
export default function Confetti({ fire }) {
  const canvasRef = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!fire) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = (canvas.width = window.innerWidth * dpr);
    const H = (canvas.height = window.innerHeight * dpr);
    ctx.scale(dpr, dpr);

    const colors = ['#d4af37', '#f7e7a8', '#e8472b', '#159e54', '#0a5ad6', '#ffffff'];
    const cx = window.innerWidth / 2;
    const N = 160;
    const parts = Array.from({ length: N }, (_, i) => ({
      x: cx + (((i * 53) % 200) - 100),
      y: window.innerHeight * 0.32,
      // deterministic-ish spread (no Math.random dependency on first frame)
      vx: Math.cos((i / N) * Math.PI * 2) * (3 + (i % 5)),
      vy: -6 - (i % 7),
      size: 5 + (i % 4) * 2,
      color: colors[i % colors.length],
      rot: i,
      vr: ((i % 5) - 2) * 0.2,
      life: 0,
    }));

    let frame = 0;
    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of parts) {
        p.vy += 0.18; // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life++;
        const alpha = Math.max(0, 1 - frame / 150);
        if (alpha > 0 && p.y < window.innerHeight + 40) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      }
      if (alive && frame < 160) raf.current = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    tick();
    return () => cancelAnimationFrame(raf.current);
  }, [fire]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none" />;
}
