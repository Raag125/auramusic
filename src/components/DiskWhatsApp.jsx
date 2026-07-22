import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mic, ArrowRight, MessageSquare, CheckCircle2 } from 'lucide-react';

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
      padding: '4rem 1rem 3rem',
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
          borderRadius: '28px',
          maxWidth: '100%'
        }}
      >
        {/* Background Ambient Aura Glow */}
        <div style={{
          position: 'absolute',
          inset: '-20px',
          background: 'radial-gradient(ellipse at center, rgba(37, 211, 102, 0.12) 0%, rgba(18, 140, 126, 0.04) 50%, transparent 75%)',
          filter: 'blur(30px)',
          borderRadius: '40px',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Main Card Container */}
        <div className="wa-form-container" style={{
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(145deg, rgba(13, 15, 22, 0.95), rgba(7, 8, 12, 0.98))',
          borderRadius: '28px',
          padding: '2.8rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          border: '1px solid rgba(37, 211, 102, 0.2)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(37, 211, 102, 0.08), inset 0 1px 0 rgba(255,255,255,0.08)'
        }}>
          
          {/* Header Section */}
          <div className="wa-form-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                position: 'relative',
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(18, 140, 126, 0.1))',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(37, 211, 102, 0.15)'
              }}>
                <MessageSquare size={24} color={CONFIG.accent} />
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: CONFIG.accent,
                  boxShadow: `0 0 10px ${CONFIG.accent}`
                }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em' }}>
                    Direct Connection
                  </h3>
                  <span style={{
                    fontSize: '0.62rem',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    color: CONFIG.accent,
                    background: 'rgba(37, 211, 102, 0.12)',
                    border: '1px solid rgba(37, 211, 102, 0.25)',
                    padding: '3px 9px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    Instant WhatsApp
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif" }}>
                  Connect with us directly for fast quotes, customized tracks & project inquiries.
                </p>
              </div>
            </div>

            {/* Live Visualizer Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
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
                  borderRadius: '20px',
                  border: '1px solid rgba(37, 211, 102, 0.2)'
                }}
              >
                <CheckCircle2 size={40} color={CONFIG.accent} style={{ marginBottom: '10px' }} />
                <h4 style={{ color: '#fff', margin: '0 0 0.4rem', fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif" }}>Opening WhatsApp...</h4>
                <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>
                  Your details have been prepared. Please tap send in WhatsApp to start chatting!
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="wa-form-row"
                onSubmit={onSend}
                style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-end' }}
              >
                {/* Name Input */}
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', textAlign: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                    Your Name
                  </label>
                  <div style={{ position: 'relative' }}>
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
                        borderRadius: '16px',
                        padding: '16px 16px 16px 48px',
                        color: '#fff',
                        fontSize: '0.95rem',
                        fontFamily: "'DM Sans', sans-serif",
                        outline: 'none',
                        boxShadow: focused === 'name' ? `0 0 15px rgba(37, 211, 102, 0.2)` : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Contact Number Input */}
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', textAlign: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                    Your Contact Number
                  </label>
                  <div style={{ position: 'relative' }}>
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
                        borderRadius: '16px',
                        padding: '16px 16px 16px 48px',
                        color: '#fff',
                        fontSize: '0.95rem',
                        fontFamily: "'DM Sans', sans-serif",
                        outline: 'none',
                        boxShadow: focused === 'phone' ? `0 0 15px rgba(37, 211, 102, 0.2)` : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                  <motion.button
                    className="wa-form-button"
                    whileHover={{ scale: 1.03, boxShadow: `0 10px 25px rgba(37, 211, 102, 0.35)` }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    style={{
                      height: '54px',
                      padding: '0 2.2rem',
                      borderRadius: '16px',
                      border: 'none',
                      background: `linear-gradient(135deg, ${CONFIG.accent}, ${CONFIG.accentDark})`,
                      color: '#000',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontFamily: "'Outfit', sans-serif",
                      transition: 'all 0.3s ease',
                      boxShadow: '0 5px 15px rgba(37, 211, 102, 0.2)'
                    }}
                  >
                    Connect <ArrowRight size={18} color="#000" />
                  </motion.button>
                  <div style={{ textAlign: 'center', fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif" }}>
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
