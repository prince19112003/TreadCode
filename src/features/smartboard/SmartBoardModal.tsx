import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  Pencil,
  Highlighter,
  Eraser,
  Square,
  Circle,
  Minus,
  Sparkles,
  Grid,
  Trash2,
  Undo2,
  Redo2,
  Maximize2,
  Minimize2,
  X,
  Download,
  GripHorizontal,
  MoveRight
} from 'lucide-react';

export type SmartBoardTool = 'pen' | 'highlighter' | 'eraser' | 'line' | 'arrow' | 'rect' | 'circle';
export type SmartBoardGrid = 'none' | 'grid' | 'dots' | 'lines';

interface Stroke {
  tool: SmartBoardTool;
  color: string;
  size: number;
  points: { x: number; y: number }[];
}

interface SmartBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PALETTE = [
  '#f8fafc', // Crisp White
  '#fbbf24', // Amber Yellow
  '#38bdf8', // Sky Blue
  '#4ade80', // Emerald Green
  '#f472b6', // Neon Pink
  '#a855f7', // Purple
];

const SIZE_PRESETS = [2, 4, 8, 14];

export const SmartBoardModal: React.FC<SmartBoardModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTool, setActiveTool] = useState<SmartBoardTool>('pen');
  const [activeColor, setActiveColor] = useState('#f8fafc');
  const [strokeSize, setStrokeSize] = useState(4);
  const [bgGrid, setBgGrid] = useState<SmartBoardGrid>('grid');

  // Stroke History
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  // Floating Window Position
  const [pos, setPos] = useState({ x: 100, y: 80 });
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0, startY: 0, initX: 100, initY: 80
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Re-draw canvas contents whenever strokes or grid change
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // Draw background grid pattern
    if (bgGrid === 'grid') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const step = 32;
      for (let x = step; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = step; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (bgGrid === 'dots') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      const step = 28;
      for (let x = step; x < width; x += step) {
        for (let y = step; y < height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (bgGrid === 'lines') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      const step = 28;
      for (let y = step; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Helper to render stroke
    const renderStroke = (s: Stroke) => {
      if (s.points.length === 0) return;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (s.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = s.size * 3;
      } else if (s.tool === 'highlighter') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size * 2.5;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
      }

      const p0 = s.points[0];

      if (s.tool === 'pen' || s.tool === 'highlighter' || s.tool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        if (s.points.length === 1) {
          ctx.lineTo(p0.x + 0.1, p0.y + 0.1);
        } else {
          for (let i = 1; i < s.points.length; i++) {
            const pt = s.points[i];
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
      } else if (s.points.length > 1) {
        const pLast = s.points[s.points.length - 1];
        ctx.beginPath();
        if (s.tool === 'line') {
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(pLast.x, pLast.y);
        } else if (s.tool === 'arrow') {
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(pLast.x, pLast.y);
          ctx.stroke();
          // Arrow head
          const angle = Math.atan2(pLast.y - p0.y, pLast.x - p0.x);
          const headLen = 14;
          ctx.beginPath();
          ctx.moveTo(pLast.x, pLast.y);
          ctx.lineTo(pLast.x - headLen * Math.cos(angle - Math.PI / 6), pLast.y - headLen * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(pLast.x, pLast.y);
          ctx.lineTo(pLast.x - headLen * Math.cos(angle + Math.PI / 6), pLast.y - headLen * Math.sin(angle + Math.PI / 6));
        } else if (s.tool === 'rect') {
          ctx.rect(p0.x, p0.y, pLast.x - p0.x, pLast.y - p0.y);
        } else if (s.tool === 'circle') {
          const rx = (pLast.x - p0.x) / 2;
          const ry = (pLast.y - p0.y) / 2;
          const cx = p0.x + rx;
          const cy = p0.y + ry;
          ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
        }
        ctx.stroke();
      }

      ctx.restore();
    };

    strokes.forEach(renderStroke);
    if (currentStroke) renderStroke(currentStroke);
  }, [strokes, currentStroke, bgGrid]);

  // Adjust Canvas Resolution for High DPR
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    redraw();
  }, [isOpen, isFullscreen, redraw]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Get pointer coordinates relative to canvas
  const getCanvasPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const point = getCanvasPos(e);
    const newS: Stroke = {
      tool: activeTool,
      color: activeColor,
      size: strokeSize,
      points: [point]
    };
    setCurrentStroke(newS);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current || !currentStroke) return;
    const point = getCanvasPos(e);

    setCurrentStroke(prev => {
      if (!prev) return null;
      if (['pen', 'highlighter', 'eraser'].includes(prev.tool)) {
        return { ...prev, points: [...prev.points, point] };
      } else {
        // Shapes only need start point + current cursor
        return { ...prev, points: [prev.points[0], point] };
      }
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (currentStroke) {
      setStrokes(prev => [...prev, currentStroke]);
      setRedoStack([]);
      setCurrentStroke(null);
    }
  };

  // Actions
  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    setStrokes(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, last]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setStrokes(prev => [...prev, last]);
  };

  const handleClear = () => {
    setStrokes([]);
    setRedoStack([]);
    setCurrentStroke(null);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `TreadCode_SmartBoard_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Window Drag Handlers
  const handleWindowHeaderPointerDown = (e: React.PointerEvent) => {
    if (isFullscreen) return;
    setIsDraggingWindow(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: pos.x,
      initY: pos.y
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleWindowHeaderPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingWindow) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    setPos({
      x: Math.max(10, Math.min(window.innerWidth - 300, dragStartRef.current.initX + dx)),
      y: Math.max(10, Math.min(window.innerHeight - 200, dragStartRef.current.initY + dy))
    });
  };

  const handleWindowHeaderPointerUp = (e: React.PointerEvent) => {
    if (isDraggingWindow) {
      setIsDraggingWindow(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className={
          isFullscreen
            ? 'fixed inset-0 z-9999 flex flex-col bg-[#05060d]/95 backdrop-blur-2xl select-none overflow-hidden'
            : 'fixed z-9999 rounded-2xl border border-indigo-500/30 bg-[#070914]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] flex flex-col select-none overflow-hidden'
        }
        style={
          isFullscreen
            ? {}
            : {
                left: pos.x,
                top: pos.y,
                width: '780px',
                height: '520px'
              }
        }
      >
        {/* Floating / Fullscreen Header */}
        <div
          onPointerDown={handleWindowHeaderPointerDown}
          onPointerMove={handleWindowHeaderPointerMove}
          onPointerUp={handleWindowHeaderPointerUp}
          className={`h-10 px-4 flex items-center justify-between border-b border-white/10 shrink-0 bg-slate-950/80 ${
            !isFullscreen ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            {!isFullscreen && <GripHorizontal size={16} className="text-slate-500" />}
            <Sparkles size={16} className="text-amber-400" />
            <span className="font-extrabold text-xs text-white tracking-wide">
              SmartBoard <span className="text-indigo-400 font-mono text-[10px]">v1.0</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5" onPointerDown={e => e.stopPropagation()}>
            <button
              onClick={() => setIsFullscreen(f => !f)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={isFullscreen ? 'Windowed Mode' : 'Fullscreen Smart Board'}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Close Board"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Board Workspace */}
        <div className="flex-1 relative overflow-hidden bg-[#04050a]">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full h-full touch-none cursor-crosshair"
          />

          {/* Floating Tool Controls Dock */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-2xl bg-slate-950/90 border border-white/15 shadow-2xl backdrop-blur-md">
            {/* Drawing Tools */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTool('pen')}
                className={`p-2 rounded-lg transition-all ${
                  activeTool === 'pen' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Pen"
              >
                <Pencil size={15} />
              </button>

              <button
                onClick={() => setActiveTool('highlighter')}
                className={`p-2 rounded-lg transition-all ${
                  activeTool === 'highlighter' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Highlighter"
              >
                <Highlighter size={15} />
              </button>

              <button
                onClick={() => setActiveTool('eraser')}
                className={`p-2 rounded-lg transition-all ${
                  activeTool === 'eraser' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Eraser"
              >
                <Eraser size={15} />
              </button>
            </div>

            <div className="w-px h-6 bg-slate-800" />

            {/* Shapes */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTool('line')}
                className={`p-2 rounded-lg transition-all ${
                  activeTool === 'line' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Straight Line"
              >
                <Minus size={15} />
              </button>
              <button
                onClick={() => setActiveTool('arrow')}
                className={`p-2 rounded-lg transition-all ${
                  activeTool === 'arrow' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Arrow Pointer"
              >
                <MoveRight size={15} />
              </button>
              <button
                onClick={() => setActiveTool('rect')}
                className={`p-2 rounded-lg transition-all ${
                  activeTool === 'rect' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Rectangle Box"
              >
                <Square size={15} />
              </button>
              <button
                onClick={() => setActiveTool('circle')}
                className={`p-2 rounded-lg transition-all ${
                  activeTool === 'circle' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Circle"
              >
                <Circle size={15} />
              </button>
            </div>

            <div className="w-px h-6 bg-slate-800" />

            {/* Colors */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
              {COLOR_PALETTE.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveColor(c)}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    activeColor === c ? 'scale-125 ring-2 ring-indigo-400' : 'hover:scale-110 opacity-80'
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>

            <div className="w-px h-6 bg-slate-800" />

            {/* Stroke Thickness */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              {SIZE_PRESETS.map(sz => (
                <button
                  key={sz}
                  onClick={() => setStrokeSize(sz)}
                  className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
                    strokeSize === sz ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sz}px
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-slate-800" />

            {/* Grid & Actions */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setBgGrid(g => (g === 'grid' ? 'dots' : g === 'dots' ? 'lines' : g === 'lines' ? 'none' : 'grid'))}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={`Background Grid: ${bgGrid.toUpperCase()}`}
              >
                <Grid size={15} />
              </button>
              <button
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Undo"
              >
                <Undo2 size={15} />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Redo"
              >
                <Redo2 size={15} />
              </button>
              <button
                onClick={handleClear}
                className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Clear Canvas"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={handleExport}
                className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="Export Image (.png)"
              >
                <Download size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
