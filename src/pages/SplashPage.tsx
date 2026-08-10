import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { TreadCodeLogo } from '@shared/components/ui/MindTraceLogo';

interface SplashPageProps {
  onComplete?: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onComplete }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Exactly 3 Seconds Timer
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
      else navigate('/languages', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, onComplete]);

  return (
    <PageTransition className="items-center justify-center bg-[#05060b] text-slate-100 overflow-hidden relative">
      <div className="flex flex-col items-center justify-center z-10 select-none gap-10">
        {/* Minimal Clean Extra Large 3D Logo (320px) — No Background Glows */}
        <div className="relative flex items-center justify-center">
          <TreadCodeLogo size={320} />
        </div>

        {/* 3-Second Staggered Blinking Matched Color Dots (. . . .) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          {[
            'bg-linear-to-r from-cyan-400 to-sky-400 shadow-cyan-500/40',
            'bg-linear-to-r from-sky-400 to-indigo-400 shadow-indigo-500/40',
            'bg-linear-to-r from-indigo-400 to-purple-400 shadow-purple-500/40',
            'bg-linear-to-r from-purple-400 to-pink-400 shadow-pink-500/40',
          ].map((colorClass, idx) => (
            <motion.div
              key={idx}
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.3, 0.85] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: idx * 0.2,
                ease: 'easeInOut',
              }}
              className={`w-3.5 h-3.5 rounded-full shadow-sm ${colorClass}`}
            />
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
};
