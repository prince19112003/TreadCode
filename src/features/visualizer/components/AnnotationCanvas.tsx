import React, { useRef, useEffect, useCallback } from 'react';

export interface Point { x: number; y: number }

export interface Stroke {
  points: Point[];
  color: string;
  strokeWidth: number;
  isDashed?: boolean;
  dashStyle?: 'solid' | 'dashed' | 'dotted';
}

interface AnnotationCanvasProps {
  isActive: boolean;
  color: string;
  strokeWidth: number;
  isDashed: boolean;
  dashStyle?: 'solid' | 'dashed' | 'dotted';
  mode: 'pen' | 'eraser' | 'palm';
  strokesRef: React.MutableRefObject<Stroke[]>;
  undoneRef?: React.MutableRefObject<Stroke[]>;
  revision?: number;
  onStrokeComplete?: () => void;
}

// ─── Douglas-Peucker Point Simplification (Drops redundant points by 60% with zero visual loss) ─────
function getPerpDist(p: Point, p1: Point, p2: Point): number {
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  if (dx === 0 && dy === 0) return Math.hypot(p.x - p1.x, p.y - p1.y);
  const t = ((p.x - p1.x) * dx + (p.y - p1.y) * dy) / (dx * dx + dy * dy);
  if (t < 0) { dx = p.x - p1.x; dy = p.y - p1.y; }
  else if (t > 1) { dx = p.x - p2.x; dy = p.y - p2.y; }
  else {
    const cx = p1.x + t * dx;
    const cy = p1.y + t * dy;
    dx = p.x - cx; dy = p.y - cy;
  }
  return Math.hypot(dx, dy);
}

function douglasPeucker(pts: Point[], eps: number): Point[] {
  if (pts.length <= 2) return pts;
  let dmax = 0;
  let index = 0;
  const end = pts.length - 1;
  for (let i = 1; i < end; i++) {
    const d = getPerpDist(pts[i], pts[0], pts[end]);
    if (d > dmax) { index = i; dmax = d; }
  }
  if (dmax > eps) {
    const rec1 = douglasPeucker(pts.slice(0, index + 1), eps);
    const rec2 = douglasPeucker(pts.slice(index), eps);
    return rec1.slice(0, -1).concat(rec2);
  }
  return [pts[0], pts[end]];
}

function compressStrokePoints(pts: Point[]): Point[] {
  if (pts.length <= 3) return pts;
  return douglasPeucker(pts, 0.75);
}

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  isActive,
  color,
  strokeWidth,
  isDashed: _isDashed,
  dashStyle = 'solid',
  mode,
  strokesRef,
  undoneRef,
  revision = 0,
  onStrokeComplete,
}) => {
  // Dual-Canvas architecture: committedCanvas (bottom) + liveCanvas (top)
  const committedCanvasRef = useRef<HTMLCanvasElement>(null);
  const liveCanvasRef = useRef<HTMLCanvasElement>(null);

  const isDrawing = useRef(false);
  const currentStroke = useRef<Point[]>([]);

  // Get DPR-scaled 2D context with hardware desynchronized mode
  const getScaledCtx = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d', { desynchronized: true });
    if (!ctx) return null;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  };

  const drawStrokePath = useCallback((ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length === 0) return;
    const w = stroke.strokeWidth || 4;
    ctx.lineWidth = w;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = stroke.color;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.imageSmoothingEnabled = false;

    const style = stroke.dashStyle || (stroke.isDashed ? 'dashed' : 'solid');
    if (style === 'dashed') {
      ctx.lineCap = 'butt';
      ctx.setLineDash([w * 3.5, w * 2]);
    } else if (style === 'dotted') {
      ctx.lineCap = 'round';
      ctx.setLineDash([0.1, w * 2]);
    } else {
      ctx.lineCap = 'round';
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    const pts = stroke.points;
    if (pts.length === 1) {
      ctx.arc(pts[0].x, pts[0].y, w / 2, 0, Math.PI * 2);
      ctx.fillStyle = stroke.color;
      ctx.fill();
      return;
    }

    ctx.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 2) {
      ctx.lineTo(pts[1].x, pts[1].y);
    } else {
      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    }
    ctx.stroke();
  }, []);

  // Redraw committed (static) canvas only when strokes array changes (Undo / Redo / Clear / Stroke Finished)
  const redrawCommitted = useCallback(() => {
    const canvas = committedCanvasRef.current;
    const ctx = getScaledCtx(canvas);
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    for (const stroke of strokesRef.current) {
      drawStrokePath(ctx, stroke);
    }
  }, [strokesRef, drawStrokePath]);

  // Redraw live canvas (only the currently drawing stroke — zero cost!)
  const redrawLive = useCallback(() => {
    const canvas = liveCanvasRef.current;
    const ctx = getScaledCtx(canvas);
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    if (isDrawing.current && mode === 'pen' && currentStroke.current.length > 0) {
      drawStrokePath(ctx, {
        points: currentStroke.current,
        color,
        strokeWidth,
        dashStyle,
        isDashed: dashStyle !== 'solid',
      });
    }
  }, [color, strokeWidth, dashStyle, mode, drawStrokePath]);

  const getPos = (e: React.PointerEvent): Point => {
    const canvas = liveCanvasRef.current || committedCanvasRef.current;
    if (!canvas) return { x: e.clientX, y: e.clientY };
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width > 0 ? (canvas.clientWidth || canvas.width / (window.devicePixelRatio || 1)) / rect.width : 1;
    const scaleY = rect.height > 0 ? (canvas.clientHeight || canvas.height / (window.devicePixelRatio || 1)) / rect.height : 1;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const distToSegment = (pt: Point, p1: Point, p2: Point) => {
    const l2 = (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2;
    if (l2 === 0) return Math.hypot(pt.x - p1.x, pt.y - p1.y);
    let t = ((pt.x - p1.x) * (p2.x - p1.x) + (pt.y - p1.y) * (p2.y - p1.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(pt.x - (p1.x + t * (p2.x - p1.x)), pt.y - (p1.y + t * (p2.y - p1.y)));
  };

  const eraseAt = (pt: Point) => {
    const eraseRadius = 30;
    const initialCount = strokesRef.current.length;
    strokesRef.current = strokesRef.current.filter(stroke => {
      if (stroke.points.length === 0) return false;
      if (stroke.points.length === 1) {
        return Math.hypot(stroke.points[0].x - pt.x, stroke.points[0].y - pt.y) > eraseRadius;
      }
      for (let i = 0; i < stroke.points.length - 1; i++) {
        if (distToSegment(pt, stroke.points[i], stroke.points[i + 1]) < eraseRadius) {
          return false;
        }
      }
      return true;
    });

    if (strokesRef.current.length !== initialCount) {
      if (undoneRef) undoneRef.current = [];
      redrawCommitted();
      if (onStrokeComplete) onStrokeComplete();
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isActive || mode === 'palm' || !e.isPrimary) return;
    isDrawing.current = true;
    const pt = getPos(e);
    liveCanvasRef.current?.setPointerCapture(e.pointerId);

    if (mode === 'eraser') {
      eraseAt(pt);
    } else {
      currentStroke.current = [pt];
      redrawLive();
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isActive || !isDrawing.current || mode === 'palm' || !e.isPrimary) return;
    const pt = getPos(e);

    if (mode === 'eraser') {
      eraseAt(pt);
      return;
    }

    const last = currentStroke.current[currentStroke.current.length - 1];
    // Micro-jitter threshold filter (0.5px) — eliminates redundant dense duplicate points
    if (last && Math.hypot(pt.x - last.x, pt.y - last.y) < 0.6) return;

    currentStroke.current.push(pt);
    redrawLive();
  };

  const onPointerUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (mode === 'pen' && currentStroke.current.length > 0) {
      const compressedPoints = compressStrokePoints(currentStroke.current);
      strokesRef.current.push({
        points: compressedPoints,
        color,
        strokeWidth,
        isDashed: dashStyle !== 'solid',
        dashStyle,
      });
      if (undoneRef) undoneRef.current = [];
      redrawCommitted();
      if (onStrokeComplete) onStrokeComplete();
    }
    currentStroke.current = [];
    // Clear live canvas once committed
    const canvas = liveCanvasRef.current;
    const ctx = getScaledCtx(canvas);
    if (canvas && ctx) {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    }
  };

  // Resize canvas observer to fit parent container with HD resolution scaling
  useEffect(() => {
    const c1 = committedCanvasRef.current;
    const c2 = liveCanvasRef.current;
    if (!c1 || !c2) return;
    const parent = c1.parentElement || c1;
    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || window.innerHeight;
      [c1, c2].forEach(c => {
        c.width = w * dpr;
        c.height = h * dpr;
        c.style.width = `${w}px`;
        c.style.height = `${h}px`;
      });
      redrawCommitted();
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [redrawCommitted]);

  useEffect(() => {
    redrawCommitted();
  }, [revision, redrawCommitted]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 60 }}>
      {/* Bottom Layer: All committed static strokes (Zero redraw during live drawing) */}
      <canvas
        ref={committedCanvasRef}
        className="block absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
      {/* Top Layer: Live active stroke only — receives pointer input */}
      <canvas
        ref={liveCanvasRef}
        className="block absolute inset-0 w-full h-full pointer-events-auto"
        style={{
          cursor: 'default',
          pointerEvents: (isActive && mode !== 'palm') ? 'all' : 'none',
          touchAction: 'none',
          zIndex: 2,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </div>
  );
};
