import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Plus, Activity, Sliders, ChevronRight, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

interface DataPoint {
  x: number; // 0 to 10 hours
  y: number; // 0 to 100 score
}

const INITIAL_DATA: DataPoint[] = [
  { x: 1, y: 24 },
  { x: 2, y: 32 },
  { x: 3, y: 39 },
  { x: 4, y: 48 },
  { x: 5, y: 55 },
  { x: 6, y: 68 },
  { x: 7, y: 74 },
  { x: 8, y: 82 },
  { x: 9, y: 89 },
  { x: 10, y: 95 },
];

export const LinearRegressionStage: React.FC = () => {
  // Model state: y = m*x + c
  const [m, setM] = useState<number>(2.5); // Initial poor slope
  const [c, setC] = useState<number>(10.0); // Initial intercept
  const [points, setPoints] = useState<DataPoint[]>(INITIAL_DATA);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [epoch, setEpoch] = useState<number>(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [showResiduals, setShowResiduals] = useState<boolean>(true);
  const [learningRate, setLearningRate] = useState<number>(0.015);
  const [lastInsight, setLastInsight] = useState<string>('Click "Step 1 Iteration" or "Auto-Fit" to see how the line adjusts to minimize error.');

  const animationRef = useRef<number | null>(null);

  // Compute Current MSE & Residuals
  const { mse, residuals, gradM, gradC } = useMemo(() => {
    let sumSquaredError = 0;
    let sumGradM = 0;
    let sumGradC = 0;

    const resList = points.map((p) => {
      const predY = m * p.x + c;
      const error = p.y - predY; // actual - predicted
      sumSquaredError += error * error;
      sumGradM += -2 * error * p.x;
      sumGradC += -2 * error;
      return { ...p, predY, error };
    });

    const n = Math.max(1, points.length);
    return {
      mse: sumSquaredError / n,
      residuals: resList,
      gradM: sumGradM / n,
      gradC: sumGradC / n,
    };
  }, [m, c, points]);

  // Track loss history
  useEffect(() => {
    setLossHistory((prev) => {
      const next = [...prev, Math.round(mse)];
      return next.slice(-25); // Keep last 25 points
    });
  }, [epoch]);

  // Step Gradient Descent
  const stepGradientDescent = () => {
    // Gradient update with normalized scale for visual stability
    const nextM = Math.max(-5, Math.min(15, m - learningRate * (gradM * 0.1)));
    const nextC = Math.max(0, Math.min(60, c - learningRate * (gradC * 0.5)));
    
    const deltaM = nextM - m;
    setM(Number(nextM.toFixed(3)));
    setC(Number(nextC.toFixed(2)));
    setEpoch((prev) => prev + 1);

    if (Math.abs(deltaM) < 0.01 && Math.abs(gradC) < 1) {
      setLastInsight('Optimal convergence reached! The line now minimizes the sum of squared distances.');
      setIsRunning(false);
    } else {
      setLastInsight(`Epoch ${epoch + 1}: Line adjusted angle by ${(deltaM * 10).toFixed(2)}°. MSE dropped to ${mse.toFixed(1)}.`);
    }
  };

  // Auto-fit interval runner
  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        stepGradientDescent();
      }, 120);
      return () => clearInterval(timer);
    }
  }, [isRunning, m, c, gradM, gradC, learningRate, epoch]);

  // Reset Model
  const handleReset = () => {
    setIsRunning(false);
    setM(2.5);
    setC(10.0);
    setEpoch(0);
    setLossHistory([]);
    setPoints(INITIAL_DATA);
    setLastInsight('Model reset. Line has returned to initial random position.');
  };

  // Add Point by Clicking Coordinate Plane
  const handlePlaneClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isRunning) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // SVG coordinates mapping: SVG viewBox is 0 0 500 350
    // Chart area: X from 50 to 470 (range 420), Y from 30 to 300 (height 270)
    const normX = Math.max(0.5, Math.min(10, ((clickX - 50) / 420) * 10));
    const normY = Math.max(5, Math.min(100, 100 - ((clickY - 30) / 270) * 100));

    const newPt: DataPoint = {
      x: Number(normX.toFixed(1)),
      y: Math.round(normY),
    };
    setPoints((prev) => [...prev, newPt]);
    setLastInsight(`Added student data point: (${newPt.x} hrs, score ${newPt.y}%). Observe how error increases.`);
  };

  // Chart Coordinate Helpers (0-10 on X, 0-100 on Y -> 500x350 SVG space)
  const mapX = (val: number) => 50 + (val / 10) * 420;
  const mapY = (val: number) => 300 - (val / 100) * 270;

  // Fit Quality Evaluation
  const fitStatus = mse < 35 ? { label: 'Optimal Fit', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
                  : mse < 120 ? { label: 'Approaching Fit', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' }
                  : { label: 'High Error (Underfit)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };

  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-[#080b14] text-slate-200 overflow-hidden select-none">
      {/* LEFT / CENTER: The Interactive 2D Coordinate Plane */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        {/* Top Control Action Bar */}
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              {isRunning ? <Pause size={13} /> : <Play size={13} />}
              <span>{isRunning ? 'Pause Fit' : 'Auto-Fit Line'}</span>
            </button>

            <button
              onClick={stepGradientDescent}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Step Iteration</span>
              <ChevronRight size={13} />
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Reset Model"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Residual Toggle & Quick Info */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showResiduals}
                onChange={(e) => setShowResiduals(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <span>Show Error Residuals</span>
            </label>

            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${fitStatus.color}`}>
              {fitStatus.label}
            </span>
          </div>
        </div>

        {/* 2D Plane Box */}
        <div className="relative flex-1 min-h-90 bg-[#0c101f] border border-slate-800/80 rounded-2xl p-2 flex flex-col justify-center items-center shadow-inner overflow-hidden">
          {/* Subtle click instruction badge */}
          <div className="absolute top-3 left-4 text-[11px] text-slate-500 flex items-center gap-1 pointer-events-none">
            <Plus size={12} className="text-indigo-400" />
            <span>Click anywhere on plane to add custom student data</span>
          </div>

          <svg
            viewBox="0 0 500 350"
            className="w-full h-full max-h-115 cursor-crosshair overflow-visible"
            onClick={handlePlaneClick}
          >
            {/* Grid background lines */}
            {[0, 20, 40, 60, 80, 100].map((score) => (
              <g key={score}>
                <line
                  x1={50}
                  y1={mapY(score)}
                  x2={470}
                  y2={mapY(score)}
                  stroke="#1b233a"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text x={42} y={mapY(score) + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                  {score}
                </text>
              </g>
            ))}

            {[0, 2, 4, 6, 8, 10].map((hr) => (
              <g key={hr}>
                <line
                  x1={mapX(hr)}
                  y1={30}
                  x2={mapX(hr)}
                  y2={300}
                  stroke="#1b233a"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text x={mapX(hr)} y={318} fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  {hr}h
                </text>
              </g>
            ))}

            {/* X and Y Axes */}
            <line x1={50} y1={30} x2={50} y2={300} stroke="#334155" strokeWidth="2" />
            <line x1={50} y1={300} x2={470} y2={300} stroke="#334155" strokeWidth="2" />

            {/* Axis Titles */}
            <text x={260} y={340} fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">
              Study Time (Hours) →
            </text>
            <text
              x={-165}
              y={16}
              fill="#94a3b8"
              fontSize="11"
              textAnchor="middle"
              fontWeight="bold"
              transform="rotate(-90)"
            >
              Exam Score (%) →
            </text>

            {/* Vertical Residual (Error) Lines */}
            {showResiduals &&
              residuals.map((r, idx) => (
                <line
                  key={`res-${idx}`}
                  x1={mapX(r.x)}
                  y1={mapY(r.y)}
                  x2={mapX(r.x)}
                  y2={mapY(r.predY)}
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                  opacity={0.75}
                />
              ))}

            {/* The Regression Line: y = m*x + c */}
            <line
              x1={mapX(0)}
              y1={mapY(m * 0 + c)}
              x2={mapX(10)}
              y2={mapY(m * 10 + c)}
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data Points (Dots) */}
            {points.map((p, idx) => (
              <g key={`pt-${idx}`}>
                <circle
                  cx={mapX(p.x)}
                  cy={mapY(p.y)}
                  r={5}
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all hover:r-7"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Real-Time Mathematical Cause-and-Effect Card */}
        <div className="mt-3.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles size={16} className="text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Live Intuition: </span>
            <span>{lastInsight}</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Live Metrics, Parameter Sliders & Loss Curve */}
      <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0d18] p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Model Equation Box */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Current Model Equation
          </span>
          <div className="font-mono text-sm font-bold text-indigo-300">
            ŷ = ({m.toFixed(2)}) · x + ({c.toFixed(2)})
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Predicted Score = <strong className="text-slate-200">{m.toFixed(2)}</strong> × Hours + <strong className="text-slate-200">{c.toFixed(2)}</strong>
          </div>
        </div>

        {/* Live Loss Metric (MSE) */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Mean Squared Error (MSE)
            </span>
            <span className="text-2xl font-mono font-black text-white">
              {mse.toFixed(1)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Iteration Step</span>
            <span className="text-base font-mono font-bold text-indigo-400">{epoch}</span>
          </div>
        </div>

        {/* Live Mini MSE Loss Curve */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Activity size={12} className="text-cyan-400" />
            Loss Minimization Curve
          </span>
          <div className="h-20 w-full flex items-end gap-1 bg-[#060810] p-1.5 rounded-lg border border-slate-800/60 overflow-hidden">
            {lossHistory.length > 1 ? (
              <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  points={lossHistory
                    .map((val, i) => {
                      const maxL = Math.max(...lossHistory, 100);
                      const x = (i / (lossHistory.length - 1)) * 100;
                      const y = 36 - (val / maxL) * 32;
                      return `${x},${Math.max(2, Math.min(38, y))}`;
                    })
                    .join(' ')}
                />
              </svg>
            ) : (
              <div className="text-[10px] text-slate-500 w-full text-center my-auto">
                Step model to record loss curve
              </div>
            )}
          </div>
        </div>

        {/* Manual Sliders */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sliders size={12} />
            Manual Parameter Tuning
          </span>

          {/* Slope Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Slope (m) [Angle]:</span>
              <span className="font-mono font-bold text-white">{m.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="15"
              step="0.1"
              value={m}
              disabled={isRunning}
              onChange={(e) => {
                setM(parseFloat(e.target.value));
                setLastInsight('Manually changed slope. Watch how the line rotates and error lines stretch/shrink.');
              }}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Intercept Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Intercept (c) [Base Score]:</span>
              <span className="font-mono font-bold text-white">{c.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={c}
              disabled={isRunning}
              onChange={(e) => {
                setC(parseFloat(e.target.value));
                setLastInsight('Manually changed intercept. Line shifts up or down.');
              }}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Why this matters (College concept breakdown) */}
        <div className="mt-auto p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-indigo-300 block mb-1">Concept in 1 Line:</strong>
          Linear regression minimizes the vertical red lines (residuals). When the total sum of squared red lines is at its lowest, you get the <em>Best-Fit Line</em>.
        </div>
      </div>
    </div>
  );
};
