import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music } from 'lucide-react';

const WHITE_KEYS = [
  { id: 1, note: 'C', title: 'Opus One', genre: 'Symphonic', dur: '3:42', accent: '#7aaaf0' },
  { id: 2, note: 'D', title: 'Midnight Drive', genre: 'Electronic', dur: '4:15', accent: '#9b6fdd' },
  { id: 3, note: 'E', title: 'Velvet Thunder', genre: 'R&B · Soul', dur: '3:18', accent: '#e09878' },
  { id: 4, note: 'F', title: 'Neon Genesis', genre: 'Hip-Hop', dur: '2:55', accent: '#50bcd4' },
  { id: 5, note: 'G', title: 'Golden Archive', genre: 'Jazz', dur: '2:58', accent: '#c8a030' },
  { id: 6, note: 'A', title: 'Crystal Rain', genre: 'Ambient', dur: '5:10', accent: '#50c89a' },
  { id: 7, note: 'B', title: 'Aurora Bloom', genre: 'Orchestral', dur: '4:44', accent: '#a870d0' },
];

const BLACK_KEYS = [
  { id: 8, note: 'C#', title: 'Raw Frequency', genre: 'Industrial', dur: '3:30', accent: '#e06070', posIdx: 0 },
  { id: 9, note: 'D#', title: 'Dark Matter', genre: 'Experimental', dur: '3:55', accent: '#6880e0', posIdx: 1 },
  { id: 10, note: 'F#', title: 'Solar Wind', genre: 'Cinematic', dur: '4:22', accent: '#e0a030', posIdx: 2 },
  { id: 11, note: 'G#', title: 'Neon Pulse', genre: 'Synthwave', dur: '3:10', accent: '#40d0b8', posIdx: 3 },
  { id: 12, note: 'A#', title: 'Deep Echo', genre: 'Dub · Bass', dur: '4:08', accent: '#9050c8', posIdx: 4 },
];

const WHITE_CLIPS = [
  'polygon(0 0, 74% 0, 74% 42%, 100% 42%, 100% 100%, 0 100%)',
  'polygon(26% 0, 74% 0, 74% 42%, 100% 42%, 100% 100%, 0 100%, 0 42%, 26% 42%)',
  'polygon(26% 0, 100% 0, 100% 100%, 0 100%, 0 42%, 26% 42%)',
  'polygon(0 0, 74% 0, 74% 42%, 100% 42%, 100% 100%, 0 100%)',
  'polygon(26% 0, 74% 0, 74% 42%, 100% 42%, 100% 100%, 0 100%, 0 42%, 26% 42%)',
  'polygon(26% 0, 74% 0, 74% 42%, 100% 42%, 100% 100%, 0 100%, 0 42%, 26% 42%)',
  'polygon(26% 0, 100% 0, 100% 100%, 0 100%, 0 42%, 26% 42%)',
];

const BK_LEFTS = [10.1, 24.2, 52.2, 66.3, 80.4];
const BK_W = 8.6;
const WK_H = 285;
const BK_H = 168;

const toRgb = h => `${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)}`;

export default function SampleMusic() {
  const [playId, setPlayId] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const play = id => setPlayId(p => p === id ? null : id);
  const allKeys = [...WHITE_KEYS, ...BLACK_KEYS];
  const activeKey = allKeys.find(k => k.id === playId);
  const activeRgb = activeKey ? toRgb(activeKey.accent) : null;

  return (
    <section className="responsive-tier-section" style={{ minHeight: 'auto', padding: isMobile ? '6vh 0 5vh' : '6vh 3vw 5vh', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

      {}
      <div style={{ alignSelf: 'flex-start', marginBottom: isMobile ? '4rem' : '2.2rem', paddingLeft: isMobile ? '5vw' : '0.5vw' }}>
        <p style={{ margin: 0, fontSize: '0.62rem', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase' }}>
          03 — Concert Series
        </p>
        <h2 style={{ margin: '5px 0 0', fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
          Listen to Our Work
        </h2>
      </div>

      {}
      <div style={{
        width: '100%',
        height: isMobile ? '700px' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '30px'
      }}>
        {}
        <div style={{
          minWidth: '850px',
          width: isMobile ? '700px' : '100%',
          maxWidth: '1340px',
          display: 'flex',
          flexDirection: 'column',
          transform: isMobile ? 'rotate(90deg)' : 'none',
          transformOrigin: 'center',
          transition: 'transform 0.5s ease'
        }}>
          <motion.div
            className="piano-cabinet"
            animate={{
              boxShadow: activeRgb && !isMobile
                ? [
                  `0 40px 100px rgba(0,0,0,0.85), 0 0  10px rgba(${activeRgb},0.05)`,
                  `0 40px 100px rgba(0,0,0,0.85), 0 0  60px rgba(${activeRgb},0.4)`,
                  `0 40px 100px rgba(0,0,0,0.85), 0 0  10px rgba(${activeRgb},0.05)`,
                ]
                : '0 20px 50px rgba(0,0,0,0.85)',
            }}
            transition={activeRgb && !isMobile ? { repeat: Infinity, duration: 1.6, ease: 'easeInOut' } : { duration: 0.6 }}
            style={{
              width: '100%',
              background: 'linear-gradient(160deg, #111 0%, #080808 60%, #050505 100%)',
              borderRadius: '16px 16px 6px 6px',
              padding: '20px 20px 0',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {}
            <div style={{ height: '10px', marginBottom: '16px', background: 'linear-gradient(90deg, rgba(180,140,60,0.06), rgba(200,160,80,0.2), rgba(180,140,60,0.06))', borderRadius: '5px', border: '1px solid rgba(200,160,80,0.14)' }} />

            {}
            <div style={{ position: 'relative' }}>
              {}
              <div style={{ display: 'flex', gap: '2px', height: `${WK_H}px` }}>
                {WHITE_KEYS.map((t, i) => {
                  const isPlaying = playId === t.id;
                  const r = toRgb(t.accent);
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: i * 0.06 }}
                      whileTap={{ y: 7, transition: { duration: 0.07, ease: 'easeOut' } }}
                      onClick={() => play(t.id)}
                      animate={isPlaying && !isMobile ? {
                        boxShadow: [
                          `inset -1px 0 0 rgba(255,255,255,0.55), inset 0 -4px 0 rgba(0,0,0,0.2), 0 0 12px rgba(${r},0.3)`,
                          `inset -1px 0 0 rgba(255,255,255,0.55), inset 0 -4px 0 rgba(0,0,0,0.2), 0 0 32px rgba(${r},0.75), 0 0 8px rgba(${r},0.4)`,
                          `inset -1px 0 0 rgba(255,255,255,0.55), inset 0 -4px 0 rgba(0,0,0,0.2), 0 0 12px rgba(${r},0.3)`,
                        ],
                      } : {
                        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.55), inset 1px 0 0 rgba(0,0,0,0.07), inset 0 -4px 0 rgba(0,0,0,0.22), 3px 5px 10px rgba(0,0,0,0.35)',
                      }}
                      style={{
                        flex: 1, height: '100%',
                        clipPath: WHITE_CLIPS[i],
                        background: isPlaying
                          ? `linear-gradient(180deg, #fffdf8 0%, rgba(${r},0.12) 50%, #ede5d8 100%)`
                          : 'linear-gradient(180deg, #fffdf8 0%, #f5ede0 65%, #e8ddd0 100%)',
                        cursor: 'pointer', position: 'relative', overflow: 'hidden',
                        borderLeft: '1px solid rgba(150,130,100,0.3)',
                        borderRight: '1px solid rgba(100,80,60,0.2)',
                        borderBottom: `3px solid ${isPlaying ? t.accent : 'rgba(100,80,60,0.45)'}`,
                        borderRadius: '0 0 6px 6px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '14px',
                        transition: 'background 0.35s, border-bottom-color 0.3s',
                      }}
                    >
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.15))', pointerEvents: 'none' }} />
                      <AnimatePresence>
                        {isPlaying && !isMobile && (
                          <motion.div
                            key="glow"
                            initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.9, 0.3] }} exit={{ opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                            style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 35%, rgba(${r},0.35), transparent 68%)`, pointerEvents: 'none' }}
                          />
                        )}
                      </AnimatePresence>
                      <div style={{ display: 'flex', flex: 1 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', padding: '0 4px', marginBottom: isMobile ? '10px' : 0 }}>
                        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.83rem', color: isPlaying ? t.accent : '#2a2018', letterSpacing: '-0.01em', whiteSpace: 'nowrap', transition: 'color 0.3s' }}>
                          {t.title}
                        </span>
                        <motion.div
                          animate={isPlaying && !isMobile ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                          transition={isPlaying && !isMobile ? { repeat: Infinity, duration: 1.6 } : {}}
                          style={{ width: '30px', height: '30px', borderRadius: '50%', background: isPlaying ? t.accent : 'rgba(0,0,0,0.1)', border: `1.5px solid ${isPlaying ? t.accent : 'rgba(0,0,0,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: isPlaying && !isMobile ? `0 4px 14px rgba(${r},0.65)` : 'none', transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s', transform: isMobile ? 'rotate(-90deg)' : 'none' }}>
                          {isPlaying ? <Pause size={11} color="#fff" fill="#fff" /> : <Play size={11} color="rgba(0,0,0,0.4)" fill="rgba(0,0,0,0.4)" style={{ marginLeft: '1px' }} />}
                        </motion.div>
                        {!isMobile && <span style={{ fontSize: '0.52rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: 'rgba(0,0,0,0.2)', letterSpacing: '0.1em' }}>{t.note}</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {}
              {BLACK_KEYS.map((t, bi) => {
                const isPlaying = playId === t.id;
                const r = toRgb(t.accent);
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.26 + bi * 0.07 }}
                    whileTap={{ y: 6, transition: { duration: 0.07, ease: 'easeOut' } }}
                    onClick={() => play(t.id)}
                    animate={isPlaying && !isMobile ? {
                      boxShadow: [
                        `3px 0 6px rgba(0,0,0,0.75), -3px 0 6px rgba(0,0,0,0.75), 0 16px 24px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.1), 0 0 14px rgba(${r},0.4)`,
                        `3px 0 6px rgba(0,0,0,0.75), -3px 0 6px rgba(0,0,0,0.75), 0 16px 24px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.1), 0 0 40px rgba(${r},0.8)`,
                        `3px 0 6px rgba(0,0,0,0.75), -3px 0 6px rgba(0,0,0,0.75), 0 16px 24px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.1), 0 0 14px rgba(${r},0.4)`,
                      ],
                    } : { boxShadow: '3px 0 6px rgba(0,0,0,0.75), -3px 0 6px rgba(0,0,0,0.75), 0 16px 24px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.1)' }}
                    style={{
                      position: 'absolute',
                      left: `calc(${BK_LEFTS[bi]}% + 1px)`,
                      top: 0, width: `${BK_W}%`, height: `${BK_H}px`,
                      background: isPlaying
                        ? `linear-gradient(180deg, #282828 0%, rgba(${r},0.35) 55%, #060606 100%)`
                        : 'linear-gradient(180deg, #2c2c2c 0%, #161616 45%, #050505 100%)',
                      borderRadius: '0 0 10px 10px',
                      cursor: 'pointer', zIndex: 20, overflow: 'hidden',
                      border: isPlaying ? `1px solid rgba(${r},0.5)` : '1px solid rgba(30,30,30,0.8)',
                      borderTop: 'none',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '0 3px 10px',
                      transition: 'background 0.35s, border-color 0.3s',
                    }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '38%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.11), rgba(255,255,255,0.02))', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px', background: 'rgba(255,255,255,0.18)', borderRadius: '0 0 2px 2px' }} />
                    <AnimatePresence>
                      {isPlaying && !isMobile && (
                        <motion.div key="bk-glow"
                          initial={{ opacity: 0 }} animate={{ opacity: [0.2, 0.8, 0.2] }} exit={{ opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                          style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 40%, rgba(${r},0.4), transparent 70%)`, pointerEvents: 'none' }} />
                      )}
                    </AnimatePresence>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: isMobile ? '8px' : 0 }}>
                      <motion.div
                        animate={isPlaying && !isMobile ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={isPlaying && !isMobile ? { repeat: Infinity, duration: 1.6 } : {}}
                        style={{ width: '22px', height: '22px', borderRadius: '50%', background: isPlaying ? t.accent : 'rgba(255,255,255,0.08)', border: `1px solid ${isPlaying ? t.accent : 'rgba(255,255,255,0.18)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: isPlaying && !isMobile ? `0 3px 10px rgba(${r},0.7)` : 'none', transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s', transform: isMobile ? 'rotate(-90deg)' : 'none' }}>
                        {isPlaying ? <Pause size={8} color="#fff" fill="#fff" /> : <Play size={8} color="rgba(255,255,255,0.45)" fill="rgba(255,255,255,0.45)" style={{ marginLeft: '1px' }} />}
                      </motion.div>
                      {!isMobile && <span style={{ fontSize: '0.44rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: isPlaying ? `rgba(${r},0.8)` : 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', marginTop: '3px', transition: 'color 0.3s' }}>{t.note}</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {}
            <div style={{ height: '18px', background: 'linear-gradient(to bottom, #0d0d0d, #060606)', borderTop: '1px solid rgba(200,160,80,0.1)' }} />
          </motion.div>

          {}
          <motion.div className="piano-track-display" style={{ width: '100%', background: 'rgba(6,6,10,0.96)', border: '1px solid rgba(200,160,80,0.12)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '18px', backdropFilter: 'blur(10px)' }}>
            <motion.div
              animate={activeRgb && !isMobile ? { scale: [1, 1.5, 1], boxShadow: [`0 0 4px rgba(${activeRgb},0.4)`, `0 0 12px rgba(${activeRgb},0.9)`, `0 0 4px rgba(${activeRgb},0.4)`] } : {}}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              style={{ width: '7px', height: '7px', borderRadius: '50%', background: activeKey ? activeKey.accent : 'rgba(200,160,80,0.3)', flexShrink: 0, transition: 'background 0.4s' }}
            />
            <AnimatePresence mode="wait">
              {activeKey ? (
                <motion.div key={activeKey.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>{activeKey.title}</span>
                  {!isMobile && <span style={{ fontSize: '0.58rem', fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{activeKey.genre}</span>}
                  {!isMobile && <span style={{ fontSize: '0.6rem', fontFamily: "'DM Sans', sans-serif", color: activeKey.accent }}>{activeKey.note} · {activeKey.dur}</span>}
                </motion.div>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(200,160,80,0.38)', letterSpacing: '0.18em', textTransform: 'uppercase', flex: 1 }}>
                  Press a key to play
                </motion.span>
              )}
            </AnimatePresence>
            <Music size={13} color="rgba(200,160,80,0.28)" />
          </motion.div>
        </div>
      </div>

    </section>
  );
}
