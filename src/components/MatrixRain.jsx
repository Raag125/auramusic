import { useEffect, useRef } from 'react';

const ALL_BLOBS = [
  { x: 0.15, y: 0.3, r: 0.35, color: [120, 40, 200], speed: 0.00018, phase: 0 },
  { x: 0.80, y: 0.6, r: 0.30, color: [30, 140, 200], speed: 0.00022, phase: 2.1 },
  { x: 0.50, y: 0.15, r: 0.25, color: [200, 50, 100], speed: 0.00015, phase: 4.2 },
  { x: 0.25, y: 0.80, r: 0.28, color: [80, 30, 180], speed: 0.00020, phase: 1.0 },
  { x: 0.75, y: 0.20, r: 0.22, color: [10, 120, 180], speed: 0.00017, phase: 3.3 },
  { x: 0.60, y: 0.85, r: 0.20, color: [160, 40, 220], speed: 0.00025, phase: 5.1 },
];

export default function MusicBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    const BLOBS = isMobile ? ALL_BLOBS.slice(0, 3) : ALL_BLOBS;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let frameCount = 0;

    const draw = (t) => {
      frameCount++;
      if (isMobile && frameCount % 2 !== 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const W = canvas.width;
      const H = canvas.height;

      ctx.fillStyle = '#030308';
      ctx.fillRect(0, 0, W, H);

      BLOBS.forEach((b) => {
        const ox = Math.sin(t * b.speed * 1.3 + b.phase) * W * 0.18;
        const oy = Math.cos(t * b.speed + b.phase * 0.7) * H * 0.18;
        const cx = b.x * W + ox;
        const cy = b.y * H + oy;
        const rr = b.r * Math.min(W, H);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
        const [r, g, bl] = b.color;
        grad.addColorStop(0, `rgba(${r},${g},${bl},0.28)`);
        grad.addColorStop(0.45, `rgba(${r},${g},${bl},0.10)`);
        grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      const vign = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.9);
      vign.addColorStop(0, 'rgba(0,0,0,0)');
      vign.addColorStop(1, 'rgba(0,0,0,0.75)');
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, display: 'block' }}
    />
  );
}
