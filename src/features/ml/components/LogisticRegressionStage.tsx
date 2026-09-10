import React, { useState, useMemo } from 'react';
import { Play, RotateCcw, Plus, Activity, Sliders, Sparkles, CheckCircle2 } from 'lucide-react';

interface ClassDataPoint {
  x: number; // e.g. Study hours 0 to 10
  label: 0 | 1; // 0: Fail (Red), 1: Pass (Cyan)
}

const INITIAL_LOGISTIC_DATA: ClassDataPoint[] = [
  { x: 1, label: 0 },
  { x: 2, label: 0 },
  { x: 2.5, label: 0 },
  { x: 3.5, label: 0 },
  { x: 4, label: 0 },
  { x: 5, label: 1 },
  { x: 5.8, label: 1 },
  { x: 6.5, label: 1 },
  { x: 7.5, label: 1 },
  { x: 8.5, label: 1 },
  { x: 9.5, label: 1 },
];

export const LogisticRegressionStage: React.FC = () => {
  const [w, setW] = useState<number>(1.2); // Weight (steepness of S-curve)
  const [b, setB] = useState<number>(-5.4); // Bias (horizontal shift)
  const [threshold, setThreshold] = useState<number>(0.5); // Decision boundary cutoff
  const [points, setPoints] = useState<ClassDataPoint[]>(INITIAL_LOGISTIC_DATA);
  const [lastInsight, setLastInsight] = useState<string>('Drag weight (w) or bias (b) sliders to shift the Sigmoid S-curve. Threshold line separates Class 0 from Class 1.');

  // Sigmoid formula: P(y=1|x) = 1 / (1 + e^-(w*x + b))
  const sigmoid = (val: number, weight: number, bias: number) => {
    const z = weight * val + bias;
    return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
  };

  // Boundary location: z = 0 => x = -b / w
  const boundaryX = w !== 0 ? -b / w : 5;

  // Compute Metrics: Accuracy & Log-Loss
  const { accuracy, logLoss, predictions } = useMemo(() => {
    let correct = 0;
    let totalLoss = 0;

    const preds = points.map((p) => {
      const prob = sigmoid(p.x, w, b);
      const predClass = prob >= threshold ? 1 : 0;
      if (predClass === p.label) correct++;

      // Binary Cross-Entropy Loss
      const safeProb = Math.max(1e-5, Math.min(1 - 1e-5, prob));
      const loss = -(p.label * Math.log(safeProb) + (1 - p.label) * Math.log(1 - safeProb));
      totalLoss += loss;

      return { ...p, prob, predClass };
    });

    const acc = Math.round((correct / Math.max(1, points.length)) * 100);
    const avgLoss = totalLoss / Math.max(1, points.length);

    return { accuracy: acc, logLoss: avgLoss, predictions: preds };
  }, [w, b, threshold, points]);

  // Add data point on canvas
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const normX = Number(Math.max(0.5, Math.min(10, ((clickX - 50) / 420) * 10)).toFixed(1));
    const label: 0 | 1 = clickY > 165 ? 0 : 1; // Click lower half = 0, upper half = 1

    setPoints((prev) => [...prev, { x: normX, label }]);
    setLastInsight(`Added Class ${label} point at X=${normX}.`);
  };

  const mapX = (val: number) => 50 + (val / 10) * 420;
  const mapY = (prob: number) => 290 - prob * 240; // 0 to 1 mapped to Y coordinates

  // Generate smooth Sigmoid Curve
  const sigmoidPath = useMemo(() => {
    let d = '';
    for (let xVal = 0; xVal <= 10; xVal += 0.1) {
      const p = sigmoid(xVal, w, b);
      const px = mapX(xVal);
      const py = mapY(p);
      d += xVal === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
    }
    return d;
  }, [w, b]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-[#080b14] text-slate-200 overflow-hidden select-none">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        {/* Top Controls */}
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setW(1.8); setB(-8.1); setLastInsight('Auto-fit calculated optimal decision boundary at X ≈ 4.5 hrs.'); }}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>Optimal S-Curve</span>
            </button>
            <button
              onClick={() => { setW(1.2); setB(-5.4); setThreshold(0.5); setPoints(INITIAL_LOGISTIC_DATA); setLastInsight('Model reset.'); }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Class 0 (Fail)</span>
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Class 1 (Pass)</span>
            </span>
          </div>
        </div>

        {/* 2D Sigmoid Canvas */}
        <div className="relative flex-1 min-h-90 bg-[#0c101f] border border-slate-800/80 rounded-2xl p-2 flex flex-col justify-center items-center shadow-inner overflow-hidden">
          <div className="absolute top-3 left-4 text-[11px] text-slate-500 flex items-center gap-1 pointer-events-none">
            <Plus size={12} className="text-indigo-400" />
            <span>Click bottom half for Red (0), top half for Cyan (1)</span>
          </div>

          <svg viewBox="0 0 500 350" className="w-full h-full max-h-115 cursor-pointer" onClick={handleCanvasClick}>
            {/* Probability 0, 0.5, 1 grid lines */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((prob) => (
              <g key={prob}>
                <line x1={50} y1={mapY(prob)} x2={470} y2={mapY(prob)} stroke="#1b233a" strokeDasharray="3 3" />
                <text x={42} y={mapY(prob) + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                  {prob.toFixed(2)}
                </text>
              </g>
            ))}

            {/* Threshold horizontal line (0.5 cutoff) */}
            <line x1={50} y1={mapY(threshold)} x2={470} y2={mapY(threshold)} stroke="#eab308" strokeWidth="1" strokeDasharray="4 4" opacity={0.6} />

            {/* Vertical Decision Boundary Line */}
            {boundaryX >= 0 && boundaryX <= 10 && (
              <g>
                <line x1={mapX(boundaryX)} y1={30} x2={mapX(boundaryX)} y2={290} stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />
                <text x={mapX(boundaryX)} y={25} fill="#c084fc" fontSize="10" textAnchor="middle" fontWeight="bold">
                  Cutoff: {boundaryX.toFixed(1)}h
                </text>
              </g>
            )}

            {/* Axes */}
            <line x1={50} y1={30} x2={50} y2={290} stroke="#334155" strokeWidth="2" />
            <line x1={50} y1={290} x2={470} y2={290} stroke="#334155" strokeWidth="2" />

            {/* The Sigmoid Probability Curve */}
            <path d={sigmoidPath} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

            {/* Class Data Dots */}
            {predictions.map((p, idx) => (
              <circle
                key={idx}
                cx={mapX(p.x)}
                cy={mapY(p.label)}
                r={6}
                fill={p.label === 1 ? '#22d3ee' : '#f43f5e'}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>

        <div className="mt-3.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles size={16} className="text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Live Intuition: </span>
            <span>{lastInsight}</span>
          </div>
        </div>
      </div>

      {/* Right Metrics Panel */}
      <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0d18] p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Sigmoid Function</span>
          <div className="font-mono text-xs font-bold text-cyan-300">
            P(Pass) = 1 / (1 + e^-[({w.toFixed(2)})x + ({b.toFixed(1)})])
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Accuracy</span>
            <span className="text-2xl font-mono font-black text-emerald-400">{accuracy}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Log-Loss</span>
            <span className="text-2xl font-mono font-black text-white">{logLoss.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sliders size={12} /> Model Tuning
          </span>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Weight (w) [Slope]:</span>
              <span className="font-mono font-bold text-white">{w.toFixed(2)}</span>
            </div>
            <input type="range" min="0.2" max="4" step="0.1" value={w} onChange={(e) => setW(parseFloat(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Bias (b) [Shift]:</span>
              <span className="font-mono font-bold text-white">{b.toFixed(1)}</span>
            </div>
            <input type="range" min="-15" max="2" step="0.2" value={b} onChange={(e) => setB(parseFloat(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
          </div>
        </div>

        <div className="mt-auto p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-indigo-300 block mb-1">Why Sigmoid?</strong>
          Linear lines output -∞ to +∞, but probability must be between 0 and 1. The Sigmoid curve squashes any real number into a clean probability percentage.
        </div>
      </div>
    </div>
  );
};
