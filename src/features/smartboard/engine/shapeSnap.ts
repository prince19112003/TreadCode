// engine/shapeSnap.ts — Hold-to-snap shape recognition

import { Point, Stroke, SmartBoardTool } from "../types";

export function classifyAndSnapShape(
  pts: Point[],
  toolSize: number,
  strokeColor: string
): Stroke | null {
  if (pts.length < 6) return null;

  const pStart = pts[0];
  const pEnd = pts[pts.length - 1];
  const distStartEnd = Math.hypot(pEnd.x - pStart.x, pEnd.y - pStart.y);

  let totalLength = 0;
  for (let i = 1; i < pts.length; i++) {
    totalLength += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  if (totalLength < 30) return null;

  const isClosed = distStartEnd < 45 || distStartEnd / totalLength < 0.28;

  if (!isClosed) {
    const straightRatio = distStartEnd / totalLength;
    if (straightRatio > 0.82) {
      return {
        tool: "line" as SmartBoardTool,
        color: strokeColor,
        size: toolSize,
        points: [pStart, pEnd],
        timestamp: Date.now(),
      };
    }
  } else {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let sumX = 0, sumY = 0;
    for (const p of pts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
      sumX += p.x;
      sumY += p.y;
    }
    const cx = sumX / pts.length;
    const cy = sumY / pts.length;

    let sumR = 0;
    const radii = pts.map((p) => {
      const r = Math.hypot(p.x - cx, p.y - cy);
      sumR += r;
      return r;
    });
    const avgR = sumR / pts.length;
    let varR = 0;
    for (const r of radii) varR += Math.pow(r - avgR, 2);
    const stdDevR = Math.sqrt(varR / pts.length);
    const cvR = stdDevR / avgR;

    if (cvR < 0.24) {
      return {
        tool: "circle" as SmartBoardTool,
        color: strokeColor,
        size: toolSize,
        points: [{ x: minX, y: minY }, { x: maxX, y: maxY }],
        timestamp: Date.now(),
      };
    } else {
      return {
        tool: "rect" as SmartBoardTool,
        color: strokeColor,
        size: toolSize,
        points: [{ x: minX, y: minY }, { x: maxX, y: maxY }],
        timestamp: Date.now(),
      };
    }
  }

  return null;
}
