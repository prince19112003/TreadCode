import { useEffect, useRef } from 'react';

/**
 * SmartBoard 1GB RAM & Low-Resource Touch Throttler:
 * Prevents high-frequency IR touch frames (120Hz-200Hz) from flooding
 * React state updates and freezing low-spec ARM/Celeron processors.
 * Accumulates zoom deltas and flushes at most once per display refresh via requestAnimationFrame.
 */
export function usePinchZoom(
  setZoom: React.Dispatch<React.SetStateAction<number>>,
  minZoom = 0.58,
  maxZoom = 2.2
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchDistRef = useRef<number | null>(null);
  const pendingFactorRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const elem = containerRef.current;
    if (!elem) return;

    const scheduleZoomUpdate = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          const factor = pendingFactorRef.current;
          pendingFactorRef.current = 1;
          if (factor !== 1) {
            setZoom(prev => Math.min(Math.max(prev * factor, minZoom), maxZoom));
          }
        });
      }
    };

    // Trackpad pinch (or Ctrl + mouse wheel)
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = -e.deltaY;
        const factor = Math.pow(1.006, delta);
        pendingFactorRef.current *= factor;
        scheduleZoomUpdate();
      }
    };

    // 2-finger Touch Pinch (SmartBoard Touchscreen / Tablet)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        touchDistRef.current = dist;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchDistRef.current !== null && touchDistRef.current > 0) {
        e.preventDefault();
        const newDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (newDist > 0) {
          const ratio = newDist / touchDistRef.current;
          touchDistRef.current = newDist;
          pendingFactorRef.current *= ratio;
          scheduleZoomUpdate();
        }
      }
    };

    const handleTouchEnd = () => {
      touchDistRef.current = null;
    };

    elem.addEventListener('wheel', handleWheel, { passive: false });
    elem.addEventListener('touchstart', handleTouchStart, { passive: true });
    elem.addEventListener('touchmove', handleTouchMove, { passive: false });
    elem.addEventListener('touchend', handleTouchEnd, { passive: true });
    elem.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      elem.removeEventListener('wheel', handleWheel);
      elem.removeEventListener('touchstart', handleTouchStart);
      elem.removeEventListener('touchmove', handleTouchMove);
      elem.removeEventListener('touchend', handleTouchEnd);
      elem.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [setZoom, minZoom, maxZoom]);

  return containerRef;
}
