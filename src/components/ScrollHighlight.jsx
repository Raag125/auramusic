import { useEffect, useRef, useState } from 'react';

/**
 * Wraps a section and applies a scroll-triggered highlight effect.
 * When the section enters the viewport, it fades in with a glow accent.
 */
export default function ScrollHighlight({ children, threshold = 0.15 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`section-highlight ${inView ? 'in-view' : ''}`}
    >
      {children}
    </div>
  );
}
