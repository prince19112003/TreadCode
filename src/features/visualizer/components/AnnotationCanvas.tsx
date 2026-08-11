import React, { useRef, useEffect, useCallback } from 'react';

interface Point { x: number; y: number }

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const currentStroke = useRef<Point[]>([]);

  const getCtx = () => canvasRef.current?.getContext('2d') ?? null;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokesRef.current.forEach(stroke => {
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
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      if (stroke.points.length === 1) {
        ctx.lineTo(stroke.points[0].x + 0.1, stroke.points[0].y + 0.1);
      } else {
        stroke.points.slice(1).forEach(pt => ctx.lineTo(pt.x, pt.y));
      }
      ctx.stroke();
    });
  }, [strokesRef]);

  const getPos = (e: React.PointerEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Distance from point pt to line segment p1-p2
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
      redraw();
      if (onStrokeComplete) onStrokeComplete();
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    // Only single primary pointer or pen draws; multi-touch acts like palm
    if (!isActive || mode === 'palm' || !e.isPrimary) return;
    isDrawing.current = true;
    const pt = getPos(e);
    canvasRef.current?.setPointerCapture(e.pointerId);

    if (mode === 'eraser') {
      eraseAt(pt);
    } else {
      currentStroke.current = [pt];
      // Instant tap drawing (S-Pen responsiveness)
      redraw();
      const ctx = getCtx();
      if (ctx) {
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, strokeWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isActive || !isDrawing.current || mode === 'palm' || !e.isPrimary) return;
    const pt = getPos(e);

    if (mode === 'eraser') {
      eraseAt(pt);
      return;
    }

    currentStroke.current.push(pt);

    redraw();

    const ctx = getCtx();
    if (!ctx || currentStroke.current.length < 2) return;
    const pts = currentStroke.current;
    const w = strokeWidth;

    ctx.lineWidth = w;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.imageSmoothingEnabled = false;

    const style = dashStyle;
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
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
  };

  const onPointerUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (mode === 'pen' && currentStroke.current.length > 0) {
      strokesRef.current.push({
        points: [...currentStroke.current],
        color,
        strokeWidth,
        isDashed: dashStyle !== 'solid',
        dashStyle,
      });
      if (undoneRef) undoneRef.current = [];
      if (onStrokeComplete) onStrokeComplete();
    }
    currentStroke.current = [];
  };

  // Resize canvas observer to fit parent container with HD resolution scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement || canvas;
    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      redraw();
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [redraw]);

  useEffect(() => {
    redraw();
  }, [revision, redraw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{
        cursor: 'default',
        pointerEvents: (isActive && mode !== 'palm') ? 'all' : 'none',
        touchAction: 'none',
        zIndex: 60,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
};
