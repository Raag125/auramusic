import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Shield, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Essential',
    price: '499',
    icon: Shield,
    accent: '#5b8af0',
    bg: 'rgba(91,138,240,0.08)',
    border: 'rgba(91,138,240,0.3)',
    solid: 'rgba(15, 24, 53, 0.95)',
    popular: false,
    features: [
      'Standard Audio Quality',
      'Delivery in 1-2 Days',
      'MP3 Format',
      'Basic Mixing',
      'Email Support'
    ]
  },
  {
    name: 'Professional',
    price: '999',
    icon: Star,
    accent: '#f05080',
    bg: 'rgba(240,80,128,0.08)',
    border: 'rgba(240,80,128,0.3)',
    solid: 'rgba(32, 10, 18, 0.95)',
    popular: true,
    features: [
      'Everything in Essential, plus:',
      'High-Quality Audio',
      'Delivery in 1 Day',
      'WAV + MP3 Formats',
      'Separate Stems',
      'Advanced Mixing & Mastering',
      'Custom Sound Design'
    ]
  },
  {
    name: 'Ultimate',
    price: '1499',
    icon: Zap,
    accent: '#2dd4bf',
    bg: 'rgba(45,212,191,0.08)',
    border: 'rgba(45,212,191,0.3)',
    solid: 'rgba(4, 23, 20, 0.95)',
    popular: false,
    features: [
      'Everything in Professional, plus:',
      'Studio Master Quality',
      'Same Day Delivery (Few Hours)',
      'All Audio Formats',
      'Project File Included',
      'Priority 24/7 Support',
      'Live 1-on-1 Feedback',
      'Lifetime Backup'
    ]
  }
];

export default function PricingTiers() {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section style={{
      minHeight: 'auto',
      padding: isMobile ? '8vh 5vw' : '8vh 5vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p style={{ margin: 0, fontSize: '0.68rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.38)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', fontWeight: 500 }}>
          03.5 — Pricing Plans
        </p>
        <h2 style={{ margin: '6px 0 0', fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
          Simple, Transparent Pricing
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '2rem',
        width: '100%',
        maxWidth: '1100px'
      }}>
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          const isHov = hovered === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: isMobile ? "0px" : "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              whileHover={{ y: -10 }}
              style={{
                border: `1px solid ${isHov ? plan.accent : plan.border}`,
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                position: 'relative',
                background: plan.solid,
                backdropFilter: isMobile ? 'none' : 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                boxShadow: isHov ? `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${plan.bg}` : '0 10px 30px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: plan.accent,
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  Most Popular
                </div>
              )}

              {/* Glow Effect */}
              {!isMobile && (
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  background: `radial-gradient(circle, ${plan.bg.replace('0.08', isHov ? '0.4' : '0.2')}, transparent 70%)`,
                  pointerEvents: 'none'
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: plan.bg.replace('0.08', '0.2'),
                  border: `1px solid ${plan.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} color={plan.accent} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 600, color: '#fff' }}>{plan.name}</h3>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>₹{plan.price}</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: feature.startsWith('Everything') ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: feature.startsWith('Everything') ? 700 : 400, fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>
                    <Check size={16} color={plan.accent} />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02, background: plan.accent, color: '#000' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  window.open(`https://wa.me/919425673599?text=${encodeURIComponent(`Hi, I'm interested in the ${plan.name} plan at ₹${plan.price}.`)}`, '_blank');
                }}
                style={{
                  marginTop: '2.5rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: `1px solid ${plan.accent}`,
                  background: 'transparent',
                  color: plan.accent,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.3s ease',
                  width: '100%'
                }}
              >
                Choose {plan.name}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
