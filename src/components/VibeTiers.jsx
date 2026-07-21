import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Zap, Flame, Sparkles, Wind, Moon } from 'lucide-react';

const vibes = [
  { genre: 'Emotional', icon: Droplet, accent: '#5b8af0', chipBg: 'rgba(91,138,240,0.18)', border: 'rgba(91,138,240,0.4)', solid: '#0f1835', desc: 'Orchestral depth and sentimental resonance. Swooping strings, piano, cinematic swells.', tags: ['Orchestral', 'Cinematic'] },
  { genre: 'Melancholic', icon: Moon, accent: '#9b63dd', chipBg: 'rgba(155,99,221,0.18)', border: 'rgba(155,99,221,0.4)', solid: '#130f22', desc: 'Slow, introspective frequencies for grief and quiet beauty.', tags: ['Lo-fi', 'Dark'] },
  { genre: 'Euphoric', icon: Zap, accent: '#38bdf8', chipBg: 'rgba(56,189,248,0.18)', border: 'rgba(56,189,248,0.4)', solid: '#071b2a', desc: 'High-vibration beats built for momentum and celebration.', tags: ['Pop', 'EDM'] },
  { genre: 'Romantic', icon: Sparkles, accent: '#f05080', chipBg: 'rgba(240,80,128,0.18)', border: 'rgba(240,80,128,0.4)', solid: '#200a12', desc: 'Warm, intimate sound for love stories and tender moments.', tags: ['Acoustic', 'Soft'] },
  { genre: 'High Energy', icon: Flame, accent: '#f0850a', chipBg: 'rgba(240,133,10,0.18)', border: 'rgba(240,133,10,0.4)', solid: '#1f0e00', desc: 'Aggressive drops, tight percussion and adrenaline-charged mixes.', tags: ['Club', 'Urban'] },
  { genre: 'Ambient', icon: Wind, accent: '#2dd4bf', chipBg: 'rgba(45,212,191,0.18)', border: 'rgba(45,212,191,0.4)', solid: '#041714', desc: 'Lush pads and frequency-tuned drones for calm focused work.', tags: ['Lo-fi', 'Meditative'] },
];

export default function VibeTiers({ onThemeChange }) {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section className="responsive-tier-section" style={{
      minHeight: '100vh',
      padding: isMobile ? '8vh 5vw' : '0 5vw',
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'center',
      flexDirection: isMobile ? 'column' : 'row',
      position: 'relative',
      gap: '5vw',
    }}>
      { }
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.6rem', zIndex: 10, width: '100%' }}>

        { }
        <div>
          <p style={{ margin: 0, fontSize: '0.68rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.38)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', fontWeight: 500 }}>
            02 — Music Mood
          </p>
          <h2 style={{ margin: '6px 0 0', fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.4rem, 2vw, 1.9rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            Choose Your Vibe
          </h2>
        </div>

        { }
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '0.95rem',
        }}>
          {vibes.map((v, i) => {
            const Icon = v.icon;
            const isHov = hovered === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.8, y: isMobile ? 15 : 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: isMobile ? "0px" : "-50px" }}
                transition={{ type: isMobile ? 'tween' : 'spring', stiffness: 120, damping: 14, duration: isMobile ? 0.4 : undefined, delay: isMobile ? i * 0.04 : i * 0.08 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -8, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  border: `1px solid ${isHov ? v.border.replace('0.4', '0.75') : v.border}`,
                  borderRadius: '16px',
                  padding: isMobile ? '0.85rem 0.8rem' : '1.1rem',
                  cursor: 'pointer',
                  background: v.solid,
                  display: 'flex', flexDirection: 'column', gap: '0.7rem',
                  position: 'relative', overflow: 'hidden',
                  transition: 'border 0.3s ease',
                  transform: 'translateZ(0)',
                  willChange: 'transform, opacity',
                }}
              >
                { }
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${v.accent}, transparent)`, opacity: isHov ? 1 : 0.5 }} />
                { }
                <div style={{ position: 'absolute', top: -40, right: -40, width: '110px', height: '110px', background: `radial-gradient(circle, ${v.chipBg.replace('0.18', isHov ? '0.55' : '0.3')}, transparent 70%)`, pointerEvents: 'none' }} />

                { }
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', zIndex: 1 }}>
                  <motion.div
                    animate={isHov ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ width: isMobile ? '30px' : '38px', height: isMobile ? '30px' : '38px', borderRadius: '10px', background: v.chipBg, border: `1px solid ${v.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <Icon size={isMobile ? 14 : 17} color={v.accent} strokeWidth={2} />
                  </motion.div>
                  <span style={{ fontSize: isMobile ? '0.78rem' : '0.95rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                    {v.genre}
                  </span>
                </div>

                { }
                {!isMobile && (
                  <p style={{ margin: 0, fontSize: '0.76rem', fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.62)', lineHeight: 1.55, zIndex: 1 }}>
                    {v.desc}
                  </p>
                )}

                { }
                <div style={{ display: 'flex', gap: '5px', zIndex: 1, flexWrap: 'wrap' }}>
                  {v.tags.map((t, ti) => (
                    <span key={ti} style={{ fontSize: isMobile ? '0.72rem' : '0.68rem', padding: '3px 10px', borderRadius: '20px', background: v.chipBg, color: v.accent, border: `1px solid ${v.border}`, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.04em' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      { }
      {!isMobile && <div style={{ flex: '0 0 46%' }} />}
    </section>
  );
}
