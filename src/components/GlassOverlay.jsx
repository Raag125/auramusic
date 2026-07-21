
export default function GlassOverlay({ themeColor = '#9b4dca' }) {
  const r = parseInt(themeColor.slice(1, 3), 16);
  const g = parseInt(themeColor.slice(3, 5), 16);
  const b = parseInt(themeColor.slice(5, 7), 16);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: 2,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'rgba(3, 2, 12, 0.22)',
      }}
    >
      {}
      <div style={{
        position: 'absolute', top: 0, left: '18%', width: '14vw', height: '100%',
        background: `linear-gradient(to right, transparent, rgba(${r},${g},${b},0.12), transparent)`,
        filter: 'blur(50px)', animation: 'pulse-light 9s infinite alternate',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: '22%', width: '10vw', height: '100%',
        background: `linear-gradient(to right, transparent, rgba(${r},${g},${b},0.08), transparent)`,
        filter: 'blur(70px)', animation: 'pulse-light 14s infinite alternate-reverse',
      }} />
      <style>{`
        @keyframes pulse-light {
          0%   { opacity: 0.3; transform: scaleX(1); }
          100% { opacity: 0.9; transform: scaleX(1.6); }
        }
      `}</style>
    </div>
  );
}
