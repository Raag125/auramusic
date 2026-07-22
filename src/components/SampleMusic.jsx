import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, SkipBack, SkipForward } from 'lucide-react';
import { diskState } from '../systems/diskPosition';

const WHITE_KEYS = [
  { id: 1, note: 'C', title: 'Baaton Ka Silsila', genre: 'Custom Song', dur: 'Sample', accent: '#7aaaf0', src: '/music/Baaton_ka_silsila.mp3' },
  { id: 2, note: 'D', title: 'Hamesha Tera', genre: 'Custom Song', dur: 'Sample', accent: '#9b6fdd', src: '/music/Hamesha Tera, Hamesha Mera.mp3' },
  { id: 3, note: 'E', title: 'Intezaar', genre: 'Custom Song', dur: 'Sample', accent: '#e09878', src: '/music/Intezaar.mp3' },
  { id: 4, note: 'F', title: 'Jaadu', genre: 'Custom Song', dur: 'Sample', accent: '#50bcd4', src: '/music/Jaadu.mp3' },
  { id: 5, note: 'G', title: 'Khoobsurat Sa Safar', genre: 'Custom Song', dur: 'Sample', accent: '#c8a030', src: '/music/Khoobsurat Sa Safar.mp3' },
  { id: 6, note: 'A', title: 'Mulakat', genre: 'Custom Song', dur: 'Sample', accent: '#50c89a', src: '/music/Mulakat.mp3' },
  { id: 7, note: 'B', title: 'Pehli Mulakat', genre: 'Custom Song', dur: 'Sample', accent: '#a870d0', src: '/music/Pehli_Mulakat.mp3' },
];

const BLACK_KEYS = [
  { id: 8, note: 'C#', title: 'Shuru Hua Tha', genre: 'Custom Song', dur: 'Sample', accent: '#e06070', posIdx: 0, src: '/music/Shuru hua tha rishton ke silsilon mein.mp3' },
  { id: 9, note: 'D#', title: 'Zindagi Ki Kahani', genre: 'Custom Song', dur: 'Sample', accent: '#6880e0', posIdx: 1, src: '/music/Zindagi_ki_kahani.mp3' },
  { id: 10, note: 'F#', title: 'Zindagi Ki Kitaab', genre: 'Custom Song', dur: 'Sample', accent: '#e0a030', posIdx: 2, src: '/music/Zindagi_ki_kitaab_ke _sabse_khoobsurat_panne.mp3' },
  { id: 11, note: 'G#', title: 'Aara', genre: 'Custom Song', dur: 'Sample', accent: '#40d0b8', posIdx: 3, src: '/music/aara.mp3' },
  { id: 12, note: 'A#', title: 'Sapna', genre: 'Custom Song', dur: 'Sample', accent: '#9050c8', posIdx: 4, src: '/music/sapna.mp3' },
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

// ─── MOBILE PIANO TWEAKS ─────────────────────────────────────────────────────
// Edit these values to adjust the piano layout on mobile ONLY.
// Desktop layout is completely unaffected.
//
// NOTE: Because the piano is ROTATED 90° on mobile:
//   - pianoWidth    → controls the VISUAL HEIGHT of the piano on screen
//   - whiteKeyHeight → controls how WIDE / STRETCHED the keys look
//   - blackKeyHeight → controls how wide the black keys look (keep ~60% of whiteKeyHeight)
const MOBILE_PIANO = {
  containerHeight: 680,    // px — outer wrapper height (should roughly match pianoWidth)
  pianoWidth: 680,         // px — visual HEIGHT of the piano on screen when rotated
  whiteKeyHeight: 310,     // px — stretch this to make keys longer/wider
  blackKeyHeight: 185,     // px — stretch this for black keys (keep ~60% of whiteKeyHeight)
  scale: 1.0,              // extra scale factor (keep at 1.0 unless you need fine-tuning)
  translateX: 0,           // px — shift piano left(-) or right(+) after rotation
  translateY: 0,           // px — shift piano up(-) or down(+) after rotation
};
// ─────────────────────────────────────────────────────────────────────────────

export default function SampleMusic() {
  const [playId, setPlayId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const audioRef = useRef(typeof window !== 'undefined' ? new Audio() : null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      setPlayId(null);
      diskState.isPlaying = false;
      diskState.pauseAudio = null;
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const allKeys = [...WHITE_KEYS, ...BLACK_KEYS];

  const play = id => {
    if (playId === id) {
      if (audioRef.current) audioRef.current.pause();
      setPlayId(null);
      diskState.isPlaying = false;
      diskState.pauseAudio = null;
    } else {
      const key = allKeys.find(k => k.id === id);
      if (key && audioRef.current) {
        audioRef.current.src = key.src;
        audioRef.current.play().catch(e => console.log('Audio error:', e));
        diskState.isPlaying = true;
        diskState.pauseAudio = () => {
          if (audioRef.current) audioRef.current.pause();
          setPlayId(null);
          diskState.isPlaying = false;
        };
      }
      setPlayId(id);
    }
  };

  const playNext = () => {
    if (playId === null) {
      play(allKeys[0].id);
      return;
    }
    const currentIndex = allKeys.findIndex(k => k.id === playId);
    const nextIndex = (currentIndex + 1) % allKeys.length;
    const id = allKeys[nextIndex].id;
    if (audioRef.current) {
      audioRef.current.src = allKeys[nextIndex].src;
      audioRef.current.play().catch(e => console.log('Audio error:', e));
      diskState.isPlaying = true;
      diskState.pauseAudio = () => {
        if (audioRef.current) audioRef.current.pause();
        setPlayId(null);
        diskState.isPlaying = false;
      };
    }
    setPlayId(id);
  };

  const playPrev = () => {
    if (playId === null) {
      play(allKeys[allKeys.length - 1].id);
      return;
    }
    const currentIndex = allKeys.findIndex(k => k.id === playId);
    const prevIndex = (currentIndex - 1 + allKeys.length) % allKeys.length;
    const id = allKeys[prevIndex].id;
    if (audioRef.current) {
      audioRef.current.src = allKeys[prevIndex].src;
      audioRef.current.play().catch(e => console.log('Audio error:', e));
      diskState.isPlaying = true;
      diskState.pauseAudio = () => {
        if (audioRef.current) audioRef.current.pause();
        setPlayId(null);
        diskState.isPlaying = false;
      };
    }
    setPlayId(id);
  };

  const activeKey = allKeys.find(k => k.id === playId);
  const activeRgb = activeKey ? toRgb(activeKey.accent) : null;

  return (
    <section className="responsive-tier-section" style={{ minHeight: 'auto', padding: isMobile ? '6vh 0 5vh' : '6vh 3vw 5vh', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

      { }
      <div style={{ alignSelf: 'flex-start', marginBottom: isMobile ? '4rem' : '2.2rem', paddingLeft: isMobile ? '5vw' : '0.5vw' }}>
        <p style={{ margin: 0, fontSize: '0.62rem', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase' }}>
          03 — Concert Series
        </p>
        <h2 style={{ margin: '5px 0 0', fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
          Listen to Our Work
        </h2>
      </div>

      <div style={{
        width: '100%',
        height: isMobile ? `${MOBILE_PIANO.containerHeight}px` : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: isMobile ? '0' : '30px'
      }}>
        <div style={{
          minWidth: isMobile ? 'auto' : '850px',
          width: isMobile ? `${MOBILE_PIANO.pianoWidth}px` : '100%',
          maxWidth: '1340px',
          display: 'flex',
          flexDirection: 'column',
          transform: isMobile
            ? `rotate(90deg) scale(${MOBILE_PIANO.scale}) translate(${MOBILE_PIANO.translateX}px, ${MOBILE_PIANO.translateY}px)`
            : 'none',
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
            { }
            <div style={{ height: '10px', marginBottom: '16px', background: 'linear-gradient(90deg, rgba(180,140,60,0.06), rgba(200,160,80,0.2), rgba(180,140,60,0.06))', borderRadius: '5px', border: '1px solid rgba(200,160,80,0.14)' }} />

            { }
            <div style={{ position: 'relative' }}>
              { }
              <div style={{ display: 'flex', gap: '2px', height: `${isMobile ? MOBILE_PIANO.whiteKeyHeight : WK_H}px` }}>
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
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)',
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

              { }
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
                      top: 0, width: `${BK_W}%`, height: `${isMobile ? MOBILE_PIANO.blackKeyHeight : BK_H}px`,
                      background: isPlaying
                        ? `linear-gradient(180deg, #282828 0%, rgba(${r},0.35) 55%, #060606 100%)`
                        : 'linear-gradient(180deg, #2c2c2c 0%, #161616 45%, #050505 100%)',
                      borderRadius: '0 0 10px 10px',
                      cursor: 'pointer', zIndex: 20, overflow: 'hidden',
                      border: isPlaying ? `1px solid rgba(${r},0.5)` : '1px solid rgba(30,30,30,0.8)',
                      borderTop: 'none',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '0 3px 10px',
                      transition: 'background 0.35s, border-color 0.3s',
                      willChange: 'transform, opacity',
                      transform: 'translateZ(0)',
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

            { }
            <div style={{ height: '18px', background: 'linear-gradient(to bottom, #0d0d0d, #060606)', borderTop: '1px solid rgba(200,160,80,0.1)', borderRadius: '0 0 6px 6px' }} />
          </motion.div>
        </div>
      </div>

      {/* Track Display (Placed flat/horizontal on mobile, outside rotated keys) */}
      <motion.div
        className="piano-track-display"
        style={{
          width: isMobile ? '92vw' : '100%',
          maxWidth: '1340px',
          background: 'rgba(6,6,10,0.96)',
          border: '1px solid rgba(200,160,80,0.12)',
          borderTop: isMobile ? '1px solid rgba(200,160,80,0.12)' : 'none',
          borderRadius: isMobile ? '16px' : '0 0 12px 12px',
          padding: isMobile ? '16px 20px' : '12px 28px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? '14px' : '18px',
          backdropFilter: 'blur(10px)',
          marginTop: isMobile ? '25px' : '-30px',
          zIndex: 30,
          boxShadow: isMobile ? '0 15px 35px rgba(0,0,0,0.6)' : 'none',
          alignSelf: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start' }}>
          <motion.div
            animate={activeRgb && !isMobile ? { scale: [1, 1.5, 1], boxShadow: [`0 0 4px rgba(${activeRgb},0.4)`, `0 0 12px rgba(${activeRgb},0.9)`, `0 0 4px rgba(${activeRgb},0.4)`] } : {}}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{ width: '7px', height: '7px', borderRadius: '50%', background: activeKey ? activeKey.accent : 'rgba(200,160,80,0.3)', flexShrink: 0, transition: 'background 0.4s' }}
          />
          <AnimatePresence mode="wait">
            {activeKey ? (
              <motion.div key={activeKey.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>{activeKey.title}</span>
                {!isMobile && <span style={{ fontSize: '0.58rem', fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{activeKey.genre}</span>}
              </motion.div>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(200,160,80,0.38)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Press a key to play
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {activeKey && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif", width: '25px', textAlign: 'right' }}>{formatTime(progress)}</span>
            <input
              type="range"
              className="audio-progress"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              style={{
                flex: 1,
                background: `linear-gradient(to right, ${activeKey.accent} ${(progress / (duration || 1)) * 100}%, rgba(255,255,255,0.1) ${(progress / (duration || 1)) * 100}%)`,
              }}
            />
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif", width: '25px' }}>{formatTime(duration)}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '16px' : '8px', justifyContent: 'center', width: isMobile ? '100%' : 'auto' }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={playPrev} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: isMobile ? '36px' : '28px', height: isMobile ? '36px' : '28px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SkipBack size={isMobile ? 14 : 12} color="rgba(255,255,255,0.7)" />
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => play(playId || allKeys[0].id)} style={{ background: activeKey ? activeKey.accent : 'rgba(255,255,255,0.1)', borderRadius: '50%', width: isMobile ? '42px' : '32px', height: isMobile ? '42px' : '32px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: activeKey ? `0 2px 10px ${activeKey.accent}80` : 'none' }}>
            {playId ? <Pause size={isMobile ? 18 : 14} color="#fff" /> : <Play size={isMobile ? 18 : 14} color="#fff" style={{ marginLeft: '2px' }} />}
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={playNext} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: isMobile ? '36px' : '28px', height: isMobile ? '36px' : '28px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SkipForward size={isMobile ? 14 : 12} color="rgba(255,255,255,0.7)" />
          </motion.button>
        </div>
      </motion.div>

    </section>
  );
}
