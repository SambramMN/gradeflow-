import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Only enable on devices with a fine pointer (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX - 4}px`;
        dotRef.current.style.top = `${e.clientY - 4}px`;
      }
    };

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15;
      if (ringRef.current) {
        const size = hovering ? 56 : 36;
        ringRef.current.style.left = `${ring.current.x - size / 2}px`;
        ringRef.current.style.top = `${ring.current.y - size / 2}px`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    const handleEnter = () => setHovering(true);
    const handleLeave = () => setHovering(false);

    // Track interactive elements
    const attachListeners = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"], input, select, textarea, [data-magnetic]');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
      return interactives;
    };

    window.addEventListener('mousemove', handleMove);
    raf.current = requestAnimationFrame(animate);

    // Use MutationObserver to re-attach on DOM changes
    let interactives = attachListeners();
    const observer = new MutationObserver(() => {
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
      interactives = attachListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf.current);
      observer.disconnect();
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, [hovering]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden lg:block" />
      <div ref={ringRef} className={`cursor-ring hidden lg:block ${hovering ? 'hovering' : ''}`} />
    </>
  );
}
