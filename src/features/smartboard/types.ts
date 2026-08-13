// ─── Shared Types & Constants for SmartBoard ─────────────────────────────────

export type SmartBoardTool =
  | "pen"
  | "highlighter"
  | "laser"
  | "eraser"
  | "stroke_eraser"
  | "line"
  | "arrow"
  | "rect"
  | "circle"
  | "pan";

export type SmartBoardGrid = "none" | "lines";
export type SmartBoardBg = "black" | "grey" | "white";

export interface Point {
  x: number;
  y: number;
  /** Pointer pressure 0–1 (0.5 fallback for mouse) */
  p?: number;
  /** Timestamp in ms (Date.now()) — needed for velocity width */
  t?: number;
}

export interface Stroke {
  tool: SmartBoardTool;
  color: string;
  size: number;
  points: Point[];
  timestamp?: number;
}

export const COLOR_PALETTE = [
  "#f8fafc",
  "#fbbf24",
  "#38bdf8",
  "#4ade80",
  "#f472b6",
  "#a855f7",
  "#ef4444",
  "#1e293b",
];

export const BG_FILL: Record<SmartBoardBg, string> = {
  black: "#05070d",
  grey: "#1a2235",
  white: "#f4f3ef",
};
