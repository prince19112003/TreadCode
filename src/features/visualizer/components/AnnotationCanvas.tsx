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
  mode: 'pen' | 'eraser';
  strokesRef: React.MutableRefObject<Stroke[]>;
}

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  isActive,
  color,
  strokeWidth,
  isDashed: _isDashed,
  dashStyle = 'solid',
  mode,
  strokesRef,
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
      if (stroke.points.length < 2) return;
      ctx.lineWidth = stroke.strokeWidth || 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = stroke.color;
      ctx.shadowBlur = 0;

      const style = stroke.dashStyle || (stroke.isDashed ? 'dashed' : 'solid');
      if (style === 'dashed') {
        ctx.setLineDash([10, 6]);
      } else if (style === 'dotted') {
        ctx.setLineDash([3, 4]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.slice(1).forEach(pt => ctx.lineTo(pt.x, pt.y));
      ctx.stroke();
    });
  }, [strokesRef]);

  const getPos = (e: React.PointerEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const eraseAt = (pt: Point) => {
    const eraseRadius = 20;
    const initialCount = strokesRef.current.length;
    strokesRef.current = strokesRef.current.filter(stroke => {
      return !stroke.points.some(p => Math.hypot(p.x - pt.x, p.y - pt.y) < eraseRadius);
    });
    if (strokesRef.current.length !== initialCount) {
      redraw();
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isActive) return;
    isDrawing.current = true;
    const pt = getPos(e);
    canvasRef.current?.setPointerCapture(e.pointerId);

    if (mode === 'eraser') {
      eraseAt(pt);
    } else {
      currentStroke.current = [pt];
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isActive || !isDrawing.current) return;
    const pt = getPos(e);

    if (mode === 'eraser') {
      eraseAt(pt);
      return;
    }

    currentStroke.current.push(pt);

    const ctx = getCtx();
    if (!ctx || currentStroke.current.length < 2) return;
    const pts = currentStroke.current;

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 0;

    const style = dashStyle;
    if (style === 'dashed') {
      ctx.setLineDash([10, 6]);
    } else if (style === 'dotted') {
      ctx.setLineDash([3, 4]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
    ctx.lineTo(pt.x, pt.y);
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
    }
    currentStroke.current = [];
  };

  // Resize canvas observer to fit parent container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement || canvas;
    const ro = new ResizeObserver(() => {
      canvas.width = parent.clientWidth || window.innerWidth;
      canvas.height = parent.clientHeight || window.innerHeight;
      redraw();
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [redraw]);

  useEffect(() => {
    if (!isDrawing.current) redraw();
  }, [strokesRef.current.length, redraw]);

  const cursorSvg = mode === 'eraser'
    ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='m7 21-4-4 13-13 4 4-13 13z' fill='%23ef4444' stroke='white' stroke-width='1.5'/><path d='m18 10 3 3-4 4h-4' stroke='white' stroke-width='1.5'/></svg>") 4 20, pointer`
    : `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' fill='${encodeURIComponent(color)}' stroke='white' stroke-width='1.5'/><path d='m15 5 4 4' stroke='white' stroke-width='1.5'/></svg>") 2 22, pointer`;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{
        cursor: isActive ? cursorSvg : 'default',
        pointerEvents: isActive ? 'all' : 'none',
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
