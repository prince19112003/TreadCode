// components/PageThumbnail.tsx

import React, { useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Stroke, SmartBoardBg, BG_FILL } from "../types";
import { drawStrokeForThumbnail } from "../engine/inkEngine";

const W = 216;
const H = 136;

interface PageThumbnailProps {
  strokes: Stroke[];
  isActive: boolean;
  bgColor: SmartBoardBg;
  index: number;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  showDelete: boolean;
}

export const PageThumbnail: React.FC<PageThumbnailProps> = ({
  strokes,
  isActive,
  bgColor,
  index,
  onClick,
  onDelete,
  showDelete,
}) => {
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    const bg = BG_FILL[bgColor];
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    if (!strokes.length) return;

    ctx.save();
    ctx.scale(W / 1200, H / 800);
    strokes.forEach((s) => {
      if (!s.points.length) return;
      drawStrokeForThumbnail(ctx, s, bg);
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
