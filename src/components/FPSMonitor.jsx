import { useState, useEffect } from 'react';

export default function FPSMonitor() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId;

    const update = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'rgba(0, 0, 0, 0.75)',
      color: fps >= 55 ? '#4ade80' : fps >= 30 ? '#facc15' : '#ef4444',
      padding: '4px 8px',
      borderRadius: '6px',
      fontFamily: 'monospace',
      fontSize: '11px',
      fontWeight: 'bold',
      zIndex: 99999,
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255,255,255,0.1)',
      pointerEvents: 'none'
    }}>
      {fps} FPS
    </div>
  );
}
