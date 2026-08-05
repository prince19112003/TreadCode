import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition } from '@shared/components/ui/PageTransition';

interface SplashPageProps {
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX?: number;
  targetY?: number;
  alpha: number;
  size: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

const CODE_LINES = [
  { text: 'def factorial(n):', indent: 0, color: '#818cf8' },
  { text: '  if n == 0: return 1', indent: 1, color: '#94a3b8' },
  { text: '  return n * factorial(n-1)', indent: 1, color: '#94a3b8' },
  { text: 'int main() {', indent: 0, color: '#34d399' },
  { text: '  arr[i] = arr[j];', indent: 1, color: '#94a3b8' },
  { text: '  stack.push(node);', indent: 1, color: '#94a3b8' },
  { text: 'for i in range(n):', indent: 0, color: '#f472b6' },
  { text: '  sum += arr[i]', indent: 1, color: '#94a3b8' },
  { text: 'node.next = head;', indent: 0, color: '#facc15' },
  { text: 'return root.val;', indent: 0, color: '#67e8f9' },
];

export const SplashPage: React.FC<SplashPageProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<'init' | 'particles' | 'logo' | 'tagline' | 'done'>('init');
  const [showLogo, setShowLogo] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showCodeSnippets, setShowCodeSnippets] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('particles'), 100);
    const t2 = setTimeout(() => { setPhase('logo'); setShowCodeSnippets(true); }, 300);
    const t3 = setTimeout(() => setShowLogo(true), 400);
    const t4 = setTimeout(() => setShowTagline(true), 800);
    const t5 = setTimeout(() => setShowBadge(true), 1100);
    const t6 = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
      else navigate('/languages', { replace: true });
    }, 2400);

    return () => { [t1, t2, t3, t4, t5, t6].forEach(clearTimeout); };
  }, [navigate, onComplete]);

  // Canvas particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let frame = 0;

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 90;
    const colors = ['rgba(99,102,241,', 'rgba(168,85,247,', 'rgba(34,211,238,', 'rgba(244,114,182,'];
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 300;
      particles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: 0.2 + Math.random() * 0.6,
        size: 0.8 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    // Halo ring targets
    const haloRadius = 175;
    const targets = particles.map((_, k) => {
      const angle = (k / particles.length) * Math.PI * 2;
      const r = haloRadius + Math.sin(k * 2.5) * 18;
      return { x: width / 2 + Math.cos(angle) * r, y: height / 2 + Math.sin(angle) * r };
    });

    let currentPhase = 'init';

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      if (canvasRef.current) {
        currentPhase = canvasRef.current.getAttribute('data-phase') || 'init';
      }

      const assembling = currentPhase === 'logo' || currentPhase === 'tagline' || currentPhase === 'done';

      // Draw soft connection lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 70) {
            const alpha = (1 - dist / 70) * 0.07;
            ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p, i) => {
        p.pulse += p.pulseSpeed;
        const pulsedAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        if (assembling) {
          const target = targets[i];
          const dx = target.x - p.x;
          const dy = target.y - p.y;
          p.x += dx * 0.09;
          p.y += dy * 0.09;
          p.alpha = Math.min(p.alpha + 0.01, 0.9);
        } else {
          p.x += p.vx + Math.sin(frame * 0.008 + i) * 0.15;
          p.y += p.vy + Math.cos(frame * 0.008 + i) * 0.15;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, p.color + (pulsedAlpha) + ')');
        gradient.addColorStop(1, p.color + '0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = p.color + pulsedAlpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <PageTransition className="items-center justify-center bg-[#020308] text-slate-100 overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Space+Grotesk:wght@300;400;600&display=swap');
        @keyframes float-code { 0%,100% { transform: translateY(0px) rotate(var(--r)); opacity: var(--o); } 50% { transform: translateY(-12px) rotate(var(--r)); opacity: calc(var(--o) * 1.3); } }
        @keyframes scanline { 0% { top: -2px; } 100% { top: 100%; } }
        @keyframes border-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
      `}</style>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        data-phase={phase}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
        <div
          style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)', animation: 'scanline 3s linear infinite' }}
        />
      </div>

      {/* Deep ambient orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.04) 40%, transparent 70%)' }} />
      <div className="absolute top-[20%] right-[15%] w-[25vw] h-[25vw] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[20%] left-[10%] w-[20vw] h-[20vw] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 70%)' }} />

      {/* Floating code snippets */}
      <AnimatePresence>
        {showCodeSnippets && CODE_LINES.map((line, i) => {
          const positions = [
            { top: '8%', left: '3%', r: '-6deg' },
            { top: '15%', right: '4%', r: '4deg' },
            { top: '30%', left: '1%', r: '-3deg' },
            { top: '72%', right: '3%', r: '3deg' },
            { bottom: '12%', left: '5%', r: '-5deg' },
            { bottom: '22%', right: '2%', r: '6deg' },
            { top: '50%', left: '2%', r: '-2deg' },
            { top: '45%', right: '1%', r: '4deg' },
            { bottom: '35%', left: '8%', r: '-4deg' },
            { top: '22%', left: '40%', r: '0deg' },
          ];
          const pos = positions[i] || { top: '50%', left: '50%', r: '0deg' };
          const delay = i * 0.08;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay, duration: 0.5 }}
              className="absolute pointer-events-none z-10 select-none"
              style={{
                ...pos,
                fontFamily: "'Fira Code', 'Courier New', monospace",
                fontSize: '11px',
                color: line.color,
                opacity: 0.18 + (i % 3) * 0.06,
                transform: `rotate(${pos.r})`,
                animation: `float-code ${3.5 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                background: 'rgba(0,0,0,0.3)',
                padding: '4px 10px',
                borderRadius: '4px',
                border: `1px solid ${line.color}22`,
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(4px)',
              } as React.CSSProperties}
            >
              {line.text}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center z-20 select-none gap-5">

        {/* Spinning ring container */}
        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative flex items-center justify-center"
            >
              {/* Outer spinning gradient ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute"
                style={{
                  width: '420px', height: '420px',
                  background: 'conic-gradient(from 0deg, rgba(99,102,241,0.5), rgba(168,85,247,0.5), rgba(34,211,238,0.5), rgba(244,114,182,0.3), rgba(99,102,241,0.5))',
                  borderRadius: '50%',
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))',
                  WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))',
                  filter: 'blur(1px)',
                }}
              />

              {/* Inner static ring */}
              <div
                className="absolute"
                style={{
                  width: '395px', height: '395px',
                  borderRadius: '50%',
                  border: '1px solid rgba(99,102,241,0.12)',
                }}
              />

              {/* Glassmorphism card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                  width: '360px', height: '200px',
                  background: 'rgba(6, 6, 20, 0.65)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(20px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 0 60px rgba(99,102,241,0.1), 0 0 120px rgba(168,85,247,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {/* Logo Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    width: '44px', height: '44px',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(99,102,241,0.5)',
                    marginBottom: '4px',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M12 2v20M2 7l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </motion.div>

                {/* Wordmark */}
                <svg width="280" height="72" viewBox="0 0 280 72" overflow="visible">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="40%" stopColor="#c084fc" />
                      <stop offset="70%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>

                  {/* Stroke draw animation */}
                  <motion.text
                    x="50%" y="50%"
                    textAnchor="middle" dominantBaseline="middle"
                    fill="none"
                    stroke="url(#logoGrad)"
                    strokeWidth="2"
                    filter="url(#glow)"
                    style={{ fontFamily: "'Dancing Script', cursive", fontSize: '62px', letterSpacing: '-1px' }}
                    initial={{ strokeDasharray: 1200, strokeDashoffset: 1200 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                  >
                    FlowTrace
                  </motion.text>

                  {/* Filled text fade in */}
                  <motion.text
                    x="50%" y="50%"
                    textAnchor="middle" dominantBaseline="middle"
                    fill="url(#logoGrad)"
                    filter="url(#glow)"
                    style={{ fontFamily: "'Dancing Script', cursive", fontSize: '62px', letterSpacing: '-1px' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                  >
                    FlowTrace
                  </motion.text>
                </svg>
              </motion.div>

              {/* Orbiting dot */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="absolute"
                style={{ width: '420px', height: '420px' }}
              >
                <div style={{
                  position: 'absolute', top: '50%', left: '-5px',
                  transform: 'translateY(-50%)',
                  width: '10px', height: '10px',
                  background: 'radial-gradient(circle, #22d3ee, #6366f1)',
                  borderRadius: '50%',
                  boxShadow: '0 0 14px #22d3ee, 0 0 4px white',
                }} />
              </motion.div>

              {/* Orbiting dot 2 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                className="absolute"
                style={{ width: '420px', height: '420px' }}
              >
                <div style={{
                  position: 'absolute', top: '-5px', left: '50%',
                  transform: 'translateX(-50%)',
                  width: '7px', height: '7px',
                  background: 'radial-gradient(circle, #f472b6, #a855f7)',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px #f472b6',
                }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tagline */}
        <AnimatePresence>
          {showTagline && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center gap-2"
            >
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '13px',
                fontWeight: 300,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #818cf8, #c084fc, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Visualize &nbsp;·&nbsp; Learn &nbsp;·&nbsp; Master
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Language badges */}
        <AnimatePresence>
          {showBadge && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              {['Python', 'C++', 'Java', 'C', 'DSA'].map((lang, i) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    padding: '3px 12px',
                    borderRadius: '100px',
                    fontSize: '10px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    border: '1px solid rgba(99,102,241,0.3)',
                    color: 'rgba(165,180,252,0.85)',
                    background: 'rgba(99,102,241,0.08)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {lang}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading bar */}
        <AnimatePresence>
          {showBadge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ width: '200px' }}
            >
              <div style={{ height: '1px', background: 'rgba(99,102,241,0.15)', borderRadius: '1px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #6366f1, #a855f7, #22d3ee)',
                    borderRadius: '1px',
                    boxShadow: '0 0 8px rgba(99,102,241,0.8)',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
