import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MessageCircle, Mic, ArrowRight } from 'lucide-react';

const CONFIG = {
  w: 900,
  accent: '#25d366'
};

export default function DiskWhatsApp() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);

  const onSend = (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(`Hi, I'm ${name}. ${msg}`)}`, '_blank');
    setSent(true);
    setTimeout(() => { setSent(false); setName(''); setMsg(''); }, 3000);
  };

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: '4rem 0 2rem',
      position: 'relative',
      zIndex: 20
    }}>
      <motion.div
        style={{
          width: `${CONFIG.w}px`,
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          maxWidth: '92vw'
        }}
      >
        {}
        <div className="wa-form-container" style={{
          position: 'relative',
          zIndex: 1,
          background: '#07070c',
          backdropFilter: 'none',
          borderRadius: '24px',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
        }}>
          
          {}
          <div className="wa-form-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '14px',
                background: 'rgba(37, 211, 102, 0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Mic size={20} color={CONFIG.accent} />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Direct Connection</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontFamily: "'DM Sans', sans-serif" }}>Send a message to start your project</p>
              </div>
            </div>

            {}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '22px' }}>
              {[1,2,3,4,5,6].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: ['4px', '20px', '8px', '22px', '4px'] }}
                  transition={{ duration: 0.7 + (i*0.12), repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: '3px', background: CONFIG.accent, borderRadius: '4px', opacity: 0.4 }}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', padding: '1.5rem 0' }}
              >
                <h4 style={{ color: CONFIG.accent, margin: '0 0 0.5rem', fontSize: '1.2rem' }}>Message Sent!</h4>
                <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '0.85rem' }}>Redirecting to WhatsApp...</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="wa-form-row"
                onSubmit={onSend}
                style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-end' }}
              >
                {}
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Identity</label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="rgba(255,255,255,0.15)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text" required value={name} onChange={e => setName(e.target.value)}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                      placeholder="Your identity"
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${focused === 'name' ? 'rgba(37,211,102,0.42)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '15px',
                        padding: '16px 16px 16px 50px',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </div>
                </div>

                {}
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Your Vibe</label>
                  <div style={{ position: 'relative' }}>
                    <MessageCircle size={15} color="rgba(255,255,255,0.15)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text" required value={msg} onChange={e => setMsg(e.target.value)}
                      onFocus={() => setFocused('msg')} onBlur={() => setFocused(null)}
                      placeholder="Tell us about the project..."
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${focused === 'msg' ? 'rgba(37,211,102,0.42)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '15px',
                        padding: '16px 16px 16px 50px',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </div>
                </div>

                {}
                <motion.button
                  className="wa-form-button"
                  whileHover={{ scale: 1.05, background: CONFIG.accent, color: '#000' }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  style={{
                    height: '56px',
                    padding: '0 2.5rem',
                    borderRadius: '15px',
                    border: `1px solid ${CONFIG.accent}`,
                    background: 'transparent',
                    color: CONFIG.accent,
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  Connect <ArrowRight size={18} />
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
