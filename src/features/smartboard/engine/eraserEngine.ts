// engine/eraserEngine.ts — High-performance Partial Stroke Slicing + Lasso & Brush Eraser

import type { Point, Stroke } from "../types";

type SetStrokes = (fn: (s: Stroke[]) => Stroke[]) => void;

/**
 * Standard Ray-Casting Algorithm for Point-in-Polygon
 */
function isPointInPolygon(p: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect =
      yi > p.y !== yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Check if a point lies within eraser radius of a brush path segment
 */
function distToSegmentSquared(p: Point, v: Point, w: Point): number {
  const l2 = (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
  if (l2 === 0) return (p.x - v.x) * (p.x - v.x) + (p.y - v.y) * (p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  const px = v.x + t * (w.x - v.x);
  const py = v.y + t * (w.y - v.y);
  return (p.x - px) * (p.x - px) + (p.y - py) * (p.y - py);
}

/**
 * Densify points along stroke segments so partial erasing works accurately on straight/sparse lines
 */
function resamplePoints(pts: Point[], maxStep = 4): Point[] {
  if (pts.length < 2) return pts;
  const res: Point[] = [pts[0]];

  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

    if (dist > maxStep) {
      const steps = Math.ceil(dist / maxStep);
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        res.push({
          x: p1.x + (p2.x - p1.x) * t,
          y: p1.y + (p2.y - p1.y) * t,
          p: (p1.p ?? 0.5) * (1 - t) + (p2.p ?? 0.5) * t,
          t: p1.t && p2.t ? p1.t * (1 - t) + p2.t * t : undefined,
        });
      }
    }
    res.push(p2);
  }
  return res;
}

/**
 * Slices a single stroke into multiple smaller strokes by removing points inside the erased area
 */
function sliceStroke(stroke: Stroke, isErased: (p: Point) => boolean): Stroke[] {
  if (stroke.points.length === 0) return [];

  // Shape tools (rect, circle) if whole shape hit
  if (["rect", "circle"].includes(stroke.tool)) {
    const hit = stroke.points.some(isErased);
    return hit ? [] : [stroke];
  }

  // Densify points along the stroke to allow fine-grained partial erasing
  const densePts = resamplePoints(stroke.points, 4);

  const result: Stroke[] = [];
  let currentSegment: Point[] = [];

  for (const pt of densePts) {
    if (isErased(pt)) {
      if (currentSegment.length >= 2) {
        result.push({ ...stroke, tool: stroke.tool === "arrow" || stroke.tool === "line" ? "pen" : stroke.tool, points: currentSegment });
      }
      currentSegment = [];
    } else {
      currentSegment.push(pt);
    }
  }

  if (currentSegment.length >= 2) {
    result.push({ ...stroke, tool: stroke.tool === "arrow" || stroke.tool === "line" ? "pen" : stroke.tool, points: currentSegment });
  }

  return result;
}

/**
 * Erase stroke segments inside the drawn eraser or lasso path
 */
export function eraseLassoArea(
  eraserPts: Point[],
  eraserSize: number,
  setStrokes: SetStrokes,
  isWholeStroke = false
) {
  if (!eraserPts.length) return;

  // Single tap / dot eraser
  if (eraserPts.length < 3) {
    const pt = eraserPts[eraserPts.length - 1];
    const radius = Math.max(16, eraserSize * 3.5);
    const radiusSq = radius * radius;

    const isHit = (p: Point) => {
      const dx = p.x - pt.x;
      const dy = p.y - pt.y;
      return dx * dx + dy * dy <= radiusSq;
    };

    setStrokes((prev) => {
      if (isWholeStroke) {
        return prev.filter((s) => !s.points.some(isHit));
      }
      return prev.flatMap((s) => sliceStroke(s, isHit));
    });
    return;
  }

  // Calculate bounding box for performance pre-filtering
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of eraserPts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  // Prepare closed polygon by connecting first and last points if not already closed
  const polyPts = [...eraserPts];
  const first = eraserPts[0];
  const last = eraserPts[eraserPts.length - 1];
  if (Math.hypot(first.x - last.x, first.y - last.y) > 5) {
    polyPts.push(first);
  }

  const brushRadius = Math.max(16, eraserSize * 3.2);
  const brushRadiusSq = brushRadius * brushRadius;
  const padding = brushRadius + 10;
  const paddedMinX = minX - padding;
  const paddedMaxX = maxX + padding;
  const paddedMinY = minY - padding;
  const paddedMaxY = maxY + padding;

  const isPointErased = (p: Point): boolean => {
    // Quick AABB reject
    if (p.x < paddedMinX || p.x > paddedMaxX || p.y < paddedMinY || p.y > paddedMaxY) {
      return false;
    }

    // 1. Check if inside the enclosed lasso polygon area
    if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) {
      if (isPointInPolygon(p, polyPts)) return true;
    }

    // 2. Check if along the eraser brush boundary line
    for (let i = 0; i < eraserPts.length - 1; i++) {
      if (distToSegmentSquared(p, eraserPts[i], eraserPts[i + 1]) <= brushRadiusSq) {
        return true;
      }
    }

    return false;
  };

  setStrokes((prev) => {
    if (isWholeStroke) {
      return prev.filter((s) => !s.points.some(isPointErased));
    }
    return prev.flatMap((s) => sliceStroke(s, isPointErased));
  });
}
