import { useRef, useEffect } from 'react';
import { diskState } from '../systems/diskPosition';

// ═══════════════════════════════════════════════════════════════════
// DISK INFLUENCE ENGINE
// 
// A performant RAF-driven proximity system that makes DOM elements
// react to the 3D disk's screen position with smooth, cinematic
// displacement. All transforms are applied directly to the DOM
// (bypassing React's render cycle) for zero-overhead animation.
//
// Architecture:
// - diskState.x/y is updated by Background3D at ~60fps
// - Each hook instance reads diskState and computes displacement
// - Displacement uses quadratic falloff + directional push
// - Smooth interpolation via lerp prevents jitter
// - CSS transform (translate3d + scale + rotate) is GPU-composited
// ═══════════════════════════════════════════════════════════════════

/**
 * Hook that makes an element react to the 3D disk's proximity.
 * Returns a ref to attach to the target DOM element.
 * 
 * @param {Object} options
 * @param {number} options.influenceRadius - Radius of the influence field in px (default 400)
 * @param {number} options.maxDisplacement - Max push distance in px (default 35)
 * @param {number} options.smoothing - Lerp factor 0-1 (lower = smoother, default 0.06)
 * @param {number} options.intensity - Force multiplier 0-1+ (default 1.0)
 * @param {number} options.scaleEffect - Scale reduction at max force (default 0.04)
 * @param {number} options.rotationEffect - Max rotation in degrees (default 1.5)
 */
export function useDiskInfluence(options = {}) {
  const {
    influenceRadius = 400,
    maxDisplacement = 35,
    smoothing = 0.06,
    intensity = 1.0,
    scaleEffect = 0.04,
    rotationEffect = 1.5,
  } = options;

  const ref = useRef(null);
  const state = useRef({ x: 0, y: 0, scale: 1, rot: 0 });
  const cachedRect = useRef({ absoluteCX: 0, absoluteCY: 0, radius: 0 });
  const rafId = useRef(null);
  const isFirstFrame = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // GPU compositing hint
    el.style.willChange = 'transform';

    // PERFORMANCE FIX: Cache absolute document coordinates to prevent Layout Thrashing.
    // Querying getBoundingClientRect() 60fps causes severe scroll jitter.
    const updateCache = () => {
      const currentTransform = el.style.transform;
      el.style.transform = 'none'; // Temporarily clear transform to get true box

      const rect = el.getBoundingClientRect();
      cachedRect.current = {
        absoluteCX: rect.left + window.scrollX + rect.width * 0.5,
        absoluteCY: rect.top + window.scrollY + rect.height * 0.5,
        radius: Math.max(rect.width, rect.height) * 0.3
      };

      el.style.transform = currentTransform; // Restore instantly
    };

    updateCache();
    window.addEventListener('resize', updateCache, { passive: true });

    const tick = () => {
      // Guard against unmounted elements
      if (!el || !el.isConnected) return;

      // Calculate current viewport position using cached absolute + scroll (Zero Layout Thrashing!)
      const elCX = cachedRect.current.absoluteCX - window.scrollX;
      const elCY = cachedRect.current.absoluteCY - window.scrollY;

      // Vector from disk center to element center
      const dx = elCX - diskState.x;
      const dy = elCY - diskState.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Factor in element's own size from cache
      const elRadius = cachedRect.current.radius;
      const effectiveDist = Math.max(0, dist - elRadius);

      let targetX = 0;
      let targetY = 0;
      let targetScale = 1;
      let targetRot = 0;

      if (effectiveDist < influenceRadius && diskState.visible) {
        // Quadratic falloff — natural physics-like force decay
        const normalizedDist = effectiveDist / influenceRadius;
        const force = Math.pow(1 - normalizedDist, 2.5) * intensity;

        // Normalized direction AWAY from disk (element escapes)
        const len = Math.max(dist, 1);
        const dirX = dx / len;
        const dirY = dy / len;

        // Displacement vector
        targetX = dirX * maxDisplacement * force;
        targetY = dirY * maxDisplacement * force;

        // Subtle scale compression when pushed (object looks pressured)
        if (scaleEffect > 0) {
          targetScale = 1 - force * scaleEffect;
        }

        // Gentle tilt away from disk direction
        if (rotationEffect > 0) {
          targetRot = dirX * force * rotationEffect;
        }
      }

      // Smooth interpolation — the core of cinematic feel
      const s = state.current;
      const sm = isFirstFrame.current ? 1 : smoothing;
      s.x += (targetX - s.x) * sm;
      s.y += (targetY - s.y) * sm;
      s.scale += (targetScale - s.scale) * sm;
      s.rot += (targetRot - s.rot) * sm;
      isFirstFrame.current = false;

      // Snap tiny values to zero (prevents sub-pixel jitter & GPU waste)
      const SNAP_POS = 0.05;
      const SNAP_SCALE = 0.0005;
      const SNAP_ROT = 0.01;
      if (Math.abs(s.x) < SNAP_POS && targetX === 0) s.x = 0;
      if (Math.abs(s.y) < SNAP_POS && targetY === 0) s.y = 0;
      if (Math.abs(s.scale - 1) < SNAP_SCALE && targetScale === 1) s.scale = 1;
      if (Math.abs(s.rot) < SNAP_ROT && targetRot === 0) s.rot = 0;

      // Only touch the DOM when there's actual movement
      const hasMovement = s.x !== 0 || s.y !== 0 || s.scale !== 1 || s.rot !== 0;
      if (hasMovement) {
        el.style.transform =
          `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0) ` +
          `scale(${s.scale.toFixed(4)}) ` +
          `rotate(${s.rot.toFixed(2)}deg)`;
      } else {
        // Clear transform completely when at rest
        if (el.style.transform !== '') {
          el.style.transform = '';
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', updateCache);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (el) {
        el.style.transform = '';
        el.style.willChange = '';
      }
    };
  }, [influenceRadius, maxDisplacement, smoothing, intensity, scaleEffect, rotationEffect]);

  return ref;
}

/**
 * Wrapper component that applies disk influence to its children.
 * Use this around cards, panels, text blocks, etc.
 * 
 * The wrapper becomes a normal block-level element in the layout,
 * so it naturally participates in grids, flex containers, etc.
 * The transform is visual-only — it doesn't affect layout flow.
 * 
 * @example
 * <Influenced influenceRadius={400} maxDisplacement={35}>
 *   <motion.div>Card content</motion.div>
 * </Influenced>
 */
export function Influenced({
  children,
  style,
  className,
  influenceRadius,
  maxDisplacement,
  smoothing,
  intensity,
  scaleEffect,
  rotationEffect,
  ...rest
}) {
  const ref = useDiskInfluence({
    influenceRadius,
    maxDisplacement,
    smoothing,
    intensity,
    scaleEffect,
    rotationEffect,
  });

  return (
    <div ref={ref} className={className} style={style} {...rest}>
      {children}
    </div>
  );
}
