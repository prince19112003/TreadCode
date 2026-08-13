// components/RadialMenu.tsx — Floating radial tool picker

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pencil, Highlighter, Eraser, X, Sparkle, Hand, SquareCheck,
} from "lucide-react";
import type { SmartBoardTool } from "../types";

interface RadialMenuProps {
  tool: SmartBoardTool;
  setTool: (t: SmartBoardTool) => void;
  isToolMenuOpen: boolean;
  setIsToolMenuOpen: (v: boolean) => void;
  eraserSubmenuOpen: boolean;
  setEraserSubmenuOpen: (v: boolean) => void;
}

const TOOL_ITEMS: {
  tool: SmartBoardTool;
  icon: React.ReactNode;
  title: string;
  angle: number;
}[] = [
  { tool: "pen", icon: <Pencil size={15} />, title: "Pen (P)", angle: -120 },
  { tool: "highlighter", icon: <Highlighter size={15} />, title: "Highlighter (H)", angle: -60 },
  { tool: "laser", icon: <Sparkle size={15} />, title: "Laser (L)", angle: 0 },
  { tool: "eraser", icon: <Eraser size={15} />, title: "Eraser Options", angle: 60 },
  { tool: "pan", icon: <Hand size={15} />, title: "Pan (Space)", angle: 120 },
];

export const RadialMenu: React.FC<RadialMenuProps> = ({
  tool,
  setTool,
  isToolMenuOpen,
  setIsToolMenuOpen,
  eraserSubmenuOpen,
  setEraserSubmenuOpen,
}) => {
  const activeTool =
    tool === "eraser" || tool === "stroke_eraser" ? "eraser" : tool;

  const CurrentIcon =
    tool === "pen" ? <Pencil size={16} /> :
    tool === "highlighter" ? <Highlighter size={16} /> :
    tool === "laser" ? <Sparkle size={16} /> :
    tool === "stroke_eraser" ? <SquareCheck size={16} /> :
    tool === "eraser" ? <Eraser size={16} /> :
    <Hand size={16} />;

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="absolute top-12 sm:top-3.5 left-1/2 -translate-x-1/2 z-40 cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
        {/* Fan-out items */}
        <AnimatePresence>
          {isToolMenuOpen && (
            <>
              {TOOL_ITEMS.map((item) => {
                const rad = (item.angle * Math.PI) / 180;
                const dist = typeof window !== "undefined" && window.innerWidth < 640 ? 44 : 52;
                const x = Math.sin(rad) * dist;
                const y = Math.cos(rad) * dist;
                const isSelected = activeTool === item.tool;

                return (
                  <div
                    key={item.tool}
                    className="absolute"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
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
                          setTool(item.tool);
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

                    {/* Eraser sub-menu */}
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
                          title="Freehand lasso eraser"
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
                          title="Whole stroke eraser"
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

        {/* Central hub button */}
        <button
          onClick={() => setIsToolMenuOpen(!isToolMenuOpen)}
          className={`w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-[0_8px_30px_rgba(0,0,0,0.85)] border backdrop-blur-2xl active:scale-90 z-30 ${
            isToolMenuOpen
              ? "bg-slate-900/90 border-slate-700 text-rose-400 hover:bg-slate-800 hover:text-rose-300"
              : "bg-indigo-600 border-indigo-400 text-white hover:bg-indigo-500 shadow-indigo-500/30"
          }`}
          title={isToolMenuOpen ? "Close Radial Menu" : "Open Radial Menu"}
        >
          {isToolMenuOpen ? <X size={16} /> : CurrentIcon}
        </button>
      </div>
    </motion.div>
  );
};
