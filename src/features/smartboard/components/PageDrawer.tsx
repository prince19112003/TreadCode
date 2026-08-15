// components/PageDrawer.tsx — Pages list sidebar with thumbnails

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import type { Stroke, SmartBoardBg } from "../types";
import { PageThumbnail } from "./PageThumbnail";

interface PageDrawerProps {
  pages: Stroke[][];
  pageIdx: number;
  setPageIdx: (i: number) => void;
  pagesOpen: boolean;
  setPagesOpen: (v: boolean) => void;
  deletePage: (idx: number, e: React.MouseEvent) => void;
  isFlyAnimating: boolean;
  boardBg: SmartBoardBg;
}

export const PageDrawer = React.memo<PageDrawerProps>(({
  pages,
  pageIdx,
  setPageIdx,
  pagesOpen,
  setPagesOpen,
  deletePage,
  isFlyAnimating,
  boardBg,
}) => {
  return (
    <>
      {/* Page controls (top-left) */}
      <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 z-40 flex flex-col gap-1 select-none pointer-events-auto">
        {/* Pages toggle button */}
        <button
          onClick={() => setPagesOpen(!pagesOpen)}
          className={`h-6 px-2 flex items-center justify-center gap-1 rounded-lg backdrop-blur-md text-[10px] font-medium transition-all active:scale-95 border shadow-xs ${
            pagesOpen
              ? "bg-indigo-950/80 text-indigo-300 border-indigo-700/60"
              : "bg-[#0d1424]/90 hover:bg-[#162036] text-slate-300 hover:text-white border-slate-800"
          }`}
          title="View Pages"
        >
          <span>Pages ({pageIdx + 1}/{pages.length})</span>
        </button>

        {/* Page thumbnails drawer */}
        <AnimatePresence>
          {pagesOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="mt-1.5 flex flex-col overflow-y-auto max-h-[60vh] gap-2.5 p-0.5 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {pages.map((ps, i) => (
                <motion.div
                  key={i}
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
                    onDelete={(e) => deletePage(i, e)}
                    showDelete={pages.length > 1}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Apple Keynote-style fly-to-drawer animation on new page */}
      <AnimatePresence>
        {isFlyAnimating && (
          <motion.div
            key="fly-page"
            initial={{ opacity: 0.8, scale: 0.96, x: 0, y: 0, borderRadius: "16px" }}
            animate={{ opacity: 0.2, scale: 0.15, x: -310, y: -190, borderRadius: "10px" }}
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
    </>
  );
});
