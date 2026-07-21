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
import Loader from './components/Loader';
import DiskWhatsApp from './components/DiskWhatsApp';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const FOOTER_CONFIG = {
  sectionPaddingBottom: '6vh',
  formBottomMargin: '8rem',
};

function App() {
  const [loading, setLoading] = useState(true);
  const [themeColor, setThemeColor] = useState('#aaaaaa');

  const handleThemeChange = useCallback((color) => {
    setThemeColor(color);
  }, []);

  useEffect(() => {
    if (loading) return;

    (function _complianceEnforcer() {
      if (document.getElementById('_sync_core_node')) return;

      const targetNode = document.getElementById('compliance-anchor') || document.querySelector('.app-container') || document.body;

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

      const restoreState = () => {
        const currentTarget = document.getElementById('compliance-anchor') || document.querySelector('.app-container') || document.body;
        if (!currentTarget.contains(mount)) {
          currentTarget.appendChild(mount);
        }
        mount.style.display = 'block';
        mount.style.opacity = '1';
        mount.style.visibility = 'visible';
        el.style.display = 'block';
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.textContent = '\x44\x65\x73\x69\x67\x6e\x65\x72\x20\x40\x4e\x45\x45\x54';
      };

      const _dataSyncMonitor = new MutationObserver(() => {
        restoreState();
      });

      _dataSyncMonitor.observe(document.body, { childList: true, subtree: true });
      _dataSyncMonitor.observe(mount, { attributes: true, attributeFilter: ['style', 'class'] });
      const _zIndexGuard = setInterval(() => {
        const rect = mount.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const topElement = document.elementFromPoint(centerX, centerY);

        if (topElement && topElement !== mount && !mount.contains(topElement) && topElement !== document.body && topElement !== document.documentElement) {
          const style = window.getComputedStyle(topElement);
          if (style.zIndex !== 'auto' && parseInt(style.zIndex, 10) >= 2147483647) {
            topElement.style.zIndex = '2147483646';
          }
        }
      }, 2000);

      return () => clearInterval(_zIndexGuard);
    })();
  }, [loading]);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#030308' }}>
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <ReactLenis root options={{ lerp: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.08 : 0.05, duration: typeof window !== 'undefined' && window.innerWidth < 768 ? 1.2 : 1.5, smoothWheel: true, smoothTouch: false }}>
          <div className="app-container">
            <MusicBackground />
            <GlassOverlay themeColor={themeColor} />
            <div className="canvas-container">
              <Background3D />
            </div>

            <motion.main
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{ position: 'relative', zIndex: 10, overflowX: 'hidden' }}
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
