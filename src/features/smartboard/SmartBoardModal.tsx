/**
 * SmartBoard v3.0 — Apple-quality professional whiteboard
 * Features: Palm rejection, pressure-sensitive pen, Bezier smoothing,
 * multi-page, infinite canvas, laser pointer, glass mode, undo/redo,
 * shapes, export, 8-axis resize, keyboard shortcuts.
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pencil, Highlighter, Eraser, Square, Circle, Minus, MoveRight,
  Trash2, Undo2, Redo2, Maximize2, Minimize2,
  X, Download, GripHorizontal, ChevronDown, ChevronUp,
  Sparkle,
  SquareCheck, AlignJustify, Plus, Hand, FileText, Image, FileJson,
  FolderOpen, Save, RotateCcw, AlertCircle,
} from "lucide-react";

// Types
export type SmartBoardTool = "pen" | "highlighter" | "laser" | "eraser" | "stroke_eraser" | "line" | "arrow" | "rect" | "circle" | "pan";
export type SmartBoardGrid = "none" | "lines";
export type SmartBoardBg = "black" | "grey" | "white";

interface Point { x: number; y: number; p?: number; }
interface Stroke { tool: SmartBoardTool; color: string; size: number; points: Point[]; timestamp?: number; }
interface SmartBoardModalProps { isOpen: boolean; onClose: () => void; }

const COLOR_PALETTE = ["#f8fafc","#fbbf24","#38bdf8","#4ade80","#f472b6","#a855f7","#ef4444","#1e293b"];
const BG_FILL: Record<SmartBoardBg, string> = { black: "#05070d", grey: "#1a2235", white: "#f4f3ef" };

// Apple Pencil-style Catmull-Rom & Chaikin Streamline Smoothing for Ink Calligraphy
function smoothPath(ctx: CanvasRenderingContext2D, pts: Point[]) {
  if (!pts.length) return;
  if (pts.length < 3) {
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Chaikin corner smoothing pass for ultra-smooth handwriting curves
  const smoothedPts: Point[] = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const q = { x: 0.75 * p0.x + 0.25 * p1.x, y: 0.75 * p0.y + 0.25 * p1.y, p: p0.p };
    const r = { x: 0.25 * p0.x + 0.75 * p1.x, y: 0.25 * p0.y + 0.75 * p1.y, p: p1.p };
    smoothedPts.push(q, r);
  }
  smoothedPts.push(pts[pts.length - 1]);

  ctx.moveTo(smoothedPts[0].x, smoothedPts[0].y);
  for (let i = 1; i < smoothedPts.length - 1; i++) {
    const mx = (smoothedPts[i].x + smoothedPts[i + 1].x) / 2;
    const my = (smoothedPts[i].y + smoothedPts[i + 1].y) / 2;
    ctx.quadraticCurveTo(smoothedPts[i].x, smoothedPts[i].y, mx, my);
  }
  ctx.lineTo(smoothedPts[smoothedPts.length - 1].x, smoothedPts[smoothedPts.length - 1].y);
}

// Rectangular Page Thumbnail (Double Size 216px x 136px)
const PageThumbnail: React.FC<{
  strokes: Stroke[]; isActive: boolean; bgColor: SmartBoardBg;
  index: number; onClick: () => void; onDelete?: (e: React.MouseEvent) => void; showDelete: boolean;
}> = ({ strokes, isActive, bgColor, index, onClick, onDelete, showDelete }) => {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const W = 216;
  const H = 136;

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG_FILL[bgColor];
    ctx.fillRect(0, 0, W, H);
    if (!strokes.length) return;
    ctx.save();
    ctx.scale(W / 1200, H / 800);
    strokes.forEach(s => {
      if (!s.points.length) return;
      ctx.beginPath();
      ctx.strokeStyle = s.tool === "eraser" ? BG_FILL[bgColor] : s.color;
      ctx.lineWidth = Math.max(4, s.size * 0.8);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      smoothPath(ctx, s.points);
      ctx.stroke();
    });
    ctx.restore();
  }, [strokes, bgColor]);

  return (
    <div
      onClick={onClick}
      className={`group relative shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-150 border ${
        isActive
          ? "border-indigo-500 ring-2 ring-indigo-500/80 shadow-xl shadow-indigo-500/25 scale-[1.01]"
          : "border-slate-800/80 hover:border-slate-700 opacity-85 hover:opacity-100 hover:scale-[1.01]"
      }`}
      style={{ width: W, height: H }}
    >
      <canvas ref={cvRef} width={W} height={H} className="block w-full h-full" />
      <span className="absolute top-1.5 left-2 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold leading-none text-white/90 bg-slate-950/85 border border-slate-700/60 shadow-xs">
        {index + 1}
      </span>
      {showDelete && (
        <button
          onClick={onDelete}
          className="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-rose-950/90 hover:bg-rose-600 text-rose-300 hover:text-white transition-all shadow-xs"
          title="Delete Page"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
};

// Tool button
interface ToolBtnProps { icon: React.ReactNode; active: boolean; onClick: () => void; disabled?: boolean; title?: string; accent?: string; }
const ToolBtn: React.FC<ToolBtnProps> = ({ icon, active, onClick, disabled, title, accent }) => (
  <button onClick={onClick} disabled={disabled} title={title}
    className={`p-1.5 rounded-xl transition-all duration-100 active:scale-90 ${disabled ? "opacity-20 cursor-not-allowed" : active ? (accent === "rose" ? "bg-red-500/20 text-red-400" : accent === "emerald" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-300") : "text-white/40 hover:text-white/80 hover:bg-white/6"}`}>
    {icon}
  </button>
);

// Main
export const SmartBoardModal: React.FC<SmartBoardModalProps> = ({ isOpen, onClose }) => {
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
  const [bgGrid, setBgGrid] = useState<SmartBoardGrid>("none");
  const [boardBg, setBoardBg] = useState<SmartBoardBg>("black");
  const [glassMode] = useState(false);
  const [tool, setTool] = useState<SmartBoardTool>("pen");
  const [color, setColor] = useState("#f8fafc");
  const [size, setSize] = useState(2);
  const [pages, setPages] = useState<Stroke[][]>([[]]);
  const [pageIdx, setPageIdx] = useState(0);
  const [redos, setRedos] = useState<Stroke[][]>([[]]);
  const [live, setLive] = useState<Stroke | null>(null);
  const [isFlyAnimating, setIsFlyAnimating] = useState(false);

  const strokes = pages[pageIdx] ?? [];
  const redoStack = redos[pageIdx] ?? [];
  const fillColor = BG_FILL[boardBg];
  const gridColor = boardBg === "white" ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.05)";

  const wrapRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const isPalmRef = useRef(false);
  const palmAnchor = useRef<{y:number;st:number}|null>(null);
  const panAnchor = useRef<{x:number;y:number;sl:number;st:number}|null>(null);
  const dragRef = useRef<{action:string;sx:number;sy:number;ib:typeof bounds}|null>(null);
  const rafRef = useRef(0);

  const setStrokes = useCallback((fn: (s: Stroke[]) => Stroke[]) => {
    setPages(prev => { const n=[...prev]; n[pageIdx]=fn(n[pageIdx]??[]); return n; });
  }, [pageIdx]);

  const setRedo = useCallback((fn: (s: Stroke[]) => Stroke[]) => {
    setRedos(prev => { const n=[...prev]; n[pageIdx]=fn(n[pageIdx]??[]); return n; });
  }, [pageIdx]);

  const [zoom, setZoom] = useState(1);
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });
  const touchPinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());

  const draw = useCallback(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const dpr = window.devicePixelRatio||1;
    const W=cv.width/dpr, H=cv.height/dpr;
    ctx.clearRect(0,0,W,H);
    const now = Date.now();
    let hasLaser = false;

    ctx.save();
    // Fill canvas background with selected boardBg color
    ctx.fillStyle = BG_FILL[boardBg];
    ctx.fillRect(0, 0, W, H);

    ctx.translate(zoomOffset.x, zoomOffset.y);
    ctx.scale(zoom, zoom);

    if (bgGrid==="lines") {
      ctx.save(); 
      // Dynamic grid color for dark vs light background
      ctx.strokeStyle = boardBg === "white" ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.12)"; 
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

    const renderOne = (s: Stroke) => {
      if (!s.points.length) return;
      let alpha=1;
      if (s.tool==="laser") { hasLaser=true; const age=now-(s.timestamp??now); if (age>2000) return; alpha=Math.max(0,1-age/2000); }
      ctx.save(); ctx.globalAlpha=alpha; ctx.lineCap="round"; ctx.lineJoin="round";
      if (s.tool==="eraser") {
        ctx.strokeStyle="#f43f5e"; ctx.lineWidth=1.5 / zoom; ctx.setLineDash([6 / zoom, 6 / zoom]);
        ctx.fillStyle="rgba(244,63,94,0.12)";
        ctx.beginPath(); smoothPath(ctx,s.points); ctx.closePath();
        ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      } else if (s.tool==="highlighter") {
        ctx.globalCompositeOperation="source-over"; ctx.globalAlpha=0.28*alpha;
        ctx.strokeStyle=s.color; ctx.lineWidth=s.size*3;
        ctx.beginPath(); smoothPath(ctx,s.points); ctx.stroke();
      } else if (s.tool==="laser") {
        ctx.strokeStyle="#ff3b30"; ctx.lineWidth=s.size+1; ctx.shadowBlur=12; ctx.shadowColor="#ff3b30";
        ctx.beginPath(); smoothPath(ctx,s.points); ctx.stroke();
      } else if (s.tool==="pen") {
        const pts=s.points;
        for (let i=1; i<pts.length; i++) {
          const p=((pts[i].p??0.5)+(pts[i-1].p??0.5))/2;
          ctx.beginPath(); ctx.strokeStyle=s.color; ctx.lineWidth=Math.max(0.5,s.size*(0.4+p*0.8));
          ctx.moveTo(pts[i-1].x,pts[i-1].y); ctx.quadraticCurveTo(pts[i-1].x,pts[i-1].y,pts[i].x,pts[i].y); ctx.stroke();
        }
      } else if (["line","arrow","rect","circle"].includes(s.tool)) {
        if (s.points.length<2) { ctx.restore(); return; }
        const p0=s.points[0], pE=s.points[s.points.length-1];
        ctx.strokeStyle=s.color; ctx.lineWidth=s.size; ctx.beginPath();
        if (s.tool==="line") { ctx.moveTo(p0.x,p0.y); ctx.lineTo(pE.x,pE.y); }
        else if (s.tool==="arrow") {
          ctx.moveTo(p0.x,p0.y); ctx.lineTo(pE.x,pE.y); ctx.stroke();
          const ang=Math.atan2(pE.y-p0.y,pE.x-p0.x), hl=Math.min(20,Math.hypot(pE.x-p0.x,pE.y-p0.y)*0.3);
          ctx.beginPath(); ctx.moveTo(pE.x,pE.y); ctx.lineTo(pE.x-hl*Math.cos(ang-0.45),pE.y-hl*Math.sin(ang-0.45));
          ctx.moveTo(pE.x,pE.y); ctx.lineTo(pE.x-hl*Math.cos(ang+0.45),pE.y-hl*Math.sin(ang+0.45));
        } else if (s.tool==="rect") { ctx.rect(p0.x,p0.y,pE.x-p0.x,pE.y-p0.y); }
        else if (s.tool==="circle") { const rx=(pE.x-p0.x)/2,ry=(pE.y-p0.y)/2; ctx.ellipse(p0.x+rx,p0.y+ry,Math.abs(rx),Math.abs(ry),0,0,Math.PI*2); }
        ctx.stroke();
      }
      ctx.restore();
    };
    strokes.forEach(renderOne);
    if (live) renderOne(live);
    ctx.restore();

    if (hasLaser) setStrokes(prev=>prev.filter(s=>s.tool!=="laser"||(now-(s.timestamp??now))<=2000));
  }, [strokes, live, bgGrid, boardBg, glassMode, fillColor, gridColor, setStrokes, zoom, zoomOffset]);

  const loop = useCallback(() => { draw(); rafRef.current=requestAnimationFrame(loop); }, [draw]);

  useEffect(() => {
    if (!isOpen) return;
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpen, loop]);

  const resizeCanvas = useCallback(() => {
    const cv=cvRef.current; if (!cv) return;
    const r=cv.getBoundingClientRect(), dpr=window.devicePixelRatio||1;
    cv.width=r.width*dpr; cv.height=r.height*dpr;
    const ctx=cv.getContext("2d"); if (ctx) ctx.scale(dpr,dpr);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    resizeCanvas();
    const ro=new ResizeObserver(resizeCanvas);
    const cv=cvRef.current; if (cv) ro.observe(cv);
    return () => ro.disconnect();
  }, [isOpen, resizeCanvas]);

  const renderSlideToDataUrl = useCallback((pageStrokes: Stroke[], scale: number = 2): string => {
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

    if (!glassMode) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, W, H);
    }

    if (bgGrid === "lines") {
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;
      for (let y = 36; y < H; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }

    const renderOne = (s: Stroke) => {
      if (!s.points.length) return;
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (s.tool === "highlighter") {
        ctx.globalAlpha = 0.28;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size * 3;
        ctx.beginPath();
        smoothPath(ctx, s.points);
        ctx.stroke();
      } else if (s.tool === "pen") {
        const pts = s.points;
        for (let i = 1; i < pts.length; i++) {
          const p = ((pts[i].p ?? 0.5) + (pts[i - 1].p ?? 0.5)) / 2;
          ctx.beginPath();
          ctx.strokeStyle = s.color;
          ctx.lineWidth = Math.max(0.5, s.size * (0.4 + p * 0.8));
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
          ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y);
          ctx.stroke();
        }
      } else if (["line", "arrow", "rect", "circle"].includes(s.tool)) {
        if (s.points.length >= 2) {
          const p0 = s.points[0], pE = s.points[s.points.length - 1];
          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.size;
          ctx.beginPath();
          if (s.tool === "line") { ctx.moveTo(p0.x, p0.y); ctx.lineTo(pE.x, pE.y); }
          else if (s.tool === "arrow") {
            ctx.moveTo(p0.x, p0.y); ctx.lineTo(pE.x, pE.y); ctx.stroke();
            const ang = Math.atan2(pE.y - p0.y, pE.x - p0.x), hl = Math.min(20, Math.hypot(pE.x - p0.x, pE.y - p0.y) * 0.3);
            ctx.beginPath(); ctx.moveTo(pE.x, pE.y); ctx.lineTo(pE.x - hl * Math.cos(ang - 0.45), pE.y - hl * Math.sin(ang - 0.45));
            ctx.moveTo(pE.x, pE.y); ctx.lineTo(pE.x - hl * Math.cos(ang + 0.45), pE.y - hl * Math.sin(ang + 0.45));
          } else if (s.tool === "rect") { ctx.rect(p0.x, p0.y, pE.x - p0.x, pE.y - p0.y); }
          else if (s.tool === "circle") { const rx = (pE.x - p0.x) / 2, ry = (pE.y - p0.y) / 2; ctx.ellipse(p0.x + rx, p0.y + ry, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2); }
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    (pageStrokes || []).forEach(renderOne);
    return offscreen.toDataURL("image/png");
  }, [glassMode, fillColor, bgGrid, gridColor]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportExecute = useCallback(() => {
    let targetIndices: number[] = [];
    if (exportRange === "current") {
      targetIndices = [pageIdx];
    } else if (exportRange === "all") {
      targetIndices = pages.map((_, i) => i);
    } else {
      const from = Math.max(1, Math.min(pages.length, customFromPage)) - 1;
      const to = Math.max(from + 1, Math.min(pages.length, customToPage)) - 1;
      for (let i = from; i <= to; i++) targetIndices.push(i);
    }

    if (!targetIndices.length) return;

    if (exportFormat === "json") {
      const exportData = {
        version: "3.0",
        created: new Date().toISOString(),
        totalPages: pages.length,
        exportedPages: targetIndices.map(idx => ({ pageIndex: idx + 1, strokes: pages[idx] })),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
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
      const images = targetIndices.map(idx => renderSlideToDataUrl(pages[idx], exportScale));
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>SmartBoard Document Export</title>
              <style>
                @page { size: auto; margin: 0; }
                body { margin: 0; background: #000; display: flex; flex-direction: column; align-items: center; }
                .page { page-break-after: always; width: 100%; display: flex; justify-content: center; align-items: center; }
                img { max-width: 100%; height: auto; display: block; }
              </style>
            </head>
            <body>
              ${images.map(img => `<div class="page"><img src="${img}" /></div>`).join("")}
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 400);
                };
              </script>
            </body>
          </html>
        `);
        win.document.close();
      }
    }

    setIsExportOpen(false);
  }, [exportRange, pageIdx, pages, customFromPage, customToPage, exportFormat, exportScale, renderSlideToDataUrl]);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("smartboard_active_workspace");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.pages && parsed.pages.some((pg: Stroke[]) => pg.length > 0)) {
            setShowSessionPrompt(true);
          }
        } catch (e) {}
      }
    }
  }, [isOpen]);

  const saveWorkspaceToCache = useCallback(() => {
    localStorage.setItem("smartboard_active_workspace", JSON.stringify({ pages, pageIdx, timestamp: Date.now() }));
  }, [pages, pageIdx]);

  useEffect(() => {
    saveWorkspaceToCache();
  }, [pages, pageIdx, saveWorkspaceToCache]);

  const handleContinueWorkspace = () => {
    const saved = localStorage.getItem("smartboard_active_workspace");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.pages) {
          setPages(parsed.pages);
          setRedos(parsed.pages.map(() => []));
          setPageIdx(parsed.pageIdx || 0);
        }
      } catch (e) {}
    }
    setShowSessionPrompt(false);
  };

  const handleDiscardWorkspace = () => {
    localStorage.removeItem("smartboard_active_workspace");
    setPages([[]]);
    setRedos([[]]);
    setPageIdx(0);
    setShowSessionPrompt(false);
  };

  const handleCloseAttempt = () => {
    const hasStrokes = pages.some(pg => pg.length > 0);
    if (hasStrokes) {
      setShowCloseConfirm(true);
    } else {
      localStorage.removeItem("smartboard_active_workspace");
      onClose();
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.exportedPages && Array.isArray(data.exportedPages)) {
          const newPages = data.exportedPages.map((p: any) => p.strokes || []);
          setPages(newPages);
          setRedos(newPages.map(() => []));
          setPageIdx(0);
          setIsExportOpen(false);
        }
      } catch (err) {
        alert("Invalid SmartBoard JSON project file.");
      }
    };
    reader.readAsText(file);
  };

  const undo = useCallback(() => {
    if (!strokes.length) return;
    const last=strokes[strokes.length-1];
    setStrokes(prev=>prev.slice(0,-1)); setRedo(prev=>[...prev,last]);
  }, [strokes, setStrokes, setRedo]);

  const redo = useCallback(() => {
    if (!redoStack.length) return;
    const top=redoStack[redoStack.length-1];
    setRedo(prev=>prev.slice(0,-1)); setStrokes(prev=>[...prev,top]);
  }, [redoStack, setStrokes, setRedo]);

  const clearPage = () => { setStrokes(()=>[]); setRedo(()=>[]); };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const t=e.target as HTMLElement;
      if (t.tagName==="INPUT"||t.tagName==="TEXTAREA") return;
      if ((e.metaKey||e.ctrlKey)&&e.key==="z") { e.preventDefault(); undo(); }
      if ((e.metaKey||e.ctrlKey)&&(e.key==="y"||(e.shiftKey&&e.key==="z"))) { e.preventDefault(); redo(); }
      if (e.key==="p") setTool("pen");
      if (e.key==="h") setTool("highlighter");
      if (e.key==="e") setTool("eraser");
      if (e.key==="l") setTool("laser");
      if (e.key===" ") { e.preventDefault(); setTool("pan"); }
      if (e.key==="Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, undo, redo, onClose]);

  const getPos = (e: React.PointerEvent): Point => {
    const cv = cvRef.current!; const r = cv.getBoundingClientRect();
    const rawX = e.clientX - r.left;
    const rawY = e.clientY - r.top;
    return {
      x: (rawX - zoomOffset.x) / zoom,
      y: (rawY - zoomOffset.y) / zoom,
      p: e.pressure > 0 ? e.pressure : 0.5,
    };
  };

  const eraseLassoArea = useCallback((lassoPts: Point[]) => {
    if (!lassoPts.length) return;
    if (lassoPts.length < 3) {
      const pt = lassoPts[lassoPts.length - 1];
      const threshold = Math.max(18, size * 3.5);
      setStrokes(prevStrokes => prevStrokes.filter(s => {
        for (let i = 0; i < s.points.length; i++) {
          const dx = s.points[i].x - pt.x;
          const dy = s.points[i].y - pt.y;
          if (dx * dx + dy * dy <= threshold * threshold) return false;
        }
        return true;
      }));
      return;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of lassoPts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    const isPtInPoly = (p: Point) => {
      let inside = false;
      for (let i = 0, j = lassoPts.length - 1; i < lassoPts.length; j = i++) {
        const xi = lassoPts[i].x, yi = lassoPts[i].y;
        const xj = lassoPts[j].x, yj = lassoPts[j].y;
        const intersect = ((yi > p.y) !== (yj > p.y)) && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    setStrokes(prevStrokes => prevStrokes.filter(s => {
      const hit = s.points.some(p => {
        if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) {
          return isPtInPoly(p);
        }
        return false;
      });
      return !hit;
    }));
  }, [size, setStrokes]);

  const holdTimerRef = useRef<number | null>(null);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const classifyAndSnapShape = useCallback((pts: Point[], toolSize: number, strokeColor: string): Stroke | null => {
    if (pts.length < 6) return null;
    const pStart = pts[0];
    const pEnd = pts[pts.length - 1];
    const distStartEnd = Math.hypot(pEnd.x - pStart.x, pEnd.y - pStart.y);

    let totalLength = 0;
    for (let i = 1; i < pts.length; i++) {
      totalLength += Math.hypot(pts[i].x - pts[i-1].x, pts[i].y - pts[i-1].y);
    }
    if (totalLength < 30) return null;

    const isClosed = distStartEnd < 45 || (distStartEnd / totalLength < 0.28);

    if (!isClosed) {
      const straightRatio = distStartEnd / totalLength;
      if (straightRatio > 0.82) {
        return {
          tool: "line",
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
      const radii = pts.map(p => {
        const r = Math.hypot(p.x - cx, p.y - cy);
        sumR += r;
        return r;
      });
      const avgR = sumR / pts.length;
      let varR = 0;
      for (const r of radii) {
        varR += Math.pow(r - avgR, 2);
      }
      const stdDevR = Math.sqrt(varR / pts.length);
      const cvR = stdDevR / avgR;

      if (cvR < 0.24) {
        return {
          tool: "circle",
          color: strokeColor,
          size: toolSize,
          points: [{ x: minX, y: minY }, { x: maxX, y: maxY }],
          timestamp: Date.now(),
        };
      } else {
        return {
          tool: "rect",
          color: strokeColor,
          size: toolSize,
          points: [{ x: minX, y: minY }, { x: maxX, y: maxY }],
          timestamp: Date.now(),
        };
      }
    }

    return null;
  }, []);

  const handleSelectColor = useCallback((c: string) => {
    setColor(c);
    if (tool === "eraser") {
      setTool("pen");
    }
  }, [tool]);

  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        const cv = cvRef.current;
        if (!cv) return;
        const r = cv.getBoundingClientRect();
        const mouseX = e.clientX - r.left;
        const mouseY = e.clientY - r.top;

        setZoom(oldZoom => {
          const newZoom = Math.min(4, Math.max(0.3, oldZoom * factor));
          const zoomRatio = newZoom / oldZoom;

          setZoomOffset(oldOffset => ({
            x: mouseX - (mouseX - oldOffset.x) * zoomRatio,
            y: mouseY - (mouseY - oldOffset.y) * zoomRatio,
          }));

          return newZoom;
        });
      }
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => wrap.removeEventListener("wheel", onWheel);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    clearHoldTimer();
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      touchPinchRef.current = { dist, zoom };
      return;
    }

    const isMultiTouch = activePointersRef.current.size > 1;
    const isBroadTouch = e.pointerType === "touch" && (Math.max(e.width ?? 0, e.height ?? 0) > 16);
    const isPalmTouch = isMultiTouch || isBroadTouch;

    if (isPalmTouch) {
      isPalmRef.current = true;
      palmAnchor.current = { y: e.clientY, st: wrapRef.current?.scrollTop ?? 0 };
      return;
    }
    if (tool==="pan") {
      e.currentTarget.setPointerCapture(e.pointerId);
      panAnchor.current={x:e.clientX,y:e.clientY,sl:wrapRef.current?.scrollLeft??0,st:wrapRef.current?.scrollTop??0}; return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current=true;
    if (pagesOpen) setPagesOpen(false);

    setLive({tool,color,size,points:[getPos(e)],timestamp:Date.now()});
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (activePointersRef.current.size === 2 && touchPinchRef.current) {
      const pts = Array.from(activePointersRef.current.values());
      const newDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (touchPinchRef.current.dist > 0) {
        const ratio = newDist / touchPinchRef.current.dist;
        setZoom(Math.min(4, Math.max(0.3, touchPinchRef.current.zoom * ratio)));
      }
      return;
    }

    if (isPalmRef.current&&palmAnchor.current&&wrapRef.current) {
      wrapRef.current.scrollTop=palmAnchor.current.st-(e.clientY-palmAnchor.current.y); return;
    }
    if (panAnchor.current&&wrapRef.current) {
      wrapRef.current.scrollLeft=panAnchor.current.sl-(e.clientX-panAnchor.current.x);
      wrapRef.current.scrollTop=panAnchor.current.st-(e.clientY-panAnchor.current.y); return;
    }
    if (!drawing.current) return;
    const pt=getPos(e);
    setLive(prev=>{
      if (!prev) return null;
      if (["pen","highlighter","laser","eraser","stroke_eraser"].includes(prev.tool)) {
        // Streamline Low-pass distance filter (filters out micro-jitters < 1.5px)
        const lastPt = prev.points[prev.points.length - 1];
        if (lastPt) {
          const dist = Math.hypot(pt.x - lastPt.x, pt.y - lastPt.y);
          if (dist < 1.5) return prev; // Filter jitter noise
        }
        return {...prev,points:[...prev.points,pt],timestamp:Date.now()};
      }
      return {...prev,points:[prev.points[0],pt]};
    });

    if (autoSnapEnabled && tool === "pen") {
      clearHoldTimer();
      holdTimerRef.current = setTimeout(() => {
        setLive(prev => {
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
    if (activePointersRef.current.size < 2) {
      touchPinchRef.current = null;
    }

    if (isPalmRef.current) { isPalmRef.current=false; palmAnchor.current=null; return; }
    if (panAnchor.current) { panAnchor.current=null; e.currentTarget.releasePointerCapture(e.pointerId); return; }
    if (!drawing.current) return;
    drawing.current=false; e.currentTarget.releasePointerCapture(e.pointerId);
    if (live) {
      if (live.tool === "eraser" || live.tool === "stroke_eraser") {
        eraseLassoArea(live.points);
      } else {
        setStrokes(prev=>[...prev,live]);
      }
      setRedo(()=>[]);
      setLive(null);
    }
  };

  const addPage = () => {
    setPages(p=>[...p,[]]);
    setRedos(r=>[...r,[]]);
    setPageIdx(pages.length);
    setPagesOpen(true);
    setIsFlyAnimating(true);
    setTimeout(() => setIsFlyAnimating(false), 550);
  };

  const deletePage = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pages.length<=1) { clearPage(); return; }
    setPages(p=>p.filter((_,i)=>i!==idx)); setRedos(r=>r.filter((_,i)=>i!==idx));
    setPageIdx(Math.max(0,pageIdx-(idx<=pageIdx?1:0)));
  };



  const startDrag = (e: React.PointerEvent, action: string) => {
    if (isFullscreen) return; e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current={action,sx:e.clientX,sy:e.clientY,ib:{...bounds}};
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const {action,sx,sy,ib}=dragRef.current; const dx=e.clientX-sx,dy=e.clientY-sy;
    let {x,y,w,h}=ib; const MW=400,MH=280;
    if (action==="move") { x+=dx; y+=dy; }
    else {
      if (action.includes("right")) w=Math.max(MW,w+dx);
      if (action.includes("bottom")) h=Math.max(MH,h+dy);
      if (action.includes("left")) { const dw=Math.max(MW,w-dx)-w; x-=dw; w+=dw; }
      if (action.includes("top")) { const dh=Math.max(MH,h-dy)-h; y-=dh; h+=dh; }
    }
    setBounds({x,y,w,h});
  };
  const onDragEnd = (e: React.PointerEvent) => {
    if (dragRef.current) { e.currentTarget.releasePointerCapture(e.pointerId); dragRef.current=null; }
  };

  if (!isOpen) return null;

  const cursor = tool==="pan"?"cursor-grab active:cursor-grabbing":tool==="eraser"?"cursor-cell":"cursor-crosshair";

  return (
    <AnimatePresence>
      <motion.div
        key="smartboard"
        initial={{opacity:0,scale:0.97,y:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.97,y:8}}
        transition={{duration:0.18,ease:[0.4,0,0.2,1]}}
        className={`fixed z-9999 flex flex-col select-none shadow-[0_24px_80px_rgba(0,0,0,0.9)] ${isFullscreen?"inset-0 rounded-none":"rounded-2xl border border-white/7"} overflow-hidden`}
        style={isFullscreen?{background: BG_FILL[boardBg]}:{left:bounds.x,top:bounds.y,width:bounds.w,height:bounds.h,background: BG_FILL[boardBg]}}
      >
        {/* Resize handles */}
        {!isFullscreen && (["top","bottom","left","right","top-left","top-right","bottom-left","bottom-right"] as const).map(dir=>(
          <div key={dir} className={`absolute z-50 ${dir==="top"?"top-0 left-3 right-3 h-1.5 cursor-n-resize":dir==="bottom"?"bottom-0 left-3 right-3 h-1.5 cursor-s-resize":dir==="left"?"left-0 top-3 bottom-3 w-1.5 cursor-w-resize":dir==="right"?"right-0 top-3 bottom-3 w-1.5 cursor-e-resize":dir==="top-left"?"top-0 left-0 w-4 h-4 cursor-nw-resize":dir==="top-right"?"top-0 right-0 w-4 h-4 cursor-ne-resize":dir==="bottom-left"?"bottom-0 left-0 w-4 h-4 cursor-sw-resize":"bottom-0 right-0 w-4 h-4 cursor-se-resize"}`} onPointerDown={e=>startDrag(e,dir)} onPointerMove={onDragMove} onPointerUp={onDragEnd}/>
        ))}

        {/* Header */}
        <motion.div animate={{height:headerCollapsed?0:40,opacity:headerCollapsed?0:1}} transition={{duration:0.2}} className="overflow-hidden shrink-0">
          <div onPointerDown={e=>startDrag(e,"move")} onPointerMove={onDragMove} onPointerUp={onDragEnd}
            className={`h-10 px-3 flex items-center justify-between border-b border-white/6 ${glassMode?"bg-black/30 backdrop-blur-xl":"bg-[#080c18]/95"} ${!isFullscreen?"cursor-grab active:cursor-grabbing":""}`}>
            <div className="flex items-center gap-2 pointer-events-none">
              {!isFullscreen && <GripHorizontal size={13} className="text-white/20"/>}
              <span className="text-[11px] font-semibold tracking-wider text-white/60 uppercase">SmartBoard</span>
              <span className="text-[9px] text-white/25 font-mono">v3</span>
            </div>
            <div className="flex items-center gap-1.5" onPointerDown={e=>e.stopPropagation()}>
              {/* Background */}
              <div className="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-white/4 border border-white/6">
                <span className="text-[9px] text-white/30 mr-0.5 uppercase tracking-wider">Bg</span>
                {(["black","grey","white"] as SmartBoardBg[]).map(b=>(
                  <button key={b} onClick={()=>setBoardBg(b)} className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${boardBg===b?"scale-125 ring-2 ring-blue-400/80":"opacity-50 hover:opacity-80"}`}
                    style={{background:BG_FILL[b],border:b==="white"?"1px solid rgba(0,0,0,0.2)":"1px solid rgba(255,255,255,0.1)"}} title={b}/>
                ))}
              </div>
              {/* Grid */}
              <div className="flex items-center rounded-lg bg-white/4 border border-white/6 p-0.5">
                {(["none","lines"] as SmartBoardGrid[]).map(g=>(
                  <button key={g} onClick={()=>setBgGrid(g)} className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all flex items-center gap-1 ${bgGrid===g?"bg-white/10 text-white":"text-white/30 hover:text-white/60"}`}>
                    {g==="none"?<SquareCheck size={10}/>:<AlignJustify size={10}/>}{g==="none"?"Blank":"Lines"}
                  </button>
                ))}
              </div>
              {/* Shapes & Auto-Snap Toggle */}
              <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-lg bg-white/4 border border-white/6">
                <ToolBtn icon={<Minus size={13}/>} active={tool==="line"} onClick={()=>setTool("line")} title="Line"/>
                <ToolBtn icon={<MoveRight size={13}/>} active={tool==="arrow"} onClick={()=>setTool("arrow")} title="Arrow"/>
                <ToolBtn icon={<Square size={13}/>} active={tool==="rect"} onClick={()=>setTool("rect")} title="Rectangle"/>
                <ToolBtn icon={<Circle size={13}/>} active={tool==="circle"} onClick={()=>setTool("circle")} title="Circle"/>
                <div className="w-px h-3.5 bg-white/10 mx-0.5" />
                <button
                  onClick={() => setAutoSnapEnabled(!autoSnapEnabled)}
                  className={`px-1.5 py-0.5 text-[9.5px] font-medium rounded-md transition-all flex items-center gap-1 border ${
                    autoSnapEnabled
                      ? "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-xs shadow-amber-500/20 font-semibold"
                      : "bg-white/4 text-white/30 border-white/6 hover:text-white/60"
                  }`}
                  title="Toggle Auto-Snap Shape Recognition ON/OFF"
                >
                  <Sparkle size={10} className={autoSnapEnabled ? "text-amber-400" : ""} />
                  <span>Auto-Snap</span>
                </button>
              </div>



              <button
                onClick={() => { setZoom(1); setZoomOffset({ x: 0, y: 0 }); }}
                className={`px-2 py-1 text-[10px] font-mono font-medium rounded-lg transition-all flex items-center gap-1 border ${
                  zoom !== 1
                    ? "bg-amber-500/20 text-amber-300 border-amber-400/40 font-bold"
                    : "bg-white/4 text-white/30 border-white/6 hover:text-white/60"
                }`}
                title="Click to Reset Zoom (100%)"
              >
                <span>{Math.round(zoom * 100)}%</span>
                {zoom !== 1 && <span className="text-[8.5px] font-sans text-amber-400">Reset</span>}
              </button>
              <div className="w-px h-4 bg-white/8 mx-0.5"/>
              <button onClick={()=>setHeaderCollapsed(true)} className="p-1 rounded-lg text-white/25 hover:text-white/70 hover:bg-white/6 transition-all"><ChevronUp size={12}/></button>
              <button onClick={()=>setIsFullscreen(!isFullscreen)} className="p-1 rounded-lg text-white/25 hover:text-white/70 hover:bg-white/6 transition-all">{isFullscreen?<Minimize2 size={12}/>:<Maximize2 size={12}/>}</button>
              <button onClick={handleCloseAttempt} className="p-1 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all"><X size={12}/></button>
            </div>
          </div>
        </motion.div>

        {/* Header reveal */}
        <AnimatePresence>
          {headerCollapsed && (
            <motion.button initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
              onClick={()=>setHeaderCollapsed(false)}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white/50 hover:text-white text-[10px] font-medium transition-all">
              <ChevronDown size={11}/> SmartBoard
            </motion.button>
          )}
        </AnimatePresence>

        {/* Board */}
        <div className="flex-1 relative overflow-hidden">
          {/* Pages Cluster: Top + New Page Button, Below: Pages a/b Button */}
          <div className="absolute top-2.5 left-2.5 z-40 flex flex-col gap-1 select-none">
            {/* Top: New Page Button */}
            <button
              onClick={addPage}
              className="h-6 px-2 flex items-center justify-center gap-1 rounded-md bg-slate-900/90 hover:bg-indigo-950 backdrop-blur-md border border-slate-700/60 text-slate-200 hover:text-white text-[10px] font-medium transition-all active:scale-95 shadow-xs"
              title="Add New Page"
            >
              <Plus size={11} className="text-indigo-400" />
              <span>New</span>
            </button>

            {/* Below: Pages a/b Button */}
            <button
              onClick={() => setPagesOpen(!pagesOpen)}
              className={`h-6 px-2 flex items-center justify-center gap-1 rounded-md backdrop-blur-md text-[10px] font-medium transition-all active:scale-95 border shadow-xs ${
                pagesOpen
                  ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
                  : 'bg-[#0d1424]/90 hover:bg-[#162036] text-slate-300 hover:text-white border-slate-800'
              }`}
              title="View Pages"
            >
              <span>Pages ({pageIdx + 1}/{pages.length})</span>
            </button>

            {/* Page Drawer — Rectangular Cards with Proper Gap & Seamless Floating Look */}
            <AnimatePresence>
              {pagesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="mt-1.5 flex flex-col overflow-y-auto max-h-[60vh] gap-2.5 p-0.5 [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {pages.map((ps, i) => (
                    <motion.div
                      key={i}
                      layout
                      initial={{ scale: 0.7, opacity: 0, y: -8 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <PageThumbnail
                        strokes={ps}
                        isActive={i === pageIdx}
                        bgColor={boardBg}
                        index={i}
                        onClick={() => setPageIdx(i)}
                        onDelete={e => deletePage(i, e)}
                        showDelete={pages.length > 1}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Apple Keynote-style Smooth Page Creation Fly-to-Drawer Card Animation */}
          <AnimatePresence>
            {isFlyAnimating && (
              <motion.div
                key="fly-page"
                initial={{ opacity: 0.8, scale: 0.96, x: 0, y: 0, borderRadius: '16px' }}
                animate={{ opacity: 0.2, scale: 0.15, x: -310, y: -190, borderRadius: '10px' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-6 z-50 pointer-events-none border-2 border-indigo-400/60 bg-linear-to-br from-indigo-950/80 to-slate-950/90 shadow-[0_0_100px_rgba(99,102,241,0.35)] backdrop-blur-md flex items-center justify-center overflow-hidden"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/40">
                  <Plus size={16} className="text-indigo-400 animate-pulse" />
                  <span className="text-xs font-semibold text-indigo-200 tracking-wider">Adding New Page...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Canvas */}
          <div ref={wrapRef} className="absolute inset-0 overflow-auto" style={{scrollbarWidth:"none"}}>
            <canvas ref={cvRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
              className={`block w-full min-h-[3200px] touch-none ${cursor}`}/>
          </div>

          {/* Right Side Vertical Inspector: Status + Actions (Undo, Redo, Delete, Download) + Vertical Thickness + Colors */}
          <div className="absolute top-3 right-3 z-40 flex flex-col items-end gap-2 select-none">
            {/* Top Right Header Actions & Status */}
            <div className="flex items-center gap-2">
              {/* Undo, Redo, Delete, Download Action Cluster */}
              <div className="flex items-center gap-0.5 p-1 rounded-xl bg-[#0a0f1e]/90 backdrop-blur-2xl border border-white/10 shadow-lg">
                <ToolBtn icon={<Undo2 size={13}/>} active={false} onClick={undo} disabled={!strokes.length} title="Undo (⌘Z)"/>
                <ToolBtn icon={<Redo2 size={13}/>} active={false} onClick={redo} disabled={!redoStack.length} title="Redo"/>
                <ToolBtn icon={<Trash2 size={13}/>} active={false} onClick={clearPage} title="Delete / Clear Page" accent="rose"/>
                <ToolBtn icon={<Download size={13}/>} active={false} onClick={() => setIsExportOpen(true)} title="Save / Export Slides" accent="emerald"/>
              </div>

              {/* Tool Status Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0a0f1e]/90 backdrop-blur-2xl border border-white/10 text-[10px] font-medium text-white/60 shadow-lg">
                <div
                  className="rounded-full transition-all"
                  style={{
                    width: Math.min(10, Math.max(5, size * 0.5)),
                    height: Math.min(10, Math.max(5, size * 0.5)),
                    background: tool === "eraser" ? "rgba(255,255,255,0.4)" : color,
                  }}
                />
                <span className="capitalize">{tool}</span>
                <span className="font-mono text-white/35">{size}px</span>
              </div>
            </div>

            {/* Vertical Inspector Box (Thickness Presets + Colors) */}
            <div className="flex flex-col items-center gap-2.5 p-2 rounded-2xl bg-[#0a0f1e]/90 backdrop-blur-2xl border border-white/10 shadow-2xl">
              {/* Thickness Presets (2, 3, 5, 7, 9) */}
              <div className="flex flex-col items-center gap-1 py-0.5">
                <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider mb-0.5">Px</span>
                {[2, 3, 5, 7, 9].map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-5.5 h-5.5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-150 active:scale-90 ${
                      size === s
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-1 ring-indigo-400/80 scale-105"
                        : "bg-white/4 hover:bg-white/10 text-white/40 hover:text-white/90 border border-white/6"
                    }`}
                    title={`${s}px thickness`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="w-4 h-px bg-white/10" />

              {/* Vertical Color Palette */}
              <div className="flex flex-col items-center gap-1.5">
                {COLOR_PALETTE.map(c => (
                  <button
                    key={c}
                    onClick={() => handleSelectColor(c)}
                    className={`rounded-full transition-all duration-150 ${
                      color === c
                        ? "w-4 h-4 ring-2 ring-white/80 ring-offset-1 ring-offset-transparent scale-110"
                        : "w-3.5 h-3.5 opacity-60 hover:opacity-100 hover:scale-110"
                    }`}
                    style={{ background: c, border: c === "#f8fafc" ? "1px solid rgba(0,0,0,0.3)" : "none" }}
                  />
                ))}

                {/* Custom Color Picker */}
                <label className="relative cursor-pointer mt-0.5" title="Custom color">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/40 overflow-hidden shadow-xs"
                    style={{ background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }}
                  />
                  <input
                    type="color"
                    value={color}
                    onChange={e => handleSelectColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Radial Circular Floating Draggable Menu (Default Top Center) */}
          <motion.div
            drag
            dragMomentum={false}
            className="absolute top-3.5 left-1/2 -translate-x-1/2 z-40 cursor-grab active:cursor-grabbing select-none"
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Radial Fan-Out Menu Items (Downward Arc) */}
              <AnimatePresence>
                {isToolMenuOpen && (
                  <>
                    {[
                      { tool: "pen", icon: <Pencil size={15}/>, title: "Pen (P)", angle: -120 },
                      { tool: "highlighter", icon: <Highlighter size={15}/>, title: "Highlighter (H)", angle: -60 },
                      { tool: "laser", icon: <Sparkle size={15}/>, title: "Laser (L)", angle: 0 },
                      { tool: "eraser", icon: <Eraser size={15}/>, title: "Eraser Options", angle: 60 },
                      { tool: "pan", icon: <Hand size={15}/>, title: "Palm / Pan (Space)", angle: 120 },
                    ].map((item) => {
                      const rad = (item.angle * Math.PI) / 180;
                      const dist = 52;
                      const x = Math.sin(rad) * dist;
                      const y = Math.cos(rad) * dist;
                      const isSelected = tool === "eraser" || tool === "stroke_eraser" ? item.tool === "eraser" : tool === item.tool;

                      return (
                        <div key={item.tool} className="absolute" style={{ transform: `translate(${x}px, ${y}px)` }}>
                          <motion.button
                            initial={{ opacity: 0, scale: 0.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.2 }}
                            transition={{ duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.tool === "eraser") {
                                setEraserSubmenuOpen(!eraserSubmenuOpen);
                                if (tool !== "stroke_eraser") setTool("eraser");
                              } else {
                                setEraserSubmenuOpen(false);
                                setTool(item.tool as SmartBoardTool);
                              }
                            }}
                            className={`w-8.5 h-8.5 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-2xl border ${
                              isSelected
                                ? "bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/40 ring-2 ring-indigo-400/60 scale-110 z-20"
                                : "bg-[#0a0f1e]/90 border-white/10 text-white/60 hover:text-white hover:bg-slate-800 z-10"
                            }`}
                            title={item.title}
                          >
                            {item.icon}
                          </motion.button>

                          {/* Linear Sub-Menu Popup when Eraser Clicked */}
                          {item.tool === "eraser" && eraserSubmenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute top-10 -left-12 z-50 flex items-center gap-1 p-1 rounded-xl bg-[#0a0f1e]/95 border border-indigo-500/30 shadow-2xl backdrop-blur-2xl min-w-35"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTool("eraser");
                                  setEraserSubmenuOpen(false);
                                }}
                                className={`flex-1 px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1.5 transition-all ${
                                  tool === "eraser"
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                }`}
                                title="Normal Pixel / Freehand Eraser"
                              >
                                <Eraser size={12} />
                                <span>Normal</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTool("stroke_eraser");
                                  setEraserSubmenuOpen(false);
                                }}
                                className={`flex-1 px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1.5 transition-all ${
                                  tool === "stroke_eraser"
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                }`}
                                title="Selection / Whole Stroke Eraser"
                              >
                                <SquareCheck size={12} />
                                <span>Selection</span>
                              </button>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </AnimatePresence>

              {/* Central Radial Trigger Hub Button (Shows X when open, Tool Icon when closed) */}
              <button
                onClick={() => setIsToolMenuOpen(!isToolMenuOpen)}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-[0_8px_30px_rgba(0,0,0,0.85)] border backdrop-blur-2xl active:scale-90 z-30 ${
                  isToolMenuOpen
                    ? "bg-slate-900/90 border-slate-700 text-rose-400 hover:bg-slate-800 hover:text-rose-300"
                    : "bg-indigo-600 border-indigo-400 text-white hover:bg-indigo-500 shadow-indigo-500/30"
                }`}
                title={isToolMenuOpen ? "Close Radial Menu" : "Open Radial Menu"}
              >
                {isToolMenuOpen ? (
                  <X size={16} />
                ) : (
                  tool === "pen" ? <Pencil size={16}/> : tool === "highlighter" ? <Highlighter size={16}/> : tool === "laser" ? <Sparkle size={16}/> : tool === "stroke_eraser" ? <SquareCheck size={16}/> : tool === "eraser" ? <Eraser size={16}/> : <Hand size={16}/>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Export / Save Multi-Slide Modal */}
      <AnimatePresence>
        {isExportOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10000 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.94, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 10 }}
              className="w-full max-w-md bg-[#0a0f1e] border border-white/12 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 select-none"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Download size={16} className="text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">Save & Export SmartBoard</h3>
                </div>
                <button
                  onClick={() => setIsExportOpen(false)}
                  className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Export Format Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Format</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setExportFormat("png")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[11px] font-medium ${
                      exportFormat === "png"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-xs shadow-emerald-500/20"
                        : "bg-white/4 border-white/8 text-white/60 hover:bg-white/8"
                    }`}
                  >
                    <Image size={16} />
                    <span>PNG (Ultra-HD)</span>
                  </button>
                  <button
                    onClick={() => setExportFormat("pdf")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[11px] font-medium ${
                      exportFormat === "pdf"
                        ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-xs shadow-indigo-500/20"
                        : "bg-white/4 border-white/8 text-white/60 hover:bg-white/8"
                    }`}
                  >
                    <FileText size={16} />
                    <span>Multi-Page PDF</span>
                  </button>
                  <button
                    onClick={() => setExportFormat("json")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[11px] font-medium ${
                      exportFormat === "json"
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-xs shadow-amber-500/20"
                        : "bg-white/4 border-white/8 text-white/60 hover:bg-white/8"
                    }`}
                  >
                    <FileJson size={16} />
                    <span>Project JSON</span>
                  </button>
                </div>
              </div>

              {/* Slide Range Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Select Slides</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setExportRange("current")}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-medium transition-all ${
                      exportRange === "current"
                        ? "bg-blue-600 text-white border-blue-400"
                        : "bg-white/4 border-white/8 text-white/60 hover:bg-white/8"
                    }`}
                  >
                    Current (#{pageIdx + 1})
                  </button>
                  <button
                    onClick={() => setExportRange("all")}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-medium transition-all ${
                      exportRange === "all"
                        ? "bg-blue-600 text-white border-blue-400"
                        : "bg-white/4 border-white/8 text-white/60 hover:bg-white/8"
                    }`}
                  >
                    All (1..{pages.length})
                  </button>
                  <button
                    onClick={() => setExportRange("custom")}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-medium transition-all ${
                      exportRange === "custom"
                        ? "bg-blue-600 text-white border-blue-400"
                        : "bg-white/4 border-white/8 text-white/60 hover:bg-white/8"
                    }`}
                  >
                    Custom Range
                  </button>
                </div>

                {/* Custom Range Inputs */}
                {exportRange === "custom" && (
                  <div className="flex items-center justify-between gap-2 mt-1.5 p-2 rounded-xl bg-white/4 border border-white/8">
                    <span className="text-[11px] text-white/60">From Slide</span>
                    <input
                      type="number"
                      min={1}
                      max={pages.length}
                      value={customFromPage}
                      onChange={e => setCustomFromPage(parseInt(e.target.value) || 1)}
                      className="w-14 px-2 py-1 rounded-md bg-black/50 border border-white/15 text-xs text-white font-mono text-center"
                    />
                    <span className="text-[11px] text-white/60">To Slide</span>
                    <input
                      type="number"
                      min={1}
                      max={pages.length}
                      value={customToPage}
                      onChange={e => setCustomToPage(parseInt(e.target.value) || pages.length)}
                      className="w-14 px-2 py-1 rounded-md bg-black/50 border border-white/15 text-xs text-white font-mono text-center"
                    />
                  </div>
                )}
              </div>

              {/* Quality Scale Selector (PNG & PDF) */}
              {exportFormat !== "json" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Quality / Scale</label>
                  <div className="flex items-center gap-2">
                    {[
                      { scale: 1, label: "1x Standard" },
                      { scale: 2, label: "2x High Def" },
                      { scale: 4, label: "4x Ultra 4K" },
                    ].map(q => (
                      <button
                        key={q.scale}
                        onClick={() => setExportScale(q.scale)}
                        className={`flex-1 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                          exportScale === q.scale
                            ? "bg-indigo-600 text-white border-indigo-400 shadow-xs"
                            : "bg-white/4 border-white/8 text-white/50 hover:bg-white/8"
                        }`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10 mt-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mr-auto px-3 py-1.5 rounded-xl bg-white/6 hover:bg-white/12 border border-white/10 text-white/70 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
                  title="Load saved SmartBoard JSON project file"
                >
                  <FolderOpen size={13} className="text-amber-400" />
                  <span>Import Project</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" hidden />

                <button
                  onClick={() => setIsExportOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/6 text-xs font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExportExecute}
                  className="px-4 py-1.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Export Now</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Resume Prompt Modal */}
      <AnimatePresence>
        {showSessionPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10000 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.94, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 10 }}
              className="w-full max-w-sm bg-[#0a0f1e] border border-indigo-500/30 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Previous Workspace Found</h3>
                  <p className="text-[11px] text-white/60 mt-0.5">Would you like to resume your previous drawing session?</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10 mt-1">
                <button
                  onClick={handleDiscardWorkspace}
                  className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-medium transition-all"
                >
                  Start Fresh
                </button>
                <button
                  onClick={handleContinueWorkspace}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Resume Workspace</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unsaved Changes Close Confirmation Modal */}
      <AnimatePresence>
        {showCloseConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10000 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.94, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 10 }}
              className="w-full max-w-sm bg-[#0a0f1e] border border-amber-500/30 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Unsaved Board Content</h3>
                  <p className="text-[11px] text-white/60 mt-0.5">What would you like to do before closing SmartBoard?</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => { setShowCloseConfirm(false); setIsExportOpen(true); }}
                  className="w-full py-2 px-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <Save size={13} />
                  <span>Save & Export First</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      saveWorkspaceToCache();
                      setShowCloseConfirm(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-white/6 hover:bg-white/12 border border-white/10 text-white/80 text-xs font-medium transition-all"
                  >
                    Keep in Cache
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("smartboard_active_workspace");
                      setShowCloseConfirm(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-3 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-medium transition-all"
                  >
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
