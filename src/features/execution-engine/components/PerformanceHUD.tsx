import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Zap, ChevronDown, X, GripVertical, HardDrive, Monitor, Maximize2 } from 'lucide-react';

interface PerformanceHUDProps {
  isOpen: boolean;
  onClose: () => void;
  isLight?: boolean;
}

export const PerformanceHUD: React.FC<PerformanceHUDProps> = ({
  isOpen,
  onClose,
  isLight = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pos, setPos] = useState(() => {
    if (typeof window !== 'undefined') {
      const defaultX = Math.max(16, window.innerWidth - 370);
      const defaultY = Math.max(16, window.innerHeight - 360);
      return { x: defaultX, y: defaultY };
    }
    return { x: 50, y: 50 };
  });

  // Direct DOM references for zero-overhead telemetry updates (0 React re-renders)
  const fpsTextRef = useRef<HTMLSpanElement | null>(null);
  const fpsPillRef = useRef<HTMLSpanElement | null>(null);
  const frameTimeRef = useRef<HTMLSpanElement | null>(null);
  const jankMaxRef = useRef<HTMLSpanElement | null>(null);
  const heapUsedRef = useRef<HTMLSpanElement | null>(null);
  const heapPillRef = useRef<HTMLSpanElement | null>(null);
  const heapTotalRef = useRef<HTMLSpanElement | null>(null);
  const heapLimitRef = useRef<HTMLSpanElement | null>(null);
  const heapBarRef = useRef<HTMLDivElement | null>(null);
  const domCountRef = useRef<HTMLSpanElement | null>(null);
  const fpsBadgeRef = useRef<HTMLSpanElement | null>(null);
  const displayHzRef = useRef<HTMLSpanElement | null>(null);
  const viewportRef = useRef<HTMLSpanElement | null>(null);

  // Dragging interaction state
  const isDraggingRef = useRef(false);
  const dragStartPointer = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const totalMovedDistance = useRef(0);

  // 100% Authentic Real-Time Measurement Loop
  useEffect(() => {
    if (!isOpen) return;

    let animFrameId: number;
    let frameTimestamps: number[] = [];
    let recentDeltas: number[] = [];
    let lastFrameTime = 0;
    let lastMetricsSampleTime = performance.now();
    let maxFrameDeltaInInterval = 0;
    let detectedDisplayHz = 0;

    const measureLoop = (currentTime: number) => {
      // 1. Calculate inter-frame delta
      if (lastFrameTime > 0) {
        const delta = currentTime - lastFrameTime;

        // Skip pauses if tab was hidden, minimized, or backgrounded (>250ms)
        if (delta > 250) {
          frameTimestamps = [];
          recentDeltas = [];
          lastFrameTime = currentTime;
          lastMetricsSampleTime = currentTime;
          maxFrameDeltaInInterval = 0;
          animFrameId = requestAnimationFrame(measureLoop);
          return;
        }

        recentDeltas.push(delta);
        if (recentDeltas.length > 50) {
          recentDeltas.shift();
        }

        if (delta > maxFrameDeltaInInterval) {
          maxFrameDeltaInInterval = delta;
        }
      }
      lastFrameTime = currentTime;
      frameTimestamps.push(currentTime);

      // Maintain rolling 1000ms frame window
      while (frameTimestamps.length > 0 && frameTimestamps[0] < currentTime - 1000) {
        frameTimestamps.shift();
      }

      // Sample verified empirical metrics every 450ms directly into DOM refs
      const elapsedSinceLastSample = currentTime - lastMetricsSampleTime;
      if (elapsedSinceLastSample >= 450 && frameTimestamps.length >= 3) {
        // Detect native monitor refresh rate from median frame delta
        if (recentDeltas.length >= 12) {
          const sorted = [...recentDeltas].sort((a, b) => a - b);
          const medianDelta = sorted[Math.floor(sorted.length / 2)];
          if (medianDelta > 0) {
            const rawHz = 1000 / medianDelta;
            const standardRates = [30, 40, 48, 50, 60, 72, 75, 90, 120, 144, 165, 240];
            let matchedHz = Math.round(rawHz);
            for (const std of standardRates) {
              if (Math.abs(rawHz - std) <= 2.2) {
                matchedHz = std;
                break;
              }
            }
            detectedDisplayHz = matchedHz;
            if (displayHzRef.current) {
              displayHzRef.current.innerText = `(${detectedDisplayHz} Hz Display)`;
            }
          }
        }

        // Rolling FPS calculation
        const windowDuration = frameTimestamps[frameTimestamps.length - 1] - frameTimestamps[0];
        const intervalsCount = frameTimestamps.length - 1;
        const rawFps = windowDuration > 0 ? (intervalsCount * 1000) / windowDuration : 0;

        // Exact lock if running at native display refresh rate without dropped frames
        let fps = Math.round(rawFps);
        if (detectedDisplayHz > 0 && Math.abs(rawFps - detectedDisplayHz) <= 0.8) {
          fps = detectedDisplayHz;
        }

        // Exact frame latency
        const avgFrameMs = intervalsCount > 0
          ? (windowDuration / intervalsCount).toFixed(1)
          : (1000 / Math.max(1, fps)).toFixed(1);

        const expectedFrameMs = detectedDisplayHz > 0 ? (1000 / detectedDisplayHz) : (parseFloat(avgFrameMs) || 16.6);
        const isJank = maxFrameDeltaInInterval > (expectedFrameMs * 1.8);

        // 1. Live FPS & Collapsed Pill
        if (fpsTextRef.current) {
          fpsTextRef.current.innerText = `${fps} FPS`;
          fpsTextRef.current.style.color = isJank ? '#f87171' : '#34d399';
        }
        if (fpsPillRef.current) {
          fpsPillRef.current.innerText = `${fps} FPS`;
        }

        // 2. Verified Status Badge (Adaptive to any refresh rate: 30Hz, 40Hz, 60Hz, 120Hz)
        if (fpsBadgeRef.current) {
          if (!isJank) {
            fpsBadgeRef.current.innerText = 'STABLE';
            fpsBadgeRef.current.className = 'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80';
          } else {
            fpsBadgeRef.current.innerText = 'FRAME DROP';
            fpsBadgeRef.current.className = 'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/80';
          }
        }

        // 3. Frame Render Latency & Peak Spike
        if (frameTimeRef.current) {
          frameTimeRef.current.innerText = `${avgFrameMs} ms`;
        }
        if (jankMaxRef.current) {
          jankMaxRef.current.innerText = `${maxFrameDeltaInInterval.toFixed(1)} ms`;
        }

        // 4. Exact V8 Heap Memory Allocation
        const perfMemory = (performance as unknown as {
          memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          };
        }).memory;

        if (perfMemory) {
          const usedMB = (perfMemory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
          const totalMB = (perfMemory.totalJSHeapSize / (1024 * 1024)).toFixed(1);
          const limitMB = Math.round(perfMemory.jsHeapSizeLimit / (1024 * 1024));

          if (heapUsedRef.current) heapUsedRef.current.innerText = `${usedMB} MB`;
          if (heapPillRef.current) heapPillRef.current.innerText = `${usedMB} MB`;
          if (heapTotalRef.current) heapTotalRef.current.innerText = `${totalMB} MB`;
          if (heapLimitRef.current) heapLimitRef.current.innerText = `${limitMB} MB`;

          if (heapBarRef.current && perfMemory.totalJSHeapSize > 0) {
            const pct = Math.min(100, Math.round((perfMemory.usedJSHeapSize / perfMemory.totalJSHeapSize) * 100));
            heapBarRef.current.style.width = `${pct}%`;
          }
        } else {
          if (heapUsedRef.current) heapUsedRef.current.innerText = 'Native Engine';
          if (heapPillRef.current) heapPillRef.current.innerText = 'Active';
          if (heapTotalRef.current) heapTotalRef.current.innerText = 'Managed';
          if (heapLimitRef.current) heapLimitRef.current.innerText = 'System';
        }

        // 5. Exact Active DOM Node Count
        if (domCountRef.current) {
          const nodeCount = document.getElementsByTagName('*').length;
          domCountRef.current.innerText = `${nodeCount.toLocaleString()} nodes`;
        }

        // 6. Live Viewport Resolution
        if (viewportRef.current) {
          viewportRef.current.innerText = `${window.innerWidth}×${window.innerHeight} (${window.devicePixelRatio || 1}x DPI)`;
        }

        // Reset interval tracking
        lastMetricsSampleTime = currentTime;
        maxFrameDeltaInInterval = 0;
      }

      animFrameId = requestAnimationFrame(measureLoop);
    };

    animFrameId = requestAnimationFrame(measureLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [isOpen]);

  // Pointer drag handling for floating movable window
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isDraggingRef.current = true;
    totalMovedDistance.current = 0;
    dragStartPointer.current = { x: e.clientX, y: e.clientY };
    dragStartPos.current = { x: pos.x, y: pos.y };

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartPointer.current.x;
      const dy = moveEvent.clientY - dragStartPointer.current.y;
      totalMovedDistance.current = Math.hypot(dx, dy);

      const targetWidth = isCollapsed ? 180 : 360;
      const targetHeight = isCollapsed ? 42 : 320;

      const maxX = Math.max(10, window.innerWidth - targetWidth - 10);
      const maxY = Math.max(10, window.innerHeight - targetHeight - 10);

      const nextX = Math.max(10, Math.min(maxX, dragStartPos.current.x + dx));
      const nextY = Math.max(10, Math.min(maxY, dragStartPos.current.y + dy));

      setPos({ x: nextX, y: nextY });
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }, [pos, isCollapsed]);

  if (!isOpen) return null;

  /* =====================================================================
     COLLAPSED STATE: Floating Movable Mini-Pill
     ===================================================================== */
  if (isCollapsed) {
    return (
      <div
        onPointerDown={handlePointerDown}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          touchAction: 'none',
        }}
        className="fixed z-9999 select-none cursor-grab active:cursor-grabbing animate-in fade-in duration-150"
      >
        <div
          onClick={(e) => {
            if (totalMovedDistance.current < 5) {
              e.stopPropagation();
              setIsCollapsed(false);
            }
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all shadow-sm ${
            isLight
              ? 'bg-slate-900 text-white border-slate-700 hover:border-slate-500'
              : 'bg-zinc-950 text-zinc-100 border-zinc-700 hover:border-zinc-500'
          }`}
          title="Drag to move, click to expand Performance HUD"
        >
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Zap size={13} className="shrink-0" />
          </div>

          <span ref={fpsPillRef} className="text-emerald-400">
            -- FPS
          </span>
          <span className="text-zinc-500">|</span>
          <span ref={heapPillRef} className="text-zinc-300">
            -- MB
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="ml-1 p-0.5 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close HUD"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================================
     EXPANDED STATE: 100% Authentic Real-Time Metrics Window
     ===================================================================== */
  return (
    <div
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        touchAction: 'none',
      }}
      className="fixed z-9999 w-87.5 sm:w-90 rounded-lg border border-zinc-800 bg-zinc-950/98 text-zinc-100 font-mono shadow-md select-none flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {/* ── DRAGGABLE HEADER ── */}
      <div
        onPointerDown={handlePointerDown}
        className="flex items-center justify-between px-3 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <GripVertical size={13} className="text-zinc-500 shrink-0" />
          <Zap size={14} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-bold tracking-tight text-white">
            Performance
          </span>
          <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Collapse to Pill Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(true);
            }}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Minimize"
          >
            <ChevronDown size={14} />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── METRICS BODY ── */}
      <div className="p-3.5 space-y-3 text-xs">

        {/* Metric 1: FPS */}
        <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-400 uppercase font-semibold">FPS</span>
              <span ref={displayHzRef} className="text-[10px] text-zinc-500 font-mono">
                (-- Hz)
              </span>
            </div>
            <span ref={fpsBadgeRef} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
              STABLE
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span ref={fpsTextRef} className="text-xl font-bold font-mono text-emerald-400">
              -- FPS
            </span>
            <div className="text-[10px] text-right text-zinc-400 space-x-2">
              <span>Avg: <span ref={frameTimeRef} className="text-zinc-200">-- ms</span></span>
              <span>•</span>
              <span>Spike: <span ref={jankMaxRef} className="text-zinc-200">-- ms</span></span>
            </div>
          </div>
        </div>

        {/* Metric 2: Memory */}
        <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <HardDrive size={12} className="text-zinc-400" />
              <span className="text-[11px] text-zinc-400 uppercase font-semibold">Memory</span>
            </div>
            <span className="text-[10px] text-zinc-400">
              Max: <span ref={heapLimitRef} className="text-zinc-200">-- MB</span>
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 block">Used</span>
              <span ref={heapUsedRef} className="text-base font-bold font-mono text-white">
                -- MB
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 block">Allocated</span>
              <span ref={heapTotalRef} className="text-xs font-mono text-zinc-300">
                -- MB
              </span>
            </div>
          </div>

          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              ref={heapBarRef}
              style={{ width: '0%' }}
              className="h-full bg-emerald-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Metric 3 & 4: DOM Elements & Resolution */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800/80 space-y-1">
            <div className="flex items-center gap-1.5">
              <Monitor size={12} className="text-zinc-400" />
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">DOM Elements</span>
            </div>
            <span ref={domCountRef} className="block text-xs font-bold text-zinc-200 truncate">
              --
            </span>
          </div>

          <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800/80 space-y-1">
            <div className="flex items-center gap-1.5">
              <Maximize2 size={12} className="text-zinc-400" />
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Resolution</span>
            </div>
            <span ref={viewportRef} className="block text-xs font-bold text-zinc-200 truncate">
              --
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-zinc-400 pt-1 flex items-center justify-end border-t border-zinc-800/80">
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="text-zinc-400 hover:text-white underline cursor-pointer"
          >
            Collapse
          </button>
        </div>
      </div>
    </div>
  );
};
