import React from "react";
import { Undo2, Redo2, Trash2, Download } from "lucide-react";
import { ToolBtn } from "./ToolBtn";

interface InspectorPanelProps {
  hasStrokes: boolean;
  hasRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearPage: () => void;
  setIsExportOpen: (v: boolean) => void;
}

export const InspectorPanel = React.memo<InspectorPanelProps>(({
  hasStrokes,
  hasRedo,
  undo,
  redo,
  clearPage,
  setIsExportOpen,
}) => {

  return (
    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-40 flex flex-col items-end gap-1.5 sm:gap-2 select-none pointer-events-auto">
      {/* Action cluster: Undo / Redo / Clear / Export */}
      <div className="flex items-center gap-0.5 p-0.5 sm:p-1 rounded-xl bg-[#0a0f1e]/90 backdrop-blur-2xl border border-white/10 shadow-lg">
        <ToolBtn icon={<Undo2 size={13} />} active={false} onClick={undo} disabled={!hasStrokes} title="Undo (⌘Z)" />
        <ToolBtn icon={<Redo2 size={13} />} active={false} onClick={redo} disabled={!hasRedo} title="Redo" />
        <ToolBtn icon={<Trash2 size={13} />} active={false} onClick={clearPage} title="Clear Page" accent="rose" />
        <ToolBtn icon={<Download size={13} />} active={false} onClick={() => setIsExportOpen(true)} title="Save / Export" accent="emerald" />
      </div>
    </div>
  );
});
