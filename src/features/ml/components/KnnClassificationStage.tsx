import React, { useState, useMemo } from 'react';
import { RotateCcw, Plus, Sliders, Sparkles, Target } from 'lucide-react';

interface Point2D {
  id: number;
  x: number;
  y: number;
  label: 'A' | 'B'; // A: Red, B: Cyan
}

const INITIAL_KNN_DATA: Point2D[] = [
  // Class A (Red Cluster top-left)
  { id: 1, x: 20, y: 70, label: 'A' },
  { id: 2, x: 28, y: 80, label: 'A' },
  { id: 3, x: 35, y: 65, label: 'A' },
  { id: 4, x: 22, y: 55, label: 'A' },
  { id: 5, x: 40, y: 75, label: 'A' },
  { id: 6, x: 30, y: 90, label: 'A' },

  // Class B (Cyan Cluster bottom-right)
  { id: 7, x: 70, y: 30, label: 'B' },
  { id: 8, x: 80, y: 25, label: 'B' },
  { id: 9, x: 75, y: 45, label: 'B' },
  { id: 10, x: 65, y: 35, label: 'B' },
  { id: 11, x: 85, y: 40, label: 'B' },
  { id: 12, x: 90, y: 20, label: 'B' },
];

export const KnnClassificationStage: React.FC = () => {
  const [k, setK] = useState<number>(3);
  const [queryPt, setQueryPt] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [points, setPoints] = useState<Point2D[]>(INITIAL_KNN_DATA);
  const [lastInsight, setLastInsight] = useState<string>('Click anywhere to place the target point. KNN finds the K-closest dots and votes.');

  // Find K-nearest neighbors using Euclidean Distance
  const { neighbors, voteA, voteB, maxRadius, winner } = useMemo(() => {
    const withDist = points.map((p) => {
      const dist = Math.hypot(p.x - queryPt.x, p.y - queryPt.y);
      return { ...p, dist };
    });

    withDist.sort((a, b) => a.dist - b.dist);
    const topK = withDist.slice(0, Math.min(k, withDist.length));

    let countA = 0;
    let countB = 0;
    topK.forEach((n) => {
      if (n.label === 'A') countA++;
      else countB++;
    });

    const maxDist = topK.length > 0 ? topK[topK.length - 1].dist : 20;
    const win = countA > countB ? 'A' : countB > countA ? 'B' : 'Tie';

    return { neighbors: topK, voteA: countA, voteB: countB, maxRadius: maxDist, winner: win };
  }, [points, queryPt, k]);

  // Click canvas to move query point
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const normX = Math.round(((clickX - 40) / 420) * 100);
    const normY = Math.round(100 - ((clickY - 20) / 280) * 100);

    const safeX = Math.max(5, Math.min(95, normX));
    const safeY = Math.max(5, Math.min(95, normY));

    setQueryPt({ x: safeX, y: safeY });
    setLastInsight(`Moved query point to (${safeX}, ${safeY}). Closest ${k} neighbors voted: ${voteA} Red vs ${voteB} Cyan.`);
  };

  const mapX = (val: number) => 40 + (val / 100) * 420;
  const mapY = (val: number) => 300 - (val / 100) * 280;

  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-[#080b14] text-slate-200 overflow-hidden select-none">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Select K:</span>
            {[1, 3, 5, 7].map((num) => (
              <button
                key={num}
                onClick={() => setK(num)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  k === num ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                K = {num}
              </button>
            ))}
            <button
              onClick={() => { setQueryPt({ x: 50, y: 50 }); setK(3); }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer ml-2"
              title="Reset"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Class Red ({voteA} votes)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Class Cyan ({voteB} votes)</span>
            </div>
          </div>
        </div>

        <div className="relative flex-1 min-h-90 bg-[#0c101f] border border-slate-800/80 rounded-2xl p-2 flex flex-col justify-center items-center shadow-inner overflow-hidden">
          <div className="absolute top-3 left-4 text-[11px] text-slate-500 flex items-center gap-1 pointer-events-none">
            <Target size={12} className="text-purple-400" />
            <span>Click anywhere to position target query point</span>
          </div>

          <svg viewBox="0 0 500 350" className="w-full h-full max-h-115 cursor-crosshair" onClick={handleCanvasClick}>
            {/* Grid */}
            {[20, 40, 60, 80].map((v) => (
              <g key={v}>
                <line x1={40} y1={mapY(v)} x2={460} y2={mapY(v)} stroke="#1b233a" strokeDasharray="3 3" />
                <line x1={mapX(v)} y1={20} x2={mapX(v)} y2={300} stroke="#1b233a" strokeDasharray="3 3" />
              </g>
            ))}

            {/* Neighborhood Circle for K Neighbors */}
            <circle
              cx={mapX(queryPt.x)}
              cy={mapY(queryPt.y)}
              r={(maxRadius / 100) * 420}
              fill="rgba(168, 85, 247, 0.08)"
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Connecting lines to K nearest neighbors */}
            {neighbors.map((n) => (
              <line
                key={n.id}
                x1={mapX(queryPt.x)}
                y1={mapY(queryPt.y)}
                x2={mapX(n.x)}
                y2={mapY(n.y)}
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                opacity={0.8}
              />
            ))}

            {/* Data Dots */}
            {points.map((p) => {
              const isNeighbor = neighbors.some((nb) => nb.id === p.id);
              return (
                <circle
                  key={p.id}
                  cx={mapX(p.x)}
                  cy={mapY(p.y)}
                  r={isNeighbor ? 7.5 : 5.5}
                  fill={p.label === 'A' ? '#f43f5e' : '#06b6d4'}
                  stroke={isNeighbor ? '#ffffff' : '#1e293b'}
                  strokeWidth={isNeighbor ? 2.5 : 1.5}
                  className="transition-all"
                />
              );
            })}

            {/* The Query Point (Crosshair Target) */}
            <circle
              cx={mapX(queryPt.x)}
              cy={mapY(queryPt.y)}
              r={9}
              fill={winner === 'A' ? '#f43f5e' : winner === 'B' ? '#06b6d4' : '#eab308'}
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <text x={mapX(queryPt.x)} y={mapY(queryPt.y) - 13} fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
              Target ({winner === 'A' ? 'Red' : winner === 'B' ? 'Cyan' : 'Tie'})
            </text>
          </svg>
        </div>

        <div className="mt-3.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles size={16} className="text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Voting Breakdown: </span>
            <span>{lastInsight}</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0d18] p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Predicted Output</span>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <span>Winner:</span>
            <span className={winner === 'A' ? 'text-rose-400' : winner === 'B' ? 'text-cyan-400' : 'text-amber-400'}>
              Class {winner === 'A' ? 'Red' : winner === 'B' ? 'Cyan' : 'Tie'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Distance Ranking</span>
          <div className="space-y-1.5">
            {neighbors.map((n, i) => (
              <div key={n.id} className="flex justify-between text-xs p-1.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${n.label === 'A' ? 'bg-rose-500' : 'bg-cyan-400'}`} />
                  <span>#{i + 1} Neighbor</span>
                </span>
                <span className="font-mono text-slate-400">d = {n.dist.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-3 bg-purple-950/30 border border-purple-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-purple-300 block mb-1">Why Odd K (3, 5, 7)?</strong>
          In binary classification, choosing an odd number for $K$ prevents tie votes! KNN doesn't train a model; it simply memorizes the training coordinates and classifies by majority vote.
        </div>
      </div>
    </div>
  );
};
