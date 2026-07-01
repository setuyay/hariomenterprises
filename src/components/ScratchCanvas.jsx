'use client';
import { useRef, useEffect, useState, useCallback } from 'react';

// A premium gold scratch-foil overlay. Renders `children` underneath; the user
// scratches the foil away with mouse or touch. Calls onComplete once enough is
// cleared, then fades the foil out.
export default function ScratchCanvas({ children, onComplete, threshold = 0.5, className = '' }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const drawing = useRef(false);
  const completed = useRef(false);
  const initialized = useRef(false);
  const lastCheck = useRef(0);
  const [cleared, setCleared] = useState(false);

  const paintFoil = useCallback((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    // brushed-gold gradient
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#c89a3c');
    g.addColorStop(0.25, '#f7e7a8');
    g.addColorStop(0.5, '#b8862f');
    g.addColorStop(0.75, '#f3dd98');
    g.addColorStop(1, '#9c6f23');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // subtle sparkle flecks
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 70; i++) {
      const x = (i * 137.5) % w;
      const y = (i * 89.3) % h;
      ctx.fillStyle = i % 2 ? '#fff7df' : '#7a5713';
      ctx.beginPath();
      ctx.arc(x, y, ((i * 7) % 3) + 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // prompt text
    ctx.fillStyle = 'rgba(70,48,8,.8)';
    ctx.font = '700 16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦  SCRATCH HERE  ✦', w / 2, h / 2 - 8);
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText('Use your finger or mouse', w / 2, h / 2 + 14);
  }, []);

  // Robustly size + paint the foil once the container actually has a layout box.
  // (On first mount the box can measure 0 while animations/layout settle.)
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const init = () => {
      if (initialized.current) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return; // not laid out yet — try again later
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFoil(ctx, w, h);
      initialized.current = true;
      if (ro) ro.disconnect();
    };

    init();
    let ro;
    if (!initialized.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(init);
      ro.observe(wrap);
    }
    const r1 = requestAnimationFrame(init);
    const r2 = requestAnimationFrame(() => requestAnimationFrame(init));
    return () => { ro && ro.disconnect(); cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [paintFoil]);

  const pointFromEvent = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    // map client px → CSS px within the (possibly scaled) canvas
    const sx = rect.width ? canvas.clientWidth / rect.width : 1;
    const sy = rect.height ? canvas.clientHeight / rect.height : 1;
    return { x: (cx - rect.left) * sx, y: (cy - rect.top) * sy };
  };

  const scratchAt = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    maybeCheck();
  };

  const maybeCheck = () => {
    const now = Date.now();
    if (now - lastCheck.current < 160) return; // throttle expensive reads
    lastCheck.current = now;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    if (!width || !height) return;
    const step = 16;
    const data = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * step) {
      total++;
      if (data[i] === 0) transparent++;
    }
    if (total && transparent / total >= threshold && !completed.current) {
      completed.current = true;
      setCleared(true);
      onComplete?.();
    }
  };

  const start = (e) => { drawing.current = true; const p = pointFromEvent(e); scratchAt(p.x, p.y); };
  const move = (e) => { if (!drawing.current) return; e.preventDefault(); const p = pointFromEvent(e); scratchAt(p.x, p.y); };
  const end = () => { drawing.current = false; };

  return (
    <div ref={wrapRef} className={`relative select-none ${className}`} style={{ touchAction: 'none' }}>
      <div className="absolute inset-0">{children}</div>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 rounded-2xl cursor-pointer transition-opacity duration-700 ${cleared ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
    </div>
  );
}
