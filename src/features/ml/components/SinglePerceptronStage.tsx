import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';

interface PerceptronPoint {
  x1: number;
  x2: number;
  target: 0 | 1;
}

// Logic OR Gate data points
const OR_GATE_DATA: PerceptronPoint[] = [
  { x1: 0, x2: 0, target: 0 },
  { x1: 0, x2: 1, target: 1 },
  { x1: 1, x2: 0, target: 1 },
  { x1: 1, x2: 1, target: 1 },
];

export const SinglePerceptronStage: React.FC = () => {
  const [w1, setW1] = useState<number>(-0.3);
  const [w2, setW2] = useState<number>(0.4);
  const [bias, setBias] = useState<number>(-0.2);
  const learningRate = 0.1;
  const [epoch, setEpoch] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastInsight, setLastInsight] = useState<string>('The Perceptron updates its weights whenever it misclassifies a point: w = w + η*(target - pred)*x.');

  // Predict: z = w1*x1 + w2*x2 + bias. Output 1 if z >= 0 else 0
  const predict = (x1: number, x2: number, currW1: number, currW2: number, currB: number) => {
    const z = currW1 * x1 + currW2 * x2 + currB;
    return z >= 0 ? 1 : 0;
  };

  // Check errors
  const errors = OR_GATE_DATA.filter((p) => predict(p.x1, p.x2, w1, w2, bias) !== p.target);
  const isFullyLearned = errors.length === 0;

  // Single step of Rosenblatt Perceptron Learning
  const trainStep = () => {
    let newW1 = w1;
    let newW2 = w2;
    let newB = bias;
    let updated = false;

    for (const p of OR_GATE_DATA) {
      const pred = predict(p.x1, p.x2, newW1, newW2, newB);
      const err = p.target - pred;

      if (err !== 0) {
        newW1 += learningRate * err * p.x1;
        newW2 += learningRate * err * p.x2;
        newB += learningRate * err;
        updated = true;
        setLastInsight(`Misclassified point (${p.x1}, ${p.x2}). Adjusted weights: w1=${newW1.toFixed(2)}, w2=${newW2.toFixed(2)}, bias=${newB.toFixed(2)}.`);
        break; // 1 update per step
      }
    }

    setW1(Number(newW1.toFixed(3)));
    setW2(Number(newW2.toFixed(3)));
    setBias(Number(newB.toFixed(3)));
    setEpoch((prev) => prev + 1);

    if (!updated) {
      setLastInsight('Convergence! All 4 points are correctly separated by the perceptron hyperplane.');
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => trainStep(), 250);
      return () => clearInterval(timer);
    }
  }, [isRunning, w1, w2, bias, epoch]);

  const handleReset = () => {
    setIsRunning(false);
    setW1(-0.3);
    setW2(0.4);
    setBias(-0.2);
    setEpoch(0);
    setLastInsight('Perceptron weights reset to random initialization.');
  };

  // Map 0-1 Cartesian coordinates to 500x350 SVG space
  const mapX = (x: number) => 80 + x * 320;
  const mapY = (y: number) => 280 - y * 220;

  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-[#080b14] text-slate-200 overflow-hidden select-none">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              disabled={isFullyLearned}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isFullyLearned
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : isRunning
                  ? 'bg-amber-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isRunning ? <Pause size={13} /> : <Play size={13} />}
              <span>{isFullyLearned ? 'Learned!' : isRunning ? 'Pause' : 'Auto-Train Weights'}</span>
            </button>
            <button
              onClick={trainStep}
              disabled={isRunning || isFullyLearned}
              className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Train 1 Step</span>
              <ChevronRight size={13} />
            </button>
            <button onClick={handleReset} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer">
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Target 0</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>Target 1</span>
            </span>
            <span className={`px-2 py-0.5 rounded-md font-bold ${isFullyLearned ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
              {isFullyLearned ? '100% Correct' : `${errors.length} Misclassified`}
            </span>
          </div>
        </div>

        {/* 2D Decision Plane */}
        <div className="relative flex-1 min-h-90 bg-[#0c101f] border border-slate-800/80 rounded-2xl p-2 flex flex-col justify-center items-center shadow-inner overflow-hidden">
          <svg viewBox="0 0 500 350" className="w-full h-full max-h-115">
            {/* Coordinate Grid Box */}
            <rect x={80} y={60} width={320} height={220} fill="rgba(255,255,255,0.01)" stroke="#1e293b" />
            <line x1={80} y1={280} x2={400} y2={280} stroke="#475569" strokeWidth="1.5" />
            <line x1={80} y1={60} x2={80} y2={280} stroke="#475569" strokeWidth="1.5" />

            <text x={240} y={315} fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="bold">Input x1 →</text>
            <text x={45} y={170} fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="bold" transform="rotate(-90 45 170)">Input x2 →</text>

            {/* Decision Line: w1*x1 + w2*x2 + b = 0 => x2 = (-w1*x1 - b) / w2 */}
            {w2 !== 0 && (
              <line
                x1={mapX(-0.2)}
                y1={mapY((-w1 * -0.2 - bias) / w2)}
                x2={mapX(1.2)}
                y2={mapY((-w1 * 1.2 - bias) / w2)}
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}

            {/* OR-Gate 4 Points */}
            {OR_GATE_DATA.map((p, i) => {
              const pred = predict(p.x1, p.x2, w1, w2, bias);
              const isError = pred !== p.target;
              return (
                <g key={i}>
                  {isError && (
                    <circle cx={mapX(p.x1)} cy={mapY(p.x2)} r={12} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" />
                  )}
                  <circle
                    cx={mapX(p.x1)}
                    cy={mapY(p.x2)}
                    r={7.5}
                    fill={p.target === 1 ? '#818cf8' : '#f43f5e'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text x={mapX(p.x1)} y={mapY(p.x2) - 13} fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
                    ({p.x1},{p.x2})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-3.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles size={16} className="text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Weight Update Rule: </span>
            <span>{lastInsight}</span>
          </div>
        </div>
      </div>

      {/* Right Neuron Architecture Panel */}
      <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0d18] p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Neuron Formula</span>
          <div className="font-mono text-xs font-bold text-indigo-300">
            z = ({w1.toFixed(2)})·x1 + ({w2.toFixed(2)})·x2 + ({bias.toFixed(2)})
          </div>
        </div>

        {/* Weights & Bias Table */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Synaptic Parameters</span>
          <div className="flex justify-between pb-1 border-b border-slate-800">
            <span className="text-slate-400">Weight 1 (w1):</span>
            <span className="font-mono font-bold text-white">{w1.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pb-1 border-b border-slate-800">
            <span className="text-slate-400">Weight 2 (w2):</span>
            <span className="font-mono font-bold text-white">{w2.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Bias (b):</span>
            <span className="font-mono font-bold text-white">{bias.toFixed(2)}</span>
          </div>
        </div>

        {/* Step count */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">Training Epoch:</span>
          <span className="font-mono font-bold text-lg text-indigo-400">{epoch}</span>
        </div>

        <div className="mt-auto p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-indigo-300 block mb-1">Birth of Deep Learning:</strong>
          In 1957, Frank Rosenblatt created the Perceptron as an electronic simulation of a human brain cell. When multiple perceptrons are stacked together in layers, they form modern Deep Neural Networks!
        </div>
      </div>
    </div>
  );
};
