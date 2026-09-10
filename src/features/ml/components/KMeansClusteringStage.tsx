import React, { useState } from 'react';
import { RotateCcw, ChevronRight, Sparkles, Flag } from 'lucide-react';

interface ClusterPoint {
  id: number;
  x: number;
  y: number;
  cluster: number; // 0, 1, 2
}

interface Centroid {
  id: number;
  x: number;
  y: number;
  color: string;
}

const INITIAL_POINTS: ClusterPoint[] = [
  // Group 1
  { id: 1, x: 20, y: 30, cluster: 0 },
  { id: 2, x: 25, y: 25, cluster: 0 },
  { id: 3, x: 30, y: 40, cluster: 0 },
  { id: 4, x: 18, y: 45, cluster: 0 },
  { id: 5, x: 28, y: 35, cluster: 0 },

  // Group 2
  { id: 6, x: 75, y: 80, cluster: 1 },
  { id: 7, x: 82, y: 75, cluster: 1 },
  { id: 8, x: 80, y: 88, cluster: 1 },
  { id: 9, x: 70, y: 85, cluster: 1 },
  { id: 10, x: 88, y: 70, cluster: 1 },

  // Group 3
  { id: 11, x: 75, y: 25, cluster: 2 },
  { id: 12, x: 80, y: 35, cluster: 2 },
  { id: 13, x: 85, y: 20, cluster: 2 },
  { id: 14, x: 70, y: 30, cluster: 2 },
  { id: 15, x: 65, y: 22, cluster: 2 },
];

const INITIAL_CENTROIDS: Centroid[] = [
  { id: 0, x: 45, y: 60, color: '#f59e0b' }, // Amber
  { id: 1, x: 55, y: 45, color: '#a855f7' }, // Purple
  { id: 2, x: 60, y: 70, color: '#06b6d4' }, // Cyan
];

export const KMeansClusteringStage: React.FC = () => {
  const [points, setPoints] = useState<ClusterPoint[]>(INITIAL_POINTS);
  const [centroids, setCentroids] = useState<Centroid[]>(INITIAL_CENTROIDS);
  const [phase, setPhase] = useState<'assign' | 'update'>('assign');
  const [iteration, setIteration] = useState<number>(0);
  const [lastInsight, setLastInsight] = useState<string>('Step 1 (Assignment): Each point measures Euclidean distance and joins the closest centroid.');

  const mapX = (val: number) => 40 + (val / 100) * 420;
  const mapY = (val: number) => 300 - (val / 100) * 280;

  // Single step of K-Means
  const stepKMeans = () => {
    if (phase === 'assign') {
      // Phase 1: Assign each point to the closest centroid
      const updatedPts = points.map((p) => {
        let minDist = Infinity;
        let bestCluster = 0;
        centroids.forEach((c) => {
          const d = Math.hypot(p.x - c.x, p.y - c.y);
          if (d < minDist) {
            minDist = d;
            bestCluster = c.id;
          }
        });
        return { ...p, cluster: bestCluster };
      });

      setPoints(updatedPts);
      setPhase('update');
      setLastInsight('Points assigned to closest centroid. Now click "Step" to shift centroids to cluster centers.');
    } else {
      // Phase 2: Move centroids to the mean (average) of their cluster points
      const updatedCentroids = centroids.map((c) => {
        const clusterPts = points.filter((p) => p.cluster === c.id);
        if (clusterPts.length === 0) return c;
        const avgX = clusterPts.reduce((acc, p) => acc + p.x, 0) / clusterPts.length;
        const avgY = clusterPts.reduce((acc, p) => acc + p.y, 0) / clusterPts.length;
        return { ...c, x: Math.round(avgX), y: Math.round(avgY) };
      });

      setCentroids(updatedCentroids);
      setPhase('assign');
      setIteration((prev) => prev + 1);
      setLastInsight(`Iteration ${iteration + 1}: Centroids shifted to mean (center of gravity) of their clusters.`);
    }
  };

  const handleReset = () => {
    setPoints(INITIAL_POINTS);
    setCentroids(INITIAL_CENTROIDS);
    setPhase('assign');
    setIteration(0);
    setLastInsight('K-Means clustering reset.');
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-[#080b14] text-slate-200 overflow-hidden select-none">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={stepKMeans}
              className="px-4 py-1.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <span>Step ({phase === 'assign' ? '1. Assign Points' : '2. Move Centroids'})</span>
              <ChevronRight size={14} />
            </button>
            <button onClick={handleReset} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer">
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {centroids.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                <span>Cluster #{i + 1}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 2D Canvas */}
        <div className="relative flex-1 min-h-90 bg-[#0c101f] border border-slate-800/80 rounded-2xl p-2 flex flex-col justify-center items-center shadow-inner overflow-hidden">
          <svg viewBox="0 0 500 350" className="w-full h-full max-h-115">
            {/* Connecting lines from points to their assigned centroid */}
            {points.map((p) => {
              const c = centroids.find((cen) => cen.id === p.cluster);
              if (!c) return null;
              return (
                <line
                  key={p.id}
                  x1={mapX(p.x)}
                  y1={mapY(p.y)}
                  x2={mapX(c.x)}
                  y2={mapY(c.y)}
                  stroke={c.color}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity={0.35}
                />
              );
            })}

            {/* Data Points */}
            {points.map((p) => {
              const c = centroids.find((cen) => cen.id === p.cluster);
              return (
                <circle
                  key={p.id}
                  cx={mapX(p.x)}
                  cy={mapY(p.y)}
                  r={6}
                  fill={c ? c.color : '#94a3b8'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Flag Centroids */}
            {centroids.map((c) => (
              <g key={c.id} className="transition-all duration-500">
                <circle cx={mapX(c.x)} cy={mapY(c.y)} r={14} fill={c.color} opacity={0.25} />
                <rect
                  x={mapX(c.x) - 7}
                  y={mapY(c.y) - 7}
                  width={14}
                  height={14}
                  fill={c.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  rx={3}
                />
                <text x={mapX(c.x)} y={mapY(c.y) + 3} fill="#000000" fontSize="9" textAnchor="middle" fontWeight="bold">
                  K
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-3.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">2-Step Algorithm: </span>
            <span>{lastInsight}</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0d18] p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Current State</span>
          <div className="text-lg font-bold text-amber-300">
            {phase === 'assign' ? 'Waiting to Assign Points' : 'Waiting to Move Centroids'}
          </div>
          <span className="text-xs text-slate-400">Completed Iterations: {iteration}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Centroid Coordinates</span>
          <div className="space-y-1.5 font-mono text-xs">
            {centroids.map((c, i) => (
              <div key={i} className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="flex items-center gap-1.5" style={{ color: c.color }}>
                  <Flag size={12} /> Centroid #{i + 1}
                </span>
                <span className="text-slate-300">({c.x}, {c.y})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-amber-300 block mb-1">Unsupervised Intuition:</strong>
          K-Means has no teacher or labels. It discovers natural hidden clusters purely by alternating between assigning points and taking the average.
        </div>
      </div>
    </div>
  );
};
