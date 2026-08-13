// engine/eraserEngine.ts — Lasso + point-hit eraser logic

import type { Point, Stroke } from "../types";

type SetStrokes = (fn: (s: Stroke[]) => Stroke[]) => void;

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

export function eraseLassoArea(
  lassoPts: Point[],
  size: number,
  setStrokes: SetStrokes
) {
  if (!lassoPts.length) return;

  // Point-hit mode (single tap / very short lasso)
  if (lassoPts.length < 3) {
    const pt = lassoPts[lassoPts.length - 1];
    const threshold = Math.max(18, size * 3.5);
    setStrokes((prev) =>
      prev.filter((s) => {
        for (const sp of s.points) {
          const dx = sp.x - pt.x;
          const dy = sp.y - pt.y;
          if (dx * dx + dy * dy <= threshold * threshold) return false;
        }
        return true;
      })
    );
    return;
  }

  // Lasso bounding box for fast pre-filter
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of lassoPts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  setStrokes((prev) =>
    prev.filter((s) => {
      const hit = s.points.some((p) => {
        if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) {
          return isPointInPolygon(p, lassoPts);
        }
        return false;
      });
      return !hit;
    })
  );
}
