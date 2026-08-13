/**
 * inkEngine.ts — SmartBoard v4.0 iPad-quality ink renderer
 *
 * Algorithm summary:
 *  1. Chaikin curve smoothing (2 passes) removes micro-jitter & sharp corners
 *  2. Midpoint Quadratic Bezier — ONE continuous beginPath per stroke → zero seam artifacts
 *  3. Velocity-based width (optional, default OFF): fast = thin, slow = thick (calligraphic)
 *  4. Polygon outline rendering for variable-width strokes
 *  5. Natural start/end taper — ink touch/lift feel
 */

import type { Point, Stroke } from "../types";

// ─── Chaikin Corner Smoothing ─────────────────────────────────────────────────
// 2 iterations gives Apple Pencil-quality smoothness without over-softening
function chaikinSmooth(pts: Point[], iterations = 2): Point[] {
  let result = [...pts];
  for (let iter = 0; iter < iterations; iter++) {
    const s: Point[] = [result[0]];
    for (let i = 0; i < result.length - 1; i++) {
      const a = result[i];
      const b = result[i + 1];
      s.push(
        { x: 0.75 * a.x + 0.25 * b.x, y: 0.75 * a.y + 0.25 * b.y, p: a.p, t: a.t },
        { x: 0.25 * a.x + 0.75 * b.x, y: 0.25 * a.y + 0.75 * b.y, p: b.p, t: b.t }
      );
    }
    s.push(result[result.length - 1]);
    result = s;
  }
  return result;
}

// ─── Midpoint Bezier Path Builder ─────────────────────────────────────────────
// Builds ONE continuous smooth path — NO seam artifacts between segments
// This is the core fix: each point is a control point, midpoints are curve endpoints
export function buildMidpointPath(ctx: CanvasRenderingContext2D, pts: Point[]) {
  if (pts.length < 2) return;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 0; i < pts.length - 1; i++) {
    const mid = {
      x: (pts[i].x + pts[i + 1].x) / 2,
      y: (pts[i].y + pts[i + 1].y) / 2,
    };
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, mid.x, mid.y);
  }
  ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
}

// ─── Smooth Path (used by highlighter, laser, eraser visual) ──────────────────
export function smoothPath(ctx: CanvasRenderingContext2D, pts: Point[]) {
  if (!pts.length) return;
  if (pts.length < 3) {
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  buildMidpointPath(ctx, pts);
}

// ─── Velocity-Based Width Array ───────────────────────────────────────────────
// Speed 0 → widest (slow, deliberate stroke)
// Speed > threshold → thinnest (fast swipe)
function computeVelocityWidths(pts: Point[], baseSize: number): number[] {
  const widths: number[] = new Array(pts.length).fill(baseSize);
  const MAX_SPEED = 0.75; // px/ms — above this line goes thinnest

  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    const dt = Math.max(1, (pts[i].t ?? i * 16) - (pts[i - 1].t ?? (i - 1) * 16));
    const speed = Math.hypot(dx, dy) / dt;
    const pressure = pts[i].p ?? 0.5;
    const speedFactor = Math.min(speed / MAX_SPEED, 1);
    // Blend: pressure weight 40%, velocity weight 60%
    widths[i] = Math.max(0.4, baseSize * (0.25 + pressure * 0.4 + (1 - speedFactor) * 0.55));
  }
  // Seed first point from second
  widths[0] = widths.length > 1 ? widths[1] : baseSize;

  // EMA smoothing to remove jitter in width transitions
  const alpha = 0.35;
  for (let i = 1; i < widths.length; i++) {
    widths[i] = widths[i - 1] * (1 - alpha) + widths[i] * alpha;
  }

  // Natural start taper: 0.15x → 1.0x over first ~10% of stroke
  const taperLen = Math.min(8, Math.floor(pts.length * 0.12));
  for (let i = 0; i < taperLen; i++) {
    widths[i] *= (i + 1) / (taperLen + 1);
  }
  // Natural end taper: 1.0x → 0.1x over last ~10%
  for (let i = 0; i < taperLen; i++) {
    const idx = pts.length - 1 - i;
    widths[idx] *= (i + 1) / (taperLen + 1);
  }

  return widths;
}

// ─── Variable-Width Polygon Stroke ────────────────────────────────────────────
// Draws as a filled outline polygon — enables calligraphic width variation
function drawVariableWidthStroke(
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  widths: number[],
  color: string
) {
  if (pts.length === 1) {
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, widths[0] / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    return;
  }

  // Build perpendicular offset boundary points
  const upper: { x: number; y: number }[] = [];
  const lower: { x: number; y: number }[] = [];

  for (let i = 0; i < pts.length; i++) {
    const prev = i > 0 ? pts[i - 1] : pts[i];
    const next = i < pts.length - 1 ? pts[i + 1] : pts[i];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    // Perpendicular normal
    const nx = -dy / len;
    const ny = dx / len;
    const hw = widths[i] / 2;
    upper.push({ x: pts[i].x + nx * hw, y: pts[i].y + ny * hw });
    lower.push({ x: pts[i].x - nx * hw, y: pts[i].y - ny * hw });
  }

  ctx.beginPath();

  // Forward: upper boundary (smooth bezier)
  ctx.moveTo(upper[0].x, upper[0].y);
  for (let i = 0; i < upper.length - 1; i++) {
    const mid = { x: (upper[i].x + upper[i + 1].x) / 2, y: (upper[i].y + upper[i + 1].y) / 2 };
    ctx.quadraticCurveTo(upper[i].x, upper[i].y, mid.x, mid.y);
  }
  ctx.lineTo(upper[upper.length - 1].x, upper[upper.length - 1].y);

  // End round cap
  {
    const last = pts[pts.length - 1];
    const prev = pts.length > 1 ? pts[pts.length - 2] : pts[0];
    const ang = Math.atan2(last.y - prev.y, last.x - prev.x);
    ctx.arc(last.x, last.y, widths[widths.length - 1] / 2, ang - Math.PI / 2, ang + Math.PI / 2);
  }

  // Backward: lower boundary (smooth bezier)
  for (let i = lower.length - 1; i > 0; i--) {
    const mid = { x: (lower[i].x + lower[i - 1].x) / 2, y: (lower[i].y + lower[i - 1].y) / 2 };
    ctx.quadraticCurveTo(lower[i].x, lower[i].y, mid.x, mid.y);
  }
  ctx.lineTo(lower[0].x, lower[0].y);

  // Start round cap
  {
    const first = pts[0];
    const next = pts.length > 1 ? pts[1] : pts[0];
    const ang = Math.atan2(next.y - first.y, next.x - first.x);
    ctx.arc(first.x, first.y, widths[0] / 2, ang + Math.PI / 2, ang - Math.PI / 2);
  }

  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// ─── Natural Pen Stroke (non-velocity mode) ───────────────────────────────────
// Single continuous bezier path — no per-segment beginPath, zero seam artifacts
function drawNaturalPenStroke(
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  color: string,
  baseSize: number
) {
  if (pts.length === 0) return;

  const smoothed = pts.length > 3 ? chaikinSmooth(pts, 2) : pts;

  if (smoothed.length === 1) {
    // Single tap — filled dot
    ctx.beginPath();
    ctx.arc(smoothed[0].x, smoothed[0].y, baseSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    return;
  }

  // Apply subtle pressure-based taper while keeping a single path
  const taperLen = Math.min(6, Math.floor(smoothed.length * 0.12));

  // Draw single continuous smooth stroke
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // For uniform width — one path, one stroke, no seams
  const avgPressure = smoothed.reduce((a, p) => a + (p.p ?? 0.5), 0) / smoothed.length;
  ctx.lineWidth = Math.max(0.5, baseSize * (0.65 + avgPressure * 0.6));

  buildMidpointPath(ctx, smoothed);
  ctx.stroke();

  // Start dot (ink touch)
  if (taperLen > 0 && smoothed.length > 2) {
    const startP = smoothed[0].p ?? 0.5;
    ctx.beginPath();
    ctx.arc(smoothed[0].x, smoothed[0].y, Math.max(0.4, (baseSize * (0.3 + startP * 0.4)) / 2), 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

// ─── Main Draw Stroke ─────────────────────────────────────────────────────────
// Dispatches to per-tool renderer. Returns true if laser strokes are active.
export function drawStroke(
  ctx: CanvasRenderingContext2D,
  s: Stroke,
  now: number,
  zoom: number,
  _bgFill: string,
  velocityMode: boolean
): boolean {
  if (!s.points.length) return false;

  let hasLaser = false;
  let alpha = 1;

  if (s.tool === "laser") {
    hasLaser = true;
    const age = now - (s.timestamp ?? now);
    if (age > 2000) return hasLaser;
    alpha = Math.max(0, 1 - age / 2000);
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const pts = s.points;

  switch (s.tool) {
    case "eraser": {
      // Show lasso eraser as a dashed pink outline during drawing
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 1.5 / zoom;
      ctx.setLineDash([6 / zoom, 6 / zoom]);
      ctx.fillStyle = "rgba(244,63,94,0.08)";
      ctx.beginPath();
      buildMidpointPath(ctx, pts);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }

    case "highlighter": {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.28 * alpha;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size * 3;
      ctx.beginPath();
      buildMidpointPath(ctx, pts);
      ctx.stroke();
      break;
    }

    case "laser": {
      ctx.strokeStyle = "#ff3b30";
      ctx.lineWidth = s.size + 1;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#ff3b30";
      ctx.beginPath();
      buildMidpointPath(ctx, pts);
      ctx.stroke();
      break;
    }

    case "pen": {
      const smoothed = pts.length > 3 ? chaikinSmooth(pts, 2) : pts;
      if (velocityMode && smoothed.length > 3) {
        // iPad calligraphic mode: velocity + pressure → variable width polygon
        const widths = computeVelocityWidths(smoothed, s.size);
        drawVariableWidthStroke(ctx, smoothed, widths, s.color);
      } else {
        // Standard natural ink: single bezier path, no seams, subtle pressure taper
        drawNaturalPenStroke(ctx, pts, s.color, s.size);
      }
      break;
    }

    case "line":
    case "arrow":
    case "rect":
    case "circle": {
      if (pts.length < 2) break;
      const p0 = pts[0];
      const pE = pts[pts.length - 1];
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.beginPath();
      if (s.tool === "line") {
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(pE.x, pE.y);
      } else if (s.tool === "arrow") {
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(pE.x, pE.y);
        ctx.stroke();
        const ang = Math.atan2(pE.y - p0.y, pE.x - p0.x);
        const hl = Math.min(20, Math.hypot(pE.x - p0.x, pE.y - p0.y) * 0.3);
        ctx.beginPath();
        ctx.moveTo(pE.x, pE.y);
        ctx.lineTo(pE.x - hl * Math.cos(ang - 0.45), pE.y - hl * Math.sin(ang - 0.45));
        ctx.moveTo(pE.x, pE.y);
        ctx.lineTo(pE.x - hl * Math.cos(ang + 0.45), pE.y - hl * Math.sin(ang + 0.45));
      } else if (s.tool === "rect") {
        ctx.rect(p0.x, p0.y, pE.x - p0.x, pE.y - p0.y);
      } else if (s.tool === "circle") {
        const rx = (pE.x - p0.x) / 2;
        const ry = (pE.y - p0.y) / 2;
        ctx.ellipse(p0.x + rx, p0.y + ry, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
      }
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
  return hasLaser;
}

// ─── Thumbnail Stroke Renderer ────────────────────────────────────────────────
// Lightweight version used by PageThumbnail (no velocity mode needed)
export function drawStrokeForThumbnail(
  ctx: CanvasRenderingContext2D,
  s: Stroke,
  bgFill: string
) {
  if (!s.points.length) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (s.tool === "eraser") {
    ctx.strokeStyle = bgFill;
    ctx.lineWidth = Math.max(4, s.size * 2);
    ctx.beginPath();
    buildMidpointPath(ctx, s.points);
    ctx.stroke();
  } else if (s.tool === "highlighter") {
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.size * 3;
    ctx.beginPath();
    buildMidpointPath(ctx, s.points);
    ctx.stroke();
  } else if (s.tool === "pen") {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = Math.max(1, s.size * 0.7);
    ctx.beginPath();
    buildMidpointPath(ctx, s.points);
    ctx.stroke();
  } else if (["line", "arrow", "rect", "circle"].includes(s.tool)) {
    if (s.points.length < 2) { ctx.restore(); return; }
    const p0 = s.points[0];
    const pE = s.points[s.points.length - 1];
    ctx.strokeStyle = s.color;
    ctx.lineWidth = Math.max(1.5, s.size * 0.6);
    ctx.beginPath();
    if (s.tool === "line" || s.tool === "arrow") { ctx.moveTo(p0.x, p0.y); ctx.lineTo(pE.x, pE.y); }
    else if (s.tool === "rect") { ctx.rect(p0.x, p0.y, pE.x - p0.x, pE.y - p0.y); }
    else if (s.tool === "circle") {
      const rx = (pE.x - p0.x) / 2;
      const ry = (pE.y - p0.y) / 2;
      ctx.ellipse(p0.x + rx, p0.y + ry, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
    }
    ctx.stroke();
  }

  ctx.restore();
}
