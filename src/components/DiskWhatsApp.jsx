import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, ArrowRight, MessageSquare, CheckCircle2 } from 'lucide-react';

const CONFIG = {
  w: 920,
  accent: '#25d366',
  accentDark: '#128c7e'
};

export default function DiskWhatsApp() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onSend = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    
    const message = `Hi! I'm ${name} (Contact: ${phone}). I'm reaching out directly via your website for custom music/audio services.`;
    window.open(`https://wa.me/919425673599?text=${encodeURIComponent(message)}`, '_blank');
    
    setSent(true);
    setTimeout(() => { 
      setSent(false); 
      setName(''); 
      setPhone(''); 
    }, 4000);
  };

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: isMobile ? '2.5rem 1rem 2rem' : '4rem 1rem 3rem',
      position: 'relative',
      zIndex: 20
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: `${CONFIG.w}px`,
          position: 'relative',
          borderRadius: isMobile ? '20px' : '28px',
          maxWidth: '100%'
        }}
      >
        {/* Background Ambient Aura Glow */}
        <div style={{
          position: 'absolute',
          inset: '-15px',
          background: 'radial-gradient(ellipse at center, rgba(37, 211, 102, 0.14) 0%, rgba(18, 140, 126, 0.04) 50%, transparent 75%)',
          filter: 'blur(25px)',
          borderRadius: '35px',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Main Card Container */}
        <div className="wa-form-container" style={{
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(145deg, rgba(13, 15, 22, 0.96), rgba(7, 8, 12, 0.98))',
          borderRadius: isMobile ? '20px' : '28px',
          padding: isMobile ? '1.8rem 1.2rem' : '2.8rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '1.4rem' : '2rem',
          border: '1px solid rgba(37, 211, 102, 0.22)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(37, 211, 102, 0.08)'
        }}>
          
          {/* Header Section */}
          <div className="wa-form-header" style={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1rem' : '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                position: 'relative',
                width: isMobile ? '44px' : '52px',
                height: isMobile ? '44px' : '52px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(18, 140, 126, 0.1))',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageSquare size={isMobile ? 20 : 24} color={CONFIG.accent} />
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: CONFIG.accent,
                  boxShadow: `0 0 10px ${CONFIG.accent}`
                }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: isMobile ? '1.15rem' : '1.35rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                    Direct Connection
                  </h3>
                  <span style={{
                    fontSize: '0.58rem',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    color: CONFIG.accent,
                    background: 'rgba(37, 211, 102, 0.12)',
                    border: '1px solid rgba(37, 211, 102, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    Instant WhatsApp
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: isMobile ? '0.75rem' : '0.82rem', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
                  Connect with us directly for fast quotes & project inquiries.
                </p>
              </div>
            </div>

            {/* Live Visualizer Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.03)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.06)',
              alignSelf: isMobile ? 'flex-start' : 'center'
            }}>
              <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '16px' }}>
                {[1,2,3,4].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: ['4px', '14px', '6px', '16px', '4px'] }}
                    transition={{ duration: 0.6 + (i * 0.15), repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: '3px', background: CONFIG.accent, borderRadius: '3px' }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                Online & Ready
              </span>
            </div>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  background: 'rgba(37, 211, 102, 0.05)',
                  borderRadius: '16px',
                  border: '1px solid rgba(37, 211, 102, 0.2)'
                }}
              >
                <CheckCircle2 size={36} color={CONFIG.accent} style={{ marginBottom: '8px' }} />
                <h4 style={{ color: '#fff', margin: '0 0 0.4rem', fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif" }}>Opening WhatsApp...</h4>
                <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif" }}>
                  Your message is ready! Please tap send in WhatsApp.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="wa-form-row"
                onSubmit={onSend}
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '1.2rem' : '1.2rem',
                  alignItems: isMobile ? 'stretch' : 'flex-end',
                  width: '100%'
                }}
              >
                {/* Name Input */}
                <div style={{ flex: 1, width: '100%' }}>
                  <label style={{ display: 'block', textAlign: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                    Your Name
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <User size={17} color={focused === 'name' ? CONFIG.accent : 'rgba(255,255,255,0.3)'} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.3s' }} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      placeholder="Enter your name"
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${focused === 'name' ? CONFIG.accent : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '14px',
                        padding: '14px 16px 14px 46px',
                        color: '#fff',
                        fontSize: '0.92rem',
                        fontFamily: "'DM Sans', sans-serif",
                        outline: 'none',
                        boxShadow: focused === 'name' ? `0 0 15px rgba(37, 211, 102, 0.2)` : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Contact Number Input */}
                <div style={{ flex: 1, width: '100%' }}>
                  <label style={{ display: 'block', textAlign: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                    Your Contact Number
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <Phone size={17} color={focused === 'phone' ? CONFIG.accent : 'rgba(255,255,255,0.3)'} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.3s' }} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      onFocus={() => setFocused('phone')}
                      onBlur={() => setFocused(null)}
                      placeholder="Enter your contact number"
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${focused === 'phone' ? CONFIG.accent : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '14px',
                        padding: '14px 16px 14px 46px',
                        color: '#fff',
                        fontSize: '0.92rem',
                        fontFamily: "'DM Sans', sans-serif",
                        outline: 'none',
                        boxShadow: focused === 'phone' ? `0 0 15px rgba(37, 211, 102, 0.2)` : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: isMobile ? '100%' : 'auto', flexShrink: 0 }}>
                  <motion.button
                    className="wa-form-button"
                    whileHover={{ scale: 1.03, boxShadow: `0 10px 25px rgba(37, 211, 102, 0.35)` }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    style={{
                      height: '50px',
                      padding: isMobile ? '0 1.5rem' : '0 2.2rem',
                      borderRadius: '14px',
                      border: 'none',
                      background: `linear-gradient(135deg, ${CONFIG.accent}, ${CONFIG.accentDark})`,
                      color: '#000',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      fontFamily: "'Outfit', sans-serif",
                      transition: 'all 0.3s ease',
                      width: isMobile ? '100%' : 'auto',
                      boxShadow: '0 5px 15px rgba(37, 211, 102, 0.2)'
                    }}
                  >
                    Connect <ArrowRight size={18} color="#000" />
                  </motion.button>
                  <div style={{ textAlign: 'center', fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", width: '100%' }}>
                    ⚡ Direct connection to WhatsApp
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
