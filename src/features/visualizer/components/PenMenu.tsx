import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'motion/react';
import { Pen, Eraser, Undo2, Redo2, Trash2, Sliders, Scissors, MoreHorizontal, X } from 'lucide-react';
import { AnnotationCanvas } from './AnnotationCanvas';
import type { Stroke } from './AnnotationCanvas';

const SIX_COLORS = [
  { hex: '#ffffff', label: 'White' },
  { hex: '#10b981', label: 'Emerald' },
  { hex: '#f43f5e', label: 'Rose' },
  { hex: '#06b6d4', label: 'Cyan' },
  { hex: '#f59e0b', label: 'Amber' },
  { hex: '#a855f7', label: 'Purple' },
];

// Radial Arc Angles: Spans a clean 160° arc pointing inwards from the screen edge
const RADIAL_ANGLES_LEFT = [-80, -48, -16, 16, 48, 80];
const RADIAL_ANGLES_RIGHT = [100, 132, 164, 196, 228, 260];

const RADIUS_INNER = 52;
const RADIUS_OUTER = 98;

export const PenMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPenActive, setIsPenActive] = useState(false);
  const [mode, setMode] = useState<'pen' | 'eraser' | 'palm'>('pen');
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
    const checkTarget = () => {
      const el = document.getElementById('canvas-pen-layer');
      setPortalTarget(prev => (prev === el ? prev : el));
    };
    checkTarget();

    const observer = new MutationObserver(() => {
      checkTarget();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Floating position
  const [pos, setPos] = useState({ x: window.innerWidth - 64, y: window.innerHeight * 0.7 });
  const [isLeftEdge, setIsLeftEdge] = useState(false);

  const handleFabClick = () => {
    if (!isPenActive) {
      setIsPenActive(true);
      setMode('pen');
      setIsOpen(true);
      setActiveSubMenu('none');
    } else {
      setIsPenActive(false);
      setMode('palm');
      setIsOpen(false);
      setActiveSubMenu('none');
    }
  };

  const handleStrokeStart = () => {
    setIsOpen(false);
    setActiveSubMenu('none');
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

  const angles = isLeftEdge ? RADIAL_ANGLES_LEFT : RADIAL_ANGLES_RIGHT;
  const canUndo = strokesRef.current.length > 0;
  const canRedo = undoneRef.current.length > 0;

  // Outer Ring: 6 Action Tools
  const outerRingItems = [
    {
      id: 'eraser',
      title: mode === 'eraser' ? 'Eraser Active (Click to switch to Pen)' : 'Eraser Tool',
      icon: <Eraser size={16} />,
      action: () => {
        setMode(m => (m === 'eraser' ? 'pen' : 'eraser'));
        setIsPenActive(true);
        setActiveSubMenu('none');
      },
      active: mode === 'eraser',
      activeClass: 'bg-rose-600 border-rose-500 text-white',
      disabled: false,
    },
    {
      id: 'thickness',
      title: `Stroke Width: ${strokeWidth}px`,
      icon: (
        <div className="flex flex-col items-center justify-center gap-0.5">
          <div
            className="rounded-full bg-cyan-400"
            style={{
              width: strokeWidth === 2 ? 4 : strokeWidth === 4 ? 6 : strokeWidth === 7 ? 8 : 10,
              height: strokeWidth === 2 ? 4 : strokeWidth === 4 ? 6 : strokeWidth === 7 ? 8 : 10,
            }}
          />
          <span className="text-[8px] font-mono font-bold leading-none">{strokeWidth}px</span>
        </div>
      ),
      action: () => setActiveSubMenu(m => (m === 'thickness' ? 'none' : 'thickness')),
      active: activeSubMenu === 'thickness',
      activeClass: 'bg-cyan-950 border-cyan-400 text-cyan-300',
      disabled: false,
    },
    {
      id: 'style',
      title: `Line Style: ${dashStyle}`,
      icon:
        dashStyle === 'dotted' ? (
          <MoreHorizontal size={16} className="text-amber-400" />
        ) : dashStyle === 'dashed' ? (
          <Scissors size={16} className="text-indigo-300" />
        ) : (
          <Sliders size={16} className="text-slate-200" />
        ),
      action: () => setActiveSubMenu(m => (m === 'style' ? 'none' : 'style')),
      active: activeSubMenu === 'style' || dashStyle !== 'solid',
      activeClass: 'bg-indigo-950 border-indigo-400 text-indigo-300',
      disabled: false,
    },
    {
      id: 'undo',
      title: 'Undo (Ctrl+Z)',
      icon: <Undo2 size={16} />,
      action: handleUndo,
      active: false,
      activeClass: '',
      disabled: !canUndo,
    },
    {
      id: 'redo',
      title: 'Redo (Ctrl+Y)',
      icon: <Redo2 size={16} />,
      action: handleRedo,
      active: canRedo,
      activeClass: 'text-emerald-400 border-emerald-500',
      disabled: !canRedo,
    },
    {
      id: 'clear',
      title: 'Clear Canvas',
      icon: <Trash2 size={16} className="text-rose-400" />,
      action: handleClear,
      active: false,
      activeClass: '',
      disabled: strokesRef.current.length === 0,
    },
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
      onStrokeStart={handleStrokeStart}
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

      {/* Floating Radial Format Command Menu */}
      <motion.div
        drag
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ duration: 0 }}
        className="fixed z-9999 w-11 h-11 select-none cursor-grab active:cursor-grabbing"
        style={{ left: 0, top: 0 }}
      >
        <div className="relative w-11 h-11">
          {/* Radial Items Container */}
          {isOpen && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Inner Radial Arc: 6 Color Swatches */}
              {angles.map((deg, idx) => {
                const c = SIX_COLORS[idx];
                const rad = (deg * Math.PI) / 180;
                const x = Math.round(RADIUS_INNER * Math.cos(rad));
                const y = Math.round(RADIUS_INNER * Math.sin(rad));
                const isSelected = mode === 'pen' && color === c.hex;

                return (
                  <button
                    key={c.hex}
                    onClick={(e) => {
                      e.stopPropagation();
                      setColor(c.hex);
                      setMode('pen');
                      setIsPenActive(true);
                      setActiveSubMenu('none');
                    }}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      left: 22,
                      top: 22,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center pointer-events-auto transition-transform active:scale-95 border bg-[#0f172a] z-20 ${
                      isSelected
                        ? 'border-white ring-2 ring-white/40 scale-110'
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                    title={`${c.label} Pen`}
                  >
                    <span
                      className="w-4.5 h-4.5 rounded-full"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                );
              })}

              {/* Outer Radial Arc: 6 Action Tools */}
              {angles.map((deg, idx) => {
                const item = outerRingItems[idx];
                const rad = (deg * Math.PI) / 180;
                const x = Math.round(RADIUS_OUTER * Math.cos(rad));
                const y = Math.round(RADIUS_OUTER * Math.sin(rad));

                return (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                    disabled={item.disabled}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      left: 22,
                      top: 22,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-8.5 h-8.5 rounded-full flex items-center justify-center pointer-events-auto transition-transform active:scale-95 border z-20 ${
                      item.disabled
                        ? 'bg-[#0b0f19] border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                        : item.active
                        ? item.activeClass
                        : 'bg-[#0f172a] border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title={item.title}
                  >
                    {item.icon}
                  </button>
                );
              })}

              {/* Thickness Sub-Menu */}
              {activeSubMenu === 'thickness' && (
                <div
                  className={`absolute ${isLeftEdge ? 'left-32' : '-left-56'} -top-12 p-1.5 bg-[#0f172a] border border-slate-700 rounded-lg flex items-center gap-1.5 z-50 pointer-events-auto`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { val: 2, label: '2px' },
                    { val: 4, label: '4px' },
                    { val: 7, label: '7px' },
                    { val: 10, label: '10px' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => { setStrokeWidth(opt.val); setActiveSubMenu('none'); }}
                      className={`flex flex-col items-center gap-1 px-2 py-1 rounded text-[10px] font-mono font-medium transition-colors ${
                        strokeWidth === opt.val
                          ? 'bg-cyan-950 border border-cyan-500 text-cyan-200'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                      }`}
                    >
                      <span
                        className="rounded-full bg-cyan-400"
                        style={{ width: opt.val, height: opt.val }}
                      />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Line Style Sub-Menu */}
              {activeSubMenu === 'style' && (
                <div
                  className={`absolute ${isLeftEdge ? 'left-32' : '-left-60'} -top-12 p-1.5 bg-[#0f172a] border border-slate-700 rounded-lg flex items-center gap-1.5 z-50 pointer-events-auto`}
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
                      className={`px-2.5 py-1.5 rounded text-[11px] font-mono font-medium transition-colors ${
                        dashStyle === opt.type
                          ? 'bg-indigo-950 border border-indigo-500 text-indigo-200'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Central Hub Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleFabClick(); }}
            className={`w-11 h-11 rounded-full flex items-center justify-center pointer-events-auto transition-colors active:scale-95 border z-30 cursor-pointer ${
              isOpen
                ? 'bg-[#0f172a] border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800'
                : isPenActive
                ? mode === 'eraser'
                  ? 'bg-rose-600 border-rose-500 text-white'
                  : 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-[#0f172a] border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={
              isOpen
                ? 'Close Menu'
                : !isPenActive
                ? 'Open Pen Menu & Draw'
                : mode === 'eraser'
                ? 'Eraser Mode (Tap to close)'
                : 'Pen Mode (Tap to close)'
            }
          >
            {isOpen ? (
              <X size={18} />
            ) : mode === 'eraser' ? (
              <Eraser size={18} />
            ) : (
              <Pen size={18} />
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
};
