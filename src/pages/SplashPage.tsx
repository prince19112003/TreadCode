import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition } from '@shared/components/ui/PageTransition';

interface SplashPageProps {
  onComplete?: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'logo' | 'progress' | 'done'>('logo');
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Stage 1: Display Logo for 1.2s
    const t1 = setTimeout(() => {
      setPhase('progress');
    }, 1200);

    // Stage 2: Animate Progress Bar
    let interval: ReturnType<typeof setInterval>;
    if (phase === 'progress') {
      interval = setInterval(() => {
        setPercentage((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Complete Splash Screen transition after progress completion
            setTimeout(() => {
              setPhase('done');
              if (onComplete) onComplete();
              else navigate('/languages', { replace: true });
            }, 300);
            return 100;
          }
          return prev + 4;
        });
      }, 35);
    }

    return () => {
      clearTimeout(t1);
      if (interval) clearInterval(interval);
    };
  }, [phase, navigate, onComplete]);

  return (
    <PageTransition className="items-center justify-center bg-[#000000] text-slate-100 overflow-hidden relative">
      {/* Sleek Apple Monochromatic Ambient glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="flex flex-col items-center justify-center z-10 select-none gap-10">
        {/* Apple-like minimalist branding container */}
        <AnimatePresence mode="wait">
          {phase === 'logo' && (
            <motion.div
              key="apple-logo-intro"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col items-center gap-6"
            >
              {/* Apple-style minimalist vector icon container */}
              <div 
                className="w-16 h-16 rounded-[22%] flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 10px 30px rgba(0,0,0,0.4)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M12 2L2 7v10l10 5 10-5V7L12 2z" 
                    stroke="rgba(255,255,255,0.9)" 
                    strokeWidth="1.6" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M12 22V12m0 0L2 7m10 5l10-5" 
                    stroke="rgba(255,255,255,0.4)" 
                    strokeWidth="1.2"
                  />
                </svg>
              </div>

              <div className="flex flex-col items-center gap-1">
                <h1 
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    fontSize: '24px',
                    fontWeight: 600,
                    letterSpacing: '-0.5px',
                    color: '#ffffff',
                  }}
                >
                  FlowTrace
                </h1>
                <span 
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    fontSize: '10px',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    color: '#8e8e93',
                  }}
                >
                  Visualizer
                </span>
              </div>
            </motion.div>
          )}

          {phase === 'progress' && (
            <motion.div
              key="apple-progress-bar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-8 w-44"
            >
              {/* Minimal Apple Progress bar */}
              <div 
                className="w-full rounded-full overflow-hidden"
                style={{
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <div 
                  className="h-full bg-white transition-all duration-75"
                  style={{
                    width: `${percentage}%`,
                    boxShadow: '0 0 8px rgba(255,255,255,0.4)',
                  }}
                />
              </div>

              <span 
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                  fontSize: '11px',
                  color: '#8e8e93',
                  letterSpacing: '0.05em',
                }}
              >
                Loading...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
