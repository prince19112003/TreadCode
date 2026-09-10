import React, { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const TRAIN_POINTS: Point[] = [
  { x: 1, y: 35 },
  { x: 2, y: 48 },
  { x: 3, y: 40 },
  { x: 4, y: 62 },
  { x: 5, y: 58 },
  { x: 6, y: 75 },
  { x: 7, y: 70 },
  { x: 8, y: 88 },
  { x: 9, y: 82 },
];

export const OverfittingUnderfittingStage: React.FC = () => {
  const [complexity, setComplexity] = useState<'underfit' | 'optimal' | 'overfit'>('optimal');

  const mapX = (val: number) => 40 + (val / 10) * 420;
  const mapY = (val: number) => 300 - (val / 100) * 270;

  // Generate curve path for each state
  const curvePath = useMemo(() => {
    let d = '';
    for (let x = 0.5; x <= 9.5; x += 0.1) {
      let y = 0;
      if (complexity === 'underfit') {
        // Flat horizontal-ish line (High Bias)
        y = 55;
      } else if (complexity === 'optimal') {
        // Smooth linear/quadratic trend
        y = 30 + x * 6.5;
      } else {
        // High Variance (Squiggly polynomial fitting noise perfectly)
        y = 30 + x * 6.5 + Math.sin(x * 3.5) * 16;
      }
      const px = mapX(x);
      const py = mapY(Math.max(10, Math.min(95, y)));
      d += x === 0.5 ? `M ${px} ${py}` : ` L ${px} ${py}`;
    }
    return d;
  }, [complexity]);

  const config = {
    underfit: {
      title: 'Underfitting (High Bias)',
      trainLoss: 'High (340)',
      testLoss: 'High (365)',
      badge: 'Too Simple',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      insight: 'The model is too simple (a flat line). It fails to learn both training patterns and test data.',
    },
    optimal: {
      title: 'Just Right (Optimal Fit)',
      trainLoss: 'Low (25)',
      testLoss: 'Low (28)',
      badge: 'Balanced Sweet Spot',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      insight: 'Good generalization! The model captures the underlying signal without memorizing random noise.',
    },
    overfit: {
      title: 'Overfitting (High Variance)',
      trainLoss: 'Near Zero (2)',
      testLoss: 'Disaster High (480)',
      badge: 'Memorized Noise',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      insight: 'The model has memorized the training points perfectly (0 error), but fails miserably on unseen test data!',
    },
  }[complexity];

  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-[#080b14] text-slate-200 overflow-hidden select-none">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Model Mode:</span>
            {(['underfit', 'optimal', 'overfit'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setComplexity(mode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  complexity === mode
                    ? mode === 'optimal'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : mode === 'underfit'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'underfit' ? '1. Underfitting' : mode === 'optimal' ? '2. Just Right' : '3. Overfitting'}
              </button>
            ))}
          </div>

          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${config.badgeColor}`}>
            {config.badge}
          </span>
        </div>

        {/* 2D Fitting Canvas */}
        <div className="relative flex-1 min-h-90 bg-[#0c101f] border border-slate-800/80 rounded-2xl p-2 flex flex-col justify-center items-center shadow-inner overflow-hidden">
          <svg viewBox="0 0 500 350" className="w-full h-full max-h-115">
            {/* Grid */}
            {[25, 50, 75].map((y) => (
              <line key={y} x1={40} y1={mapY(y)} x2={460} y2={mapY(y)} stroke="#1b233a" strokeDasharray="3 3" />
            ))}

            {/* Model Fit Line/Curve */}
            <path
              d={curvePath}
              fill="none"
              stroke={complexity === 'optimal' ? '#10b981' : complexity === 'underfit' ? '#f59e0b' : '#f43f5e'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Training Points */}
            {TRAIN_POINTS.map((p, idx) => (
              <circle
                key={idx}
                cx={mapX(p.x)}
                cy={mapY(p.y)}
                r={6}
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>

        <div className="mt-3.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles size={16} className="text-violet-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Generalization Insight: </span>
            <span>{config.insight}</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0d18] p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Diagnosis</span>
          <div className="text-lg font-bold text-white">{config.title}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Train Error</span>
            <span className="text-xl font-mono font-bold text-white">{config.trainLoss}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Test Error</span>
            <span className={`text-xl font-mono font-bold ${complexity === 'overfit' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {config.testLoss}
            </span>
          </div>
        </div>

        {/* Bias vs Variance trade-off guide */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Tradeoff Comparison</span>
          <div className="flex justify-between pb-1 border-b border-slate-800">
            <span className="text-slate-400">Bias:</span>
            <span className="font-mono font-bold text-white">{complexity === 'underfit' ? 'High' : 'Low'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Variance:</span>
            <span className="font-mono font-bold text-white">{complexity === 'overfit' ? 'High' : 'Low'}</span>
          </div>
        </div>

        <div className="mt-auto p-3 bg-violet-950/30 border border-violet-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-violet-300 block mb-1">The Golden Rule:</strong>
          We don't care about getting 100% on the training dataset. What matters in machine learning is how well the model predicts <em>unseen</em> future test data!
        </div>
      </div>
    </div>
  );
};
