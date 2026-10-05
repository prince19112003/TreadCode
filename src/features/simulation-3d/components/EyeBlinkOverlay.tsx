import React, { useEffect, useState } from 'react';

interface EyeBlinkOverlayProps {
  onComplete: () => void;
}

/**
 * Cinematic 2-blink eyelid animation on simulation entry.
 * Pure CSS/React — zero Three.js dependency, fully sandboxed.
 */
export const EyeBlinkOverlay: React.FC<EyeBlinkOverlayProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'blink' | 'reopening' | 'done'>('closed');

  useEffect(() => {
    // Sequence: closed → slowly open → quick blink → open → fade out
    const t1 = setTimeout(() => setPhase('opening'), 80);
    const t2 = setTimeout(() => setPhase('blink'), 900);
    const t3 = setTimeout(() => setPhase('reopening'), 1150);
    const t4 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  // Eyelid positions based on phase
  const eyelidStyles: Record<string, { top: string; bottom: string; transition: string }> = {
    closed:    { top: '0%',    bottom: '0%',    transition: 'none' },
    opening:   { top: '-50%',  bottom: '-50%',  transition: 'top 820ms cubic-bezier(0.33,0,0.66,1), bottom 820ms cubic-bezier(0.33,0,0.66,1)' },
    blink:     { top: '0%',    bottom: '0%',    transition: 'top 120ms ease-in, bottom 120ms ease-in' },
    reopening: { top: '-50%',  bottom: '-50%',  transition: 'top 400ms cubic-bezier(0.33,0,0.66,1), bottom 400ms cubic-bezier(0.33,0,0.66,1)' },
  };

  const style = eyelidStyles[phase] ?? eyelidStyles['closed'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Top eyelid */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '50%',
          background: '#000000',
          top: style.top,
          transition: style.transition,
        }}
      />
      {/* Bottom eyelid */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '50%',
          background: '#000000',
          bottom: style.bottom,
          transition: style.transition,
        }}
      />
    </div>
  );
};
