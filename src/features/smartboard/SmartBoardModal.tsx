/**
 * SmartBoard v4.0 — iPad-quality natural ink + modular architecture
 *
 * What's new vs v3.0:
 *  - inkEngine.ts: Chaikin smoothing + midpoint bezier → zero seam artifacts
 *  - Velocity Ink mode (default OFF): fast=thin, slow=thick calligraphic strokes
 *  - Coalesced pointer events: captures all intermediate points → no staircase artifacts
 *  - Point timestamp tracking for accurate velocity measurement
 *  - Modular: engine/, components/ folders for easy maintenance
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Download, Image, FileText, FileJson,
  FolderOpen, Save, RotateCcw, AlertCircle,
} from "lucide-react";

import type { SmartBoardTool, SmartBoardGrid, SmartBoardBg, Point, Stroke } from "./types";
import { BG_FILL } from "./types";
import { drawStroke } from "./engine/inkEngine";
import { classifyAndSnapShape } from "./engine/shapeSnap";
import { eraseLassoArea } from "./engine/eraserEngine";
import { BoardHeader } from "./components/BoardHeader";
import { InspectorPanel } from "./components/InspectorPanel";
import { PageDrawer } from "./components/PageDrawer";
import { RadialMenu } from "./components/RadialMenu";

// Re-export types that are imported by external code
export type { SmartBoardTool, SmartBoardGrid, SmartBoardBg };

interface SmartBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartBoardModal: React.FC<SmartBoardModalProps> = ({ isOpen, onClose }) => {
  // ─── UI State ──────────────────────────────────────────────────────────────
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bounds, setBounds] = useState({ x: 80, y: 60, w: 940, h: 620 });
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(true);
  const [autoSnapEnabled, setAutoSnapEnabled] = useState(false);
  const [eraserSubmenuOpen, setEraserSubmenuOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showSessionPrompt, setShowSessionPrompt] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [exportFormat, setExportFormat] = useState<"png" | "pdf" | "json">("png");
  const [exportRange, setExportRange] = useState<"current" | "all" | "custom">("current");
  const [exportScale, setExportScale] = useState<number>(2);
  const [customFromPage, setCustomFromPage] = useState<number>(1);
  const [customToPage, setCustomToPage] = useState<number>(1);

  // ─── Board State ────────────────────────────────────────────────────────────
  const [bgGrid, setBgGrid] = useState<SmartBoardGrid>("none");
  const [boardBg, setBoardBg] = useState<SmartBoardBg>("black");
  const [glassMode] = useState(false);
  const [tool, setTool] = useState<SmartBoardTool>("pen");
  const [color, setColor] = useState("#f8fafc");
  const [size, setSize] = useState(2);
  // ★ Velocity Ink mode — OFF by default
  const [velocityMode, setVelocityMode] = useState(false);

  // ─── Pages ─────────────────────────────────────────────────────────────────
  const [pages, setPages] = useState<Stroke[][]>([[]]);
  const [pageIdx, setPageIdx] = useState(0);
  const [redos, setRedos] = useState<Stroke[][]>([[]]);
  const [live, setLive] = useState<Stroke | null>(null);
  const [isFlyAnimating, setIsFlyAnimating] = useState(false);

  const strokes = pages[pageIdx] ?? [];
  const redoStack = redos[pageIdx] ?? [];
  const fillColor = BG_FILL[boardBg];
  const gridColor =
    boardBg === "white" ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.05)";

  // ─── Refs ───────────────────────────────────────────────────────────────────
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const isPalmRef = useRef(false);
  const palmAnchor = useRef<{ y: number; st: number } | null>(null);
  const panAnchor = useRef<{ x: number; y: number; sl: number; st: number } | null>(null);
  const dragRef = useRef<{ action: string; sx: number; sy: number; ib: typeof bounds } | null>(null);
  const rafRef = useRef(0);
  const holdTimerRef = useRef<number | null>(null);
  const touchPinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());

  // ─── Zoom ───────────────────────────────────────────────────────────────────
  const [zoom, setZoom] = useState(1);
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });

  // ─── Page Helpers ────────────────────────────────────────────────────────────
  const setStrokes = useCallback(
    (fn: (s: Stroke[]) => Stroke[]) => {
      setPages((prev) => {
        const n = [...prev];
        n[pageIdx] = fn(n[pageIdx] ?? []);
        return n;
      });
    },
    [pageIdx]
  );

  const setRedo = useCallback(
    (fn: (s: Stroke[]) => Stroke[]) => {
      setRedos((prev) => {
        const n = [...prev];
        n[pageIdx] = fn(n[pageIdx] ?? []);
        return n;
      });
    },
    [pageIdx]
  );

  // ─── History ─────────────────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (!strokes.length) return;
    const last = strokes[strokes.length - 1];
    setStrokes((prev) => prev.slice(0, -1));
    setRedo((prev) => [...prev, last]);
  }, [strokes, setStrokes, setRedo]);

  const redo = useCallback(() => {
    if (!redoStack.length) return;
    const top = redoStack[redoStack.length - 1];
    setRedo((prev) => prev.slice(0, -1));
    setStrokes((prev) => [...prev, top]);
  }, [redoStack, setStrokes, setRedo]);

  const clearPage = () => {
    setStrokes(() => []);
    setRedo(() => []);
  };

  // ─── Keyboard Shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
      if (e.key === "p") setTool("pen");
      if (e.key === "h") setTool("highlighter");
      if (e.key === "e") setTool("eraser");
      if (e.key === "l") setTool("laser");
      if (e.key === " ") { e.preventDefault(); setTool("pan"); }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, undo, redo, onClose]);

  // ─── Canvas Draw Loop (RAF) ───────────────────────────────────────────────────
  const draw = useCallback(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = cv.width / dpr;
    const H = cv.height / dpr;
    ctx.clearRect(0, 0, W, H);
    const now = Date.now();
    let hasLaser = false;

    ctx.save();
    ctx.fillStyle = BG_FILL[boardBg];
    ctx.fillRect(0, 0, W, H);
    ctx.translate(zoomOffset.x, zoomOffset.y);
    ctx.scale(zoom, zoom);

    // Grid lines
    if (bgGrid === "lines") {
      ctx.save();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5 / zoom;
      const startY = Math.floor(-zoomOffset.y / (zoom * 36)) * 36 - 36;
      const endY = Math.ceil((H - zoomOffset.y) / (zoom * 36)) * 36 + 36;
      const startX = Math.floor(-zoomOffset.x / (zoom * 36)) * 36 - 36;
      const endX = Math.ceil((W - zoomOffset.x) / (zoom * 36)) * 36 + 36;
      for (let y = startY; y < endY; y += 36) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Render all committed strokes
    strokes.forEach((s) => {
      if (drawStroke(ctx, s, now, zoom, fillColor, velocityMode)) hasLaser = true;
    });
    // Render live (in-progress) stroke
    if (live) {
      if (drawStroke(ctx, live, now, zoom, fillColor, velocityMode)) hasLaser = true;
    }

    ctx.restore();

    if (hasLaser) {
      setStrokes((prev) => prev.filter((s) => s.tool !== "laser" || (now - (s.timestamp ?? now)) <= 2000));
    }
  }, [strokes, live, bgGrid, boardBg, gridColor, fillColor, zoom, zoomOffset, velocityMode, setStrokes]);

  const loop = useCallback(() => {
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  useEffect(() => {
    if (!isOpen) return;
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpen, loop]);

  // ─── Canvas Resize ────────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    cv.width = r.width * dpr;
    cv.height = r.height * dpr;
    const ctx = cv.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    const cv = cvRef.current;
    if (cv) ro.observe(cv);
    return () => ro.disconnect();
  }, [isOpen, resizeCanvas]);

  // ─── Export/Render ────────────────────────────────────────────────────────────
  const renderSlideToDataUrl = useCallback(
    (pageStrokes: Stroke[], scale = 2): string => {
      const cv = cvRef.current;
      if (!cv) return "";
      const dpr = window.devicePixelRatio || 1;
      const W = cv.width / dpr;
      const H = Math.max(1200, cv.height / dpr);
      const offscreen = document.createElement("canvas");
      offscreen.width = W * scale;
      offscreen.height = H * scale;
      const ctx = offscreen.getContext("2d");
      if (!ctx) return "";
      ctx.scale(scale, scale);
      if (!glassMode) { ctx.fillStyle = fillColor; ctx.fillRect(0, 0, W, H); }
      if (bgGrid === "lines") {
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;
        for (let y = 36; y < H; y += 36) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
      }
      pageStrokes.forEach((s) => drawStroke(ctx, s, Date.now(), 1, fillColor, false));
      return offscreen.toDataURL("image/png");
    },
    [glassMode, fillColor, bgGrid, gridColor]
  );

  // ─── Pinch Zoom (wheel) ────────────────────────────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        const cv = cvRef.current;
        if (!cv) return;
        const r = cv.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        setZoom((oldZoom) => {
          const newZoom = Math.min(4, Math.max(0.3, oldZoom * factor));
          const ratio = newZoom / oldZoom;
          setZoomOffset((old) => ({ x: mx - (mx - old.x) * ratio, y: my - (my - old.y) * ratio }));
          return newZoom;
        });
      }
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => wrap.removeEventListener("wheel", onWheel);
  }, []);

  // ─── Pointer Input ────────────────────────────────────────────────────────────
  const getPos = (e: React.PointerEvent): Point => {
    const cv = cvRef.current!;
    const r = cv.getBoundingClientRect();
    return {
      x: (e.clientX - r.left - zoomOffset.x) / zoom,
      y: (e.clientY - r.top - zoomOffset.y) / zoom,
      p: e.pressure > 0 ? e.pressure : 0.5,
      t: Date.now(), // ★ timestamp for velocity computation
    };
  };

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    clearHoldTimer();
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Pinch-zoom init
    if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      touchPinchRef.current = { dist, zoom };
      return;
    }

    // Palm rejection
    const isBroadTouch = e.pointerType === "touch" && Math.max(e.width ?? 0, e.height ?? 0) > 16;
    const isPalmTouch = activePointersRef.current.size > 1 || isBroadTouch;
    if (isPalmTouch) {
      isPalmRef.current = true;
      palmAnchor.current = { y: e.clientY, st: wrapRef.current?.scrollTop ?? 0 };
      return;
    }

    if (tool === "pan") {
      e.currentTarget.setPointerCapture(e.pointerId);
      panAnchor.current = { x: e.clientX, y: e.clientY, sl: wrapRef.current?.scrollLeft ?? 0, st: wrapRef.current?.scrollTop ?? 0 };
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    if (pagesOpen) setPagesOpen(false);
    setLive({ tool, color, size, points: [getPos(e)], timestamp: Date.now() });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Pinch zoom
    if (activePointersRef.current.size === 2 && touchPinchRef.current) {
      const pts = Array.from(activePointersRef.current.values());
      const newDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (touchPinchRef.current.dist > 0) {
        const ratio = newDist / touchPinchRef.current.dist;
        setZoom(Math.min(4, Math.max(0.3, touchPinchRef.current.zoom * ratio)));
      }
      return;
    }

    if (isPalmRef.current && palmAnchor.current && wrapRef.current) {
      wrapRef.current.scrollTop = palmAnchor.current.st - (e.clientY - palmAnchor.current.y);
      return;
    }
    if (panAnchor.current && wrapRef.current) {
      wrapRef.current.scrollLeft = panAnchor.current.sl - (e.clientX - panAnchor.current.x);
      wrapRef.current.scrollTop = panAnchor.current.st - (e.clientY - panAnchor.current.y);
      return;
    }
    if (!drawing.current) return;

    // ★ Coalesced events — capture ALL intermediate pointer positions from OS
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    const cv = cvRef.current!;
    const r = cv.getBoundingClientRect();

    setLive((prev) => {
      if (!prev) return null;
      if (["pen", "highlighter", "laser", "eraser", "stroke_eraser"].includes(prev.tool)) {
        const newPts: Point[] = [];
        for (const ev of events) {
          const pt: Point = {
            x: (ev.clientX - r.left - zoomOffset.x) / zoom,
            y: (ev.clientY - r.top - zoomOffset.y) / zoom,
            p: ev.pressure > 0 ? ev.pressure : 0.5,
            t: ev.timeStamp ? performance.timeOrigin + ev.timeStamp : Date.now(),
          };
          // Low-pass jitter filter
          const last = newPts[newPts.length - 1] ?? prev.points[prev.points.length - 1];
          if (last && Math.hypot(pt.x - last.x, pt.y - last.y) < 1.2) continue;
          newPts.push(pt);
        }
        if (!newPts.length) return prev;
        return { ...prev, points: [...prev.points, ...newPts], timestamp: Date.now() };
      }
      // Shape tools: only start + current endpoint
      const pt = getPos(e);
      return { ...prev, points: [prev.points[0], pt] };
    });

    // Auto-Snap hold timer
    if (autoSnapEnabled && tool === "pen") {
      clearHoldTimer();
      holdTimerRef.current = setTimeout(() => {
        setLive((prev) => {
          if (!prev || prev.tool !== "pen" || prev.points.length < 6) return prev;
          const snapped = classifyAndSnapShape(prev.points, prev.size, prev.color);
          return snapped || prev;
        });
      }, 300);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    clearHoldTimer();
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) touchPinchRef.current = null;

    if (isPalmRef.current) { isPalmRef.current = false; palmAnchor.current = null; return; }
    if (panAnchor.current) { panAnchor.current = null; e.currentTarget.releasePointerCapture(e.pointerId); return; }
    if (!drawing.current) return;
    drawing.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (live) {
      if (live.tool === "eraser" || live.tool === "stroke_eraser") {
        eraseLassoArea(live.points, size, setStrokes);
      } else {
        setStrokes((prev) => [...prev, live]);
      }
      setRedo(() => []);
      setLive(null);
    }
  };

  // ─── Page Operations ───────────────────────────────────────────────────────────
  const addPage = () => {
    setPages((p) => [...p, []]);
    setRedos((r) => [...r, []]);
    setPageIdx(pages.length);
    setPagesOpen(true);
    setIsFlyAnimating(true);
    setTimeout(() => setIsFlyAnimating(false), 550);
  };

  const deletePage = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pages.length <= 1) { clearPage(); return; }
    setPages((p) => p.filter((_, i) => i !== idx));
    setRedos((r) => r.filter((_, i) => i !== idx));
    setPageIdx(Math.max(0, pageIdx - (idx <= pageIdx ? 1 : 0)));
  };

  // ─── Window Drag/Resize ────────────────────────────────────────────────────────
  const startDrag = (e: React.PointerEvent, action: string) => {
    if (isFullscreen) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { action, sx: e.clientX, sy: e.clientY, ib: { ...bounds } };
  };

  const onDragMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { action, sx, sy, ib } = dragRef.current;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    let { x, y, w, h } = ib;
    const MW = 400, MH = 280;
    if (action === "move") { x += dx; y += dy; }
    else {
      if (action.includes("right")) w = Math.max(MW, w + dx);
      if (action.includes("bottom")) h = Math.max(MH, h + dy);
      if (action.includes("left")) { const dw = Math.max(MW, w - dx) - w; x -= dw; w += dw; }
      if (action.includes("top")) { const dh = Math.max(MH, h - dy) - h; y -= dh; h += dh; }
    }
    setBounds({ x, y, w, h });
  };

  const onDragEnd = (e: React.PointerEvent) => {
    if (dragRef.current) { e.currentTarget.releasePointerCapture(e.pointerId); dragRef.current = null; }
  };

  // ─── Session Persistence ───────────────────────────────────────────────────────
  const saveWorkspaceToCache = useCallback(() => {
    localStorage.setItem("smartboard_active_workspace", JSON.stringify({ pages, pageIdx, timestamp: Date.now() }));
  }, [pages, pageIdx]);

  useEffect(() => {
    if (!isOpen) return;
    const saved = localStorage.getItem("smartboard_active_workspace");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.pages && parsed.pages.some((pg: Stroke[]) => pg.length > 0)) {
          setShowSessionPrompt(true);
        }
      } catch {}
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !pages.some((pg) => pg.length > 0)) return;
    const t = setInterval(saveWorkspaceToCache, 30000);
    return () => clearInterval(t);
  }, [isOpen, pages, saveWorkspaceToCache]);

  const handleContinueWorkspace = () => {
    const saved = localStorage.getItem("smartboard_active_workspace");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.pages) { setPages(parsed.pages); setPageIdx(parsed.pageIdx ?? 0); }
      } catch {}
    }
    setShowSessionPrompt(false);
  };

  const handleDiscardWorkspace = () => {
    localStorage.removeItem("smartboard_active_workspace");
    setShowSessionPrompt(false);
  };

  const handleCloseAttempt = () => {
    if (strokes.length > 0 || pages.some((pg) => pg.length > 0)) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  // ─── Import JSON ────────────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.exportedPages) {
          const imported: Stroke[][] = data.exportedPages.map((p: { strokes: Stroke[] }) => p.strokes);
          setPages(imported);
          setRedos(imported.map(() => []));
          setPageIdx(0);
          setIsExportOpen(false);
        }
      } catch {
        alert("Invalid SmartBoard JSON project file.");
      }
    };
    reader.readAsText(file);
  };

  // ─── Export Execute ─────────────────────────────────────────────────────────────
  const handleExportExecute = useCallback(() => {
    let targetIndices: number[] = [];
    if (exportRange === "current") targetIndices = [pageIdx];
    else if (exportRange === "all") targetIndices = pages.map((_, i) => i);
    else {
      const from = Math.max(1, Math.min(pages.length, customFromPage)) - 1;
      const to = Math.max(from + 1, Math.min(pages.length, customToPage)) - 1;
      for (let i = from; i <= to; i++) targetIndices.push(i);
    }
    if (!targetIndices.length) return;

    if (exportFormat === "json") {
      const blob = new Blob([JSON.stringify({ version: "4.0", created: new Date().toISOString(), totalPages: pages.length, exportedPages: targetIndices.map((idx) => ({ pageIndex: idx + 1, strokes: pages[idx] })) }, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `smartboard_export_${Date.now()}.json`;
      a.click();
    } else if (exportFormat === "png") {
      targetIndices.forEach((idx, i) => {
        setTimeout(() => {
          const dataUrl = renderSlideToDataUrl(pages[idx], exportScale);
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = `smartboard_page_${idx + 1}_${exportScale}x.png`;
          a.click();
        }, i * 300);
      });
    } else if (exportFormat === "pdf") {
      const images = targetIndices.map((idx) => renderSlideToDataUrl(pages[idx], exportScale));
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`<!DOCTYPE html><html><head><title>SmartBoard Export</title><style>@page{size:auto;margin:0}body{margin:0;background:#000;display:flex;flex-direction:column;align-items:center}.page{page-break-after:always;width:100%;display:flex;justify-content:center;align-items:center}img{max-width:100%;height:auto;display:block}</style></head><body>${images.map((img) => `<div class="page"><img src="${img}"/></div>`).join("")}<script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script></body></html>`);
        win.document.close();
      }
    }
    setIsExportOpen(false);
  }, [exportRange, pageIdx, pages, customFromPage, customToPage, exportFormat, exportScale, renderSlideToDataUrl]);

  // ─── Early Return ───────────────────────────────────────────────────────────────
  if (!isOpen) return null;

  const cursor =
    tool === "pan" ? "cursor-grab active:cursor-grabbing" :
    tool === "eraser" ? "cursor-cell" :
    "cursor-crosshair";

  return (
    <AnimatePresence>
      <motion.div
        key="smartboard"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed z-9999 flex flex-col select-none shadow-[0_24px_80px_rgba(0,0,0,0.9)] ${isFullscreen ? "inset-0 rounded-none" : "rounded-2xl border border-white/7"} overflow-hidden`}
        style={
          isFullscreen
            ? { background: BG_FILL[boardBg] }
            : { left: bounds.x, top: bounds.y, width: bounds.w, height: bounds.h, background: BG_FILL[boardBg] }
        }
      >
        {/* Resize handles */}
        {!isFullscreen &&
          (["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"] as const).map((dir) => (
            <div
              key={dir}
              className={`absolute z-50 ${
                dir === "top" ? "top-0 left-3 right-3 h-1.5 cursor-n-resize" :
                dir === "bottom" ? "bottom-0 left-3 right-3 h-1.5 cursor-s-resize" :
                dir === "left" ? "left-0 top-3 bottom-3 w-1.5 cursor-w-resize" :
                dir === "right" ? "right-0 top-3 bottom-3 w-1.5 cursor-e-resize" :
                dir === "top-left" ? "top-0 left-0 w-4 h-4 cursor-nw-resize" :
                dir === "top-right" ? "top-0 right-0 w-4 h-4 cursor-ne-resize" :
                dir === "bottom-left" ? "bottom-0 left-0 w-4 h-4 cursor-sw-resize" :
                "bottom-0 right-0 w-4 h-4 cursor-se-resize"
              }`}
              onPointerDown={(e) => startDrag(e, dir)}
              onPointerMove={onDragMove}
              onPointerUp={onDragEnd}
            />
          ))}

        {/* Header */}
        <BoardHeader
          boardBg={boardBg} setBoardBg={setBoardBg}
          bgGrid={bgGrid} setBgGrid={setBgGrid}
          tool={tool} setTool={setTool}
          autoSnapEnabled={autoSnapEnabled} setAutoSnapEnabled={setAutoSnapEnabled}
          velocityMode={velocityMode} setVelocityMode={setVelocityMode}
          zoom={zoom} setZoom={setZoom} setZoomOffset={setZoomOffset}
          isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen}
          headerCollapsed={headerCollapsed} setHeaderCollapsed={setHeaderCollapsed}
          glassMode={glassMode}
          handleCloseAttempt={handleCloseAttempt}
          startDrag={startDrag} onDragMove={onDragMove} onDragEnd={onDragEnd}
        />

        {/* Board area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Page Drawer */}
          <PageDrawer
            pages={pages} pageIdx={pageIdx} setPageIdx={setPageIdx}
            pagesOpen={pagesOpen} setPagesOpen={setPagesOpen}
            addPage={addPage} deletePage={deletePage}
            isFlyAnimating={isFlyAnimating} boardBg={boardBg}
          />

          {/* Canvas */}
          <div ref={wrapRef} className="absolute inset-0 overflow-auto" style={{ scrollbarWidth: "none" }}>
            <canvas
              ref={cvRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className={`block w-full min-h-[3200px] touch-none ${cursor}`}
            />
          </div>

          {/* Inspector Panel */}
          <InspectorPanel
            strokes={strokes} redoStack={redoStack}
            undo={undo} redo={redo} clearPage={clearPage}
            setIsExportOpen={setIsExportOpen}
            tool={tool} color={color} setColor={setColor}
            size={size} setSize={setSize}
          />

          {/* Radial Tool Menu */}
          <RadialMenu
            tool={tool} setTool={setTool}
            isToolMenuOpen={isToolMenuOpen} setIsToolMenuOpen={setIsToolMenuOpen}
            eraserSubmenuOpen={eraserSubmenuOpen} setEraserSubmenuOpen={setEraserSubmenuOpen}
          />
        </div>
      </motion.div>

      {/* ── Export Modal ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isExportOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-10000 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.94, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 10 }}
              className="w-full max-w-md bg-[#0a0f1e] border border-white/12 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 select-none">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Download size={16} className="text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">Save & Export SmartBoard</h3>
                </div>
                <button onClick={() => setIsExportOpen(false)} className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"><X size={14} /></button>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { f: "png", icon: <Image size={16} />, label: "PNG (Ultra-HD)", color: "emerald" },
                    { f: "pdf", icon: <FileText size={16} />, label: "Multi-Page PDF", color: "indigo" },
                    { f: "json", icon: <FileJson size={16} />, label: "Project JSON", color: "amber" },
                  ].map(({ f, icon, label, color }) => (
                    <button key={f} onClick={() => setExportFormat(f as typeof exportFormat)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[11px] font-medium ${
                        exportFormat === f
                          ? `bg-${color}-500/20 border-${color}-500/50 text-${color}-300 shadow-xs shadow-${color}-500/20`
                          : "bg-white/4 border-white/8 text-white/60 hover:bg-white/8"
                      }`}>
                      {icon}<span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Select Slides</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["current", "all", "custom"] as const).map((r) => (
                    <button key={r} onClick={() => setExportRange(r)}
                      className={`py-2 px-2 rounded-xl border text-[11px] font-medium transition-all ${exportRange === r ? "bg-blue-600 text-white border-blue-400" : "bg-white/4 border-white/8 text-white/60 hover:bg-white/8"}`}>
                      {r === "current" ? `Current (#${pageIdx + 1})` : r === "all" ? `All (1..${pages.length})` : "Custom Range"}
                    </button>
                  ))}
                </div>
                {exportRange === "custom" && (
                  <div className="flex items-center justify-between gap-2 mt-1.5 p-2 rounded-xl bg-white/4 border border-white/8">
                    <span className="text-[11px] text-white/60">From</span>
                    <input type="number" min={1} max={pages.length} value={customFromPage} onChange={(e) => setCustomFromPage(parseInt(e.target.value) || 1)} className="w-14 px-2 py-1 rounded-md bg-black/50 border border-white/15 text-xs text-white font-mono text-center" />
                    <span className="text-[11px] text-white/60">To</span>
                    <input type="number" min={1} max={pages.length} value={customToPage} onChange={(e) => setCustomToPage(parseInt(e.target.value) || pages.length)} className="w-14 px-2 py-1 rounded-md bg-black/50 border border-white/15 text-xs text-white font-mono text-center" />
                  </div>
                )}
              </div>
              {exportFormat !== "json" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Quality</label>
                  <div className="flex items-center gap-2">
                    {[{ scale: 1, label: "1x Standard" }, { scale: 2, label: "2x High Def" }, { scale: 4, label: "4x Ultra 4K" }].map((q) => (
                      <button key={q.scale} onClick={() => setExportScale(q.scale)}
                        className={`flex-1 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${exportScale === q.scale ? "bg-indigo-600 text-white border-indigo-400 shadow-xs" : "bg-white/4 border-white/8 text-white/50 hover:bg-white/8"}`}>
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10 mt-1">
                <button onClick={() => fileInputRef.current?.click()} className="mr-auto px-3 py-1.5 rounded-xl bg-white/6 hover:bg-white/12 border border-white/10 text-white/70 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5">
                  <FolderOpen size={13} className="text-amber-400" /><span>Import Project</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" hidden />
                <button onClick={() => setIsExportOpen(false)} className="px-3.5 py-1.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/6 text-xs font-medium transition-all">Cancel</button>
                <button onClick={handleExportExecute} className="px-4 py-1.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 transition-all active:scale-95 flex items-center gap-1.5">
                  <Download size={13} /><span>Export Now</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Session Resume Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSessionPrompt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-10000 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.94, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 10 }}
              className="w-full max-w-sm bg-[#0a0f1e] border border-indigo-500/30 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0"><RotateCcw size={20} /></div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Previous Workspace Found</h3>
                  <p className="text-[11px] text-white/60 mt-0.5">Resume your previous drawing session?</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10 mt-1">
                <button onClick={handleDiscardWorkspace} className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-medium transition-all">Start Fresh</button>
                <button onClick={handleContinueWorkspace} className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center gap-1.5">
                  <RotateCcw size={13} /><span>Resume Workspace</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Unsaved Close Confirm Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showCloseConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-10000 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.94, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 10 }}
              className="w-full max-w-sm bg-[#0a0f1e] border border-amber-500/30 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0"><AlertCircle size={20} /></div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Unsaved Board Content</h3>
                  <p className="text-[11px] text-white/60 mt-0.5">What would you like to do before closing?</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <button onClick={() => { setShowCloseConfirm(false); setIsExportOpen(true); }}
                  className="w-full py-2 px-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all">
                  <Save size={13} /><span>Save & Export First</span>
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => { saveWorkspaceToCache(); setShowCloseConfirm(false); onClose(); }}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-white/6 hover:bg-white/12 border border-white/10 text-white/80 text-xs font-medium transition-all">
                    Keep in Cache
                  </button>
                  <button onClick={() => { localStorage.removeItem("smartboard_active_workspace"); setShowCloseConfirm(false); onClose(); }}
                    className="flex-1 py-1.5 px-3 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-medium transition-all">
                    Discard & Exit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
