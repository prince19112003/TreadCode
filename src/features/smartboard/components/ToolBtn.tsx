// components/ToolBtn.tsx

import React from "react";

export interface ToolBtnProps {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  accent?: "rose" | "emerald";
}

export const ToolBtn: React.FC<ToolBtnProps> = ({
  icon,
  active,
  onClick,
  disabled,
  title,
  accent,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-xl transition-all duration-100 active:scale-90 ${
      disabled
        ? "opacity-20 cursor-not-allowed"
        : active
        ? accent === "rose"
          ? "bg-red-500/20 text-red-400"
          : accent === "emerald"
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-blue-500/20 text-blue-300"
        : "text-white/40 hover:text-white/80 hover:bg-white/6"
    }`}
  >
    {icon}
  </button>
);
