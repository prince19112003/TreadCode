import React, { useState } from 'react';
import { RotateCcw, Sliders, Sparkles } from 'lucide-react';

interface SvmPoint {
  id: number;
  x: number;
  y: number;
  label: 1 | -1; // 1: Cyan, -1: Rose
}

const SVM_DATA: SvmPoint[] = [
  // Class -1 (Rose)
  { id: 1, x: 20, y: 75, label: -1 },
  { id: 2, x: 30, y: 85, label: -1 },
  { id: 3, x: 25, y: 60, label: -1 },
  { id: 4, x: 42, y: 70, label: -1 }, // Support Vector 1

  // Class +1 (Cyan)
  { id: 5, x: 58, y: 35, label: 1 }, // Support Vector 2
  { id: 6, x: 75, y: 25, label: 1 },
  { id: 7, x: 85, y: 40, label: 1 },
  { id: 8, x: 70, y: 15, label: 1 },
];

export const SvmStage: React.FC = () => {
  const [slope, setSlope] = useState<number>(-1.0); // Hyperplane slope
  const [offset, setOffset] = useState<number>(105); // Hyperplane Y-intercept
  const [marginWidth, setMarginWidth] = useState<number>(18); // Margin gap
  const [lastInsight, setLastInsight] = useState<string>('SVM searches for the decision boundary that creates the widest possible empty corridor (Maximum Margin).');

  const mapX = (val: number) => 40 + (val / 100) * 420;
  const mapY = (val: number) => 300 - (val / 100) * 280;

  // Support vectors are the points closest to or touching the margin lines
  const supportVectorIds = [4, 5];

  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-[#080b14] text-slate-200 overflow-hidden select-none">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSlope(-1.0); setOffset(102); setMarginWidth(22); setLastInsight('Maximum margin hyperplane computed with optimal margin width.'); }}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-pink-600 hover:bg-pink-500 text-white cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>Maximize Margin</span>
            </button>
            <button
              onClick={() => { setSlope(-0.6); setOffset(90); setMarginWidth(12); }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Class -1</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Class +1</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full border border-amber-400" />
              <span>Support Vectors</span>
            </span>
          </div>
        </div>

        {/* 2D SVM Canvas */}
        <div className="relative flex-1 min-h-90 bg-[#0c101f] border border-slate-800/80 rounded-2xl p-2 flex flex-col justify-center items-center shadow-inner overflow-hidden">
          <svg viewBox="0 0 500 350" className="w-full h-full max-h-115">
            {/* Margins Corridor Shading */}
            <polygon
              points={`
                ${mapX(0)},${mapY(slope * 0 + offset + marginWidth)}
                ${mapX(100)},${mapY(slope * 100 + offset + marginWidth)}
                ${mapX(100)},${mapY(slope * 100 + offset - marginWidth)}
                ${mapX(0)},${mapY(slope * 0 + offset - marginWidth)}
              `}
              fill="rgba(236, 72, 153, 0.08)"
            />

            {/* Positive Margin Line: w.x + b = +1 */}
            <line
              x1={mapX(0)}
              y1={mapY(slope * 0 + offset + marginWidth)}
              x2={mapX(100)}
              y2={mapY(slope * 100 + offset + marginWidth)}
              stroke="#f472b6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Central Hyperplane: w.x + b = 0 */}
            <line
              x1={mapX(0)}
              y1={mapY(slope * 0 + offset)}
              x2={mapX(100)}
              y2={mapY(slope * 100 + offset)}
              stroke="#ec4899"
              strokeWidth="3"
            />

            {/* Negative Margin Line: w.x + b = -1 */}
            <line
              x1={mapX(0)}
              y1={mapY(slope * 0 + offset - marginWidth)}
              x2={mapX(100)}
              y2={mapY(slope * 100 + offset - marginWidth)}
              stroke="#f472b6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Points */}
            {SVM_DATA.map((p) => {
              const isSupport = supportVectorIds.includes(p.id);
              return (
                <g key={p.id}>
                  {isSupport && (
                    <circle cx={mapX(p.x)} cy={mapY(p.y)} r={11} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                  )}
                  <circle
                    cx={mapX(p.x)}
                    cy={mapY(p.y)}
                    r={6.5}
                    fill={p.label === 1 ? '#06b6d4' : '#f43f5e'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-3.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles size={16} className="text-pink-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Maximum Margin Principle: </span>
            <span>{lastInsight}</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0d18] p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Hyperplane Equation</span>
          <div className="font-mono text-sm font-bold text-pink-300">
            w · x + b = 0
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Margin Corridor Width</span>
            <span className="text-2xl font-mono font-black text-white">{(marginWidth * 2).toFixed(1)} px</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Support Vectors</span>
            <span className="text-base font-mono font-bold text-amber-400">2 Points</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sliders size={12} /> Hyperplane Controls
          </span>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Angle / Slope:</span>
              <span className="font-mono font-bold text-white">{slope.toFixed(2)}</span>
            </div>
            <input type="range" min="-2.5" max="-0.2" step="0.1" value={slope} onChange={(e) => setSlope(parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Margin Width (2/||w||):</span>
              <span className="font-mono font-bold text-white">{marginWidth}</span>
            </div>
            <input type="range" min="8" max="30" value={marginWidth} onChange={(e) => setMarginWidth(parseInt(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
          </div>
        </div>

        <div className="mt-auto p-3 bg-pink-950/30 border border-pink-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-pink-300 block mb-1">What are Support Vectors?</strong>
          They are the critical boundary points that "support" the margin lines. Even if you delete all other distant points, the SVM decision line stays exactly identical!
        </div>
      </div>
    </div>
  );
};
