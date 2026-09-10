import React, { useState, useMemo } from 'react';
import { RotateCcw, Sliders, Sparkles, GitFork } from 'lucide-react';

interface TreeNodePoint {
  id: number;
  x: number; // 0 to 100
  y: number; // 0 to 100
  label: 'A' | 'B'; // A: Red, B: Emerald
}

const TREE_DATA: TreeNodePoint[] = [
  // Left Zone (Predominantly Red)
  { id: 1, x: 15, y: 30, label: 'A' },
  { id: 2, x: 25, y: 70, label: 'A' },
  { id: 3, x: 35, y: 45, label: 'A' },
  { id: 4, x: 42, y: 85, label: 'A' },
  { id: 5, x: 20, y: 60, label: 'A' },

  // Right Top Zone (Predominantly Emerald)
  { id: 6, x: 65, y: 75, label: 'B' },
  { id: 7, x: 80, y: 85, label: 'B' },
  { id: 8, x: 75, y: 65, label: 'B' },
  { id: 9, x: 90, y: 70, label: 'B' },

  // Right Bottom Zone (Predominantly Red)
  { id: 10, x: 70, y: 25, label: 'A' },
  { id: 11, x: 85, y: 35, label: 'A' },
  { id: 12, x: 80, y: 15, label: 'A' },
];

export const DecisionTreeStage: React.FC = () => {
  const [splitX, setSplitX] = useState<number>(50); // Split 1: Vertical split line
  const [splitY, setSplitY] = useState<number>(55); // Split 2: Horizontal split for right side
  const [maxDepth, setMaxDepth] = useState<number>(2);

  // Compute Gini Impurity & Accuracy
  const { accuracy, purityScore } = useMemo(() => {
    let correct = 0;
    TREE_DATA.forEach((p) => {
      let predicted: 'A' | 'B';
      if (p.x < splitX) {
        predicted = 'A'; // Zone 1
      } else {
        if (maxDepth === 1) {
          predicted = 'B';
        } else {
          predicted = p.y >= splitY ? 'B' : 'A'; // Zone 2 vs Zone 3
        }
      }
      if (predicted === p.label) correct++;
    });

    const acc = Math.round((correct / TREE_DATA.length) * 100);
    return { accuracy: acc, purityScore: (acc / 100).toFixed(2) };
  }, [splitX, splitY, maxDepth]);

  const mapX = (val: number) => 40 + (val / 100) * 420;
  const mapY = (val: number) => 300 - (val / 100) * 280;

  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-[#080b14] text-slate-200 overflow-hidden select-none">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        {/* Controls */}
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Tree Depth:</span>
            {[1, 2].map((d) => (
              <button
                key={d}
                onClick={() => setMaxDepth(d)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  maxDepth === d ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Depth {d} {d === 1 ? '(1 Split)' : '(2 Splits)'}
              </button>
            ))}
            <button
              onClick={() => { setSplitX(50); setSplitY(55); setMaxDepth(2); }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer ml-2"
              title="Reset"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Class Red</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Class Emerald</span>
            </span>
          </div>
        </div>

        {/* 2D Partitioning Plane */}
        <div className="relative flex-1 min-h-90 bg-[#0c101f] border border-slate-800/80 rounded-2xl p-2 flex flex-col justify-center items-center shadow-inner overflow-hidden">
          <svg viewBox="0 0 500 350" className="w-full h-full max-h-115">
            {/* Zone 1 Color Background (Left of SplitX) */}
            <rect x={40} y={20} width={((splitX) / 100) * 420} height={280} fill="rgba(244, 63, 94, 0.08)" />

            {/* Zone 2 & 3 Color Background (Right of SplitX) */}
            {maxDepth === 1 ? (
              <rect x={mapX(splitX)} y={20} width={((100 - splitX) / 100) * 420} height={280} fill="rgba(16, 185, 129, 0.08)" />
            ) : (
              <>
                {/* Zone 2 Top (Emerald) */}
                <rect x={mapX(splitX)} y={20} width={((100 - splitX) / 100) * 420} height={mapY(splitY) - 20} fill="rgba(16, 185, 129, 0.12)" />
                {/* Zone 3 Bottom (Red) */}
                <rect x={mapX(splitX)} y={mapY(splitY)} width={((100 - splitX) / 100) * 420} height={300 - mapY(splitY)} fill="rgba(244, 63, 94, 0.08)" />
              </>
            )}

            {/* Split 1: Vertical Line at SplitX */}
            <line x1={mapX(splitX)} y1={20} x2={mapX(splitX)} y2={300} stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 3" />
            <text x={mapX(splitX)} y={15} fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">
              Split 1 (X = {splitX})
            </text>

            {/* Split 2: Horizontal Line on Right Side */}
            {maxDepth >= 2 && (
              <g>
                <line x1={mapX(splitX)} y1={mapY(splitY)} x2={460} y2={mapY(splitY)} stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 3" />
                <text x={430} y={mapY(splitY) - 6} fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">
                  Split 2 (Y = {splitY})
                </text>
              </g>
            )}

            {/* Data Points */}
            {TREE_DATA.map((p) => (
              <circle
                key={p.id}
                cx={mapX(p.x)}
                cy={mapY(p.y)}
                r={6}
                fill={p.label === 'A' ? '#f43f5e' : '#10b981'}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>

        <div className="mt-3.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Axis-Aligned Partitioning: </span>
            <span>Decision trees divide continuous 2D space into rectangular bounding zones using orthogonal cutoff lines.</span>
          </div>
        </div>
      </div>

      {/* Right Visual Hierarchy Tree Panel */}
      <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0d18] p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Split Accuracy</span>
            <span className="text-2xl font-mono font-black text-emerald-400">{accuracy}%</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Purity</span>
            <span className="text-base font-mono font-bold text-slate-200">{purityScore}</span>
          </div>
        </div>

        {/* Tree Flowchart Visualizer */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <GitFork size={12} className="text-emerald-400" />
            Decision Tree Hierarchy
          </span>

          <div className="flex flex-col items-center gap-2 text-xs font-mono">
            {/* Root Node */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold">
              Is X &lt; {splitX}?
            </div>

            {/* Branches */}
            <div className="w-full flex justify-between px-6 text-[10px] text-slate-500">
              <span>Yes (Left)</span>
              <span>No (Right)</span>
            </div>

            <div className="w-full flex justify-between gap-2">
              {/* Left Leaf */}
              <div className="flex-1 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-center text-[11px] font-bold">
                Class Red (5)
              </div>

              {/* Right Branch */}
              {maxDepth === 1 ? (
                <div className="flex-1 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center text-[11px] font-bold">
                  Class Emerald
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="px-2 py-1 rounded bg-slate-950 border border-sky-500/40 text-sky-300 text-[10px] font-bold w-full text-center">
                    Is Y ≥ {splitY}?
                  </div>
                  <div className="w-full flex gap-1">
                    <span className="flex-1 p-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center text-[10px] font-bold">
                      Emerald
                    </span>
                    <span className="flex-1 p-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-center text-[10px] font-bold">
                      Red
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sliders size={12} /> Split Cutoffs
          </span>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Vertical Split (X):</span>
              <span className="font-mono font-bold text-white">{splitX}</span>
            </div>
            <input type="range" min="20" max="80" value={splitX} onChange={(e) => setSplitX(parseInt(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
          </div>

          {maxDepth >= 2 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Horizontal Split (Y):</span>
                <span className="font-mono font-bold text-white">{splitY}</span>
              </div>
              <input type="range" min="20" max="80" value={splitY} onChange={(e) => setSplitY(parseInt(e.target.value))} className="w-full accent-sky-500 cursor-pointer" />
            </div>
          )}
        </div>

        <div className="mt-auto p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-emerald-300 block mb-1">Information Gain & Purity:</strong>
          A split is chosen when it maximizes the purity of the child leaves (e.g. all points inside a leaf belong to the same class).
        </div>
      </div>
    </div>
  );
};
