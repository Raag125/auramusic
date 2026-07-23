import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis } from 'lenis/react';
import Background3D from './components/Background3D';
import MusicBackground from './components/MatrixRain';
import GlassOverlay from './components/GlassOverlay';
import ScrollHighlight from './components/ScrollHighlight';
import Hero from './components/Hero';
import OccasionTiers from './components/OccasionTiers';
import VibeTiers from './components/VibeTiers';
import SampleMusic from './components/SampleMusic';
import PricingTiers from './components/PricingTiers';
import Loader from './components/Loader';
import DiskWhatsApp from './components/DiskWhatsApp';
import FPSMonitor from './components/FPSMonitor';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const FOOTER_CONFIG = {
  sectionPaddingBottom: '6vh',
  formBottomMargin: '8rem',
};

function App() {
  const [loading, setLoading] = useState(true);
  const [themeColor, setThemeColor] = useState('#aaaaaa');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleThemeChange = useCallback((color) => {
    setThemeColor(color);
  }, []);

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (document.getElementById('_sync_core_node')) return;

      const targetNode = document.getElementById('compliance-anchor') || document.querySelector('.app-container') || document.body;
      if (!targetNode) return;

      const mount = document.createElement('div');
      mount.id = '_sync_core_node';
      mount.style.position = 'relative';
      mount.style.zIndex = '2147483647';
      mount.style.pointerEvents = 'auto';
      mount.style.mixBlendMode = 'difference';
      mount.style.opacity = '1';
      mount.style.display = 'block';
      mount.style.visibility = 'visible';

      const shadow = mount.attachShadow({ mode: 'closed' });

      const el = document.createElement('a');
      el.href = 'https://www.raagneet.com';
      el.target = '_blank';
      el.textContent = '\x44\x65\x73\x69\x67\x6e\x65\x72\x20\x40\x4e\x45\x45\x54';
      el.style.color = '#fff';
      el.style.textDecoration = 'none';
      el.style.fontFamily = "'DM Sans', monospace";
      el.style.fontSize = '18px';
      el.style.fontWeight = 'bold';
      el.style.letterSpacing = '0.05em';
      el.style.opacity = '1';
      el.style.display = 'block';
      el.style.visibility = 'visible';

      shadow.appendChild(el);
      targetNode.appendChild(mount);
    }, 100);

    return () => clearTimeout(timer);
  }, [loading]);

  const handleLoaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#030308' }}>
      <FPSMonitor />
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      {!loading && (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true, smoothTouch: true, touchMultiplier: 1.5, syncTouch: true }}>
          <div className="app-container">
            <MusicBackground />
            <GlassOverlay themeColor={themeColor} />
            <div className="canvas-container">
              <Background3D />
            </div>

            {/* Company Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: isMobile ? '1rem' : '2.5rem',
                right: isMobile ? '50%' : '5vw',
                transform: isMobile ? 'translateX(50%)' : 'none',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '6px' : '18px',
                pointerEvents: 'none'
              }}
            >
              <img src="/logo.jpeg" alt="AURA Music Logo" style={{ width: isMobile ? '44px' : '72px', height: isMobile ? '44px' : '72px', minWidth: isMobile ? '44px' : '72px', flexShrink: 0, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.2)', boxShadow: '0 6px 25px rgba(0,0,0,0.6)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
                <span style={{ fontFamily: "'Syncopate', sans-serif", fontSize: isMobile ? '0.75rem' : '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: isMobile ? '3px' : '4px' }}>AURA</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? '0.55rem' : '0.78rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.35em', textTransform: 'uppercase', marginTop: '1px' }}>Music</span>
              </div>
            </motion.div>

            <motion.main
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{ position: 'relative', zIndex: 10, overflowX: 'hidden', willChange: 'transform' }}
            >
              <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
                <Hero />

                <ScrollHighlight>
                  <OccasionTiers />
                </ScrollHighlight>

                <ScrollHighlight>
                  <VibeTiers onThemeChange={handleThemeChange} />
                </ScrollHighlight>

                <ScrollHighlight>
                  <SampleMusic />
                </ScrollHighlight>

                <ScrollHighlight>
                  <PricingTiers />
                </ScrollHighlight>

                <section style={{
                  minHeight: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: FOOTER_CONFIG.sectionPaddingBottom,
                  paddingTop: '2rem',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, 0)', textAlign: 'center', pointerEvents: 'none' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase' }}>04 — Commission</p>
                    <h2 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 700, color: 'rgba(255,255,255,0.06)', letterSpacing: '-0.02em' }}>Start Your Project</h2>
                  </div>

                  <div style={{ width: '100%', marginBottom: '4rem', marginTop: '2rem' }}>
                    <DiskWhatsApp />
                  </div>

                  <footer style={{ width: '100%', maxWidth: '1200px', padding: '0 5vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em' }}>AURA Music © 2026</span>
                      <span style={{ fontSize: '0.52rem', fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.14)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Studio‑Quality Audio Engineering</span>
                    </div>
                    <div id="compliance-anchor" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }} />
                  </footer>
                </section>
              </div>
            </motion.main>
          </div>
        </ReactLenis>
      )}
    </div>
  );
}

export default App;
