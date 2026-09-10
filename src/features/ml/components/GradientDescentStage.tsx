import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Sparkles, Sliders } from 'lucide-react';

export const GradientDescentStage: React.FC = () => {
  // Loss function: J(θ) = θ^2 + 10. Gradient: dJ/dθ = 2*θ
  const [theta, setTheta] = useState<number>(8.5); // Initial position on right slope
  const [learningRate, setLearningRate] = useState<number>(0.2); // Alpha
  const [stepCount, setStepCount] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [pathHistory, setPathHistory] = useState<{ theta: number; loss: number }[]>([
    { theta: 8.5, loss: 8.5 * 8.5 + 10 },
  ]);
  const [lastInsight, setLastInsight] = useState<string>('Adjust Learning Rate (α) and click "Step Descent" to watch the ball roll down the loss gradient.');

  const loss = theta * theta + 10;
  const gradient = 2 * theta;

  const stepDescent = () => {
    // θ_new = θ - α * gradient
    const nextTheta = theta - learningRate * gradient;
    const nextLoss = nextTheta * nextTheta + 10;

    setTheta(nextTheta);
    setStepCount((prev) => prev + 1);
    setPathHistory((prev) => [...prev, { theta: nextTheta, loss: nextLoss }]);

    if (Math.abs(nextTheta) < 0.05) {
      setLastInsight('Convergence achieved! The gradient is 0 at the bottom valley (global minimum).');
      setIsRunning(false);
    } else if (Math.abs(nextTheta) > 15) {
      setLastInsight('Overshoot / Divergence! Learning Rate is too high, causing the ball to fly out of the valley.');
      setIsRunning(false);
    } else {
      setLastInsight(`Step ${stepCount + 1}: Moved by step size -α·(dJ/dθ) = ${(-learningRate * gradient).toFixed(2)}.`);
    }
  };

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => stepDescent(), 200);
      return () => clearInterval(timer);
    }
  }, [isRunning, theta, learningRate, stepCount]);

  const handleReset = () => {
    setIsRunning(false);
    setTheta(8.5);
    setStepCount(0);
    setPathHistory([{ theta: 8.5, loss: 8.5 * 8.5 + 10 }]);
    setLastInsight('Gradient descent reset to starting parameter θ = 8.5.');
  };

  // Map θ (-10 to +10) and Loss (0 to 110) to SVG (500 x 350)
  const mapX = (t: number) => 250 + (t / 10) * 200;
  const mapY = (l: number) => 300 - (l / 110) * 260;

  // Parabolic bowl curve path
  const curvePath = (() => {
    let d = '';
    for (let t = -9.5; t <= 9.5; t += 0.2) {
      const l = t * t + 10;
      const x = mapX(t);
      const y = mapY(l);
      d += t === -9.5 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  })();

  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-[#080b14] text-slate-200 overflow-hidden select-none">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isRunning ? 'bg-amber-600 text-white' : 'bg-orange-600 hover:bg-orange-500 text-white'
              }`}
            >
              {isRunning ? <Pause size={13} /> : <Play size={13} />}
              <span>{isRunning ? 'Pause' : 'Auto-Roll Ball'}</span>
            </button>
            <button
              onClick={stepDescent}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Step 1 Iteration</span>
              <ChevronRight size={13} />
            </button>
            <button onClick={handleReset} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer">
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Gradient (Slope):</span>
            <span className="font-bold text-orange-400">{gradient.toFixed(2)}</span>
          </div>
        </div>

        {/* 2D Convex Valley Canvas */}
        <div className="relative flex-1 min-h-90 bg-[#0c101f] border border-slate-800/80 rounded-2xl p-2 flex flex-col justify-center items-center shadow-inner overflow-hidden">
          <svg viewBox="0 0 500 350" className="w-full h-full max-h-115">
            {/* Parabolic Loss Curve */}
            <path d={curvePath} fill="none" stroke="#f97316" strokeWidth="3" />

            {/* Global Minimum Marker (Center) */}
            <line x1={250} y1={mapY(10)} x2={250} y2={320} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x={250} y={335} fill="#4ade80" fontSize="10" textAnchor="middle" fontWeight="bold">
              Minimum (θ = 0)
            </text>

            {/* Stepped Trajectory Points */}
            {pathHistory.map((step, idx) => (
              <circle
                key={idx}
                cx={mapX(step.theta)}
                cy={mapY(step.loss)}
                r={3.5}
                fill="#fdba74"
                opacity={0.6}
              />
            ))}

            {/* Tangent Slope Arrow */}
            <line
              x1={mapX(theta) - 25}
              y1={mapY(loss) - 25 * (gradient / 4)}
              x2={mapX(theta) + 25}
              y2={mapY(loss) + 25 * (gradient / 4)}
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="2 2"
            />

            {/* The Rolling Ball (Current Parameter θ) */}
            <circle
              cx={mapX(theta)}
              cy={mapY(loss)}
              r={9}
              fill="#f97316"
              stroke="#ffffff"
              strokeWidth="2.5"
              className="transition-all duration-200"
            />
          </svg>
        </div>

        <div className="mt-3.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles size={16} className="text-orange-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Gradient Update: </span>
            <span>{lastInsight}</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0d18] p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Update Formula</span>
          <div className="font-mono text-sm font-bold text-orange-300">
            θ_next = θ - α · [∇J(θ)]
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Parameter (θ)</span>
            <span className="text-2xl font-mono font-black text-white">{theta.toFixed(2)}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Loss J(θ)</span>
            <span className="text-2xl font-mono font-black text-orange-400">{loss.toFixed(1)}</span>
          </div>
        </div>

        {/* Learning Rate Slider */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sliders size={12} /> Learning Rate (α)
          </span>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Step Size (α):</span>
              <span className="font-mono font-bold text-white">{learningRate}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.1"
              step="0.05"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.05 (Slow)</span>
              <span>0.25 (Optimal)</span>
              <span>1.0 (Overshoot)</span>
            </div>
          </div>
        </div>

        <div className="mt-auto p-3 bg-orange-950/30 border border-orange-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-orange-300 block mb-1">Why Gradient Descent?</strong>
          Every deep learning model and neural net (including ChatGPT) learns this exact way: computing the slope (gradient) and taking a small step in the opposite direction.
        </div>
      </div>
    </div>
  );
};
