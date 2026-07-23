import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MagicRings from './MagicRings';

export default function Loader({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 3;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setFinishing(true);
        setTimeout(onComplete, 1400);
      }
      setPercent(current);
    }, 120);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.02,
        filter: 'blur(8px)',
        transition: {
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#030305',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      }}
    >
      <MagicRings 
        color="#9b4dca" 
        colorTwo="#5ea8c8" 
        speed={1.5} 
        opacity={finishing ? 0.3 : 0.8}
        followMouse={true}
        clickBurst={true}
      />
      <motion.div
        animate={{
          opacity: finishing ? 0 : 1,
          scale: finishing ? 0.95 : 1,
          filter: finishing ? 'blur(4px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '2rem', height: '60px' }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: finishing
                ? ['20%', '10%']
                : ['20%', '100%', '30%', '80%', '20%']
            }}
            transition={{
              duration: finishing ? 0.6 : 1.5,
              repeat: finishing ? 0 : Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
            style={{
              width: '10px',
              backgroundColor: 'var(--accent-1)',
              borderRadius: '20px'
            }}
          />
        ))}
      </div>
      <img src="/logo.jpeg" alt="AURA Music Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.15)', marginBottom: '1.5rem', boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }} />
      <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: '2rem', fontWeight: 700, letterSpacing: '4px' }}>
        AURA
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 400, letterSpacing: '0.55em', color: 'rgba(255,255,255,0.45)', marginTop: '6px', textTransform: 'uppercase' }}>
        Music
      </div>
      <p style={{ marginTop: '1.5rem', color: 'var(--accent-2)', fontFamily: "'Syncopate', sans-serif", fontWeight: 700 }}>
        {percent}%
      </p>
      </motion.div>
    </motion.div>
  );
}
