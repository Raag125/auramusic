/**
 * Shared mutable state for the 3D disk's viewport-space position.
 * 
 * Written to by Background3D's useFrame loop at ~60fps.
 * Read by useDiskInfluence hooks across all components.
 * 
 * Using a plain JS object (not React state) for zero-overhead
 * reads at 60fps without triggering any React re-renders.
 * This is the critical bridge between the Three.js world and DOM elements.
 */
export const diskState = {
  /** Disk center X in viewport pixels */
  x: -9999,
  /** Disk center Y in viewport pixels */
  y: -9999,
  /** Whether the disk is currently in front of camera and visible */
  visible: false,
  /** Approximate screen radius of the disk in pixels */
  screenRadius: 180,
  /** Controlled by Hero player — drives disk spin speed */
  isPlaying: false,
};
