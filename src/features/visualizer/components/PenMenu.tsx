import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Pen, Eraser, Undo2, Redo2, Trash2, X, Sliders, Scissors, MoreHorizontal } from 'lucide-react';
import { AnnotationCanvas } from './AnnotationCanvas';
import type { Stroke } from './AnnotationCanvas';

const SIX_COLORS = [
  { hex: '#ffffff', label: 'White' },
  { hex: '#34d399', label: 'Emerald' },
  { hex: '#fb7185', label: 'Rose' },
  { hex: '#22d3ee', label: 'Cyan' },
  { hex: '#facc15', label: 'Amber' },
  { hex: '#c084fc', label: 'Purple' },
];

export const PenMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPenActive, setIsPenActive] = useState(false);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#ffffff');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [dashStyle, setDashStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [activeSubMenu, setActiveSubMenu] = useState<'none' | 'thickness' | 'style'>('none');

  const strokesRef = useRef<Stroke[]>([]);
  const undoneRef = useRef<Stroke[]>([]);
  const [revision, setRevision] = useState(0);

  // Portal target container inside flowchart canvas
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById('canvas-pen-layer');
    if (el) setPortalTarget(el);
  }, []);

  // Floating position
  const [pos, setPos] = useState({ x: window.innerWidth - 64, y: window.innerHeight * 0.7 });
  const [isLeftEdge, setIsLeftEdge] = useState(false);

  const toggleMenu = () => {
    setIsOpen(prev => {
      const next = !prev;
      setIsPenActive(next);
      setActiveSubMenu('none');
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
    setRevision(r => r + 1);
  };

  const handleRedo = () => {
    if (undoneRef.current.length === 0) return;
    const last = undoneRef.current.pop()!;
    strokesRef.current.push(last);
    setRevision(r => r + 1);
  };

  const handleClear = () => {
    strokesRef.current = [];
    undoneRef.current = [];
    setRevision(r => r + 1);
  };

  const handleStrokeComplete = () => {
    setRevision(r => r + 1);
  };

  const handleDragEnd = (_event: any, info: any) => {
    const screenWidth = window.innerWidth;
    const isLeft = info.point.x < screenWidth / 2;
    setIsLeftEdge(isLeft);
    const targetX = isLeft ? 16 : screenWidth - 64;
    const targetY = Math.min(Math.max(info.point.y, 60), window.innerHeight - 80);
    const slideOffset = (!isOpen && !isPenActive) ? (isLeft ? -40 : 40) : 0;
    setPos({ x: targetX + slideOffset, y: targetY });
  };

  // Generate SVG Pie-Slice Sector Wedge path
  const getPieSlicePath = (rIn: number, rOut: number, startDeg: number, endDeg: number, isLeft: boolean) => {
    const cx = 24;
    const cy = 24;

    const rad1 = (startDeg * Math.PI) / 180;
    const rad2 = (endDeg * Math.PI) / 180;

    const xOut1 = cx + rOut * Math.cos(rad1);
    const yOut1 = cy + rOut * Math.sin(rad1);
    const xIn1 = cx + rIn * Math.cos(rad1);
    const yIn1 = cy + rIn * Math.sin(rad1);

    const xOut2 = cx + rOut * Math.cos(rad2);
    const yOut2 = cy + rOut * Math.sin(rad2);
    const xIn2 = cx + rIn * Math.cos(rad2);
    const yIn2 = cy + rIn * Math.sin(rad2);

    if (isLeft) {
      return `M ${xIn1} ${yIn1} L ${xOut1} ${yOut1} A ${rOut} ${rOut} 0 0 1 ${xOut2} ${yOut2} L ${xIn2} ${yIn2} A ${rIn} ${rIn} 0 0 0 ${xIn1} ${yIn1} Z`;
    } else {
      return `M ${xIn1} ${yIn1} L ${xOut1} ${yOut1} A ${rOut} ${rOut} 0 0 0 ${xOut2} ${yOut2} L ${xIn2} ${yIn2} A ${rIn} ${rIn} 0 0 1 ${xIn1} ${yIn1} Z`;
    }
  };

  // 6 Sectors for Inner 6 Color Pens Layer (Radius 28px - 74px)
  const innerSectors = isLeftEdge
    ? [
        { start: -90, end: -60, center: -75 },
        { start: -60, end: -30, center: -45 },
        { start: -30, end: 0, center: -15 },
        { start: 0, end: 30, center: 15 },
        { start: 30, end: 60, center: 45 },
        { start: 60, end: 90, center: 75 },
      ]
    : [
        { start: 270, end: 240, center: 255 },
        { start: 240, end: 210, center: 225 },
        { start: 210, end: 180, center: 195 },
        { start: 180, end: 150, center: 165 },
        { start: 150, end: 120, center: 135 },
        { start: 120, end: 90, center: 105 },
      ];

  // 6 Sectors for Outer Action & Tools Layer (Radius 76px - 128px)
  const outerSectors = isLeftEdge
    ? [
        { start: -90, end: -60, center: -75 },
        { start: -60, end: -30, center: -45 },
        { start: -30, end: 0, center: -15 },
        { start: 0, end: 30, center: 15 },
        { start: 30, end: 60, center: 45 },
        { start: 60, end: 90, center: 75 },
      ]
    : [
        { start: 270, end: 240, center: 255 },
        { start: 240, end: 210, center: 225 },
        { start: 210, end: 180, center: 195 },
        { start: 180, end: 150, center: 165 },
        { start: 150, end: 120, center: 135 },
        { start: 120, end: 90, center: 105 },
      ];

  // Inner Ring: 6 Color Pens
  const innerRingItems = SIX_COLORS.map(c => ({
    id: `color-${c.hex}`,
    hex: c.hex,
    icon: <Pen className="w-4 h-4" style={{ color: c.hex }} />,
    action: () => { setColor(c.hex); setMode('pen'); setActiveSubMenu('none'); },
    active: mode === 'pen' && color === c.hex,
  }));

  const canUndo = strokesRef.current.length > 0;
  const canRedo = undoneRef.current.length > 0;

  // Outer Ring: 6 Action Tools
  const outerRingItems = [
    { id: 'undo', icon: <Undo2 className={`w-4 h-4 ${canUndo ? 'text-white font-extrabold' : 'text-slate-600'}`} />, action: handleUndo, active: false, activeFill: '', activeStroke: '' },
    { id: 'redo', icon: <Redo2 className={`w-4 h-4 ${canRedo ? 'text-emerald-300 font-extrabold' : 'text-slate-600'}`} />, action: handleRedo, active: canRedo, activeFill: 'rgba(16, 185, 129, 0.4)', activeStroke: 'rgba(52, 211, 153, 0.8)' },
    {
      id: 'mode',
      icon: (
        <div className={`p-1 rounded-lg transition-all ${mode === 'eraser' ? 'bg-rose-500/20 ring-2 ring-rose-400' : ''}`}>
          <Eraser className={`w-4 h-4 ${mode === 'eraser' ? 'text-rose-400 font-bold' : 'text-rose-300'}`} />
        </div>
      ),
      action: () => { setMode(m => m === 'pen' ? 'eraser' : 'pen'); setActiveSubMenu('none'); },
      active: mode === 'eraser',
      activeFill: 'rgba(225, 29, 72, 0.45)',
      activeStroke: 'rgba(251, 113, 133, 0.9)',
    },
    {
      id: 'thickness',
      icon: (
        <div className="flex flex-col items-center justify-center gap-0.5">
          <div
            className="rounded-full bg-cyan-400 transition-all"
            style={{
              width: strokeWidth === 2 ? 4 : strokeWidth === 5 ? 7 : 10,
              height: strokeWidth === 2 ? 4 : strokeWidth === 5 ? 7 : 10,
            }}
          />
          <span className="text-[9px] font-mono text-cyan-300 font-bold">{strokeWidth}px</span>
        </div>
      ),
      action: () => setActiveSubMenu(m => m === 'thickness' ? 'none' : 'thickness'),
      active: activeSubMenu === 'thickness',
      activeFill: 'rgba(6, 182, 212, 0.4)',
      activeStroke: 'rgba(56, 189, 248, 0.8)',
    },
    {
      id: 'style',
      icon: dashStyle === 'dotted' ? (
        <MoreHorizontal className="w-4 h-4 text-amber-400" />
      ) : dashStyle === 'dashed' ? (
        <Scissors className="w-4 h-4 text-indigo-300" />
      ) : (
        <Sliders className="w-4 h-4 text-slate-200" />
      ),
      action: () => setActiveSubMenu(m => m === 'style' ? 'none' : 'style'),
      active: activeSubMenu === 'style' || dashStyle !== 'solid',
      activeFill: 'rgba(129, 140, 248, 0.4)',
      activeStroke: 'rgba(165, 180, 252, 0.8)',
    },
    { id: 'clear', icon: <Trash2 className="w-4 h-4 text-rose-400" />, action: handleClear, active: false, activeFill: '', activeStroke: '' },
  ];

  const canvasNode = (
    <AnnotationCanvas
      isActive={isPenActive}
      color={color}
      strokeWidth={strokeWidth}
      isDashed={dashStyle !== 'solid'}
      dashStyle={dashStyle}
      mode={mode}
      strokesRef={strokesRef}
      undoneRef={undoneRef}
      revision={revision}
      onStrokeComplete={handleStrokeComplete}
    />
  );

  return (
    <>
      {/* Portal Canvas anchored inside #canvas-pen-layer for Zoom/Scroll support */}
      {portalTarget ? (
        ReactDOM.createPortal(canvasNode, portalTarget)
      ) : (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {canvasNode}
        </div>
      )}

      {/* Floating Semicircular Radial Pie-Slice Command Dial Menu */}
      <motion.div
        drag
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="fixed z-9999 w-12 h-12 select-none cursor-grab active:cursor-grabbing"
        style={{ left: 0, top: 0 }}
      >
        <div className="relative w-full h-full">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* SVG Radial Pie Slices Background Container */}
                <svg
                  className="absolute overflow-visible pointer-events-none z-10"
                  style={{
                    width: 320,
                    height: 320,
                    left: -136,
                    top: -136,
                  }}
                  viewBox="-136 -136 320 320"
                >
                  {/* Inner Semicircular Layer Pie Wedges (Radius 28px - 74px) -> 6 Color Pens */}
                  {innerSectors.map((sec, idx) => {
                    const item = innerRingItems[idx];
                    const isActive = item?.active;

                    return (
                      <path
                        key={`inner-wedge-${idx}`}
                        d={getPieSlicePath(28, 74, sec.start, sec.end, isLeftEdge)}
                        fill={isActive ? 'rgba(51, 65, 85, 0.95)' : 'rgba(17, 24, 44, 0.95)'}
                        stroke={isActive ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.15)'}
                        strokeWidth={isActive ? '2' : '1.5'}
                        className="transition-colors duration-150 pointer-events-auto cursor-pointer hover:fill-slate-800"
                        onClick={(e) => { e.stopPropagation(); item.action(); }}
                      />
                    );
                  })}

                  {/* Outer Semicircular Layer Pie Wedges (Radius 76px - 128px) -> 6 Action & Tool Slots */}
                  {outerSectors.map((sec, idx) => {
                    const item = outerRingItems[idx];
                    const isActive = item?.active;
                    const activeFill = item?.activeFill || 'rgba(99, 102, 241, 0.4)';
                    const activeStroke = item?.activeStroke || 'rgba(255, 255, 255, 0.35)';

                    return (
                      <path
                        key={`outer-wedge-${idx}`}
                        d={getPieSlicePath(76, 128, sec.start, sec.end, isLeftEdge)}
                        fill={isActive ? activeFill : 'rgba(12, 16, 32, 0.95)'}
                        stroke={isActive ? activeStroke : 'rgba(255, 255, 255, 0.15)'}
                        strokeWidth={isActive ? '2' : '1.5'}
                        className="transition-colors duration-150 pointer-events-auto cursor-pointer hover:fill-slate-800"
                        onClick={(e) => { e.stopPropagation(); item.action(); }}
                      />
                    );
                  })}
                </svg>

                {/* Inner Semicircular Layer Icons -> 6 Color Pens (Radius = 51px) */}
                {innerSectors.map((sec, idx) => {
                  const item = innerRingItems[idx];
                  const radius = 51;
                  const rad = (sec.center * Math.PI) / 180;
                  const x = radius * Math.cos(rad);
                  const y = radius * Math.sin(rad);

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      animate={{ opacity: 1, x, y, scale: 1 }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      transition={{ delay: idx * 0.02, type: 'spring', stiffness: 450, damping: 26 }}
                      onClick={(e) => { e.stopPropagation(); item.action(); }}
                      className="absolute top-1 left-1 w-10 h-10 flex items-center justify-center pointer-events-auto z-20"
                    >
                      {item.icon}
                    </motion.button>
                  );
                })}

                {/* Outer Semicircular Layer Icons -> 6 Action Tools (Radius = 102px) */}
                {outerSectors.map((sec, idx) => {
                  const item = outerRingItems[idx];
                  const radius = 102;
                  const rad = (sec.center * Math.PI) / 180;
                  const x = radius * Math.cos(rad);
                  const y = radius * Math.sin(rad);

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      animate={{ opacity: 1, x, y, scale: 1 }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      transition={{ delay: 0.05 + idx * 0.02, type: 'spring', stiffness: 450, damping: 26 }}
                      onClick={(e) => { e.stopPropagation(); item.action(); }}
                      className="absolute top-1 left-1 w-10 h-10 flex items-center justify-center pointer-events-auto z-20"
                    >
                      {item.icon}
                    </motion.button>
                  );
                })}

                {/* Interactive Horizontal Pop-up Sub-Menu for 3 Thickness Options */}
                {activeSubMenu === 'thickness' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 8 }}
                    className={`absolute ${isLeftEdge ? 'left-36' : '-left-48'} -top-12 px-3 py-2 bg-slate-900/95 border border-cyan-500/40 rounded-2xl flex items-center gap-2.5 backdrop-blur-xl shadow-2xl z-50 pointer-events-auto`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[
                      { val: 2, label: 'Thin (2px)', dotSize: 5 },
                      { val: 5, label: 'Medium (5px)', dotSize: 8 },
                      { val: 9, label: 'Thick (9px)', dotSize: 12 },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => { setStrokeWidth(opt.val); setActiveSubMenu('none'); }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all ${
                          strokeWidth === opt.val
                            ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/60 shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="rounded-full bg-cyan-400" style={{ width: opt.dotSize, height: opt.dotSize }} />
                        <span>{opt.val}px</span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Interactive Horizontal Pop-up Sub-Menu for 3 Line Style Options */}
                {activeSubMenu === 'style' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 8 }}
                    className={`absolute ${isLeftEdge ? 'left-36' : '-left-56'} -top-12 px-3 py-2 bg-slate-900/95 border border-indigo-500/40 rounded-2xl flex items-center gap-2 backdrop-blur-xl shadow-2xl z-50 pointer-events-auto`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[
                      { type: 'solid', label: 'Solid —' },
                      { type: 'dashed', label: 'Dashed --' },
                      { type: 'dotted', label: 'Dotted ···' },
                    ].map((opt) => (
                      <button
                        key={opt.type}
                        onClick={() => { setDashStyle(opt.type as any); setActiveSubMenu('none'); }}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all ${
                          dashStyle === opt.type
                            ? 'bg-indigo-500/25 text-indigo-200 border border-indigo-400/60 shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center FAB Toggle Button */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); toggleMenu(); }}
            whileTap={{ scale: 0.9 }}
            className={`absolute inset-0 rounded-full flex items-center justify-center shadow-xl transition-all z-30 ${
              isPenActive
                ? mode === 'eraser'
                  ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                  : 'bg-indigo-600 text-white border border-indigo-400/40'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-400/30'
            }`}
          >
            {isOpen ? <X className="w-5.5 h-5.5 pointer-events-none" /> : mode === 'eraser' ? <Eraser className="w-5.5 h-5.5 pointer-events-none" /> : <Pen className="w-5.5 h-5.5 pointer-events-none" />}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};
