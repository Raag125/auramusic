import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { diskState } from '../systems/diskPosition';

const CONFIG = {
  diskRadius: 2.2,
  diskThickness: 0.04,
  labelFaceRadius: 2.1,

  bodyColor: "#111116",
  bodyEmissive: "#04040a",
  returnSpeed: 0.38,
  idleSpinSpeed: 0.025,

  pos_Hero: [2.4, 0.5, 1.1, 0.8, 0.4],
  pos_Tier1: [-2.5, 0.3, 1.8, 0.7, 0.3],
  pos_Tier2: [1.5, 0.4, 2.8, 0.6, 2.3],
  pos_Sample: [0.1, 0.0, 0.2, 0.5, 0.2],
  pos_Bottom: [0, 0.2, 4.5, 0.5, -0.2],
};

const M_CONFIG = {
  pos_Hero: [1.0, 1.3, -1.0, 0.8, 0.2],
  pos_Tier1: [-1.0, -1.0, -1.0, 0.7, 0.3],
  pos_Tier2: [1.0, 1.5, -1.0, 0.6, 1.3],
  pos_Sample: [0, 2.0, -1.0, 0.5, 0.2],
  pos_Bottom: [1.0, 1.0, -1.0, 0.5, -0.2],
};

const drag = {
  active: false,
  mx: 0,
  my: 0,
  diskScreenX: 0,
  diskScreenY: 0,
};

function lerpKF(a, b, t) {
  return [
    THREE.MathUtils.lerp(a[0], b[0], t),
    THREE.MathUtils.lerp(a[1], b[1], t),
    THREE.MathUtils.lerp(a[2], b[2], t),
    THREE.MathUtils.lerp(a[3], b[3], t),
    THREE.MathUtils.lerp(a[4], b[4], t),
  ];
}

/**
 * Creates a high-detail procedural vinyl texture combining:
 * 1. Realistic concentric micro-grooves & track separation bands
 * 2. Radial specular sheen
 * 3. High-resolution AURA Music center label artwork
 * Renders once to canvas texture -> zero per-frame draw call overhead!
 */
function useVinylTexture(side = 'A') {
  return useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const size = isMobile ? 512 : 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (side === 'B') {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    const cx = size / 2;
    const cy = size / 2;
    const fullR = size / 2 - 4;
    const labelR = Math.round(fullR * (1.0 / 2.1));
    const holeR = 20;

    // 1. Vinyl Body Base
    const bgGrad = ctx.createRadialGradient(cx, cy, labelR, cx, cy, fullR);
    bgGrad.addColorStop(0, '#121218');
    bgGrad.addColorStop(0.5, '#0b0b0f');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, fullR, 0, Math.PI * 2);
    ctx.fill();

    // 2. Vinyl Micro-grooves
    ctx.save();
    for (let r = labelR + 8; r < fullR - 6; r += 3) {
      const isTrackGap = (r % 42 < 4);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      if (isTrackGap) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.lineWidth = 2.5;
      } else {
        const even = Math.floor(r / 3) % 2 === 0;
        ctx.strokeStyle = even ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.025)';
        ctx.lineWidth = 1;
      }
      ctx.stroke();
    }
    ctx.restore();

    // 3. Radial Vinyl Sheen Effect
    const sheenX = cx + fullR * 0.25;
    const sheenY = cy - fullR * 0.3;
    const sheen = ctx.createRadialGradient(sheenX, sheenY, 20, sheenX, sheenY, fullR * 0.7);
    sheen.addColorStop(0, 'rgba(220,200,255,0.09)');
    sheen.addColorStop(0.3, 'rgba(120,160,255,0.05)');
    sheen.addColorStop(0.7, 'rgba(80,220,200,0.02)');
    sheen.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sheen;
    ctx.beginPath();
    ctx.arc(cx, cy, fullR, 0, Math.PI * 2);
    ctx.fill();

    // 4. Center Label Background
    const labelGrad = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, labelR);
    if (side === 'A') {
      labelGrad.addColorStop(0, '#fdfdfd');
      labelGrad.addColorStop(0.55, '#eaeaea');
      labelGrad.addColorStop(0.85, '#d8d8d8');
      labelGrad.addColorStop(1, '#c2c2c2');
    } else {
      labelGrad.addColorStop(0, '#282830');
      labelGrad.addColorStop(0.55, '#18181e');
      labelGrad.addColorStop(1, '#08080c');
    }
    ctx.fillStyle = labelGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, labelR, 0, Math.PI * 2);
    ctx.fill();

    // Label Outer Rim Border
    ctx.strokeStyle = side === 'A' ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, labelR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = side === 'A' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(cx, cy, labelR - 12, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Label Artwork Text & Graphics
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const originY = cy - labelR * 0.42;

    ctx.font = 'italic bold 76px Georgia, serif';
    ctx.fillStyle = side === 'A' ? '#0a0a0f' : '#ffffff';
    ctx.shadowColor = side === 'A' ? 'rgba(0,0,0,0.15)' : 'rgba(200,180,255,0.4)';
    ctx.shadowBlur = 8;
    ctx.fillText('AURA', cx, originY);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = side === 'A' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 110, originY + 44);
    ctx.lineTo(cx + 110, originY + 44);
    ctx.stroke();

    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillStyle = side === 'A' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)';
    ctx.fillText('Music', cx, originY + 82);

    // Musical Symbols
    const symColor = side === 'A' ? 'rgba(20,20,35,0.65)' : 'rgba(255,255,255,0.45)';

    ctx.save();
    ctx.translate(cx - 50, cy + 8);
    ctx.fillStyle = symColor;
    ctx.font = 'bold 72px serif';
    ctx.fillText('\u{1D11E}', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(cx + 52, cy - 4);
    ctx.fillStyle = symColor;
    ctx.font = 'bold 56px serif';
    ctx.fillText('\u266A', 0, 0);
    ctx.restore();

    // Subtle Ring Dots around label
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      const dr = labelR * 0.72;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * dr, cy + Math.sin(a) * dr, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = side === 'A' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)';
      ctx.fill();
    }

    // 6. Center Hole Ring
    const holeGrad = ctx.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, holeR + 10);
    holeGrad.addColorStop(0, '#1a1a22');
    holeGrad.addColorStop(1, '#030308');
    ctx.fillStyle = holeGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, holeR + 10, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [side]);
}

function VinylRecord() {
  const group = useRef();
  const spinGroup = useRef();
  const scrollRef = useRef(0);
  const screenPos = useRef(new THREE.Vector3());
  const glowRef = useRef();

  const labelTextureA = useVinylTexture('A');
  const labelTextureB = useVinylTexture('B');
  const colorObj = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    const handleScroll = () => { scrollRef.current = window.scrollY; };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    if (!group.current) return;

    const activeMaxScroll = window._cachedMaxScroll || Math.max(1, document.body.scrollHeight - window.innerHeight);
    const activeIsMobile = window._cachedIsMobile !== undefined ? window._cachedIsMobile : window.innerWidth < 768;
    const scroll = scrollRef.current;

    // Smooth spinning calculation
    if (spinGroup.current) {
      const targetSpeed = diskState.isPlaying ? CONFIG.idleSpinSpeed : 0.001;
      spinGroup.current._spinSpeed = THREE.MathUtils.lerp(
        spinGroup.current._spinSpeed ?? 0.001,
        targetSpeed,
        0.04
      );
      spinGroup.current.rotation.y -= spinGroup.current._spinSpeed;
    }

    // Color pulse on outer glow
    const time = state.clock.elapsedTime;
    if (glowRef.current) {
      const hue = (time * 0.05) % 1;
      colorObj.setHSL(hue, 0.4, 0.5);
      glowRef.current.material.color.lerp(colorObj, 0.08);
      glowRef.current.material.opacity = 0.08 + Math.sin(time * 2) * 0.04;
    }

    const progress = Math.max(0, Math.min(1, scroll / activeMaxScroll));
    const r = progress * 4;
    const cfg = activeIsMobile ? M_CONFIG : CONFIG;
    let kf;

    if (r <= 1) {
      kf = lerpKF(cfg.pos_Hero, cfg.pos_Tier1, r);
    } else if (r <= 2) {
      kf = lerpKF(cfg.pos_Tier1, cfg.pos_Tier2, r - 1);
    } else if (r <= 3) {
      kf = lerpKF(cfg.pos_Tier2, cfg.pos_Sample, r - 2);
    } else {
      kf = lerpKF(cfg.pos_Sample, cfg.pos_Bottom, r - 3);
    }

    const bob = Math.sin(time * 0.8) * 0.12;
    const spd = activeIsMobile ? 0.25 : CONFIG.returnSpeed;

    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, kf[0], spd);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, kf[1] + bob, spd);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, kf[2], spd);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, kf[3], spd);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, kf[4], spd);

    // Screen tracking for DOM proximity engine
    screenPos.current.setFromMatrixPosition(group.current.matrixWorld);
    screenPos.current.project(state.camera);
    drag.diskScreenX = (screenPos.current.x + 1) / 2 * window.innerWidth;
    drag.diskScreenY = (-screenPos.current.y + 1) / 2 * window.innerHeight;

    diskState.x = drag.diskScreenX;
    diskState.y = drag.diskScreenY;
    diskState.visible = screenPos.current.z > 0 && screenPos.current.z < 1;
  });

  const halfT = CONFIG.diskThickness / 2;
  const segments = typeof window !== 'undefined' && window.innerWidth < 768 ? 32 : 48;

  return (
    <group ref={group}>
      <group ref={spinGroup}>
        {/* Main Cylinder Edge */}
        <mesh>
          <cylinderGeometry args={[CONFIG.diskRadius, CONFIG.diskRadius, CONFIG.diskThickness, segments]} />
          <meshStandardMaterial
            color={CONFIG.bodyColor}
            emissive={CONFIG.bodyEmissive}
            emissiveIntensity={0.2}
            roughness={0.2}
            metalness={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Top Glow Accent Ring */}
        <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, halfT + 0.005, 0]}>
          <ringGeometry args={[CONFIG.diskRadius - 0.03, CONFIG.diskRadius + 0.06, segments]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Bottom Glow Accent Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -halfT - 0.005, 0]}>
          <ringGeometry args={[CONFIG.diskRadius - 0.03, CONFIG.diskRadius + 0.04, segments]} />
          <meshBasicMaterial
            color="#5e5e6a"
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Single Top Face (Procedural Vinyl Grooves + Label Texture) */}
        <mesh position={[0, halfT + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[CONFIG.diskRadius, segments]} />
          <meshStandardMaterial map={labelTextureA} roughness={0.3} metalness={0.4} side={THREE.DoubleSide} />
        </mesh>

        {/* Single Bottom Face (Procedural Vinyl Grooves + Label Texture B) */}
        <mesh position={[0, -halfT - 0.003, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[CONFIG.diskRadius, segments]} />
          <meshStandardMaterial map={labelTextureB} roughness={0.3} metalness={0.4} side={THREE.DoubleSide} />
        </mesh>

        {/* Center Metal Pin */}
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, CONFIG.diskThickness + 0.04, 24]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.95} roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, CONFIG.diskThickness + 0.06, 24]} />
          <meshBasicMaterial color="#000" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

export default function Background3D() {
  useEffect(() => {
    const updateCache = () => {
      window._cachedMaxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      window._cachedIsMobile = window.innerWidth < 768;
    };
    window.addEventListener('resize', updateCache);
    updateCache();
    return () => window.removeEventListener('resize', updateCache);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      dpr={typeof window !== 'undefined' ? (window.innerWidth < 768 ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.25)) : 1.0}
    >
      <ambientLight intensity={2.2} />
      <directionalLight position={[5, 10, 7]} intensity={3.0} color="#ffffff" />
      <directionalLight position={[-5, -10, -5]} intensity={1.8} color="#7b52de" />
      <directionalLight position={[0, 15, -5]} intensity={2.2} color="#38bdf8" />
      <pointLight position={[3, 4, 5]} intensity={3.5} color="#f05080" distance={20} />

      <VinylRecord />
    </Canvas>
  );
}
