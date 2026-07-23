import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Briefcase, Users, Activity, ChevronRight } from 'lucide-react';

const occasions = [
  {
    category: 'Personal Events', icon: Heart,
    accent: '#f05080', chipBg: 'rgba(240,80,128,0.18)', border: 'rgba(240,80,128,0.4)', solid: '#200a12',
    desc: 'Custom music for milestone life moments — crafted for the people and memories that matter most.',
    examples: ['Wedding', 'Anniversary', 'Birthday', 'Proposal'],
  },
  {
    category: 'Business & Brand', icon: Briefcase,
    accent: '#38bdf8', chipBg: 'rgba(56,189,248,0.18)', border: 'rgba(56,189,248,0.4)', solid: '#071b2a',
    desc: 'Audio identity that speaks before words do. Sound that defines your brand.',
    examples: ['Brand Anthem', 'Podcast Intro', 'Product Launch', 'Event Stinger'],
  },
  {
    category: 'Social Media', icon: Users,
    accent: '#f0850a', chipBg: 'rgba(240,133,10,0.18)', border: 'rgba(240,133,10,0.4)', solid: '#1f0e00',
    desc: 'Platform-ready, engaging tracks designed to retain attention and grow your audience.',
    examples: ['YouTube BGM', 'Reels Hook', 'TikTok Sound', 'Intro Jingle'],
  },
  {
    category: 'Wellness & Focus', icon: Activity,
    accent: '#2dd4bf', chipBg: 'rgba(45,212,191,0.18)', border: 'rgba(45,212,191,0.4)', solid: '#041714',
    desc: 'Frequency-calibrated ambient compositions for clarity, peace and restorative listening.',
    examples: ['Meditation', 'Sleep Aid', 'Yoga Flow', 'Deep Focus'],
  },
];

export default function OccasionTiers() {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section className="responsive-tier-section" style={{
      height: '100vh', padding: '0 5vw',
      display: 'flex', alignItems: 'center',
      position: 'relative', gap: '5vw',
    }}>
      {/* Spacer for 3D Disk */}
      <div className="tier-spacer" style={{ flex: '0 0 46%' }} />

      {/* Cards Container */}
      <div className="responsive-tier-cards" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.6rem', zIndex: 10 }}>
        {/* Header */}
        <div>
          <p style={{ margin: 0, fontSize: '0.68rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.38)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', fontWeight: 500 }}>
            01 — Use Case
          </p>
          <h2 style={{ margin: '6px 0 0', fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.4rem, 2vw, 1.9rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            What's the Occasion?
          </h2>
        </div>

        {/* 2x2 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.95rem' }}>
          {occasions.map((occ, i) => {
            const Icon = occ.icon;
            const isHov = hovered === i;
            return (
              <motion.div
                key={i}
                className="tier-card"
                initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.8, y: isMobile ? 15 : 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: isMobile ? "0px" : "-50px" }}
                transition={{ type: isMobile ? "tween" : "spring", stiffness: 120, damping: 14, duration: isMobile ? 0.35 : undefined, delay: isMobile ? i * 0.04 : i * 0.1 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -6, x: 4 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: occ.solid,
                  backdropFilter: 'none',
                  WebkitBackdropFilter: 'none',
                  border: `1px solid ${isHov ? occ.border.replace('0.4', '0.8') : occ.border}`,
                  borderLeft: `3px solid ${isHov ? occ.accent : occ.border}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'border 0.3s ease',
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                  position: 'relative', overflow: 'hidden',
                  transform: 'translateZ(0)',
                  willChange: 'transform, opacity',
                }}
              >
                {}
                <div style={{ position: 'absolute', bottom: -40, right: -40, width: '130px', height: '130px', background: `radial-gradient(circle, ${occ.chipBg.replace('0.18', isHov ? '0.6' : '0.3')}, transparent 70%)`, pointerEvents: 'none', transition: 'all 0.4s ease' }} />

                {}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="tier-icon" style={{ width: '40px', height: '40px', borderRadius: '11px', background: occ.chipBg, border: `1px solid ${occ.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color={occ.accent} strokeWidth={2} />
                    </div>
                    <span className="tier-title" style={{ fontSize: '1rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                      {occ.category}
                    </span>
                  </div>
                  <motion.div animate={{ x: isHov ? 5 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={17} color={isHov ? occ.accent : 'rgba(255,255,255,0.2)'} strokeWidth={2.5} />
                  </motion.div>
                </div>

                {}
                <p style={{
                  margin: 0, fontSize: '0.83rem',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, zIndex: 1,
                }}>
                  {occ.desc}
                </p>

                {}
                <div style={{ height: '1px', background: occ.border, zIndex: 1 }} />

                {}
                <div style={{ zIndex: 1 }}>
                  <p style={{
                    margin: '0 0 8px',
                    fontSize: '0.64rem', fontFamily: "'DM Sans', sans-serif",
                    textTransform: 'uppercase', letterSpacing: '0.18em',
                    color: occ.accent, fontWeight: 700,
                  }}>
                    Perfect For
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '7px', columnGap: '8px' }}>
                    {occ.examples.map((ex, ei) => (
                      <div key={ei} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        {}
                        <div style={{
                          width: '7px', height: '7px', borderRadius: '50%',
                          background: occ.accent, flexShrink: 0, opacity: 0.85,
                        }} />
                        <span style={{
                          fontSize: '0.88rem',
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 500,
                          color: '#ffffff',
                          letterSpacing: '0.01em',
                          lineHeight: 1.3,
                        }}>
                          {ex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
