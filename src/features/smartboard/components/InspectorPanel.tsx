// components/InspectorPanel.tsx — Right-side color, size, and action panel

import React from "react";
import { Undo2, Redo2, Trash2, Download } from "lucide-react";
import type { SmartBoardTool, Stroke } from "../types";
import { COLOR_PALETTE } from "../types";
import { ToolBtn } from "./ToolBtn";

interface InspectorPanelProps {
  strokes: Stroke[];
  redoStack: Stroke[];
  undo: () => void;
  redo: () => void;
  clearPage: () => void;
  setIsExportOpen: (v: boolean) => void;
  tool: SmartBoardTool;
  color: string;
  setColor: (c: string) => void;
  size: number;
  setSize: (s: number) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  strokes,
  redoStack,
  undo,
  redo,
  clearPage,
  setIsExportOpen,
  tool,
  color,
  setColor,
  size,
  setSize,
}) => {
  const handleSelectColor = (c: string) => {
    setColor(c);
  };

  return (
    <div className="absolute top-3 right-3 z-40 flex flex-col items-end gap-2 select-none">
      {/* Action cluster + Tool status */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo / Clear / Export */}
        <div className="flex items-center gap-0.5 p-1 rounded-xl bg-[#0a0f1e]/90 backdrop-blur-2xl border border-white/10 shadow-lg">
          <ToolBtn icon={<Undo2 size={13} />} active={false} onClick={undo} disabled={!strokes.length} title="Undo (⌘Z)" />
          <ToolBtn icon={<Redo2 size={13} />} active={false} onClick={redo} disabled={!redoStack.length} title="Redo" />
          <ToolBtn icon={<Trash2 size={13} />} active={false} onClick={clearPage} title="Clear Page" accent="rose" />
          <ToolBtn icon={<Download size={13} />} active={false} onClick={() => setIsExportOpen(true)} title="Save / Export" accent="emerald" />
        </div>

        {/* Tool status badge */}
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

      {/* Vertical Inspector: Size + Colors */}
      <div className="flex flex-col items-center gap-2.5 p-2 rounded-2xl bg-[#0a0f1e]/90 backdrop-blur-2xl border border-white/10 shadow-2xl">
        {/* Thickness presets */}
        <div className="flex flex-col items-center gap-1 py-0.5">
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider mb-0.5">Px</span>
          {[2, 3, 5, 7, 9].map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`w-5.5 h-5.5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-150 active:scale-90 ${
                size === s
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-1 ring-indigo-400/80 scale-105"
                  : "bg-white/4 hover:bg-white/10 text-white/40 hover:text-white/90 border border-white/6"
              }`}
              title={`${s}px`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="w-4 h-px bg-white/10" />

        {/* Color palette */}
        <div className="flex flex-col items-center gap-1.5">
          {COLOR_PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => handleSelectColor(c)}
              className={`rounded-full transition-all duration-150 ${
                color === c
                  ? "w-4 h-4 ring-2 ring-white/80 ring-offset-1 ring-offset-transparent scale-110"
                  : "w-3.5 h-3.5 opacity-60 hover:opacity-100 hover:scale-110"
              }`}
              style={{
                background: c,
                border: c === "#f8fafc" ? "1px solid rgba(0,0,0,0.3)" : "none",
              }}
            />
          ))}

          {/* Custom color picker */}
          <label className="relative cursor-pointer mt-0.5" title="Custom color">
            <div
              className="w-3.5 h-3.5 rounded-full border border-white/40 overflow-hidden shadow-xs"
              style={{ background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }}
            />
            <input
              type="color"
              value={color}
              onChange={(e) => handleSelectColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
