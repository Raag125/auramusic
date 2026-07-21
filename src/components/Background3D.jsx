import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { diskState } from '../systems/diskPosition';

const CONFIG = {
  diskRadius: 2.2,
  diskThickness: 0.04,
  labelRadius: 1.0,
  labelFaceRadius: 2.1,
  grooveInner: 1.15,

  bodyColor: "#111116",
  bodyEmissive: "#04040a",
  labelColor: "#000000",
  grooveColorA: "#0f0f15",
  grooveColorB: "#16161d",

  idleSpinSpeed: 0.025,
  returnSpeed: 0.38,

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
  return a.map((v, i) => THREE.MathUtils.lerp(v, b[i], t));
}

function useLabelTexture(side = 'A') {
  return useMemo(() => {
    const size = 1024;
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
    const outerR = size / 2 - 6;
    const innerR = Math.round(outerR * (1.0 / 2.1));

    const bgGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
    bgGrad.addColorStop(0, '#14141a');
    bgGrad.addColorStop(0.5, '#0a0a0f');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    for (let r = innerR + 12; r < outerR - 5; r += 7) {
      const even = Math.floor((r - innerR) / 7) % 2 === 0;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = even ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.02)';
      ctx.lineWidth = even ? 1.5 : 0.8;
      ctx.stroke();
    }

    const sheenX = cx + outerR * 0.25;
    const sheenY = cy - outerR * 0.3;
    const sheen = ctx.createRadialGradient(sheenX, sheenY, 10, sheenX, sheenY, outerR * 0.6);
    sheen.addColorStop(0, 'rgba(200,180,255,0.08)');
    sheen.addColorStop(0.3, 'rgba(120,160,255,0.05)');
    sheen.addColorStop(0.6, 'rgba(80,220,200,0.03)');
    sheen.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sheen;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const ringMid = innerR + (outerR - innerR) * 0.48;
    const originY = cy - ringMid;

    ctx.font = 'italic bold 90px Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(200,180,255,0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText('AURA', cx, originY);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 150, originY + 56);
    ctx.lineTo(cx + 150, originY + 56);
    ctx.stroke();

    ctx.font = 'bold 46px Arial, sans-serif';
    ctx.letterSpacing = '10px';
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.fillText('Music', cx, originY + 104);
    ctx.letterSpacing = '0px';

    const labelGrad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, innerR);
    if (side === 'A') {
      labelGrad.addColorStop(0, '#f8f8f8');
      labelGrad.addColorStop(0.55, '#e8e8e8');
      labelGrad.addColorStop(0.85, '#d5d5d5');
      labelGrad.addColorStop(1, '#bebebe');
    } else {
      labelGrad.addColorStop(0, '#242428');
      labelGrad.addColorStop(0.55, '#16161a');
      labelGrad.addColorStop(1, '#050508');
    }
    ctx.fillStyle = labelGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = side === 'A' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = side === 'A' ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(cx, cy, innerR - 16, 0, Math.PI * 2);
    ctx.stroke();

    const symColor = side === 'A' ? 'rgba(20,20,35,0.55)' : 'rgba(255,255,255,0.35)';

    ctx.save();
    ctx.translate(cx - 62, cy + 8);
    ctx.fillStyle = symColor;
    ctx.font = 'bold 88px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u{1D11E}', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(cx + 66, cy - 6);
    ctx.fillStyle = symColor;
    ctx.font = 'bold 70px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u266A', 0, 0);
    ctx.restore();

    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      const dr = innerR * 0.72;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * dr, cy + Math.sin(a) * dr, 3, 0, Math.PI * 2);
      ctx.fillStyle = side === 'A' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.15)';
      ctx.fill();
    }

    const holeGrad = ctx.createRadialGradient(cx - 8, cy - 8, 2, cx, cy, 44);
    holeGrad.addColorStop(0, '#1a1a22');
    holeGrad.addColorStop(1, '#030308');
    ctx.fillStyle = holeGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, Math.PI * 2);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [side]);

  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  return texture;
}

function VinylRecord() {
  const group = useRef();
  const spinGroup = useRef();
  const scrollRef = useRef(0);
  const screenPos = useRef(new THREE.Vector3());
  const glowRef = useRef();
  const labelTextureA = useLabelTexture('A');
  const labelTextureB = useLabelTexture('B');
  const colorObj = useMemo(() => new THREE.Color(), []);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const grooveMatA = useMemo(() => new THREE.MeshStandardMaterial({ color: CONFIG.grooveColorA, roughness: 0.2, metalness: 0.9, side: THREE.FrontSide }), []);
  const grooveMatB = useMemo(() => new THREE.MeshStandardMaterial({ color: CONFIG.grooveColorB, roughness: 0.2, metalness: 0.9, side: THREE.FrontSide }), []);

  useFrame((state) => {
    if (!group.current) return;

    const activeMaxScroll = window._cachedMaxScroll || Math.max(1, document.body.scrollHeight - window.innerHeight);
    const activeIsMobile = window._cachedIsMobile !== undefined ? window._cachedIsMobile : window.innerWidth < 768;

    scrollRef.current = window.scrollY;
    const scroll = scrollRef.current;

    if (spinGroup.current) {
      const targetSpeed = diskState.isPlaying ? CONFIG.idleSpinSpeed : 0.001;
      spinGroup.current._spinSpeed = THREE.MathUtils.lerp(
        spinGroup.current._spinSpeed ?? 0.001,
        targetSpeed,
        0.04
      );
      spinGroup.current.rotation.y -= spinGroup.current._spinSpeed;
    }

    const time = state.clock.elapsedTime;
    const hue = (time * 0.05) % 1;
    colorObj.setHSL(hue, 0.4, 0.5);

    if (glowRef.current) {
      glowRef.current.material.color.lerp(colorObj, 0.1);
      const pulse = 0.08 + Math.sin(time * 2) * 0.04;
      glowRef.current.material.opacity = pulse;
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

    screenPos.current.setFromMatrixPosition(group.current.matrixWorld);
    screenPos.current.project(state.camera);
    drag.diskScreenX = (screenPos.current.x + 1) / 2 * window.innerWidth;
    drag.diskScreenY = (-screenPos.current.y + 1) / 2 * window.innerHeight;

    diskState.x = drag.diskScreenX;
    diskState.y = drag.diskScreenY;
    diskState.visible = screenPos.current.z > 0 && screenPos.current.z < 1;
  });

  const halfT = CONFIG.diskThickness / 2;
  const grooveStep = (CONFIG.diskRadius - 0.08 - CONFIG.grooveInner) / 30;

  return (
    <group ref={group}>
      <group ref={spinGroup}>
        {}
        <mesh>
          <cylinderGeometry args={[CONFIG.diskRadius, CONFIG.diskRadius, CONFIG.diskThickness, 128]} />
          <meshPhysicalMaterial
            color={CONFIG.bodyColor}
            emissive={CONFIG.bodyEmissive}
            emissiveIntensity={0.2}
            roughness={0.15}
            metalness={0.85}
            clearcoat={0.9}
            clearcoatRoughness={0.02}
            envMapIntensity={3.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, halfT + 0.005, 0]}>
          <ringGeometry args={[CONFIG.diskRadius - 0.03, CONFIG.diskRadius + 0.06, 128]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -halfT - 0.005, 0]}>
          <ringGeometry args={[CONFIG.diskRadius - 0.03, CONFIG.diskRadius + 0.04, 128]} />
          <meshBasicMaterial
            color="#5e5e6a"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {}
        {!isMobile && Array.from({ length: 30 }, (_, i) => {
          const rad = CONFIG.grooveInner + i * grooveStep;
          return (
            <mesh key={`t${i}`} position={[0, halfT + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={i % 2 === 0 ? grooveMatA : grooveMatB}>
              <ringGeometry args={[rad, rad + grooveStep * 0.5, 128]} />
            </mesh>
          );
        })}

        {}
        {!isMobile && Array.from({ length: 30 }, (_, i) => {
          const rad = CONFIG.grooveInner + i * grooveStep;
          return (
            <mesh key={`b${i}`} position={[0, -halfT - 0.001, 0]} rotation={[Math.PI / 2, 0, 0]} material={i % 2 === 0 ? grooveMatA : grooveMatB}>
              <ringGeometry args={[rad, rad + grooveStep * 0.5, 128]} />
            </mesh>
          );
        })}

        {}
        <mesh>
          <cylinderGeometry args={[CONFIG.labelRadius, CONFIG.labelRadius, CONFIG.diskThickness + 0.005, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            map={labelTextureA}
            roughness={0.4}
            metalness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {}
        <mesh position={[0, halfT + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[CONFIG.labelFaceRadius, 128]} />
          <meshPhongMaterial map={labelTextureA} side={THREE.FrontSide} />
        </mesh>

        {}
        <mesh position={[0, -halfT - 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[CONFIG.labelFaceRadius, 128]} />
          <meshPhongMaterial map={labelTextureB} side={THREE.FrontSide} />
        </mesh>

        {}
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, CONFIG.diskThickness + 0.04, 32]} />
          <meshStandardMaterial color="#b0b0b0" metalness={1.0} roughness={0.05} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, CONFIG.diskThickness + 0.06, 32]} />
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

    return () => {
      window.removeEventListener('resize', updateCache);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      dpr={typeof window !== 'undefined' ? [1, window.innerWidth < 768 ? 1.0 : 1.5] : [1, 1]} 
    >
      <ambientLight intensity={2.5} />

      {}
      <directionalLight position={[0, 10, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[0, 20, 0]} intensity={5.0} color="#ffffff" />
      <spotLight position={[-6, 5, 8]} intensity={4.0} color="#7b52de" angle={0.4} penumbra={1} />

      {}
      <directionalLight position={[0, -10, -5]} intensity={3.5} color="#ffffff" />
      <pointLight position={[5, -5, -5]} intensity={3.0} color="#459ab1" distance={25} />
      <pointLight position={[-5, 0, -8]} intensity={2.0} color="#c8bcf0" distance={20} />

      <VinylRecord />

      <Environment preset="night" />
    </Canvas>
  );
}
