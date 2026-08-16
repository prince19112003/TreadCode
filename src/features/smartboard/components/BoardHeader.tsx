import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GripHorizontal, ChevronDown, ChevronUp, Maximize2, Minimize2, X,
  Minus, MoveRight, Square, Circle, Sparkle, AlignJustify, SquareCheck,
  Zap, Plus, SlidersHorizontal, Palette
} from "lucide-react";
import type { SmartBoardBg, SmartBoardGrid, SmartBoardTool } from "../types";
import { BG_FILL, COLOR_PALETTE } from "../types";
import { ToolBtn } from "./ToolBtn";

interface BoardHeaderProps {
  boardBg: SmartBoardBg;
  setBoardBg: (b: SmartBoardBg) => void;
  bgGrid: SmartBoardGrid;
  setBgGrid: (g: SmartBoardGrid) => void;
  tool: SmartBoardTool;
  setTool: (t: SmartBoardTool) => void;
  autoSnapEnabled: boolean;
  setAutoSnapEnabled: (v: boolean) => void;
  velocityMode: boolean;
  setVelocityMode: (v: boolean) => void;
  zoom: number;
  setZoom: (z: number) => void;
  setZoomOffset: (o: { x: number; y: number }) => void;
  color: string;
  setColor: (c: string) => void;
  size: number;
  setSize: (s: number) => void;
  addPage: () => void;
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
  headerCollapsed: boolean;
  setHeaderCollapsed: (v: boolean) => void;
  glassMode: boolean;
  handleCloseAttempt: () => void;
  startDrag: (e: React.PointerEvent, action: string) => void;
  onDragMove: (e: React.PointerEvent) => void;
  onDragEnd: (e: React.PointerEvent) => void;
}

export const BoardHeader = React.memo<BoardHeaderProps>(({
  boardBg, setBoardBg,
  bgGrid, setBgGrid,
  tool, setTool,
  autoSnapEnabled, setAutoSnapEnabled,
  velocityMode, setVelocityMode,
  zoom, setZoom, setZoomOffset,
  color, setColor,
  size, setSize,
  addPage,
  isFullscreen, setIsFullscreen,
  headerCollapsed, setHeaderCollapsed,
  glassMode,
  handleCloseAttempt,
  startDrag, onDragMove, onDragEnd,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Header bar */}
      <motion.div
        animate={{ height: headerCollapsed ? 0 : 42, opacity: headerCollapsed ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="overflow-visible shrink-0 relative z-50"
      >
        <div
          onPointerDown={(e) => startDrag(e, "move")}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          className={`h-10.5 px-2 sm:px-3 flex items-center justify-between border-b border-white/6 gap-2 ${
            glassMode ? "bg-black/30 backdrop-blur-xl" : "bg-[#080c18]/95"
          } ${!isFullscreen ? "cursor-grab active:cursor-grabbing" : ""}`}
        >
          {/* Left: Drag Grip + New Page Button */}
          <div
            className="flex items-center gap-1.5 shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {!isFullscreen && <GripHorizontal size={13} className="text-white/20 mr-1 hidden sm:inline" />}

            {/* New Slide / Page Button */}
            <button
              onClick={addPage}
              className="h-7 px-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/35 active:scale-95 border border-indigo-500/30 text-indigo-200 hover:text-white text-[11px] font-semibold transition-all shadow-xs shrink-0"
              title="Add New Slide / Page"
            >
              <Plus size={12} className="text-indigo-400" />
              <span>New</span>
            </button>

            {/* In non-fullscreen (resized) mode: Collapsible Options Menu Toggle */}
            {!isFullscreen && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`h-7 px-2 flex items-center justify-center gap-1 rounded-xl border text-[11px] font-semibold transition-all active:scale-95 ${
                    menuOpen
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                      : "bg-white/6 hover:bg-white/10 text-white/80 border-white/10"
                  }`}
                  title="Toggle Tools & Options Menu"
                >
                  <SlidersHorizontal size={12} />
                  <span>Tools</span>
                  <ChevronDown size={12} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Collapsible Dropdown Menu Panel */}
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-9 z-50 w-72 bg-[#090d1e]/95 border border-indigo-500/30 rounded-2xl p-3 shadow-2xl backdrop-blur-2xl flex flex-col gap-2.5 text-xs text-white"
                    >
                      {/* Section 1: Pen Size & Swatches */}
                      <div className="flex flex-col gap-1.5 pb-2 border-b border-white/10">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider flex items-center gap-1">
                          <Palette size={10} /> Pen Size & Colors
                        </span>
                        <div className="flex items-center justify-between gap-1 bg-white/4 p-1.5 rounded-xl border border-white/6">
                          <div className="flex items-center gap-1">
                            {[2, 3, 5, 7, 9].map((s) => (
                              <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center text-[10px] font-mono font-medium transition-all ${
                                  size === s ? "bg-indigo-600 text-white font-bold" : "text-white/40 hover:text-white"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            {COLOR_PALETTE.slice(0, 5).map((c) => (
                              <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-3.5 h-3.5 rounded-full transition-all ${color === c ? "scale-125 ring-2 ring-indigo-400" : "opacity-60"}`}
                                style={{ background: c }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Shapes */}
                      <div className="flex flex-col gap-1.5 pb-2 border-b border-white/10">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Shapes & Recognition</span>
                        <div className="flex items-center gap-1 bg-white/4 p-1 rounded-xl border border-white/6 justify-between">
                          <div className="flex items-center gap-0.5">
                            <ToolBtn icon={<Minus size={13} />} active={tool === "line"} onClick={() => setTool("line")} title="Line" />
                            <ToolBtn icon={<MoveRight size={13} />} active={tool === "arrow"} onClick={() => setTool("arrow")} title="Arrow" />
                            <ToolBtn icon={<Square size={13} />} active={tool === "rect"} onClick={() => setTool("rect")} title="Rectangle" />
                            <ToolBtn icon={<Circle size={13} />} active={tool === "circle"} onClick={() => setTool("circle")} title="Circle" />
                          </div>
                          <button
                            onClick={() => setAutoSnapEnabled(!autoSnapEnabled)}
                            className={`px-2 py-1 text-[9.5px] font-medium rounded-lg transition-all flex items-center gap-1 border ${
                              autoSnapEnabled ? "bg-amber-500/20 text-amber-300 border-amber-400/40 font-semibold" : "bg-white/4 text-white/40 border-white/6"
                            }`}
                          >
                            <Sparkle size={10} className={autoSnapEnabled ? "text-amber-400" : ""} />
                            <span>Auto-Snap</span>
                          </button>
                        </div>
                      </div>

                      {/* Section 3: Background & Canvas Mode */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 bg-white/4 px-2 py-1 rounded-xl border border-white/6">
                          <span className="text-[9px] text-white/40">Bg:</span>
                          {(["black", "grey", "white"] as SmartBoardBg[]).map((b) => (
                            <button
                              key={b}
                              onClick={() => setBoardBg(b)}
                              className={`w-3.5 h-3.5 rounded-full ${boardBg === b ? "scale-125 ring-2 ring-blue-400" : "opacity-50"}`}
                              style={{ background: BG_FILL[b] }}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => setVelocityMode(!velocityMode)}
                          className={`px-2 py-1 text-[9.5px] font-medium rounded-xl transition-all flex items-center gap-1 border ${
                            velocityMode ? "bg-violet-500/20 text-violet-300 border-violet-400/40" : "bg-white/4 text-white/40 border-white/6"
                          }`}
                        >
                          <Zap size={10} className={velocityMode ? "text-violet-400" : ""} />
                          <span>Velocity Ink</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* In Fullscreen mode: Render full inline toolbar */}
            {isFullscreen && (
              <div className="flex items-center gap-2">
                {/* Unified Minimal Pen & Color Capsule */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-white/4 border border-white/7 shadow-inner backdrop-blur-md shrink-0">
                  <div className="flex items-center gap-1">
                    {[2, 3, 5, 7, 9].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center text-[10px] font-mono font-medium transition-all ${
                          size === s ? "bg-indigo-600 text-white font-bold shadow-[0_0_10px_rgba(99,102,241,0.5)] scale-105" : "text-white/40 hover:text-white/80"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="w-px h-3.5 bg-white/10 mx-0.5" />

                  <div className="flex items-center gap-1.5">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`rounded-full transition-all ${
                          color === c ? "w-4.5 h-4.5 ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#080c18] scale-110" : "w-3.5 h-3.5 opacity-60 hover:opacity-100"
                        }`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Background color selector */}
                <div className="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-white/4 border border-white/6 shrink-0">
                  {(["black", "grey", "white"] as SmartBoardBg[]).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBoardBg(b)}
                      className={`w-3.5 h-3.5 rounded-full ${boardBg === b ? "scale-125 ring-2 ring-blue-400/80" : "opacity-50"}`}
                      style={{ background: BG_FILL[b] }}
                    />
                  ))}
                </div>

                {/* Grid selector */}
                <div className="flex items-center rounded-lg bg-white/4 border border-white/6 p-0.5 shrink-0">
                  {(["none", "lines"] as SmartBoardGrid[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setBgGrid(g)}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-md flex items-center gap-1 ${
                        bgGrid === g ? "bg-white/10 text-white" : "text-white/30"
                      }`}
                    >
                      {g === "none" ? <SquareCheck size={10} /> : <AlignJustify size={10} />}
                      <span>{g === "none" ? "Blank" : "Lines"}</span>
                    </button>
                  ))}
                </div>

                {/* Shape tools */}
                <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-lg bg-white/4 border border-white/6 shrink-0">
                  <ToolBtn icon={<Minus size={13} />} active={tool === "line"} onClick={() => setTool("line")} title="Line" />
                  <ToolBtn icon={<MoveRight size={13} />} active={tool === "arrow"} onClick={() => setTool("arrow")} title="Arrow" />
                  <ToolBtn icon={<Square size={13} />} active={tool === "rect"} onClick={() => setTool("rect")} title="Rectangle" />
                  <ToolBtn icon={<Circle size={13} />} active={tool === "circle"} onClick={() => setTool("circle")} title="Circle" />
                </div>
              </div>
            )}
          </div>

          {/* Right: Window Control Actions (Always Cleanly Positioned on Right End) */}
          <div
            className="flex items-center gap-1 shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Zoom Reset */}
            <button
              onClick={() => { setZoom(1); setZoomOffset({ x: 0, y: 0 }); }}
              className={`px-2 py-1 text-[10px] font-mono font-medium rounded-lg transition-all flex items-center gap-1 border shrink-0 ${
                zoom !== 1 ? "bg-amber-500/20 text-amber-300 border-amber-400/40 font-bold" : "bg-white/4 text-white/30 border-white/6 hover:text-white/60"
              }`}
              title="Reset Zoom"
            >
              <span>{Math.round(zoom * 100)}%</span>
            </button>

            <div className="w-px h-4 bg-white/10 mx-0.5 shrink-0" />

            <button
              onClick={() => setHeaderCollapsed(true)}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 shadow-xs shrink-0"
              title="Hide Header"
            >
              <ChevronUp size={13} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl bg-indigo-600/25 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 hover:text-indigo-100 transition-all active:scale-95 shadow-xs shadow-indigo-500/20 shrink-0"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Board"}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
            <button
              onClick={handleCloseAttempt}
              className="p-1.5 rounded-xl bg-rose-600/25 hover:bg-rose-600/45 border border-rose-500/40 text-rose-300 hover:text-white transition-all active:scale-95 shadow-xs shadow-rose-500/20 shrink-0"
              title="Close SmartBoard"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Collapsed header reveal pill */}
      {headerCollapsed && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onClick={() => setHeaderCollapsed(false)}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white/50 hover:text-white text-[10px] font-medium transition-all"
        >
          <ChevronDown size={11} /> SmartBoard
        </motion.button>
      )}
    </>
  );
});
