import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pen, Undo2, Redo2, Trash2, X, Circle } from 'lucide-react';
import { AnnotationCanvas } from './AnnotationCanvas';
import type { Stroke } from './AnnotationCanvas';

export const PenMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPenActive, setIsPenActive] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const strokesRef = useRef<Stroke[]>([]);
  const undoneRef = useRef<Stroke[]>([]);

  // Track position for floating snap
  const [pos, setPos] = useState({ x: window.innerWidth - 64, y: window.innerHeight * 0.7 });
  const [isLeftEdge, setIsLeftEdge] = useState(false);

  const toggleMenu = () => {
    setIsOpen(prev => {
      const next = !prev;
      setIsPenActive(next);
      
      setPos(current => {
        const screenWidth = window.innerWidth;
        const isLeft = current.x < screenWidth / 2;
        const targetX = isLeft ? 16 : screenWidth - 64;
        const slideOffset = !next ? (isLeft ? -40 : 40) : 0;
        return { x: targetX + slideOffset, y: current.y };
      });

      return next;
    });
  };

  const handleUndo = () => {
    if (strokesRef.current.length === 0) return;
    const last = strokesRef.current.pop()!;
    undoneRef.current.push(last);
    setIsOpen(o => { setTimeout(() => setIsOpen(o), 0); return !o; });
  };

  const handleRedo = () => {
    if (undoneRef.current.length === 0) return;
    const last = undoneRef.current.pop()!;
    strokesRef.current.push(last);
    setIsOpen(o => { setTimeout(() => setIsOpen(o), 0); return !o; });
  };

  const handleClear = () => {
    strokesRef.current = [];
    undoneRef.current = [];
    setIsOpen(o => { setTimeout(() => setIsOpen(o), 0); return !o; });
  };

  // Mathematically even fanning angles in a circular arc away from the screen edge
  const angles = isLeftEdge
    ? [-90, -54, -18, 18, 54, 90]      // facing right
    : [270, 234, 198, 162, 126, 90];  // facing left

  const menuItems = [
    { icon: <Undo2 className="w-4 h-4" />, action: handleUndo, angle: angles[0] },
    { icon: <Redo2 className="w-4 h-4" />, action: handleRedo, angle: angles[1] },
    { icon: <Trash2 className="w-4 h-4" />, action: handleClear, angle: angles[2] },
    { icon: <Circle className="w-4 h-4 text-emerald-400" fill="currentColor" />, action: () => setColor('#34d399'), angle: angles[3] },
    { icon: <Circle className="w-4 h-4 text-rose-400" fill="currentColor" />, action: () => setColor('#fb7185'), angle: angles[4] },
    { icon: <Circle className="w-4 h-4 text-white" fill="currentColor" />, action: () => setColor('#ffffff'), angle: angles[5] },
  ];

  const handleDragEnd = (_event: any, info: any) => {
    const screenWidth = window.innerWidth;
    const isLeft = info.point.x < screenWidth / 2;
    setIsLeftEdge(isLeft);

    const targetX = isLeft ? 16 : screenWidth - 64;
    const targetY = Math.min(Math.max(info.point.y, 60), window.innerHeight - 80);

    // Dock 50% off screen when closed/inactive
    const slideOffset = (!isOpen && !isPenActive) ? (isLeft ? -40 : 40) : 0;

    setPos({ x: targetX + slideOffset, y: targetY });
  };

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        <AnnotationCanvas isActive={isPenActive} color={color} strokesRef={strokesRef} />
      </div>

      <motion.div
        drag
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed z-9999 w-12 h-12 select-none cursor-grab active:cursor-grabbing"
        style={{ left: 0, top: 0 }}
      >
        <div className="relative w-full h-full">
          <AnimatePresence>
            {isOpen && (
              <>
                {menuItems.map((item, i) => {
                  const radius = 76; // Expanded radius to eliminate overlap
                  const rad = (item.angle * Math.PI) / 180;
                  const x = radius * Math.cos(rad);
                  const y = radius * Math.sin(rad);

                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      animate={{ opacity: 1, x, y, scale: 1 }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 25 }}
                      onClick={(e) => { e.stopPropagation(); item.action(); }}
                      className="absolute top-1 left-1 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shadow-lg z-20"
                    >
                      {item.icon}
                    </motion.button>
                  );
                })}
              </>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); toggleMenu(); }}
            whileTap={{ scale: 0.9 }}
            className={`absolute inset-0 rounded-full flex items-center justify-center shadow-xl transition-colors z-30 ${
              isPenActive
                ? 'bg-indigo-500 text-white shadow-indigo-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10'
            }`}
            style={isPenActive ? { boxShadow: `0 0 20px ${color}80` } : {}}
          >
            {isOpen ? <X className="w-5 h-5 pointer-events-none" /> : <Pen className="w-5 h-5 pointer-events-none" />}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};
