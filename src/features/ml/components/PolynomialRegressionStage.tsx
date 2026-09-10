import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Plus, Activity, Sliders, ChevronRight, Sparkles } from 'lucide-react';

interface DataPoint {
  x: number; // 0 to 10
  y: number; // 0 to 100
}

const PARABOLIC_DATA: DataPoint[] = [
  { x: 1, y: 82 },
  { x: 2, y: 56 },
  { x: 3, y: 38 },
  { x: 4, y: 28 },
  { x: 5, y: 26 },
  { x: 6, y: 34 },
  { x: 7, y: 49 },
  { x: 8, y: 70 },
  { x: 9, y: 88 },
];

export const PolynomialRegressionStage: React.FC = () => {
  // y = a*x^2 + b*x + c
  const [degree, setDegree] = useState<number>(2); // 1: Linear, 2: Quadratic, 3: Cubic
  const [a, setA] = useState<number>(0.0); // quadratic coeff
  const [b, setB] = useState<number>(-2.0); // linear coeff
  const [c, setC] = useState<number>(80.0); // constant
  const [points, setPoints] = useState<DataPoint[]>(PARABOLIC_DATA);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [epoch, setEpoch] = useState<number>(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [lastInsight, setLastInsight] = useState<string>('Select polynomial degree and click "Auto-Fit Curve" to bend the line to fit non-linear points.');

  // Compute Predicted Value based on degree
  const predict = (xVal: number, currA: number, currB: number, currC: number, deg: number) => {
    if (deg === 1) return currB * xVal + currC;
    return currA * Math.pow(xVal - 5, 2) + currB * (xVal - 5) + currC;
  };

  const { mse, residuals } = useMemo(() => {
    let sumSq = 0;
    const res = points.map((p) => {
      const predY = predict(p.x, a, b, c, degree);
      const err = p.y - predY;
      sumSq += err * err;
      return { ...p, predY, err };
    });
    return { mse: sumSq / Math.max(1, points.length), residuals: res };
  }, [a, b, c, degree, points]);

  useEffect(() => {
    setLossHistory((prev) => [...prev, Math.round(mse)].slice(-25));
  }, [epoch]);

  // Gradient descent step
  const stepFit = () => {
    let gradA = 0;
    let gradB = 0;
    let gradC = 0;
    const n = points.length;

    points.forEach((p) => {
      const pred = predict(p.x, a, b, c, degree);
      const diff = -(p.y - pred);
      if (degree >= 2) gradA += (2 / n) * diff * Math.pow(p.x - 5, 2);
      gradB += (2 / n) * diff * (p.x - 5);
      gradC += (2 / n) * diff;
    });

    const lr = 0.008;
    const nextA = degree >= 2 ? a - lr * gradA : 0;
    const nextB = b - lr * gradB;
    const nextC = c - lr * gradC;

    setA(Number(nextA.toFixed(3)));
    setB(Number(nextB.toFixed(3)));
    setC(Number(nextC.toFixed(2)));
    setEpoch((prev) => prev + 1);
    setLastInsight(`Iteration ${epoch + 1}: Curve curvature optimized. MSE loss: ${mse.toFixed(1)}.`);
  };

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => stepFit(), 100);
      return () => clearInterval(timer);
    }
  }, [isRunning, a, b, c, degree, epoch]);

  const handleReset = () => {
    setIsRunning(false);
    setA(0.0);
    setB(-2.0);
    setC(80.0);
    setEpoch(0);
    setLossHistory([]);
    setPoints(PARABOLIC_DATA);
    setLastInsight('Model reset to initial state.');
  };

  const mapX = (val: number) => 50 + (val / 10) * 420;
  const mapY = (val: number) => 300 - (val / 100) * 270;

  // Generate smooth SVG curve path
  const curvePath = useMemo(() => {
    let d = '';
    for (let xVal = 0; xVal <= 10; xVal += 0.2) {
      const yVal = Math.max(0, Math.min(100, predict(xVal, a, b, c, degree)));
      const px = mapX(xVal);
      const py = mapY(yVal);
      d += xVal === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
    }
    return d;
  }, [a, b, c, degree]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-[#080b14] text-slate-200 overflow-hidden select-none">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isRunning ? 'bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isRunning ? <Pause size={13} /> : <Play size={13} />}
              <span>{isRunning ? 'Pause Fit' : 'Auto-Fit Curve'}</span>
            </button>
            <button
              onClick={stepFit}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Step</span>
              <ChevronRight size={13} />
            </button>
            <button onClick={handleReset} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer">
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Degree:</span>
            {[1, 2, 3].map((d) => (
              <button
                key={d}
                onClick={() => { setDegree(d); handleReset(); }}
                className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                  degree === d ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d === 1 ? '1 (Line)' : d === 2 ? '2 (Parabola)' : '3 (Cubic)'}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex-1 min-h-90 bg-[#0c101f] border border-slate-800/80 rounded-2xl p-2 flex flex-col justify-center items-center shadow-inner overflow-hidden">
          <svg viewBox="0 0 500 350" className="w-full h-full max-h-115">
            {[0, 25, 50, 75, 100].map((score) => (
              <g key={score}>
                <line x1={50} y1={mapY(score)} x2={470} y2={mapY(score)} stroke="#1b233a" strokeDasharray="3 3" />
                <text x={42} y={mapY(score) + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">{score}</text>
              </g>
            ))}
            {[0, 2, 4, 6, 8, 10].map((hr) => (
              <g key={hr}>
                <line x1={mapX(hr)} y1={30} x2={mapX(hr)} y2={300} stroke="#1b233a" strokeDasharray="3 3" />
                <text x={mapX(hr)} y={318} fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">{hr}</text>
              </g>
            ))}
            <line x1={50} y1={30} x2={50} y2={300} stroke="#334155" strokeWidth="2" />
            <line x1={50} y1={300} x2={470} y2={300} stroke="#334155" strokeWidth="2" />

            {/* Residual error vertical markers */}
            {residuals.map((r, i) => (
              <line key={i} x1={mapX(r.x)} y1={mapY(r.y)} x2={mapX(r.x)} y2={mapY(r.predY)} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" opacity={0.7} />
            ))}

            {/* Non-linear fitted curve */}
            <path d={curvePath} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

            {/* Data points */}
            {points.map((p, i) => (
              <circle key={i} cx={mapX(p.x)} cy={mapY(p.y)} r={5.5} fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" />
            ))}
          </svg>
        </div>

        <div className="mt-3.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles size={16} className="text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Live Insight: </span>
            <span>{lastInsight}</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0d18] p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Polynomial Equation</span>
          <div className="font-mono text-xs font-bold text-sky-300 leading-relaxed">
            {degree === 1
              ? `y = (${b.toFixed(2)})x + (${c.toFixed(1)})`
              : `y = (${a.toFixed(2)})(x-5)² + (${b.toFixed(2)})(x-5) + (${c.toFixed(1)})`}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Mean Squared Error</span>
            <span className="text-2xl font-mono font-black text-white">{mse.toFixed(1)}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Step</span>
            <span className="text-base font-mono font-bold text-sky-400">{epoch}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sliders size={12} /> Curvature Controls
          </span>
          {degree >= 2 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Curvature Coeff (a):</span>
                <span className="font-mono font-bold text-white">{a.toFixed(2)}</span>
              </div>
              <input type="range" min="-3" max="5" step="0.1" value={a} onChange={(e) => setA(parseFloat(e.target.value))} className="w-full accent-sky-500 cursor-pointer" />
            </div>
          )}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Linear Shift (b):</span>
              <span className="font-mono font-bold text-white">{b.toFixed(2)}</span>
            </div>
            <input type="range" min="-10" max="10" step="0.2" value={b} onChange={(e) => setB(parseFloat(e.target.value))} className="w-full accent-sky-500 cursor-pointer" />
          </div>
        </div>

        <div className="mt-auto p-3 bg-sky-950/30 border border-sky-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-sky-300 block mb-1">Why Polynomials?</strong>
          Real-world data is rarely a straight line. By adding higher powers ($x^2, x^3$), the regression model curves to capture U-shaped valleys and arches.
        </div>
      </div>
    </div>
  );
};
