// components/BoardHeader.tsx — Top bar: bg, grid, shapes, zoom, velocity toggle

import React from "react";
import { motion } from "motion/react";
import {
  GripHorizontal, ChevronDown, ChevronUp, Maximize2, Minimize2, X,
  Minus, MoveRight, Square, Circle, Sparkle, AlignJustify, SquareCheck,
  Zap,
} from "lucide-react";
import { SmartBoardBg, SmartBoardGrid, SmartBoardTool, BG_FILL } from "../types";
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

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  boardBg, setBoardBg,
  bgGrid, setBgGrid,
  tool, setTool,
  autoSnapEnabled, setAutoSnapEnabled,
  velocityMode, setVelocityMode,
  zoom, setZoom, setZoomOffset,
  isFullscreen, setIsFullscreen,
  headerCollapsed, setHeaderCollapsed,
  glassMode,
  handleCloseAttempt,
  startDrag, onDragMove, onDragEnd,
}) => {
  return (
    <>
      {/* Header bar */}
      <motion.div
        animate={{ height: headerCollapsed ? 0 : 40, opacity: headerCollapsed ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden shrink-0"
      >
        <div
          onPointerDown={(e) => startDrag(e, "move")}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          className={`h-10 px-3 flex items-center justify-between border-b border-white/6 ${
            glassMode ? "bg-black/30 backdrop-blur-xl" : "bg-[#080c18]/95"
          } ${!isFullscreen ? "cursor-grab active:cursor-grabbing" : ""}`}
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-2 pointer-events-none">
            {!isFullscreen && <GripHorizontal size={13} className="text-white/20" />}
            <span className="text-[11px] font-semibold tracking-wider text-white/60 uppercase">SmartBoard</span>
            <span className="text-[9px] text-white/25 font-mono">v4</span>
          </div>

          {/* Right: Controls */}
          <div
            className="flex items-center gap-1.5"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Background color selector */}
            <div className="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-white/4 border border-white/6">
              <span className="text-[9px] text-white/30 mr-0.5 uppercase tracking-wider">Bg</span>
              {(["black", "grey", "white"] as SmartBoardBg[]).map((b) => (
                <button
                  key={b}
                  onClick={() => setBoardBg(b)}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                    boardBg === b ? "scale-125 ring-2 ring-blue-400/80" : "opacity-50 hover:opacity-80"
                  }`}
                  style={{
                    background: BG_FILL[b],
                    border: b === "white" ? "1px solid rgba(0,0,0,0.2)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                  title={b}
                />
              ))}
            </div>

            {/* Grid selector */}
            <div className="flex items-center rounded-lg bg-white/4 border border-white/6 p-0.5">
              {(["none", "lines"] as SmartBoardGrid[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setBgGrid(g)}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all flex items-center gap-1 ${
                    bgGrid === g ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {g === "none" ? <SquareCheck size={10} /> : <AlignJustify size={10} />}
                  {g === "none" ? "Blank" : "Lines"}
                </button>
              ))}
            </div>

            {/* Shape tools + Auto-Snap */}
            <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-lg bg-white/4 border border-white/6">
              <ToolBtn icon={<Minus size={13} />} active={tool === "line"} onClick={() => setTool("line")} title="Line" />
              <ToolBtn icon={<MoveRight size={13} />} active={tool === "arrow"} onClick={() => setTool("arrow")} title="Arrow" />
              <ToolBtn icon={<Square size={13} />} active={tool === "rect"} onClick={() => setTool("rect")} title="Rectangle" />
              <ToolBtn icon={<Circle size={13} />} active={tool === "circle"} onClick={() => setTool("circle")} title="Circle" />
              <div className="w-px h-3.5 bg-white/10 mx-0.5" />
              <button
                onClick={() => setAutoSnapEnabled(!autoSnapEnabled)}
                className={`px-1.5 py-0.5 text-[9.5px] font-medium rounded-md transition-all flex items-center gap-1 border ${
                  autoSnapEnabled
                    ? "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-xs shadow-amber-500/20 font-semibold"
                    : "bg-white/4 text-white/30 border-white/6 hover:text-white/60"
                }`}
                title="Toggle Auto-Snap Shape Recognition"
              >
                <Sparkle size={10} className={autoSnapEnabled ? "text-amber-400" : ""} />
                <span>Auto-Snap</span>
              </button>
            </div>

            {/* ★ Velocity Ink Toggle (default OFF) */}
            <button
              onClick={() => setVelocityMode(!velocityMode)}
              className={`px-1.5 py-0.5 text-[9.5px] font-medium rounded-md transition-all flex items-center gap-1 border ${
                velocityMode
                  ? "bg-violet-500/20 text-violet-300 border-violet-400/40 shadow-xs shadow-violet-500/20 font-semibold"
                  : "bg-white/4 text-white/30 border-white/6 hover:text-white/60"
              }`}
              title="Velocity Ink: Fast = thin line, Slow = thick line (calligraphic mode)"
            >
              <Zap size={10} className={velocityMode ? "text-violet-400" : ""} />
              <span>Velocity Ink</span>
            </button>

            {/* Zoom reset */}
            <button
              onClick={() => { setZoom(1); setZoomOffset({ x: 0, y: 0 }); }}
              className={`px-2 py-1 text-[10px] font-mono font-medium rounded-lg transition-all flex items-center gap-1 border ${
                zoom !== 1
                  ? "bg-amber-500/20 text-amber-300 border-amber-400/40 font-bold"
                  : "bg-white/4 text-white/30 border-white/6 hover:text-white/60"
              }`}
              title="Reset Zoom"
            >
              <span>{Math.round(zoom * 100)}%</span>
              {zoom !== 1 && <span className="text-[8.5px] font-sans text-amber-400">Reset</span>}
            </button>

            <div className="w-px h-4 bg-white/8 mx-0.5" />
            <button onClick={() => setHeaderCollapsed(true)} className="p-1 rounded-lg text-white/25 hover:text-white/70 hover:bg-white/6 transition-all">
              <ChevronUp size={12} />
            </button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1 rounded-lg text-white/25 hover:text-white/70 hover:bg-white/6 transition-all">
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
            <button onClick={handleCloseAttempt} className="p-1 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <X size={12} />
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
};
