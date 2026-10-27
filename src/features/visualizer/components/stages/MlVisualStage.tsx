import React from 'react';
import { useLessonStore } from '../../../../lessons/useLessonStore';

export const MlVisualStage: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const currentStep = useLessonStore(s => s.currentStep);
  const zoom = useLessonStore(s => s.zoom);
  const editableValues = useLessonStore(s => s.editableValues);

  const topic = lesson?.topic || 'linear_regression';
  const mem = currentStep?.memorySnapshot || {};

  /* ─────────────────────────────────────────────────────────────
     1. LINEAR REGRESSION VISUALIZER (y = mx + c)
     ───────────────────────────────────────────────────────────── */
  const renderLinearRegression = () => {
    const rawPoints = (mem.points as Array<{ x: number; y: number }>) || [
      { x: 1, y: 2.1 },
      { x: 2, y: 3.9 },
      { x: 3, y: 6.2 },
      { x: 4, y: 7.8 },
      { x: 5, y: 10.1 },
    ];

    const m = editableValues.m !== undefined ? Number(editableValues.m) : (mem.m !== undefined ? Number(mem.m) : 1.98);
    const c = editableValues.c !== undefined ? Number(editableValues.c) : (mem.c !== undefined ? Number(mem.c) : 0.22);
    const dynamicMse = (rawPoints.reduce((acc, p) => acc + Math.pow(p.y - (m * p.x + c), 2), 0) / rawPoints.length).toFixed(3);
    const mse = editableValues.m !== undefined || editableValues.c !== undefined ? dynamicMse : (mem.mse !== undefined ? Number(mem.mse).toFixed(2) : dynamicMse);

    // SVG Coordinate Mapping: X: [0, 6] => [70, 560], Y: [0, 12] => [310, 40]
    const mapX = (x: number) => 70 + (x / 6) * 490;
    const mapY = (y: number) => 310 - (y / 12) * 270;

    // Line start & end
    const x1 = 0.5;
    const y1 = m * x1 + c;
    const x2 = 5.5;
    const y2 = m * x2 + c;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Equation:</span>
            <span className="text-cyan-400 font-bold">
              y = {m.toFixed(2)}x {c >= 0 ? `+ ${c.toFixed(2)}` : `- ${Math.abs(c).toFixed(2)}`}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">MSE Loss:</span>
            <span className="text-amber-400 font-bold">{mse}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Phase:</span>
            <span className="text-emerald-400 font-bold">{mem.phase || 'OPTIMAL'}</span>
          </div>
        </div>

        {/* 2D Grid Canvas */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 360" className="w-full h-auto max-h-95 select-none">
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4, 5, 6].map(gx => (
              <line key={`gx-${gx}`} x1={mapX(gx)} y1={40} x2={mapX(gx)} y2={310} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 2, 4, 6, 8, 10, 12].map(gy => (
              <line key={`gy-${gy}`} x1={70} y1={mapY(gy)} x2={560} y2={mapY(gy)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Axis Labels */}
            {[0, 1, 2, 3, 4, 5, 6].map(gx => (
              <text key={`tx-${gx}`} x={mapX(gx)} y={330} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                {gx}
              </text>
            ))}
            {[0, 2, 4, 6, 8, 10, 12].map(gy => (
              <text key={`ty-${gy}`} x={55} y={mapY(gy) + 4} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                {gy}
              </text>
            ))}

            {/* Axis Lines */}
            <line x1={70} y1={40} x2={70} y2={310} stroke="#475569" strokeWidth="1.5" />
            <line x1={70} y1={310} x2={560} y2={310} stroke="#475569" strokeWidth="1.5" />

            {/* Regression Line */}
            <line
              x1={mapX(x1)}
              y1={mapY(y1)}
              x2={mapX(x2)}
              y2={mapY(y2)}
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="square"
            />

            {/* Residual Vertical Error Bars */}
            {rawPoints.map((p, idx) => {
              const yHat = m * p.x + c;
              const res = p.y - yHat;
              return (
                <g key={`res-${idx}`}>
                  {/* Dashed vertical residual line */}
                  <line
                    x1={mapX(p.x)}
                    y1={mapY(p.y)}
                    x2={mapX(p.x)}
                    y2={mapY(yHat)}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  {/* Error magnitude label */}
                  <text
                    x={mapX(p.x) + 8}
                    y={(mapY(p.y) + mapY(yHat)) / 2 + 3}
                    fill="#fbbf24"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {res >= 0 ? `+${res.toFixed(1)}` : res.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Data Points (Sharp Squares) */}
            {rawPoints.map((p, idx) => (
              <g key={`pt-${idx}`}>
                <rect
                  x={mapX(p.x) - 4.5}
                  y={mapY(p.y) - 4.5}
                  width="9"
                  height="9"
                  fill="#38bdf8"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                />
                <text
                  x={mapX(p.x)}
                  y={mapY(p.y) - 8}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  ({p.x}, {p.y})
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Residual Formula & Explanation Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Cost Function Formula</span>
            <span className="text-cyan-300">MSE = (1/N) · Σ (yᵢ - ŷᵢ)²</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Residual errors represent vertical deviation from candidate line.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Optimization State</span>
            <span className="text-emerald-400">
              {mem.phase === 'OPTIMAL' ? 'Closed-Form OLS Solved (Minimum Residuals)' : 'Iterative Parameter Adjustments In Progress'}
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              Slope (m) and Intercept (c) adjust until slope of cost function equals 0.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     2. GRADIENT DESCENT VISUALIZER (Loss Bowl J(w) = w^2)
     ───────────────────────────────────────────────────────────── */
  const renderGradientDescent = () => {
    const alpha = editableValues.alpha !== undefined ? Number(editableValues.alpha) : (mem.alpha !== undefined ? Number(mem.alpha) : 0.2);
    const w = editableValues.w !== undefined ? Number(editableValues.w) : (mem.w !== undefined ? Number(mem.w) : 4.0);
    const loss = w * w;
    const grad = 2.0 * w;
    const epoch = mem.epoch !== undefined ? Number(mem.epoch) : 0;
    const history = (mem.history as Array<{ epoch: number; w: number; loss: number }>) || [];

    // Mapping: w in [-4.5, 4.5] => X [70, 550], loss in [0, 20] => Y [310, 40]
    const mapW = (val: number) => 310 + (val / 4.5) * 240;
    const mapLoss = (val: number) => 310 - (val / 20) * 270;

    // Generate smooth parabola points
    const parabolaPoints: string[] = [];
    for (let stepW = -4.5; stepW <= 4.5; stepW += 0.2) {
      const stepLoss = stepW * stepW;
      parabolaPoints.push(`${mapW(stepW)},${mapLoss(stepLoss)}`);
    }

    // Tangent line at current w: line equation: Y - y0 = slope * (X - x0)
    // Note: in mathematical space, slope = dJ/dw = 2*w
    const tangentDeltaW = 0.8;
    const tW1 = w - tangentDeltaW;
    const tLoss1 = w * w - grad * tangentDeltaW;
    const tW2 = w + tangentDeltaW;
    const tLoss2 = w * w + grad * tangentDeltaW;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Epoch:</span>
            <span className="text-cyan-400 font-bold">{epoch} / 5</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Weight w:</span>
            <span className="text-cyan-300 font-bold">{w.toFixed(3)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Loss J(w):</span>
            <span className="text-amber-400 font-bold">{loss.toFixed(3)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Gradient:</span>
            <span className="text-purple-300 font-bold">{grad.toFixed(3)}</span>
          </div>
        </div>

        {/* Parabolic Loss Bowl */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 360" className="w-full h-auto max-h-95 select-none">
            {/* Grid Lines */}
            {[-4, -2, 0, 2, 4].map(gw => (
              <line key={`gw-${gw}`} x1={mapW(gw)} y1={40} x2={mapW(gw)} y2={310} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 4, 8, 12, 16, 20].map(gl => (
              <line key={`gl-${gl}`} x1={70} y1={mapLoss(gl)} x2={550} y2={mapLoss(gl)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Axis Lines */}
            <line x1={mapW(0)} y1={40} x2={mapW(0)} y2={310} stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={70} y1={310} x2={550} y2={310} stroke="#475569" strokeWidth="1.5" />

            {/* Labels */}
            {[-4, -2, 0, 2, 4].map(gw => (
              <text key={`tw-${gw}`} x={mapW(gw)} y={330} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                w = {gw}
              </text>
            ))}
            {[0, 5, 10, 15, 20].map(gl => (
              <text key={`tl-${gl}`} x={55} y={mapLoss(gl) + 4} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                {gl}
              </text>
            ))}

            {/* Parabola Curve J(w) = w^2 */}
            <polyline
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.5"
              points={parabolaPoints.join(' ')}
            />

            {/* Historical Steps Trajectory */}
            {history.map((h, i) => (
              <g key={`hist-${i}`}>
                <rect
                  x={mapW(h.w) - 3}
                  y={mapLoss(h.loss) - 3}
                  width="6"
                  height="6"
                  fill="#64748b"
                  opacity="0.6"
                />
                <text x={mapW(h.w)} y={mapLoss(h.loss) - 6} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  e{h.epoch}
                </text>
              </g>
            ))}

            {/* Tangent Line at Current Point */}
            <line
              x1={mapW(tW1)}
              y1={mapLoss(Math.max(0, tLoss1))}
              x2={mapW(tW2)}
              y2={mapLoss(Math.min(20, tLoss2))}
              stroke="#c084fc"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* Current Weight Marker (Sharp Square) */}
            <rect
              x={mapW(w) - 5}
              y={mapLoss(loss) - 5}
              width="10"
              height="10"
              fill="#f59e0b"
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Direction Arrow Vector indicating -alpha * grad */}
            {Math.abs(grad) > 0.05 && (
              <line
                x1={mapW(w)}
                y1={mapLoss(loss) + 12}
                x2={mapW(w - alpha * grad)}
                y2={mapLoss(loss) + 12}
                stroke="#10b981"
                strokeWidth="2.5"
                markerEnd="url(#arrow)"
              />
            )}
          </svg>
        </div>

        {/* Descent Mathematical Update Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Weight Update Formula</span>
            <span className="text-cyan-300">w_next = w - α · (dJ/dw)</span>
            <div className="text-[11px] text-slate-300 mt-1">
              w_next = {w.toFixed(3)} - ({alpha} × {grad.toFixed(3)}) = {(w - alpha * grad).toFixed(3)}
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Convergence Dynamics</span>
            <span className="text-emerald-400">
              {epoch >= 5 ? 'Global Minimum Reached (Gradient ≈ 0)' : 'Stepping Down Convex Loss Slope'}
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              As minimum w=0 is approached, gradient magnitude shrinks automatically.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     3. POLYNOMIAL REGRESSION (Underfitting vs Overfitting)
     ───────────────────────────────────────────────────────────── */
  const renderPolynomialRegression = () => {
    const rawPoints = (mem.points as Array<{ x: number; y: number }>) || [
      { x: -2.0, y: 4.2 },
      { x: -1.4, y: 2.1 },
      { x: -0.8, y: 0.9 },
      { x: -0.1, y: 0.2 },
      { x: 0.6, y: 0.5 },
      { x: 1.2, y: 1.7 },
      { x: 1.7, y: 3.1 },
      { x: 2.2, y: 5.0 },
    ];

    const degree = editableValues.degree !== undefined ? Number(editableValues.degree) : (mem.degree !== undefined ? Number(mem.degree) : 2);
    let trainMse = mem.trainMse !== undefined ? Number(mem.trainMse).toFixed(2) : '0.28';
    let testMse = mem.testMse !== undefined ? Number(mem.testMse).toFixed(2) : '0.31';
    let biasVariance = mem.biasVariance || 'OPTIMAL (BALANCED)';

    if (editableValues.degree !== undefined) {
      if (degree === 1) {
        trainMse = '1.84';
        testMse = '1.95';
        biasVariance = 'HIGH BIAS (UNDERFITTING)';
      } else if (degree === 2) {
        trainMse = '0.28';
        testMse = '0.31';
        biasVariance = 'OPTIMAL (BALANCED)';
      } else if (degree === 3) {
        trainMse = '0.22';
        testMse = '0.39';
        biasVariance = 'SLIGHT OVERFIT';
      } else if (degree >= 5) {
        trainMse = '0.04';
        testMse = '3.42';
        biasVariance = 'HIGH VARIANCE (OVERFITTING)';
      }
    }

    // Map: X: [-2.5, 2.5] => [70, 550], Y: [0, 6] => [310, 40]
    const mapX = (x: number) => 310 + (x / 2.5) * 240;
    const mapY = (y: number) => 310 - (y / 6) * 270;

    // Polynomial Evaluator function based on current degree
    const evalPoly = (x: number): number => {
      if (degree === 0) return 2.0;
      if (degree === 1) return 0.2 * x + 2.2; // Linear underfit
      if (degree === 2) return 0.95 * x * x + 0.1 * x + 0.25; // Parabolic optimal
      if (degree === 3) return 0.05 * x * x * x + 0.9 * x * x + 0.1 * x + 0.3;
      // Degree 5: High variance wild oscillations
      return (
        0.3 * Math.pow(x, 5) -
        0.4 * Math.pow(x, 4) -
        0.8 * Math.pow(x, 3) +
        1.5 * Math.pow(x, 2) +
        0.2 * x +
        0.2
      );
    };

    // Polyline points
    const curvePoints: string[] = [];
    for (let px = -2.3; px <= 2.3; px += 0.05) {
      const py = evalPoly(px);
      curvePoints.push(`${mapX(px)},${mapY(Math.min(6.2, Math.max(-0.5, py)))}`);
    }

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Capacity:</span>
            <span className="text-cyan-400 font-bold">Degree d = {degree}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Diagnosis:</span>
            <span
              className={`font-bold ${
                biasVariance === 'HIGH_BIAS'
                  ? 'text-amber-400'
                  : biasVariance === 'HIGH_VARIANCE'
                  ? 'text-red-400'
                  : 'text-emerald-400'
              }`}
            >
              {biasVariance === 'HIGH_BIAS'
                ? 'UNDERFITTING (HIGH BIAS)'
                : biasVariance === 'HIGH_VARIANCE'
                ? 'OVERFITTING (HIGH VARIANCE)'
                : 'BALANCED GENERALIZATION'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Train MSE:</span>
            <span className="text-emerald-400 font-bold">{trainMse}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Test MSE:</span>
            <span className={`font-bold ${degree === 5 ? 'text-red-400' : 'text-amber-400'}`}>{testMse}</span>
          </div>
        </div>

        {/* 2D Curve Grid */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 360" className="w-full h-auto max-h-95 select-none">
            {/* Grid */}
            {[-2, -1, 0, 1, 2].map(gx => (
              <line key={`gx-${gx}`} x1={mapX(gx)} y1={40} x2={mapX(gx)} y2={310} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 1, 2, 3, 4, 5, 6].map(gy => (
              <line key={`gy-${gy}`} x1={70} y1={mapY(gy)} x2={550} y2={mapY(gy)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Axes */}
            <line x1={mapX(0)} y1={40} x2={mapX(0)} y2={310} stroke="#334155" strokeWidth="1" />
            <line x1={70} y1={310} x2={550} y2={310} stroke="#475569" strokeWidth="1.5" />

            {/* Labels */}
            {[-2, -1, 0, 1, 2].map(gx => (
              <text key={`tx-${gx}`} x={mapX(gx)} y={330} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                {gx}
              </text>
            ))}
            {[0, 1, 2, 3, 4, 5, 6].map(gy => (
              <text key={`ty-${gy}`} x={55} y={mapY(gy) + 4} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                {gy}
              </text>
            ))}

            {/* Polynomial Curve */}
            {degree > 0 && (
              <polyline
                fill="none"
                stroke={degree === 1 ? '#f59e0b' : degree === 5 ? '#ef4444' : '#06b6d4'}
                strokeWidth="2.5"
                points={curvePoints.join(' ')}
              />
            )}

            {/* Data Points */}
            {rawPoints.map((p, idx) => (
              <rect
                key={`poly-p-${idx}`}
                x={mapX(p.x) - 4}
                y={mapY(p.y) - 4}
                width="8"
                height="8"
                fill="#38bdf8"
                stroke="#0284c7"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>

        {/* Diagnosis Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
          <div className={`p-2.5 border rounded-none ${degree === 1 ? 'border-amber-500 bg-amber-950/20' : 'border-slate-800 bg-[#0a0d16]'}`}>
            <span className="text-amber-400 block text-[10px] uppercase font-bold mb-1">Degree 1: Underfitting</span>
            <div className="text-slate-300">High Bias. Model hypothesis space lacks capacity to represent non-linear curvature.</div>
          </div>
          <div className={`p-2.5 border rounded-none ${degree === 2 || degree === 3 ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-800 bg-[#0a0d16]'}`}>
            <span className="text-cyan-400 block text-[10px] uppercase font-bold mb-1">Degree 2-3: Optimal</span>
            <div className="text-slate-300">Sweet Spot. Smooth curve captures real data-generating distribution without noise fitting.</div>
          </div>
          <div className={`p-2.5 border rounded-none ${degree === 5 ? 'border-red-500 bg-red-950/20' : 'border-slate-800 bg-[#0a0d16]'}`}>
            <span className="text-red-400 block text-[10px] uppercase font-bold mb-1">Degree 5: Overfitting</span>
            <div className="text-slate-300">High Variance. Curve oscillates wildly. Fits random noise, causing test loss explosion.</div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     4. LOGISTIC REGRESSION (Sigmoid & Decision Boundary)
     ───────────────────────────────────────────────────────────── */
  const renderLogisticRegression = () => {
    const rawPoints = (mem.points as Array<{ x: number; yTrue: number }>) || [
      { x: 1.0, yTrue: 0 },
      { x: 1.8, yTrue: 0 },
      { x: 2.4, yTrue: 0 },
      { x: 3.0, yTrue: 0 },
      { x: 4.2, yTrue: 1 },
      { x: 5.0, yTrue: 1 },
      { x: 5.8, yTrue: 1 },
      { x: 6.6, yTrue: 1 },
    ];

    const w = editableValues.w !== undefined ? Number(editableValues.w) : (mem.w !== undefined ? Number(mem.w) : 2.4);
    const b = editableValues.b !== undefined ? Number(editableValues.b) : (mem.b !== undefined ? Number(mem.b) : -8.64);
    const threshold = editableValues.threshold !== undefined ? Number(editableValues.threshold) : (mem.threshold !== undefined ? Number(mem.threshold) : 0.50);
    const logitCut = Math.log(Math.max(0.01, Math.min(0.99, threshold)) / (1 - Math.max(0.01, Math.min(0.99, threshold))));
    const boundaryX = (logitCut - b) / (w || 0.001);

    const sigmoid = (x: number) => {
      const z = w * x + b;
      return 1.0 / (1.0 + Math.exp(-Math.max(-10, Math.min(10, z))));
    };

    const correctCount = rawPoints.filter(p => (sigmoid(p.x) >= threshold ? 1 : 0) === p.yTrue).length;
    const accuracy = (correctCount / rawPoints.length) * 100.0;
    const logLoss = mem.logLoss !== undefined ? Number(mem.logLoss).toFixed(2) : '0.06';

    // Mapping: X in [0, 8] => [70, 550], P in [0.0, 1.0] => [310, 50]
    const mapX = (x: number) => 70 + (x / 8) * 480;
    const mapP = (p: number) => 310 - p * 260;

    // Sigmoid curve points
    const curvePoints: string[] = [];
    for (let px = 0.0; px <= 8.0; px += 0.1) {
      curvePoints.push(`${mapX(px)},${mapP(sigmoid(px))}`);
    }

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Boundary (x*):</span>
            <span className="text-emerald-400 font-bold">x = {boundaryX.toFixed(2)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Weights:</span>
            <span className="text-cyan-400 font-bold">w = {w.toFixed(2)}, b = {b.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Log-Loss:</span>
            <span className="text-amber-400 font-bold">{logLoss}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Accuracy:</span>
            <span className="text-emerald-400 font-bold">{accuracy.toFixed(1)}%</span>
          </div>
        </div>

        {/* 2D Sigmoid Canvas */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 360" className="w-full h-auto max-h-95 select-none">
            {/* Shaded Classification Zones */}
            <rect x={70} y={50} width={Math.max(0, mapX(boundaryX) - 70)} height={260} fill="#f59e0b" fillOpacity="0.04" />
            <rect x={mapX(boundaryX)} y={50} width={Math.max(0, 550 - mapX(boundaryX))} height={260} fill="#06b6d4" fillOpacity="0.04" />

            {/* Grid */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(gx => (
              <line key={`lgx-${gx}`} x1={mapX(gx)} y1={50} x2={mapX(gx)} y2={310} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 0.25, 0.5, 0.75, 1.0].map(gp => (
              <line key={`lgp-${gp}`} x1={70} y1={mapP(gp)} x2={550} y2={mapP(gp)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Threshold Line at P = 0.50 */}
            <line x1={70} y1={mapP(0.5)} x2={550} y2={mapP(0.5)} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x={555} y={mapP(0.5) + 3} fill="#f59e0b" fontSize="9" fontFamily="monospace">
              P = 0.50
            </text>

            {/* Decision Boundary Vertical Line */}
            <line x1={mapX(boundaryX)} y1={50} x2={mapX(boundaryX)} y2={310} stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
            <text x={mapX(boundaryX)} y={42} fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle">
              Boundary x* = {boundaryX.toFixed(2)}
            </text>

            {/* Axes */}
            <line x1={70} y1={50} x2={70} y2={310} stroke="#475569" strokeWidth="1.5" />
            <line x1={70} y1={310} x2={550} y2={310} stroke="#475569" strokeWidth="1.5" />

            {/* Axis labels */}
            {[0, 2, 4, 6, 8].map(gx => (
              <text key={`ltx-${gx}`} x={mapX(gx)} y={330} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                x = {gx}
              </text>
            ))}
            {[0.0, 0.5, 1.0].map(gp => (
              <text key={`lty-${gp}`} x={55} y={mapP(gp) + 4} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                {gp.toFixed(1)}
              </text>
            ))}

            {/* Sigmoid S-Curve */}
            <polyline fill="none" stroke="#06b6d4" strokeWidth="2.5" points={curvePoints.join(' ')} />

            {/* Data Points */}
            {rawPoints.map((p, idx) => {
              const prob = sigmoid(p.x);
              return (
                <g key={`lpt-${idx}`}>
                  {/* Vertical line from point to its probability on the S-curve */}
                  <line
                    x1={mapX(p.x)}
                    y1={mapP(p.yTrue)}
                    x2={mapX(p.x)}
                    y2={mapP(prob)}
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  {/* Point marker */}
                  <rect
                    x={mapX(p.x) - 4.5}
                    y={mapP(p.yTrue) - 4.5}
                    width="9"
                    height="9"
                    fill={p.yTrue === 1 ? '#38bdf8' : '#f59e0b'}
                    stroke={p.yTrue === 1 ? '#0284c7' : '#d97706'}
                    strokeWidth="1.5"
                  />
                  {/* Prediction dot on curve */}
                  <circle cx={mapX(p.x)} cy={mapP(prob)} r="3" fill="#ffffff" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Diagnosis & Classification Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Sigmoid Function & Decision</span>
            <span className="text-cyan-300">P(y=1|x) = 1 / (1 + e^-(wx+b))</span>
            <div className="text-[11px] text-slate-300 mt-1">
              If P &ge; 0.50 (i.e. x &ge; {boundaryX.toFixed(2)}) &rarr; Predict Class 1. Else Predict Class 0.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Loss & Optimization</span>
            <span className="text-emerald-400">Binary Cross-Entropy Loss: {logLoss}</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Convex log-loss guarantees a single global minimum without local optima traps.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     5. K-NEAREST NEIGHBORS (KNN) CLASSIFIER
     ───────────────────────────────────────────────────────────── */
  const renderKnnClassification = () => {
    const rawPoints = (mem.points as Array<{ id: number; x: number; y: number; label: string }>) || [];
    const k = editableValues.k !== undefined ? Number(editableValues.k) : (mem.k !== undefined ? Number(mem.k) : 5);
    const query = {
      x: editableValues.queryX !== undefined ? Number(editableValues.queryX) : (mem.query?.x ?? 4.2),
      y: editableValues.queryY !== undefined ? Number(editableValues.queryY) : (mem.query?.y ?? 5.2),
    };

    const sorted = [...rawPoints]
      .map(p => ({
        ...p,
        dist: Math.sqrt(Math.pow(p.x - query.x, 2) + Math.pow(p.y - query.y, 2)),
      }))
      .sort((a, b) => a.dist - b.dist);

    const effectiveK = Math.min(k, sorted.length || 1);
    const nearestK = sorted.slice(0, effectiveK);
    const activeNeighbors = nearestK.map(p => p.id);
    const radius = nearestK.length > 0 ? nearestK[nearestK.length - 1].dist : (mem.radius !== undefined ? Number(mem.radius) : 2.15);

    const voteA = nearestK.filter(p => p.label === 'A').length;
    const voteB = nearestK.filter(p => p.label === 'B').length;
    const votes = { A: voteA, B: voteB };
    const assignedClass = voteB >= voteA ? 'B' : 'A';

    // Map: X in [0, 9] => [70, 550], Y in [0, 9] => [310, 40]
    const mapX = (x: number) => 70 + (x / 9) * 480;
    const mapY = (y: number) => 310 - (y / 9) * 270;
    const scaleDist = (d: number) => (d / 9) * 480;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Neighbors k:</span>
            <span className="text-cyan-400 font-bold">k = {k}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Query Point:</span>
            <span className="text-slate-200 font-bold">Q({query.x}, {query.y})</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Votes:</span>
            <span className="text-amber-400 font-bold">{votes.A} Class A</span>
            <span className="text-slate-600">vs</span>
            <span className="text-cyan-400 font-bold">{votes.B} Class B</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Decision:</span>
            <span className="text-emerald-400 font-bold">Class {assignedClass}</span>
          </div>
        </div>

        {/* 2D Neighborhood Canvas */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 360" className="w-full h-auto max-h-95 select-none">
            {/* Grid */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(gx => (
              <line key={`knnx-${gx}`} x1={mapX(gx)} y1={40} x2={mapX(gx)} y2={310} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(gy => (
              <line key={`knny-${gy}`} x1={70} y1={mapY(gy)} x2={550} y2={mapY(gy)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Axes */}
            <line x1={70} y1={40} x2={70} y2={310} stroke="#475569" strokeWidth="1.5" />
            <line x1={70} y1={310} x2={550} y2={310} stroke="#475569" strokeWidth="1.5" />

            {/* Labels */}
            {[0, 2, 4, 6, 8].map(gx => (
              <text key={`knn-tx-${gx}`} x={mapX(gx)} y={330} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                {gx}
              </text>
            ))}
            {[0, 2, 4, 6, 8].map(gy => (
              <text key={`knn-ty-${gy}`} x={55} y={mapY(gy) + 4} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                {gy}
              </text>
            ))}

            {/* Search Radius Circle (if k > 0) */}
            {k > 0 && radius > 0 && (
              <circle
                cx={mapX(query.x)}
                cy={mapY(query.y)}
                r={scaleDist(radius)}
                fill="#38bdf8"
                fillOpacity="0.08"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            )}

            {/* Distance Vectors from Q to Active Neighbors */}
            {k > 0 &&
              activeNeighbors.map(nIdx => {
                const p = rawPoints[nIdx];
                if (!p) return null;
                return (
                  <line
                    key={`vec-${nIdx}`}
                    x1={mapX(query.x)}
                    y1={mapY(query.y)}
                    x2={mapX(p.x)}
                    y2={mapY(p.y)}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                );
              })}

            {/* Training Points */}
            {rawPoints.map(p => {
              const isEnclosed = activeNeighbors.includes(p.id);
              return (
                <g key={`kp-${p.id}`}>
                  <rect
                    x={mapX(p.x) - 4.5}
                    y={mapY(p.y) - 4.5}
                    width="9"
                    height="9"
                    fill={p.label === 'A' ? '#f59e0b' : '#06b6d4'}
                    stroke={isEnclosed ? '#ffffff' : '#0f172a'}
                    strokeWidth={isEnclosed ? '2' : '1'}
                  />
                  <text x={mapX(p.x)} y={mapY(p.y) - 7} fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    {p.label}
                  </text>
                </g>
              );
            })}

            {/* Query Point Q (Prominent Crosshair / Diamond) */}
            <g>
              <rect
                x={mapX(query.x) - 6}
                y={mapY(query.y) - 6}
                width="12"
                height="12"
                fill={assignedClass === 'A' ? '#f59e0b' : assignedClass === 'B' ? '#06b6d4' : '#ffffff'}
                stroke="#ffffff"
                strokeWidth="2"
                transform={`rotate(45, ${mapX(query.x)}, ${mapY(query.y)})`}
              />
              <text x={mapX(query.x)} y={mapY(query.y) - 12} fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                Q
              </text>
            </g>
          </svg>
        </div>

        {/* Voting & Complexity Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Euclidean Metric & Voting</span>
            <span className="text-cyan-300">d(Q, Pᵢ) = √((x_q - xᵢ)² + (y_q - yᵢ)²)</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Top-{k} closest points vote. Query Q assigned to majority class: Class {assignedClass}.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Hyperparameter k Impact</span>
            <span className="text-emerald-400">{k === 1 ? 'k=1: High Variance (Sensitive to Noise)' : 'k=5: Smoothed Boundary (Robust)'}</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Odd values of k prevent tie votes in binary classification problems.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     6. DECISION TREE CLASSIFIER (Space Partitioning)
     ───────────────────────────────────────────────────────────── */
  const renderDecisionTree = () => {
    const rawPoints = (mem.points as Array<{ id: number; x: number; y: number; label: number }>) || [];
    const splitX = editableValues.splitX !== undefined ? Number(editableValues.splitX) : (mem.splits?.[0]?.threshold ?? 3.8);
    const splits = editableValues.splitX !== undefined
      ? [{ axis: 'X', threshold: splitX, xMin: 0, xMax: 8 }]
      : ((mem.splits as Array<{ axis: string; threshold: number; xMin?: number; xMax?: number }>) || []);

    const leftPoints = rawPoints.filter(p => p.x <= splitX);
    const rightPoints = rawPoints.filter(p => p.x > splitX);
    const giniOf = (pts: typeof rawPoints) => {
      if (pts.length === 0) return 0;
      const p0 = pts.filter(p => p.label === 0).length / pts.length;
      const p1 = pts.filter(p => p.label === 1).length / pts.length;
      return 1 - (p0 * p0 + p1 * p1);
    };
    const weightedGini = rawPoints.length > 0
      ? (leftPoints.length / rawPoints.length) * giniOf(leftPoints) + (rightPoints.length / rawPoints.length) * giniOf(rightPoints)
      : 0;
    const gini = editableValues.splitX !== undefined ? weightedGini.toFixed(2) : (mem.gini !== undefined ? Number(mem.gini).toFixed(2) : '0.00');
    const depth = editableValues.splitX !== undefined ? 1 : (mem.depth !== undefined ? Number(mem.depth) : 2);

    // Map: X in [0, 8] => [40, 310], Y in [0, 8] => [310, 40]
    const mapX = (x: number) => 40 + (x / 8) * 270;
    const mapY = (y: number) => 310 - (y / 8) * 270;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Tree Depth:</span>
            <span className="text-cyan-400 font-bold">d = {depth}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Splits:</span>
            <span className="text-purple-300 font-bold">{splits.length} Partition Lines</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Gini Impurity:</span>
            <span className="text-amber-400 font-bold">{gini}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Status:</span>
            <span className="text-emerald-400 font-bold">{depth >= 2 ? '100% PURE LEAVES' : 'SPLITTING'}</span>
          </div>
        </div>

        {/* Dual Canvas: Left 2D Partition Space, Right Tree Graph */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex flex-col md:flex-row gap-3 rounded-none overflow-hidden">
          
          {/* Left: 2D Partition Space */}
          <div className="flex-1 flex flex-col items-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">2D Feature Space Partition</div>
            <svg viewBox="0 0 340 340" className="w-full h-auto max-h-75 select-none">
              {/* Region Color Shading */}
              {splits.length >= 1 && (
                <rect x={mapX(0)} y={mapY(8)} width={mapX(4.0) - mapX(0)} height={mapY(0) - mapY(8)} fill="#f59e0b" fillOpacity="0.08" />
              )}
              {splits.length >= 2 && (
                <>
                  <rect x={mapX(4.0)} y={mapY(5.0)} width={mapX(8) - mapX(4.0)} height={mapY(0) - mapY(5.0)} fill="#06b6d4" fillOpacity="0.08" />
                  <rect x={mapX(4.0)} y={mapY(8)} width={mapX(8) - mapX(4.0)} height={mapY(5.0) - mapY(8)} fill="#f59e0b" fillOpacity="0.08" />
                </>
              )}

              {/* Grid */}
              {[0, 2, 4, 6, 8].map(gx => (
                <line key={`dtgx-${gx}`} x1={mapX(gx)} y1={40} x2={mapX(gx)} y2={310} stroke="#1e293b" strokeWidth="1" />
              ))}
              {[0, 2, 4, 6, 8].map(gy => (
                <line key={`dtgy-${gy}`} x1={40} y1={mapY(gy)} x2={310} y2={mapY(gy)} stroke="#1e293b" strokeWidth="1" />
              ))}

              {/* Axes */}
              <line x1={40} y1={40} x2={40} y2={310} stroke="#475569" strokeWidth="1.5" />
              <line x1={40} y1={310} x2={310} y2={310} stroke="#475569" strokeWidth="1.5" />

              {/* Axis Labels */}
              {[0, 2, 4, 6, 8].map(gx => (
                <text key={`dttx-${gx}`} x={mapX(gx)} y={325} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  {gx}
                </text>
              ))}
              {[0, 2, 4, 6, 8].map(gy => (
                <text key={`dtty-${gy}`} x={30} y={mapY(gy) + 3} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">
                  {gy}
                </text>
              ))}

              {/* Split 1: Vertical Line at X1 = 4.0 */}
              {splits.some(s => s.axis === 'X1') && (
                <g>
                  <line x1={mapX(4.0)} y1={40} x2={mapX(4.0)} y2={310} stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <text x={mapX(4.0)} y={35} fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    X1 = 4.0
                  </text>
                </g>
              )}

              {/* Split 2: Horizontal Line at X2 = 5.0 for X1 > 4.0 */}
              {splits.some(s => s.axis === 'X2') && (
                <g>
                  <line x1={mapX(4.0)} y1={mapY(5.0)} x2={mapX(8.0)} y2={mapY(5.0)} stroke="#c084fc" strokeWidth="2" strokeDasharray="3 3" />
                  <text x={mapX(6.0)} y={mapY(5.0) - 5} fill="#c084fc" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    X2 = 5.0
                  </text>
                </g>
              )}

              {/* Data Points */}
              {rawPoints.map(p => (
                <rect
                  key={`dtp-${p.id}`}
                  x={mapX(p.x) - 4}
                  y={mapY(p.y) - 4}
                  width="8"
                  height="8"
                  fill={p.label === 0 ? '#f59e0b' : '#06b6d4'}
                  stroke="#0f172a"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </div>

          {/* Right: Decision Tree Hierarchy */}
          <div className="flex-1 flex flex-col items-center border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">Binary Tree Hierarchy</div>
            <div className="w-full flex flex-col items-center justify-center space-y-2 py-2">
              
              {/* Root Node */}
              <div className="p-2 border border-cyan-500 bg-cyan-950/40 text-center w-40 text-[11px] rounded-none">
                <div className="text-cyan-300 font-bold">X1 &le; 4.0?</div>
                <div className="text-[9px] text-slate-400">Gini: {splits.length === 0 ? '0.48' : '0.24'} | n=10</div>
              </div>

              {/* Connecting branches */}
              <div className="w-48 flex justify-between text-[10px] text-slate-400 px-6">
                <span>&larr; Yes</span>
                <span>No &rarr;</span>
              </div>

              {/* Level 1 Children */}
              <div className="w-full flex justify-between px-2 gap-2">
                {/* Left Leaf: Pure Class 0 */}
                <div className="flex-1 p-2 border border-amber-500 bg-amber-950/40 text-center text-[10px] rounded-none">
                  <div className="text-amber-300 font-bold">Leaf: Class 0</div>
                  <div className="text-[9px] text-emerald-400">Pure (Gini=0.00)</div>
                  <div className="text-[9px] text-slate-400">n=4 (100% Class 0)</div>
                </div>

                {/* Right Node: Second Split or Mixed */}
                <div className={`flex-1 p-2 border text-center text-[10px] rounded-none ${
                  splits.length >= 2 ? 'border-purple-500 bg-purple-950/40' : 'border-slate-700 bg-slate-900'
                }`}>
                  <div className="text-purple-300 font-bold">{splits.length >= 2 ? 'X2 ≤ 5.0?' : 'Mixed (n=6)'}</div>
                  <div className="text-[9px] text-slate-400">{splits.length >= 2 ? 'Split 2' : 'Gini=0.44'}</div>
                </div>
              </div>

              {/* Level 2 Sub-leaves if Split 2 made */}
              {splits.length >= 2 && (
                <div className="w-full flex justify-end pr-2 pt-1">
                  <div className="w-1/2 flex flex-col gap-1">
                    <div className="flex justify-between text-[9px] text-slate-400 px-2">
                      <span>&larr; Yes</span>
                      <span>No &rarr;</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 p-1.5 border border-cyan-500 bg-cyan-950/40 text-center text-[9px] rounded-none">
                        <div className="text-cyan-300 font-bold">Class 1</div>
                        <div className="text-emerald-400 text-[8px]">Pure (n=4)</div>
                      </div>
                      <div className="flex-1 p-1.5 border border-amber-500 bg-amber-950/40 text-center text-[9px] rounded-none">
                        <div className="text-amber-300 font-bold">Class 0</div>
                        <div className="text-emerald-400 text-[8px]">Pure (n=2)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Purity & Split Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Gini Impurity Formula</span>
            <span className="text-cyan-300">Gini = 1 - Σ pᵢ² (0.00 = 100% Purity)</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Splits are chosen greedily to maximize Information Gain: ΔG = G_parent - Σ (n_child/n) · G_child.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Orthogonal Space Partition</span>
            <span className="text-emerald-400">Total Leaf Nodes: 3 (Zero Error)</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Every tree split creates an axis-aligned orthogonal decision hyperplane.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     7. NAIVE BAYES VISUALIZER (P(C|x) ∝ P(C)·P(x|C))
     ───────────────────────────────────────────────────────────── */
  const renderNaiveBayes = () => {
    const mu0 = mem.mu0 !== undefined ? Number(mem.mu0) : 3.0;
    const std0 = mem.std0 !== undefined ? Number(mem.std0) : 1.0;
    const mu1 = mem.mu1 !== undefined ? Number(mem.mu1) : 6.0;
    const std1 = mem.std1 !== undefined ? Number(mem.std1) : 1.2;

    const gaussian = (x: number, mu: number, std: number) => {
      const factor = 1 / (std * Math.sqrt(2 * Math.PI));
      const exp = -Math.pow(x - mu, 2) / (2 * Math.pow(std, 2));
      return factor * Math.exp(exp);
    };

    const priorC0 = editableValues.priorC0 !== undefined ? Number(editableValues.priorC0) : (mem.priorC0 !== undefined ? Number(mem.priorC0) : 0.50);
    const priorC1 = 1 - priorC0;
    const xQuery = editableValues.xQuery !== undefined ? Number(editableValues.xQuery) : (mem.xQuery !== undefined ? Number(mem.xQuery) : 4.8);
    const boundaryX = mem.boundaryX !== undefined ? Number(mem.boundaryX) : 4.35;
    const lik0 = gaussian(xQuery, mu0, std0);
    const lik1 = gaussian(xQuery, mu1, std1);
    const num0 = lik0 * priorC0;
    const num1 = lik1 * priorC1;
    const denom = num0 + num1 || 0.0001;
    const post0 = num0 / denom;
    const post1 = num1 / denom;
    const decision = post1 >= post0 ? 'PREDICT CLASS 1 (CYAN)' : 'PREDICT CLASS 0 (AMBER)';

    // SVG Coordinate Mapping: X: [0, 10] => [60, 580], Y: [0, 0.45] => [310, 45]
    const mapX = (x: number) => 60 + (x / 10) * 520;
    const mapY = (y: number) => 310 - (y / 0.45) * 265;

    // Sample Gaussian PDF curves
    const samplePoints = Array.from({ length: 80 }, (_, i) => (i / 79) * 10);
    const d0 = samplePoints.map((x, i) => `${i === 0 ? 'M' : 'L'} ${mapX(x).toFixed(1)} ${mapY(gaussian(x, mu0, std0)).toFixed(1)}`).join(' ');
    const d1 = samplePoints.map((x, i) => `${i === 0 ? 'M' : 'L'} ${mapX(x).toFixed(1)} ${mapY(gaussian(x, mu1, std1)).toFixed(1)}`).join(' ');

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Query Feature:</span>
            <span className="text-purple-300 font-bold">x = {xQuery.toFixed(2)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Bayes Threshold:</span>
            <span className="text-slate-200 font-bold">x* = {boundaryX.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">MAP Decision:</span>
            <span className="text-emerald-400 font-bold">{decision || 'INFERRING'}</span>
          </div>
        </div>

        {/* 2D Probability Density Canvas */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 360" className="w-full h-auto max-h-95 select-none">
            {/* Class Territory Shading */}
            <rect x={mapX(0)} y={45} width={mapX(boundaryX) - mapX(0)} height={265} fill="#f59e0b" fillOpacity="0.04" />
            <rect x={mapX(boundaryX)} y={45} width={mapX(10) - mapX(boundaryX)} height={265} fill="#06b6d4" fillOpacity="0.04" />

            {/* Grid Lines */}
            {[0, 2, 4, 6, 8, 10].map(gx => (
              <line key={`nbgx-${gx}`} x1={mapX(gx)} y1={45} x2={mapX(gx)} y2={310} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 0.1, 0.2, 0.3, 0.4].map(gy => (
              <line key={`nbgy-${gy}`} x1={60} y1={mapY(gy)} x2={580} y2={mapY(gy)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Axes */}
            <line x1={60} y1={310} x2={580} y2={310} stroke="#475569" strokeWidth="1.5" />
            <line x1={60} y1={45} x2={60} y2={310} stroke="#475569" strokeWidth="1.5" />

            {/* Labels */}
            {[0, 2, 4, 6, 8, 10].map(gx => (
              <text key={`nbtx-${gx}`} x={mapX(gx)} y={328} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
                {gx}
              </text>
            ))}
            {[0.1, 0.2, 0.3, 0.4].map(gy => (
              <text key={`nbty-${gy}`} x={52} y={mapY(gy) + 4} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                {gy.toFixed(1)}
              </text>
            ))}

            {/* Gaussian Bell Curves */}
            <path d={d0} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <path d={d1} fill="none" stroke="#06b6d4" strokeWidth="2.5" />

            {/* Curve Peak Labels */}
            <text x={mapX(mu0)} y={mapY(gaussian(mu0, mu0, std0)) - 10} textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
              Class 0: N({mu0}, {std0}²)
            </text>
            <text x={mapX(mu1)} y={mapY(gaussian(mu1, mu1, std1)) - 10} textAnchor="middle" fill="#06b6d4" fontSize="10" fontFamily="monospace" fontWeight="bold">
              Class 1: N({mu1}, {std1}²)
            </text>

            {/* Bayes Decision Boundary Line */}
            <line x1={mapX(boundaryX)} y1={45} x2={mapX(boundaryX)} y2={310} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x={mapX(boundaryX) + 4} y={60} fill="#a855f7" fontSize="9" fontFamily="monospace" fontWeight="bold">
              x* = {boundaryX}
            </text>

            {/* Query Probe Line at x = xQuery */}
            <line x1={mapX(xQuery)} y1={mapY(lik1)} x2={mapX(xQuery)} y2={310} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
            <rect x={mapX(xQuery) - 3} y={307} width={6} height={6} fill="#ffffff" />
            <text x={mapX(xQuery)} y={342} textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
              x={xQuery}
            </text>

            {/* Likelihood Intersection Projections */}
            {/* Class 0 Likelihood Point */}
            <line x1={60} y1={mapY(lik0)} x2={mapX(xQuery)} y2={mapY(lik0)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
            <rect x={mapX(xQuery) - 4} y={mapY(lik0) - 4} width={8} height={8} fill="#f59e0b" />
            <text x={mapX(xQuery) - 8} y={mapY(lik0) - 6} textAnchor="end" fill="#f59e0b" fontSize="9" fontFamily="monospace">
              P(x|C₀) = {lik0.toFixed(3)}
            </text>

            {/* Class 1 Likelihood Point */}
            <line x1={60} y1={mapY(lik1)} x2={mapX(xQuery)} y2={mapY(lik1)} stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
            <rect x={mapX(xQuery) - 4} y={mapY(lik1) - 4} width={8} height={8} fill="#06b6d4" />
            <text x={mapX(xQuery) + 8} y={mapY(lik1) - 6} textAnchor="start" fill="#06b6d4" fontSize="9" fontFamily="monospace">
              P(x|C₁) = {lik1.toFixed(3)}
            </text>
          </svg>
        </div>

        {/* Posterior Probability Meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none space-y-1.5">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-amber-400 font-bold uppercase">Posterior P(Class 0 | x)</span>
              <span className="text-amber-400 font-bold">{(post0 * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 border border-slate-800 rounded-none overflow-hidden">
              <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${post0 * 100}%` }} />
            </div>
            <div className="text-[10px] text-slate-500">Likelihood: {lik0.toFixed(3)} × Prior: 0.50</div>
          </div>

          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none space-y-1.5">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-cyan-400 font-bold uppercase">Posterior P(Class 1 | x)</span>
              <span className="text-cyan-400 font-bold">{(post1 * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 border border-slate-800 rounded-none overflow-hidden">
              <div className="bg-cyan-500 h-full transition-all duration-300" style={{ width: `${post1 * 100}%` }} />
            </div>
            <div className="text-[10px] text-slate-500">Likelihood: {lik1.toFixed(3)} × Prior: 0.50 (MAP Winner)</div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     8. SUPPORT VECTOR MACHINE (SVM LINEAR MARGIN)
     ───────────────────────────────────────────────────────────── */
  const renderSvm = () => {
    const rawPoints = (mem.points as Array<{ id: number; x: number; y: number; label: number }>) || [
      { id: 0, x: 1.5, y: 3.0, label: -1 },
      { id: 1, x: 2.0, y: 5.5, label: -1 },
      { id: 2, x: 3.0, y: 2.5, label: -1 },
      { id: 3, x: 3.2, y: 4.5, label: -1 },
      { id: 4, x: 5.0, y: 5.5, label: 1 },
      { id: 5, x: 5.5, y: 3.2, label: 1 },
      { id: 6, x: 6.8, y: 6.0, label: 1 },
      { id: 7, x: 7.2, y: 4.0, label: 1 },
    ];

    const w1 = mem.w1 !== undefined ? Number(mem.w1) : 1.2;
    const w2 = mem.w2 !== undefined ? Number(mem.w2) : 0.4;
    const b = mem.b !== undefined ? Number(mem.b) : 4.8;
    const margin = editableValues.marginW !== undefined ? Number(editableValues.marginW) : (mem.margin !== undefined ? Number(mem.margin) : 1.58);
    const supportVectorIds = (mem.supportVectorIds as number[]) || [];

    // SVG Coordinate Mapping: X: [0, 8] => [70, 560], Y: [0, 8] => [310, 40]
    const mapX = (x: number) => 70 + (x / 8) * 490;
    const mapY = (y: number) => 310 - (y / 8) * 270;

    // Hyperplane lines: x2 = (bias - w1 * x1) / w2
    const calcY = (x1: number, biasOffset: number) => (b + biasOffset - w1 * x1) / w2;

    const xA = 1.0;
    const xB = 7.0;

    // Center line: w·x - b = 0
    const yCenterA = calcY(xA, 0);
    const yCenterB = calcY(xB, 0);

    const marginFactor = margin / 1.58;
    // Gutter +1: w·x - b = +1
    const yPosA = calcY(xA, 1.0 * marginFactor);
    const yPosB = calcY(xB, 1.0 * marginFactor);

    // Gutter -1: w·x - b = -1
    const yNegA = calcY(xA, -1.0 * marginFactor);
    const yNegB = calcY(xB, -1.0 * marginFactor);

    // Margin Street Polygon Points
    const marginPoints = `
      ${mapX(xA)},${mapY(yPosA)}
      ${mapX(xB)},${mapY(yPosB)}
      ${mapX(xB)},${mapY(yNegB)}
      ${mapX(xA)},${mapY(yNegA)}
    `;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Hyperplane:</span>
            <span className="text-cyan-400 font-bold">
              {w1.toFixed(2)}·X₁ + {w2.toFixed(2)}·X₂ - {b.toFixed(2)} = 0
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Margin Width (2/||w||):</span>
            <span className="text-emerald-400 font-bold">{margin.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Support Vectors:</span>
            <span className="text-purple-300 font-bold">{supportVectorIds.length} Points</span>
          </div>
        </div>

        {/* 2D Feature Space Canvas */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 360" className="w-full h-auto max-h-95 select-none">
            {/* Grid */}
            {[0, 2, 4, 6, 8].map(gx => (
              <line key={`svmgx-${gx}`} x1={mapX(gx)} y1={40} x2={mapX(gx)} y2={310} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 2, 4, 6, 8].map(gy => (
              <line key={`svmgy-${gy}`} x1={70} y1={mapY(gy)} x2={560} y2={mapY(gy)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Axes */}
            <line x1={70} y1={310} x2={560} y2={310} stroke="#475569" strokeWidth="1.5" />
            <line x1={70} y1={40} x2={70} y2={310} stroke="#475569" strokeWidth="1.5" />

            {/* Labels */}
            {[0, 2, 4, 6, 8].map(gx => (
              <text key={`svmtx-${gx}`} x={mapX(gx)} y={328} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
                X₁={gx}
              </text>
            ))}
            {[0, 2, 4, 6, 8].map(gy => (
              <text key={`svmty-${gy}`} x={60} y={mapY(gy) + 4} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
                X₂={gy}
              </text>
            ))}

            {/* Shaded Margin Street */}
            <polygon points={marginPoints} fill="#06b6d4" fillOpacity="0.07" stroke="none" />

            {/* Positive Margin Gutter: w·x - b = +1 */}
            <line x1={mapX(xA)} y1={mapY(yPosA)} x2={mapX(xB)} y2={mapY(yPosB)} stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 3" />
            <text x={mapX(xB) - 10} y={mapY(yPosB) - 6} fill="#06b6d4" fontSize="9" fontFamily="monospace">
              w·x - b = +1
            </text>

            {/* Negative Margin Gutter: w·x - b = -1 */}
            <line x1={mapX(xA)} y1={mapY(yNegA)} x2={mapX(xB)} y2={mapY(yNegB)} stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" />
            <text x={mapX(xB) - 10} y={mapY(yNegB) + 14} fill="#f59e0b" fontSize="9" fontFamily="monospace">
              w·x - b = -1
            </text>

            {/* Optimal Separating Hyperplane: w·x - b = 0 */}
            <line x1={mapX(xA)} y1={mapY(yCenterA)} x2={mapX(xB)} y2={mapY(yCenterB)} stroke="#10b981" strokeWidth="2.5" />
            <text x={mapX(xA) + 10} y={mapY(yCenterA) - 8} fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
              w·x - b = 0 (Separating Hyperplane)
            </text>

            {/* Normal Vector w Arrow originating at (4.0, yCenter) */}
            {(() => {
              const xOrigin = 4.0;
              const yOrigin = calcY(xOrigin, 0);
              const norm = Math.sqrt(w1 * w1 + w2 * w2);
              const xEnd = xOrigin + (w1 / norm) * 0.9;
              const yEnd = yOrigin + (w2 / norm) * 0.9;
              return (
                <g>
                  <line x1={mapX(xOrigin)} y1={mapY(yOrigin)} x2={mapX(xEnd)} y2={mapY(yEnd)} stroke="#ffffff" strokeWidth="2" />
                  <rect x={mapX(xEnd) - 2} y={mapY(yEnd) - 2} width={4} height={4} fill="#ffffff" />
                  <text x={mapX(xEnd) + 6} y={mapY(yEnd) - 4} fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    w=[{w1},{w2}]
                  </text>
                </g>
              );
            })()}

            {/* Data Points */}
            {rawPoints.map(p => {
              const isSV = supportVectorIds.includes(p.id);
              const isClassPos = p.label === 1;
              const color = isClassPos ? '#06b6d4' : '#f59e0b';
              const px = mapX(p.x);
              const py = mapY(p.y);

              return (
                <g key={`svmpt-${p.id}`}>
                  {/* Support Vector Outer Halo Frame */}
                  {isSV && (
                    <>
                      <rect x={px - 8} y={py - 8} width={16} height={16} fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
                      <text x={px + 10} y={py - 6} fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        SV #{p.id}
                      </text>
                    </>
                  )}
                  {/* Core Point Box */}
                  <rect x={px - 4} y={py - 4} width={8} height={8} fill={color} />
                  <text x={px} y={py + 14} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
                    #{p.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Support Vector Explanatory Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Maximum Margin Objective</span>
            <span className="text-cyan-300">Min ½ ||w||² subject to yᵢ(w·xᵢ - b) ≥ 1</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Margin width M = 2 / ||w|| = 1.58. Maximizing margin guarantees optimal generalization bounds.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Dual Sparsity Theorem</span>
            <span className="text-emerald-400">3 Support Vectors Dictate Boundary</span>
            <div className="text-[11px] text-slate-400 mt-1">
              All other 5 data points have Lagrange multiplier αᵢ = 0. Removing them leaves the hyperplane unchanged.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     9. KERNEL SVM VISUALIZER (NON-LINEAR 2D TO 3D PROJECTION)
     ───────────────────────────────────────────────────────────── */
  const renderSvmKernel = () => {
    const rawPoints = (mem.points as Array<{ id: number; x: number; y: number; r: number; label: number }>) || [
      { id: 0, x: 0.0, y: 0.2, r: 0.2, label: 1 },
      { id: 1, x: 1.0, y: 0.8, r: 1.28, label: 1 },
      { id: 2, x: -0.9, y: 0.7, r: 1.14, label: 1 },
      { id: 3, x: 0.2, y: -1.1, r: 1.12, label: 1 },
      { id: 4, x: -0.6, y: -0.8, r: 1.0, label: 1 },
      { id: 5, x: 2.8, y: 1.2, r: 3.05, label: 0 },
      { id: 6, x: -2.9, y: 0.8, r: 3.01, label: 0 },
      { id: 7, x: 0.5, y: 3.2, r: 3.24, label: 0 },
      { id: 8, x: -0.4, y: -3.1, r: 3.13, label: 0 },
      { id: 9, x: 2.2, y: -2.4, r: 3.26, label: 0 },
      { id: 10, x: -2.3, y: -2.2, r: 3.18, label: 0 },
      { id: 11, x: 2.1, y: 2.3, r: 3.11, label: 0 },
    ];

    const mode = (mem.mode as string) || '2D_CIRCULAR';
    const radiusThreshold = editableValues.radiusThreshold !== undefined ? Number(editableValues.radiusThreshold) : (mem.radiusThreshold !== undefined ? Number(mem.radiusThreshold) : 2.1);
    const correctCount = rawPoints.filter(p => (p.r <= radiusThreshold ? 1 : 0) === p.label).length;
    const accuracy = (correctCount / rawPoints.length) * 100.0;

    // Left SVG: 2D Space X, Y in [-4, 4] => [30, 310]
    const map2DX = (x: number) => 170 + (x / 4.2) * 140;
    const map2DY = (y: number) => 170 - (y / 4.2) * 140;

    // Right SVG: 3D Radial Elevation Radius [0, 4] => [45, 305], Z = r^2 [0, 14] => [300, 45]
    const map3DR = (r: number) => 45 + (r / 4.0) * 260;
    const map3DZ = (z: number) => 300 - (z / 14) * 255;

    // Elevation curve sample points
    const curveSamples = Array.from({ length: 40 }, (_, i) => (i / 39) * 3.8);
    const curveD = curveSamples.map((r, i) => `${i === 0 ? 'M' : 'L'} ${map3DR(r).toFixed(1)} ${map3DZ(r * r).toFixed(1)}`).join(' ');

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Kernel Transform:</span>
            <span className="text-purple-300 font-bold">ϕ(x) = [x₁, x₂, x₁² + x₂²]</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Decision Radius:</span>
            <span className="text-emerald-400 font-bold">r = {radiusThreshold.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Separation Accuracy:</span>
            <span className={`font-bold ${accuracy > 90 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {accuracy.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Dual Canvas: Left 2D Concentric Space, Right 3D Elevation Space */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex flex-col md:flex-row gap-3 rounded-none overflow-hidden">
          
          {/* Left: 2D Feature Space */}
          <div className="flex-1 flex flex-col items-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
              2D Original Space (Non-Linear Distribution)
            </div>
            <svg viewBox="0 0 340 340" className="w-full h-auto max-h-75 select-none">
              {/* Axes */}
              <line x1={30} y1={170} x2={310} y2={170} stroke="#334155" strokeWidth="1" />
              <line x1={170} y1={30} x2={170} y2={310} stroke="#334155" strokeWidth="1" />

              {/* Grid ticks */}
              {[-3, -2, -1, 1, 2, 3].map(v => (
                <g key={`kgrid-${v}`}>
                  <line x1={map2DX(v)} y1={167} x2={map2DX(v)} y2={173} stroke="#64748b" strokeWidth="1" />
                  <line x1={167} y1={map2DY(v)} x2={173} y2={map2DY(v)} stroke="#64748b" strokeWidth="1" />
                </g>
              ))}

              {/* Linear Cut Failure Mode */}
              {mode === '2D_LINEAR_FAIL' && (
                <>
                  <line x1={30} y1={30} x2={310} y2={310} stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />
                  <text x={40} y={55} fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    Linear Cut Fails (Acc: 58.3%)
                  </text>
                </>
              )}

              {/* Circular Decision Boundary in 2D */}
              {(mode === '2D_CIRCULAR' || mode === 'COMPLETE') && (
                <>
                  {/* Outer ring shading */}
                  <rect x={30} y={30} width={280} height={280} fill="#f59e0b" fillOpacity="0.04" />
                  {/* Inner core circle shading */}
                  <circle cx={170} cy={170} r={(radiusThreshold / 4.2) * 140} fill="#06b6d4" fillOpacity="0.10" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
                  {/* Radius label */}
                  <line x1={170} y1={170} x2={170 + (radiusThreshold / 4.2) * 140} y2={170} stroke="#10b981" strokeWidth="1.5" />
                  <text x={170 + (radiusThreshold / 4.2) * 70} y={164} textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    r = {radiusThreshold}
                  </text>
                </>
              )}

              {/* Points Scatter */}
              {rawPoints.map(p => {
                const isInner = p.label === 1;
                const color = isInner ? '#06b6d4' : '#f59e0b';
                return (
                  <rect
                    key={`kpt-${p.id}`}
                    x={map2DX(p.x) - 3.5}
                    y={map2DY(p.y) - 3.5}
                    width={7}
                    height={7}
                    fill={color}
                  />
                );
              })}
            </svg>
          </div>

          {/* Right: 3D Elevation / Radial Space */}
          <div className="flex-1 flex flex-col items-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
              Higher-D Space: z = x₁² + x₂² = r²
            </div>
            <svg viewBox="0 0 340 340" className="w-full h-auto max-h-75 select-none">
              {/* Axes */}
              <line x1={45} y1={300} x2={310} y2={300} stroke="#475569" strokeWidth="1.5" />
              <line x1={45} y1={45} x2={45} y2={300} stroke="#475569" strokeWidth="1.5" />

              {/* Axis labels */}
              <text x={305} y={316} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                Radius r
              </text>
              <text x={42} y={55} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                z = r²
              </text>

              {/* Parabolic Elevation Curve */}
              <path d={curveD} fill="none" stroke="#a855f7" strokeWidth="1.5" />
              <text x={260} y={map3DZ(3.5 * 3.5) - 6} fill="#a855f7" fontSize="9" fontFamily="monospace">
                z = r²
              </text>

              {/* Elevated Hyperplane Slice (z = 4.41) */}
              {(mode === '3D_SLICED' || mode === '2D_CIRCULAR' || mode === 'COMPLETE') && (
                <>
                  <line x1={45} y1={map3DZ(4.41)} x2={310} y2={map3DZ(4.41)} stroke="#10b981" strokeWidth="2" />
                  <text x={180} y={map3DZ(4.41) - 6} fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    3D Slicing Plane: z = 4.41 (100% Separation)
                  </text>
                </>
              )}

              {/* Elevated Points */}
              {rawPoints.map(p => {
                const isInner = p.label === 1;
                const color = isInner ? '#06b6d4' : '#f59e0b';
                const z = p.x * p.x + p.y * p.y;
                return (
                  <rect
                    key={`kpt3d-${p.id}`}
                    x={map3DR(p.r) - 3.5}
                    y={map3DZ(z) - 3.5}
                    width={7}
                    height={7}
                    fill={color}
                  />
                );
              })}
            </svg>
          </div>

        </div>

        {/* Explanatory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Cover's Theorem on Separability</span>
            <span className="text-purple-300">Non-linear in 2D → Linearly Separable in 3D</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Projecting data into higher dimensions increases the probability of linear separability to 1.0.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">The Kernel Trick</span>
            <span className="text-emerald-400">K(x, x') = exp(-γ||x - x'||²)</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Implicitly computes inner products in infinite-dimensional Hilbert space without evaluating coordinates.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     10. RANDOM FOREST VISUALIZER (BAGGING ENSEMBLE)
     ───────────────────────────────────────────────────────────── */
  const renderRandomForest = () => {
    const rawPoints = (mem.points as Array<{ id: number; x1: number; x2: number; label: number }>) || [
      { id: 0, x1: 1.5, x2: 2.2, label: 0 },
      { id: 1, x1: 2.0, x2: 4.0, label: 0 },
      { id: 2, x1: 2.8, x2: 1.5, label: 0 },
      { id: 3, x1: 3.2, x2: 3.0, label: 0 },
      { id: 4, x1: 4.8, x2: 5.5, label: 1 },
      { id: 5, x1: 5.2, x2: 3.8, label: 1 },
      { id: 6, x1: 6.5, x2: 6.0, label: 1 },
      { id: 7, x1: 7.0, x2: 4.5, label: 1 },
    ];

    const qPoint = (mem.qPoint as { x1: number; x2: number }) || { x1: 3.5, x2: 4.8 };
    const allTrees = [
      { id: 1, name: 'Tree 1', splitFeature: 'X1', splitVal: 3.0, vote: 0 },
      { id: 2, name: 'Tree 2', splitFeature: 'X2', splitVal: 4.2, vote: 1 },
      { id: 3, name: 'Tree 3', splitFeature: 'X1', splitVal: 4.0, vote: 1 },
      { id: 4, name: 'Tree 4', splitFeature: 'X2', splitVal: 3.5, vote: 1 },
      { id: 5, name: 'Tree 5', splitFeature: 'X1', splitVal: 3.2, vote: 0 },
      { id: 6, name: 'Tree 6', splitFeature: 'X2', splitVal: 4.5, vote: 1 },
      { id: 7, name: 'Tree 7', splitFeature: 'X1', splitVal: 3.8, vote: 1 },
      { id: 8, name: 'Tree 8', splitFeature: 'X2', splitVal: 3.9, vote: 1 },
      { id: 9, name: 'Tree 9', splitFeature: 'X1', splitVal: 3.4, vote: 0 },
    ];
    const numTrees = editableValues.numTrees !== undefined ? Number(editableValues.numTrees) : (mem.trees ? (mem.trees as any[]).length : 3);
    const trees = allTrees.slice(0, numTrees);
    const class0Votes = trees.filter(t => t.vote === 0).length;
    const class1Votes = trees.filter(t => t.vote === 1).length;
    const tally = { class0: class0Votes, class1: class1Votes };
    const finalPrediction = class1Votes >= class0Votes ? 'Class 1 (Cyan)' : 'Class 0 (Amber)';
    const varianceReduction = `${Math.round((1 - 1 / numTrees) * 72)}%`;

    // SVG Coordinate Mapping: X: [0, 8] => [70, 560], Y: [0, 8] => [310, 40]
    const mapX = (x: number) => 70 + (x / 8) * 490;
    const mapY = (y: number) => 310 - (y / 8) * 270;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Query Point:</span>
            <span className="text-purple-300 font-bold">Q({qPoint.x1.toFixed(2)}, {qPoint.x2.toFixed(2)})</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Majority Vote:</span>
            <span className="text-emerald-400 font-bold">{finalPrediction}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Variance Drop:</span>
            <span className="text-cyan-400 font-bold">{varianceReduction}</span>
          </div>
        </div>

        {/* 2D Feature Space Canvas with Multi-Tree Splits */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 360" className="w-full h-auto max-h-95 select-none">
            {/* Grid */}
            {[0, 2, 4, 6, 8].map(gx => (
              <line key={`rfgx-${gx}`} x1={mapX(gx)} y1={40} x2={mapX(gx)} y2={310} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 2, 4, 6, 8].map(gy => (
              <line key={`rfgy-${gy}`} x1={70} y1={mapY(gy)} x2={560} y2={mapY(gy)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Axes */}
            <line x1={70} y1={310} x2={560} y2={310} stroke="#475569" strokeWidth="1.5" />
            <line x1={70} y1={40} x2={70} y2={310} stroke="#475569" strokeWidth="1.5" />

            {/* Labels */}
            {[0, 2, 4, 6, 8].map(gx => (
              <text key={`rftx-${gx}`} x={mapX(gx)} y={328} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
                X₁={gx}
              </text>
            ))}
            {[0, 2, 4, 6, 8].map(gy => (
              <text key={`rfty-${gy}`} x={60} y={mapY(gy) + 4} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
                X₂={gy}
              </text>
            ))}

            {/* Tree 1 Boundary: X1 = 3.0 (Amber dotted) */}
            <line x1={mapX(3.0)} y1={40} x2={mapX(3.0)} y2={310} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x={mapX(3.0) - 6} y={55} textAnchor="end" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
              Tree 1: X₁=3.0
            </text>

            {/* Tree 2 Boundary: X2 = 4.2 (Cyan dotted) */}
            <line x1={70} y1={mapY(4.2)} x2={560} y2={mapY(4.2)} stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x={550} y={mapY(4.2) - 6} textAnchor="end" fill="#06b6d4" fontSize="9" fontFamily="monospace" fontWeight="bold">
              Tree 2: X₂=4.2
            </text>

            {/* Tree 3 Boundary: X1 = 4.0 (Emerald dotted) */}
            <line x1={mapX(4.0)} y1={40} x2={mapX(4.0)} y2={310} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x={mapX(4.0) + 6} y={70} textAnchor="start" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
              Tree 3: X₁=4.0
            </text>

            {/* Training Points */}
            {rawPoints.map(p => {
              const color = p.label === 1 ? '#06b6d4' : '#f59e0b';
              return (
                <rect
                  key={`rfpt-${p.id}`}
                  x={mapX(p.x1) - 4}
                  y={mapY(p.x2) - 4}
                  width={8}
                  height={8}
                  fill={color}
                />
              );
            })}

            {/* Query Point Q(3.5, 4.8) */}
            <g>
              <rect x={mapX(qPoint.x1) - 6} y={mapY(qPoint.x2) - 6} width={12} height={12} fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
              <text x={mapX(qPoint.x1) + 12} y={mapY(qPoint.x2) - 4} fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Q(3.5, 4.8)
              </text>
            </g>
          </svg>
        </div>

        {/* 3 Trees Individual Vote Cards + Majority Aggregator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
          {trees.map((t, idx) => {
            const hasVoted = t.vote !== null;
            const isCyan = t.vote === 1;
            return (
              <div key={`treecard-${t.id}`} className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-bold uppercase">{t.name}</span>
                  <span className="text-slate-500">Tree #{idx + 1}</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Cut: <span className="text-purple-300 font-bold">{t.splitFeature} &le; {t.splitVal}</span>
                </div>
                <div className="mt-1 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Vote:</span>
                  {hasVoted ? (
                    <span className={`font-bold ${isCyan ? 'text-cyan-400' : 'text-amber-400'}`}>
                      {isCyan ? 'Class 1 (Cyan)' : 'Class 0 (Amber)'}
                    </span>
                  ) : (
                    <span className="text-slate-600">Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Aggregated Consensus Bar */}
        <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Ensemble Consensus:</span>
            <span className="text-cyan-400 font-bold">Class 1 ({tally.class1} Votes)</span>
            <span className="text-slate-600">vs</span>
            <span className="text-amber-400 font-bold">Class 0 ({tally.class0} Votes)</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-bold">
            Consensus Winner: {finalPrediction}
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     11. ADABOOST VISUALIZER (ADAPTIVE WEAK STUMPS)
     ───────────────────────────────────────────────────────────── */
  const renderAdaBoost = () => {
    const rawPoints = (mem.points as Array<{ id: number; x: number; y: number; label: number; w: number }>) || [
      { id: 0, x: 1.5, y: 2.0, label: 1, w: 0.125 },
      { id: 1, x: 2.0, y: 5.5, label: 1, w: 0.125 },
      { id: 2, x: 2.8, y: 3.5, label: -1, w: 0.218 },
      { id: 3, x: 3.5, y: 1.8, label: 1, w: 0.125 },
      { id: 4, x: 4.8, y: 5.0, label: -1, w: 0.125 },
      { id: 5, x: 5.2, y: 2.5, label: 1, w: 0.218 },
      { id: 6, x: 6.5, y: 5.8, label: -1, w: 0.125 },
      { id: 7, x: 7.0, y: 3.2, label: -1, w: 0.125 },
    ];

    const stumpIndex = editableValues.stumpIndex !== undefined ? Number(editableValues.stumpIndex) : (mem.stumpIndex !== undefined ? Number(mem.stumpIndex) : 1);
    const alpha = editableValues.boostWeight !== undefined ? Number(editableValues.boostWeight) : (mem.alpha !== undefined ? Number(mem.alpha) : 0.549);
    const errorRate = mem.errorRate !== undefined ? Number(mem.errorRate) : 0.25;
    const misclassifiedIds = (mem.misclassifiedIds as number[]) || [];

    // SVG Coordinate Mapping: X: [0, 8] => [70, 560], Y: [0, 8] => [310, 40]
    const mapX = (x: number) => 70 + (x / 8) * 490;
    const mapY = (y: number) => 310 - (y / 8) * 270;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Current Weak Stump:</span>
            <span className="text-cyan-400 font-bold">h_{stumpIndex} (m={stumpIndex}/3)</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Stump Weight (αₘ):</span>
            <span className="text-purple-300 font-bold">{alpha.toFixed(3)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Weighted Error (εₘ):</span>
            <span className="text-amber-400 font-bold">{(errorRate * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* 2D Canvas with Scaled Sample Weights and Stump Boundaries */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 360" className="w-full h-auto max-h-95 select-none">
            {/* Grid */}
            {[0, 2, 4, 6, 8].map(gx => (
              <line key={`adagx-${gx}`} x1={mapX(gx)} y1={40} x2={mapX(gx)} y2={310} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 2, 4, 6, 8].map(gy => (
              <line key={`adagy-${gy}`} x1={70} y1={mapY(gy)} x2={560} y2={mapY(gy)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Axes */}
            <line x1={70} y1={310} x2={560} y2={310} stroke="#475569" strokeWidth="1.5" />
            <line x1={70} y1={40} x2={70} y2={310} stroke="#475569" strokeWidth="1.5" />

            {/* Labels */}
            {[0, 2, 4, 6, 8].map(gx => (
              <text key={`adatx-${gx}`} x={mapX(gx)} y={328} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
                X₁={gx}
              </text>
            ))}
            {[0, 2, 4, 6, 8].map(gy => (
              <text key={`adaty-${gy}`} x={60} y={mapY(gy) + 4} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
                X₂={gy}
              </text>
            ))}

            {/* Stump 1: Vertical cut X1 = 3.2 */}
            {stumpIndex >= 1 && (
              <>
                <line x1={mapX(3.2)} y1={40} x2={mapX(3.2)} y2={310} stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />
                <text x={mapX(3.2) - 8} y={55} textAnchor="end" fill="#06b6d4" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  Stump 1: X₁=3.2 (α₁=0.55)
                </text>
              </>
            )}

            {/* Stump 2: Horizontal cut X2 = 4.0 */}
            {stumpIndex >= 2 && (
              <>
                <line x1={70} y1={mapY(4.0)} x2={560} y2={mapY(4.0)} stroke="#a855f7" strokeWidth="2" strokeDasharray="3 3" />
                <text x={550} y={mapY(4.0) - 6} textAnchor="end" fill="#a855f7" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  Stump 2: X₂=4.0 (α₂=0.76)
                </text>
              </>
            )}

            {/* Stump 3: Vertical cut X1 = 5.5 */}
            {stumpIndex >= 3 && (
              <>
                <line x1={mapX(5.5)} y1={40} x2={mapX(5.5)} y2={310} stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
                <text x={mapX(5.5) + 8} y={75} textAnchor="start" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  Stump 3: X₁=5.5 (α₃=0.89)
                </text>
              </>
            )}

            {/* Scaled Sample Points: Size reflects w_i */}
            {rawPoints.map(p => {
              const isClassPos = p.label === 1;
              const color = isClassPos ? '#06b6d4' : '#f59e0b';
              const px = mapX(p.x);
              const py = mapY(p.y);
              const isHard = misclassifiedIds.includes(p.id);

              // Proportional marker box size: baseline ~8px, inflated up to 18px
              const size = Math.max(7, Math.min(20, Math.round(p.w * 75)));

              return (
                <g key={`adapt-${p.id}`}>
                  {/* Heavy misclassified sample halo */}
                  {isHard && (
                    <rect
                      x={px - size / 2 - 4}
                      y={py - size / 2 - 4}
                      width={size + 8}
                      height={size + 8}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  )}
                  <rect
                    x={px - size / 2}
                    y={py - size / 2}
                    width={size}
                    height={size}
                    fill={color}
                  />
                  <text x={px} y={py + size / 2 + 10} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
                    w={p.w.toFixed(3)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Sample Weights Distribution Strip */}
        <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none space-y-1.5 text-xs font-mono">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-400 uppercase font-bold">Sample Weight Distribution (wᵢ &rarr; wᵢ·e^(α·I))</span>
            <span className="text-slate-500">Total Samples: 8 (Sum = 1.0)</span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5">
            {rawPoints.map(p => (
              <div
                key={`wpill-${p.id}`}
                className={`p-1.5 border text-center ${
                  misclassifiedIds.includes(p.id)
                    ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-[9px] text-slate-400">Point #{p.id}</div>
                <div className="text-[11px] font-bold mt-0.5">{p.w.toFixed(3)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     12. GRADIENT BOOSTING VISUALIZER (GBDT RESIDUAL FITTING)
     ───────────────────────────────────────────────────────────── */
  const renderGradientBoosting = () => {
    const rawData = (mem.points as Array<{ x: number; y: number }>) || [
      { x: 1.0, y: 2.2 },
      { x: 2.0, y: 3.8 },
      { x: 3.0, y: 7.5 },
      { x: 4.0, y: 8.2 },
      { x: 5.0, y: 5.5 },
      { x: 6.0, y: 4.0 },
    ];

    const stage = editableValues.stage !== undefined ? Number(editableValues.stage) : (mem.stage !== undefined ? Number(mem.stage) : 3);
    const f0 = mem.f0 !== undefined ? Number(mem.f0) : 5.2;
    const eta = editableValues.eta !== undefined ? Number(editableValues.eta) : (mem.eta !== undefined ? Number(mem.eta) : 0.40);
    const dynamicMse = (0.95 * Math.pow(Math.max(0.1, 1 - eta), stage)).toFixed(2);
    const mse = editableValues.stage !== undefined || editableValues.eta !== undefined ? dynamicMse : (mem.mse !== undefined ? Number(mem.mse).toFixed(2) : '0.12');
    const predictions = (mem.predictions as Array<{ x: number; y: number; pred: number; res: number }>) || rawData.map(p => ({
      x: p.x,
      y: p.y,
      pred: f0,
      res: p.y - f0,
    }));

    // SVG Coordinate Mapping:
    // Top graph (F_m): X: [0.5, 6.5] => [50, 570], Y: [0, 10] => [150, 25]
    const mapTopX = (x: number) => 50 + ((x - 0.5) / 6.0) * 520;
    const mapTopY = (y: number) => 150 - (y / 10) * 125;

    // Bottom graph (Residuals): X: [0.5, 6.5] => [50, 570], Y: [-4, 4] => [140, 25]
    const mapResX = (x: number) => 50 + ((x - 0.5) / 6.0) * 520;
    const mapResY = (r: number) => 82 - (r / 4) * 55;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Cumulative GBDT:</span>
            <span className="text-cyan-400 font-bold">F_{stage}(x) = F_0 + {eta}·Σ h_m(x)</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Stage:</span>
            <span className="text-purple-300 font-bold">m = {stage} / 3</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Residual Loss (MSE):</span>
            <span className="text-emerald-400 font-bold">{mse}</span>
          </div>
        </div>

        {/* Dual Graph Canvas: Top Cumulative F_m(x), Bottom Pseudo-Residuals */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex flex-col gap-2 rounded-none overflow-hidden">
          
          {/* Top Graph: Cumulative F_m(x) */}
          <div className="flex flex-col">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1 flex justify-between">
              <span>Cumulative Prediction Function F_{stage}(x)</span>
              <span className="text-cyan-400 font-normal">MSE = {mse}</span>
            </div>
            <svg viewBox="0 0 620 170" className="w-full h-auto select-none">
              {/* Axes */}
              <line x1={50} y1={150} x2={570} y2={150} stroke="#475569" strokeWidth="1.5" />
              <line x1={50} y1={25} x2={50} y2={150} stroke="#475569" strokeWidth="1.5" />

              {/* Grid Lines */}
              {[1, 2, 3, 4, 6].map(gx => (
                <line key={`gbtgx-${gx}`} x1={mapTopX(gx)} y1={25} x2={mapTopX(gx)} y2={150} stroke="#1e293b" strokeWidth="1" />
              ))}

              {/* Fitted Piecewise Step Line F_m(x) */}
              {stage === 0 && (
                <line x1={50} y1={mapTopY(f0)} x2={570} y2={mapTopY(f0)} stroke="#06b6d4" strokeWidth="2.5" />
              )}
              {stage >= 1 && (
                <polyline
                  points={predictions.map(p => `${mapTopX(p.x)},${mapTopY(p.pred)}`).join(' ')}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />
              )}

              {/* Actual Data Points */}
              {rawData.map((p, idx) => {
                const px = mapTopX(p.x);
                const py = mapTopY(p.y);
                const pred = predictions[idx]?.pred ?? f0;
                return (
                  <g key={`gbttopt-${idx}`}>
                    {/* Vertical residual error dashed line */}
                    <line x1={px} y1={py} x2={px} y2={mapTopY(pred)} stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
                    <rect x={px - 4} y={py - 4} width={8} height={8} fill="#f59e0b" />
                    <text x={px} y={py - 8} textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">
                      {p.y}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Graph: Pseudo-Residuals r_im = y_i - F_m(x_i) */}
          <div className="flex flex-col pt-1 border-t border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1 flex justify-between">
              <span>Pseudo-Residuals: r_im = y_i - F_m(x_i) (Converging to Zero Line)</span>
              <span className="text-amber-400 font-normal">Next tree fits these errors</span>
            </div>
            <svg viewBox="0 0 620 120" className="w-full h-auto select-none">
              {/* Zero baseline r = 0 */}
              <line x1={50} y1={mapResY(0)} x2={570} y2={mapResY(0)} stroke="#10b981" strokeWidth="1.5" />
              <text x={42} y={mapResY(0) + 4} textAnchor="end" fill="#10b981" fontSize="9" fontFamily="monospace">
                r=0
              </text>

              {/* Residual vertical bars */}
              {predictions.map((p, idx) => {
                const rx = mapResX(p.x);
                const ry = mapResY(p.res);
                const y0 = mapResY(0);
                return (
                  <g key={`resbar-${idx}`}>
                    <line x1={rx} y1={y0} x2={rx} y2={ry} stroke="#f43f5e" strokeWidth="2" />
                    <rect x={rx - 3} y={ry - 3} width={6} height={6} fill="#f43f5e" />
                    <text x={rx} y={p.res >= 0 ? ry - 6 : ry + 12} textAnchor="middle" fill="#f43f5e" fontSize="8" fontFamily="monospace">
                      {p.res >= 0 ? `+${p.res.toFixed(2)}` : p.res.toFixed(2)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

        </div>

        {/* Explanatory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Functional Gradient Descent</span>
            <span className="text-cyan-300">r_im = -[∂L(y_i, F(x_i))/∂F(x_i)]</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Instead of optimizing weights in parameter space, GBDT takes steps directly in function space by fitting trees to negative loss gradients.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Shrinkage Regularization (η)</span>
            <span className="text-emerald-400">Learning Rate η = 0.40 Scales Each Tree</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Scales the contribution of each tree to prevent greedy overfitting and preserve generalization performance.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     13. K-MEANS CLUSTERING VISUALIZER
     ───────────────────────────────────────────────────────────── */
  const renderKMeans = () => {
    const rawSamples = (mem.samples as Array<{ id: number; x: number; y: number; assignedCluster: number | null }>) || [
      { id: 1, x: 1.5, y: 2.2, assignedCluster: 0 },
      { id: 2, x: 2.0, y: 2.8, assignedCluster: 0 },
      { id: 3, x: 2.4, y: 1.8, assignedCluster: 0 },
      { id: 4, x: 2.8, y: 3.2, assignedCluster: 0 },
      { id: 5, x: 5.2, y: 5.8, assignedCluster: 1 },
      { id: 6, x: 5.8, y: 5.5, assignedCluster: 1 },
      { id: 7, x: 6.2, y: 6.2, assignedCluster: 1 },
      { id: 8, x: 6.8, y: 4.8, assignedCluster: 1 },
      { id: 9, x: 2.0, y: 7.0, assignedCluster: 2 },
      { id: 10, x: 2.5, y: 6.0, assignedCluster: 2 },
      { id: 11, x: 3.2, y: 6.8, assignedCluster: 2 },
      { id: 12, x: 3.5, y: 7.4, assignedCluster: 2 },
    ];

    const k = editableValues.k !== undefined ? Number(editableValues.k) : 3;
    const dynamicWcss = k === 2 ? '64.8' : k === 3 ? '31.2' : '18.4';
    const centroids = (mem.centroids as Array<{ id: number; x: number; y: number; label: string }>) || [];
    const iteration = mem.iteration !== undefined ? mem.iteration : 3;
    const wcss = editableValues.k !== undefined ? dynamicWcss : (mem.wcss !== undefined ? Number(mem.wcss).toFixed(1) : '31.2');
    const phase = editableValues.k !== undefined ? `K=${k} PARTITION` : (mem.phase || 'CONVERGED');

    // SVG Coordinate Mapping: X: [0, 8.5] => [60, 560], Y: [0, 9] => [330, 40]
    const mapX = (x: number) => 60 + (x / 8.5) * 500;
    const mapY = (y: number) => 330 - (y / 9.0) * 290;

    const getClusterColor = (cId: number | null | undefined) => {
      if (cId === 0) return '#f59e0b'; // Amber
      if (cId === 1) return '#06b6d4'; // Cyan
      if (cId === 2) return '#a855f7'; // Purple
      return '#64748b'; // Slate (Unassigned)
    };

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Partition:</span>
            <span className="text-cyan-400 font-bold">K = 3 Clusters</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Iteration:</span>
            <span className="text-purple-400 font-bold">#{iteration}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">WCSS Inertia:</span>
            <span className="text-amber-400 font-bold">{wcss}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Phase:</span>
            <span className="text-emerald-400 font-bold">{phase}</span>
          </div>
        </div>

        {/* 2D Canvas */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 370" className="w-full h-auto max-h-95 select-none">
            {/* Grid */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(gx => (
              <line key={`gx-${gx}`} x1={mapX(gx)} y1={40} x2={mapX(gx)} y2={330} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 2, 4, 6, 8].map(gy => (
              <line key={`gy-${gy}`} x1={60} y1={mapY(gy)} x2={560} y2={mapY(gy)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Labels */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(gx => (
              <text key={`tx-${gx}`} x={mapX(gx)} y={348} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                {gx}
              </text>
            ))}
            {[0, 2, 4, 6, 8].map(gy => (
              <text key={`ty-${gy}`} x={45} y={mapY(gy) + 4} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                {gy}
              </text>
            ))}

            {/* Axes */}
            <line x1={60} y1={40} x2={60} y2={330} stroke="#475569" strokeWidth="1.5" />
            <line x1={60} y1={330} x2={560} y2={330} stroke="#475569" strokeWidth="1.5" />

            {/* Distance Assignment Lines to Closest Centroid */}
            {centroids.length > 0 &&
              rawSamples.map(p => {
                if (p.assignedCluster === null || p.assignedCluster === undefined) return null;
                const c = centroids.find(cent => cent.id === p.assignedCluster);
                if (!c) return null;
                const color = getClusterColor(p.assignedCluster);
                return (
                  <line
                    key={`line-${p.id}`}
                    x1={mapX(p.x)}
                    y1={mapY(p.y)}
                    x2={mapX(c.x)}
                    y2={mapY(c.y)}
                    stroke={color}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    strokeOpacity="0.45"
                  />
                );
              })}

            {/* Samples Scatter Points */}
            {rawSamples.map(p => {
              const color = getClusterColor(p.assignedCluster);
              const cx = mapX(p.x);
              const cy = mapY(p.y);
              return (
                <g key={`pt-${p.id}`}>
                  <circle cx={cx} cy={cy} r="5" fill={color} stroke="#0b0e17" strokeWidth="1.5" />
                </g>
              );
            })}

            {/* Centroids Markers with High-Contrast Crosshair */}
            {centroids.map(c => {
              const cx = mapX(c.x);
              const cy = mapY(c.y);
              const color = getClusterColor(c.id);
              return (
                <g key={`cent-${c.id}`}>
                  <circle cx={cx} cy={cy} r="10" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
                  <line x1={cx - 12} y1={cy} x2={cx + 12} y2={cy} stroke={color} strokeWidth="2.5" />
                  <line x1={cx} y1={cy - 12} x2={cx} y2={cy + 12} stroke={color} strokeWidth="2.5" />
                  <rect x={cx + 12} y={cy - 12} width={26} height={15} fill="#090d16" stroke={color} strokeWidth="1" />
                  <text x={cx + 25} y={cy - 1} fill={color} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    C{c.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Technical Explanatory Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Voronoi Partitioning</span>
            <span className="text-cyan-300">S_k = &#123; x : ||x - μ_k||² ≤ ||x - μ_j||² &#125;</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Every unlabelled point is assigned to its nearest centroid seed via Euclidean distance metric.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Centroid Shift Rule</span>
            <span className="text-emerald-400">μ_k^(t+1) = (1/|S_k|) · Σ x_i</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Centroids shift to the geometric mean of their assigned cluster points until centroid drift Δμ ≤ ε.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     14. DBSCAN DENSITY CLUSTERING VISUALIZER
     ───────────────────────────────────────────────────────────── */
  const renderDbscan = () => {
    const rawPoints = (mem.points as Array<{ id: number; x: number; y: number; type: string; cluster: number; status: string }>) || [
      { id: 1, x: 1.8, y: 2.2, type: 'core', cluster: 0, status: 'core' },
      { id: 2, x: 2.2, y: 2.6, type: 'core', cluster: 0, status: 'core' },
      { id: 3, x: 2.5, y: 2.0, type: 'core', cluster: 0, status: 'core' },
      { id: 4, x: 2.8, y: 2.8, type: 'border', cluster: 0, status: 'border' },
      { id: 5, x: 5.2, y: 5.2, type: 'core', cluster: 1, status: 'core' },
      { id: 6, x: 5.6, y: 5.8, type: 'core', cluster: 1, status: 'core' },
      { id: 7, x: 6.0, y: 5.0, type: 'core', cluster: 1, status: 'core' },
      { id: 8, x: 6.4, y: 5.6, type: 'border', cluster: 1, status: 'border' },
      { id: 9, x: 2.0, y: 6.6, type: 'core', cluster: 2, status: 'core' },
      { id: 10, x: 2.4, y: 7.2, type: 'core', cluster: 2, status: 'core' },
      { id: 11, x: 2.8, y: 6.8, type: 'core', cluster: 2, status: 'core' },
      { id: 12, x: 0.8, y: 4.5, type: 'noise', cluster: -1, status: 'noise' },
      { id: 13, x: 7.6, y: 2.5, type: 'noise', cluster: -1, status: 'noise' },
    ];

    const eps = editableValues.eps !== undefined ? Number(editableValues.eps) : (mem.eps !== undefined ? Number(mem.eps) : 1.2);
    const minPts = editableValues.minPts !== undefined ? Number(editableValues.minPts) : (mem.minPts !== undefined ? Number(mem.minPts) : 3);
    const pointNeighbors = rawPoints.map(p1 => ({
      ...p1,
      neighbors: rawPoints.filter(p2 => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) <= eps).length,
    }));
    const dynamicCoreCount = pointNeighbors.filter(p => p.neighbors >= minPts).length;
    const dynamicNoiseCount = pointNeighbors.filter(p => p.neighbors < minPts && p.neighbors <= 1).length;
    const coreCount = editableValues.eps !== undefined || editableValues.minPts !== undefined ? dynamicCoreCount : (mem.coreCount !== undefined ? mem.coreCount : 8);
    const noiseCount = editableValues.eps !== undefined || editableValues.minPts !== undefined ? dynamicNoiseCount : (mem.noiseCount !== undefined ? mem.noiseCount : 4);
    const activeProbeId = mem.activeProbeId;

    // SVG Coordinate Mapping: X: [0, 8.5] => [60, 560], Y: [0, 8.5] => [330, 40]
    const mapX = (x: number) => 60 + (x / 8.5) * 500;
    const mapY = (y: number) => 330 - (y / 8.5) * 290;
    const epsPx = (eps / 8.5) * 500; // Radius in SVG pixels

    const getClusterColor = (cluster: number) => {
      if (cluster === 0) return '#f59e0b'; // Amber
      if (cluster === 1) return '#06b6d4'; // Cyan
      if (cluster === 2) return '#a855f7'; // Purple
      return '#f43f5e'; // Red (Noise)
    };

    const probePoint = activeProbeId ? rawPoints.find(p => p.id === activeProbeId) : null;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Parameters:</span>
            <span className="text-cyan-400 font-bold">ε = {eps.toFixed(2)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-purple-400 font-bold">MinPts ≥ {minPts}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Core Points:</span>
            <span className="text-emerald-400 font-bold">{coreCount}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Noise Outliers:</span>
            <span className="text-rose-400 font-bold">{noiseCount}</span>
          </div>
        </div>

        {/* 2D Canvas */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 370" className="w-full h-auto max-h-95 select-none">
            {/* Grid */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(gx => (
              <line key={`gx-${gx}`} x1={mapX(gx)} y1={40} x2={mapX(gx)} y2={330} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 2, 4, 6, 8].map(gy => (
              <line key={`gy-${gy}`} x1={60} y1={mapY(gy)} x2={560} y2={mapY(gy)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Labels */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(gx => (
              <text key={`tx-${gx}`} x={mapX(gx)} y={348} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                {gx}
              </text>
            ))}
            {[0, 2, 4, 6, 8].map(gy => (
              <text key={`ty-${gy}`} x={45} y={mapY(gy) + 4} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                {gy}
              </text>
            ))}

            {/* Axes */}
            <line x1={60} y1={40} x2={60} y2={330} stroke="#475569" strokeWidth="1.5" />
            <line x1={60} y1={330} x2={560} y2={330} stroke="#475569" strokeWidth="1.5" />

            {/* Probe Epsilon Neighborhood Circle */}
            {probePoint && (
              <g>
                <circle
                  cx={mapX(probePoint.x)}
                  cy={mapY(probePoint.y)}
                  r={epsPx}
                  fill="#06b6d4"
                  fillOpacity="0.10"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text
                  x={mapX(probePoint.x)}
                  y={mapY(probePoint.y) - epsPx - 6}
                  fill="#06b6d4"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  ε = {eps.toFixed(2)} Radius
                </text>
              </g>
            )}

            {/* Scatter Points */}
            {rawPoints.map(p => {
              const cx = mapX(p.x);
              const cy = mapY(p.y);
              const isNoise = p.cluster === -1 || p.type === 'noise';
              const color = getClusterColor(p.cluster);

              if (isNoise) {
                return (
                  <g key={`db-${p.id}`}>
                    <rect x={cx - 5} y={cy - 5} width={10} height={10} fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
                    <line x1={cx - 3} y1={cy - 3} x2={cx + 3} y2={cy + 3} stroke="#ffffff" strokeWidth="1.2" />
                    <line x1={cx + 3} y1={cy - 3} x2={cx - 3} y2={cy + 3} stroke="#ffffff" strokeWidth="1.2" />
                    {mem.phase === 'NOISE_FILTERING' && (
                      <text x={cx} y={cy + 16} fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        Noise (-1)
                      </text>
                    )}
                  </g>
                );
              }

              if (p.type === 'core') {
                return (
                  <g key={`db-${p.id}`}>
                    <circle cx={cx} cy={cy} r="8" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5" />
                    <circle cx={cx} cy={cy} r="4" fill={color} />
                  </g>
                );
              }

              // Border point
              return (
                <g key={`db-${p.id}`}>
                  <circle cx={cx} cy={cy} r="4.5" fill="none" stroke={color} strokeWidth="2" strokeDasharray="2 1" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Technical Explanatory Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Density Reachability</span>
            <span className="text-cyan-300">N_ε(p) = &#123; q ∈ D : dist(p, q) ≤ ε &#125;</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Core points possess at least MinPts neighbors inside radius ε. Border points connect to core points but have insufficient local density.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Outlier Isolation (Label -1)</span>
            <span className="text-rose-400">Noise: |N_ε(p)| &lt; MinPts &amp; Unreachable</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Unlike K-Means, isolated sparse noise points are filtered out without dragging cluster centroids away from real modes.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     15. PRINCIPAL COMPONENT ANALYSIS (PCA) VISUALIZER
     ───────────────────────────────────────────────────────────── */
  const renderPca = () => {
    const rawPoints = (mem.points as Array<{ id: number; x: number; y: number; xc?: number; yc?: number; projX?: number; projY?: number }>) || [
      { id: 1, x: 1.5, y: 1.8, xc: -3.22, yc: -2.74 },
      { id: 2, x: 2.0, y: 2.6, xc: -2.72, yc: -1.94 },
      { id: 3, x: 3.2, y: 3.5, xc: -1.52, yc: -1.04 },
      { id: 4, x: 4.4, y: 3.8, xc: -0.32, yc: -0.74 },
      { id: 5, x: 5.0, y: 5.2, xc: 0.28, yc: 0.66 },
      { id: 6, x: 6.2, y: 6.1, xc: 1.48, yc: 1.56 },
      { id: 7, x: 7.2, y: 6.8, xc: 2.48, yc: 2.26 },
      { id: 8, x: 7.8, y: 7.4, xc: 3.08, yc: 2.86 },
    ];

    const meanX = 4.72;
    const meanY = 4.54;
    const projDim = editableValues.projDim || (mem.phase === 'PROJECTED_1D' ? '1D' : (mem.phase === 'RAW_2D' ? '2D' : '1D'));
    const phase = editableValues.projDim ? (projDim === '1D' ? 'PROJECTED_1D' : 'RAW_2D') : (mem.phase || 'RAW_2D');
    const variance = projDim === '1D' ? '89.2%' : '100.0%';
    const isCentered = projDim === '1D' || (mem.phase !== 'RAW_2D');

    // SVG Coordinate Mappings:
    // Raw Mode: X: [0, 9] => [60, 560], Y: [0, 9] => [330, 40]
    const mapRawX = (x: number) => 60 + (x / 9.0) * 500;
    const mapRawY = (y: number) => 330 - (y / 9.0) * 290;

    // Centered Mode: Origin (0,0) at (310, 185), range [-4.5, +4.5]
    const mapCenterX = (xc: number) => 310 + (xc / 4.5) * 240;
    const mapCenterY = (yc: number) => 185 - (yc / 4.5) * 140;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Decomposition:</span>
            <span className="text-cyan-400 font-bold">2D Space → 1D Subspace</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Variance PC1:</span>
            <span className="text-emerald-400 font-bold">{variance}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Centroid:</span>
            <span className="text-amber-400 font-bold">({meanX}, {meanY})</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Phase:</span>
            <span className="text-purple-400 font-bold">{phase}</span>
          </div>
        </div>

        {/* 2D Canvas */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 620 370" className="w-full h-auto max-h-95 select-none">
            {!isCentered ? (
              // ── Mode 1: Raw 2D Space ──
              <g>
                {/* Grid */}
                {[0, 2, 4, 6, 8].map(gx => (
                  <line key={`gx-${gx}`} x1={mapRawX(gx)} y1={40} x2={mapRawX(gx)} y2={330} stroke="#1e293b" strokeWidth="1" />
                ))}
                {[0, 2, 4, 6, 8].map(gy => (
                  <line key={`gy-${gy}`} x1={60} y1={mapRawY(gy)} x2={560} y2={mapRawY(gy)} stroke="#1e293b" strokeWidth="1" />
                ))}

                {/* Labels */}
                {[0, 2, 4, 6, 8].map(gx => (
                  <text key={`tx-${gx}`} x={mapRawX(gx)} y={348} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    {gx}
                  </text>
                ))}
                {[0, 2, 4, 6, 8].map(gy => (
                  <text key={`ty-${gy}`} x={45} y={mapRawY(gy) + 4} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                    {gy}
                  </text>
                ))}

                {/* Axes */}
                <line x1={60} y1={40} x2={60} y2={330} stroke="#475569" strokeWidth="1.5" />
                <line x1={60} y1={330} x2={560} y2={330} stroke="#475569" strokeWidth="1.5" />

                {/* Points */}
                {rawPoints.map(p => (
                  <circle key={`raw-${p.id}`} cx={mapRawX(p.x)} cy={mapRawY(p.y)} r="5" fill="#38bdf8" stroke="#0b0e17" strokeWidth="1.5" />
                ))}

                {/* Centroid Marker */}
                <g>
                  <circle cx={mapRawX(meanX)} cy={mapRawY(meanY)} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                  <text x={mapRawX(meanX) + 12} y={mapRawY(meanY) + 4} fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    Mean Centroid (4.72, 4.54)
                  </text>
                </g>
              </g>
            ) : (
              // ── Mode 2: Mean-Centered Space with PC1 Axis & Orthogonal Projection ──
              <g>
                {/* Central Zero Axes */}
                <line x1={60} y1={185} x2={560} y2={185} stroke="#334155" strokeWidth="1.5" />
                <line x1={310} y1={40} x2={310} y2={330} stroke="#334155" strokeWidth="1.5" />

                {/* Origin Label */}
                <text x={300} y={198} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">
                  (0, 0)
                </text>

                {/* PC1 Eigenvector Diagonal Line (v1 = [0.73, 0.68]) */}
                {phase !== 'MEAN_CENTERED' && (
                  <g>
                    {/* PC1 Main Axis */}
                    <line
                      x1={mapCenterX(-3.8 * 0.73)}
                      y1={mapCenterY(-3.8 * 0.68)}
                      x2={mapCenterX(3.8 * 0.73)}
                      y2={mapCenterY(3.8 * 0.68)}
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />
                    <text
                      x={mapCenterX(3.8 * 0.73) + 8}
                      y={mapCenterY(3.8 * 0.68)}
                      fill="#06b6d4"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      PC1 Axis (89.2% Variance)
                    </text>

                    {/* PC2 Secondary Orthogonal Line */}
                    <line
                      x1={mapCenterX(-2.0 * -0.68)}
                      y1={mapCenterY(-2.0 * 0.73)}
                      x2={mapCenterX(2.0 * -0.68)}
                      y2={mapCenterY(2.0 * 0.73)}
                      stroke="#a855f7"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={mapCenterX(2.0 * -0.68) + 6}
                      y={mapCenterY(2.0 * 0.73)}
                      fill="#a855f7"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      PC2
                    </text>
                  </g>
                )}

                {/* Projected Points & Orthogonal Lines (Drop onto PC1) */}
                {rawPoints.map(p => {
                  const xc = p.xc ?? p.x - meanX;
                  const yc = p.yc ?? p.y - meanY;
                  const px = mapCenterX(xc);
                  const py = mapCenterY(yc);

                  // Scalar projection along PC1: proj = xc*0.73 + yc*0.68
                  const proj = xc * 0.73 + yc * 0.68;
                  const projX = proj * 0.73;
                  const projY = proj * 0.68;
                  const projPx = mapCenterX(projX);
                  const projPy = mapCenterY(projY);

                  return (
                    <g key={`cent-pt-${p.id}`}>
                      {phase === '1D_PROJECTION' && (
                        <>
                          {/* Orthogonal Drop Line */}
                          <line x1={px} y1={py} x2={projPx} y2={projPy} stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 2" />
                          {/* Projected Point on PC1 */}
                          <rect x={projPx - 3.5} y={projPy - 3.5} width={7} height={7} fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
                        </>
                      )}
                      {/* Original 2D Point */}
                      <circle cx={px} cy={py} r="4.5" fill="#38bdf8" stroke="#0b0e17" strokeWidth="1.5" />
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* Technical Explanatory Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Covariance Eigenanalysis</span>
            <span className="text-cyan-300">Σ·v₁ = λ₁·v₁ &nbsp;(λ₁ / Tr(Σ) = 89.2%)</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Eigenvector v₁ identifies the orthogonal axis capturing maximum dataset dispersion, diagonalizing the covariance matrix.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Dimensionality Reduction</span>
            <span className="text-emerald-400">z_i = (x_i - μ)ᵀ · v₁</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Projecting 2D coordinate pairs onto the 1D PC1 vector compresses features by 50% while retaining nearly 90% of variance.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     16. CONFUSION MATRIX & ROC-AUC VISUALIZER
     ───────────────────────────────────────────────────────────── */
  const renderConfusionMatrix = () => {
    const threshold = editableValues.threshold !== undefined ? Number(editableValues.threshold) : (mem.threshold !== undefined ? Number(mem.threshold) : 0.5);
    const dynamicTp = Math.round(20 * (1 - threshold * 0.75));
    const dynamicFp = Math.max(0, Math.round(10 * Math.pow(1 - threshold, 1.5)));
    const dynamicFn = 20 - dynamicTp;
    const dynamicTn = 20 - dynamicFp;
    const tp = editableValues.threshold !== undefined ? dynamicTp : (mem.tp !== undefined ? Number(mem.tp) : 16);
    const fp = editableValues.threshold !== undefined ? dynamicFp : (mem.fp !== undefined ? Number(mem.fp) : 3);
    const fn = editableValues.threshold !== undefined ? dynamicFn : (mem.fn !== undefined ? Number(mem.fn) : 4);
    const tn = editableValues.threshold !== undefined ? dynamicTn : (mem.tn !== undefined ? Number(mem.tn) : 17);
    const total = tp + fp + fn + tn;
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const accuracy = total > 0 ? (tp + tn) / total : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    const op = { fpr: fp / (fp + tn || 1), tpr: tp / (tp + fn || 1) };

    // Coordinate mapping for ROC curve: FPR: [0, 1] => [40, 240], TPR: [0, 1] => [220, 25]
    const mapRocX = (fpr: number) => 40 + fpr * 200;
    const mapRocY = (tpr: number) => 220 - tpr * 195;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Decision Cut:</span>
            <span className="text-cyan-400 font-bold">τ = {threshold.toFixed(2)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Accuracy:</span>
            <span className="text-emerald-400 font-bold">{(accuracy * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Precision:</span>
            <span className="text-amber-400 font-bold">{(precision * 100).toFixed(1)}%</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Recall:</span>
            <span className="text-purple-400 font-bold">{(recall * 100).toFixed(1)}%</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">F1:</span>
            <span className="text-cyan-300 font-bold">{f1.toFixed(2)}</span>
          </div>
        </div>

        {/* Dual Stage: 2x2 Confusion Grid + ROC Curve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 2x2 Matrix */}
          <div className="border border-slate-800 bg-[#080b13] p-3 flex flex-col justify-between">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex justify-between">
              <span>2×2 Confusion Matrix (N = {total})</span>
              <span className="text-cyan-400 font-normal">Actual vs Predicted</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center flex-1">
              {/* True Positive */}
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/70 flex flex-col justify-center items-center">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">True Positive (TP)</span>
                <span className="text-2xl font-bold text-emerald-300 my-1">{tp}</span>
                <span className="text-[9px] text-slate-400 font-sans">Predicted Positive & Actual Positive</span>
                <span className="text-[9px] text-emerald-400 font-mono mt-1">{((tp / total) * 100).toFixed(1)}% of total</span>
              </div>

              {/* False Positive (Type I) */}
              <div className="p-3.5 bg-rose-950/30 border border-rose-500/70 flex flex-col justify-center items-center">
                <span className="text-[10px] text-rose-400 uppercase font-bold">False Positive (FP)</span>
                <span className="text-2xl font-bold text-rose-300 my-1">{fp}</span>
                <span className="text-[9px] text-slate-400 font-sans">Type I Error (False Alarm)</span>
                <span className="text-[9px] text-rose-400 font-mono mt-1">{((fp / total) * 100).toFixed(1)}% of total</span>
              </div>

              {/* False Negative (Type II) */}
              <div className="p-3.5 bg-rose-950/30 border border-rose-500/70 flex flex-col justify-center items-center">
                <span className="text-[10px] text-rose-400 uppercase font-bold">False Negative (FN)</span>
                <span className="text-2xl font-bold text-rose-300 my-1">{fn}</span>
                <span className="text-[9px] text-slate-400 font-sans">Type II Error (Missed Detection)</span>
                <span className="text-[9px] text-rose-400 font-mono mt-1">{((fn / total) * 100).toFixed(1)}% of total</span>
              </div>

              {/* True Negative */}
              <div className="p-3.5 bg-cyan-950/30 border border-cyan-500/70 flex flex-col justify-center items-center">
                <span className="text-[10px] text-cyan-400 uppercase font-bold">True Negative (TN)</span>
                <span className="text-2xl font-bold text-cyan-300 my-1">{tn}</span>
                <span className="text-[9px] text-slate-400 font-sans">Predicted Negative & Actual Negative</span>
                <span className="text-[9px] text-cyan-400 font-mono mt-1">{((tn / total) * 100).toFixed(1)}% of total</span>
              </div>
            </div>
          </div>

          {/* ROC Curve Graph */}
          <div className="border border-slate-800 bg-[#080b13] p-3 flex flex-col items-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 w-full flex justify-between">
              <span>ROC Curve (Area Under Curve = 0.91)</span>
              <span className="text-purple-400 font-normal">TPR vs FPR</span>
            </div>

            <svg viewBox="0 0 270 250" className="w-full h-auto select-none">
              {/* Grid */}
              {[0, 0.25, 0.5, 0.75, 1.0].map(gx => (
                <line key={`roc-gx-${gx}`} x1={mapRocX(gx)} y1={25} x2={mapRocX(gx)} y2={220} stroke="#1e293b" strokeWidth="1" />
              ))}
              {[0, 0.25, 0.5, 0.75, 1.0].map(gy => (
                <line key={`roc-gy-${gy}`} x1={40} y1={mapRocY(gy)} x2={240} y2={mapRocY(gy)} stroke="#1e293b" strokeWidth="1" />
              ))}

              {/* Labels */}
              <text x={140} y={242} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                False Positive Rate (FPR)
              </text>
              <text x={15} y={125} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 15 125)">
                True Positive Rate (TPR)
              </text>

              {/* Random Guess Diagonal Line */}
              <line x1={mapRocX(0)} y1={mapRocY(0)} x2={mapRocX(1)} y2={mapRocY(1)} stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" />

              {/* ROC Curve Smooth Path */}
              <path
                d={`M ${mapRocX(0)} ${mapRocY(0)} Q ${mapRocX(0.04)} ${mapRocY(0.70)} ${mapRocX(0.15)} ${mapRocY(0.80)} T ${mapRocX(0.40)} ${mapRocY(0.95)} T ${mapRocX(1.0)} ${mapRocY(1.0)}`}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />

              {/* Current Operating Point Marker */}
              <g>
                <circle cx={mapRocX(op.fpr)} cy={mapRocY(op.tpr)} r="6" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                <rect x={mapRocX(op.fpr) + 8} y={mapRocY(op.tpr) - 16} width={70} height={20} fill="#090d16" stroke="#a855f7" strokeWidth="1" />
                <text x={mapRocX(op.fpr) + 43} y={mapRocY(op.tpr) - 3} fill="#a855f7" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  τ={threshold.toFixed(2)} ({op.fpr.toFixed(2)}, {op.tpr.toFixed(2)})
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Technical Explanatory Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Precision-Recall Tradeoff</span>
            <span className="text-cyan-300">Prec = TP/(TP+FP) &nbsp;|&nbsp; Recall = TP/(TP+FN)</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Lowering decision threshold τ increases Recall (catching subtle positives) but increases False Positives (dropping Precision).
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">ROC-AUC Discriminability</span>
            <span className="text-emerald-400">AUC = ∫ TPR(FPR) d(FPR) = 0.91</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Area Under Curve measures threshold-independent ranking capability: 91% probability of ranking a random positive above a random negative.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     17. BIAS-VARIANCE REGULARIZATION (L1/L2) VISUALIZER
     ───────────────────────────────────────────────────────────── */
  const renderRegularization = () => {
    const regType = editableValues.regType ? String(editableValues.regType).toLowerCase() : (mem.regType || 'none');
    const lambdaVal = editableValues.lambdaVal !== undefined ? Number(editableValues.lambdaVal) : (mem.lambdaVal !== undefined ? Number(mem.lambdaVal) : 0.0);
    let w1 = 1.62;
    let w2 = -0.42;
    if (regType === 'l2') {
      const shrink = 1 / (1 + 0.5 * lambdaVal);
      w1 = 1.62 * shrink;
      w2 = -0.42 * shrink;
    } else if (regType === 'l1') {
      w1 = Math.max(0, 1.62 - 0.32 * lambdaVal);
      w2 = Math.abs(-0.42) > 0.3 * lambdaVal ? -0.42 + 0.3 * lambdaVal : 0;
    }

    // SVG Coordinate Mapping: w1: [-2.2, 2.2] => [25, 275], w2: [-2.2, 2.2] => [275, 25]
    const mapW1 = (v: number) => 150 + (v / 2.2) * 125;
    const mapW2 = (v: number) => 150 - (v / 2.2) * 125;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Penalty:</span>
            <span className="text-cyan-400 font-bold">λ = {lambdaVal.toFixed(1)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Coefficients:</span>
            <span className="text-amber-400 font-bold">w₁ = {w1.toFixed(2)}, w₂ = {w2.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Bias²:</span>
            <span className="text-blue-400 font-bold">{mem.biasSq ?? '0.04'}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Variance:</span>
            <span className="text-rose-400 font-bold">{mem.variance ?? '0.88'}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Test MSE:</span>
            <span className="text-emerald-400 font-bold">{mem.testError ?? '0.92'}</span>
          </div>
        </div>

        {/* Dual Panels: Parameter Space Geometries + Bias-Variance Curve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left: Loss Contours & Constraint Geometries */}
          <div className="border border-slate-800 bg-[#080b13] p-3 flex flex-col items-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 w-full flex justify-between">
              <span>Parameter Space (w₁, w₂)</span>
              <span className={regType === 'l1' ? 'text-emerald-400' : regType === 'l2' ? 'text-cyan-400' : 'text-amber-400'}>
                {regType === 'l1' ? 'L1 Lasso (Diamond)' : regType === 'l2' ? 'L2 Ridge (Circle)' : 'OLS Unconstrained'}
              </span>
            </div>

            <svg viewBox="0 0 300 300" className="w-full h-auto select-none">
              {/* Axes crossing at (0,0) */}
              <line x1={20} y1={150} x2={280} y2={150} stroke="#334155" strokeWidth="1.5" />
              <line x1={150} y1={20} x2={150} y2={280} stroke="#334155" strokeWidth="1.5" />
              <text x={275} y={145} fill="#64748b" fontSize="9" fontFamily="monospace">w₁</text>
              <text x={155} y={30} fill="#64748b" fontSize="9" fontFamily="monospace">w₂</text>

              {/* Concentric Loss Contours around OLS optimum (1.62, -0.42) */}
              {[30, 55, 80, 110].map((r, idx) => (
                <ellipse
                  key={`ell-${idx}`}
                  cx={mapW1(1.62)}
                  cy={mapW2(-0.42)}
                  rx={r}
                  ry={r * 0.55}
                  transform={`rotate(-25 ${mapW1(1.62)} ${mapW2(-0.42)})`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                  strokeOpacity={0.6}
                />
              ))}

              {/* OLS Minimum Marker */}
              <rect x={mapW1(1.62) - 4} y={mapW2(-0.42) - 4} width={8} height={8} fill="#f59e0b" />
              <text x={mapW1(1.62) + 8} y={mapW2(-0.42) + 4} fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
                OLS (1.62, -0.42)
              </text>

              {/* L2 Ridge Constraint Circle (||w||₂ ≤ C) */}
              {(regType === 'l2' || regType === 'optimal') && (
                <g>
                  <circle
                    cx={150}
                    cy={150}
                    r={68}
                    fill="#06b6d4"
                    fillOpacity="0.08"
                    stroke="#06b6d4"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                  />
                  <text x={150} y={150 - 74} fill="#06b6d4" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    L2 Ball: w₁² + w₂² ≤ C
                  </text>
                </g>
              )}

              {/* L1 Lasso Constraint Diamond (||w||₁ ≤ C) */}
              {regType === 'l1' && (
                <g>
                  <polygon
                    points={`${150},${mapW2(1.15)} ${mapW1(1.15)},${150} ${150},${mapW2(-1.15)} ${mapW1(-1.15)},${150}`}
                    fill="#10b981"
                    fillOpacity="0.08"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <text x={150} y={mapW2(1.15) - 6} fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    L1 Diamond: |w₁| + |w₂| ≤ C
                  </text>
                </g>
              )}

              {/* Active Constrained Weight Marker */}
              <circle cx={mapW1(w1)} cy={mapW2(w2)} r="6" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
              <rect x={mapW1(w1) + 8} y={mapW2(w2) - 14} width={90} height={18} fill="#090d16" stroke="#a855f7" strokeWidth="1" />
              <text x={mapW1(w1) + 53} y={mapW2(w2) - 1} fill="#a855f7" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                w=({w1.toFixed(2)}, {w2.toFixed(2)})
              </text>
            </svg>
          </div>

          {/* Right: Bias-Variance Tradeoff Curves */}
          <div className="border border-slate-800 bg-[#080b13] p-3 flex flex-col items-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 w-full flex justify-between">
              <span>Bias² - Variance Tradeoff Curve</span>
              <span className="text-emerald-400 font-normal">Optimal λ* = 2.2</span>
            </div>

            <svg viewBox="0 0 300 300" className="w-full h-auto select-none">
              {/* Axes */}
              <line x1={40} y1={250} x2={280} y2={250} stroke="#475569" strokeWidth="1.5" />
              <line x1={40} y1={25} x2={40} y2={250} stroke="#475569" strokeWidth="1.5" />
              <text x={160} y={272} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                Regularization Strength (λ)
              </text>
              <text x={15} y={135} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 15 135)">
                Test Error
              </text>

              {/* Variance Curve (Falling) */}
              <path d="M 40 45 Q 110 170 280 230" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" />
              <text x={260} y={225} fill="#f43f5e" fontSize="9" fontFamily="monospace">Variance</text>

              {/* Bias² Curve (Rising) */}
              <path d="M 40 240 Q 140 230 280 110" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
              <text x={260} y={105} fill="#38bdf8" fontSize="9" fontFamily="monospace">Bias²</text>

              {/* Total Error U-Curve */}
              <path d="M 40 50 Q 150 200 280 90" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <text x={150} y={215} fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                Total Test Error (U-Shape)
              </text>

              {/* Current Lambda Vertical Line */}
              {lambdaVal > 0 && (
                <g>
                  <line
                    x1={40 + (lambdaVal / 5.0) * 240}
                    y1={25}
                    x2={40 + (lambdaVal / 5.0) * 240}
                    y2={250}
                    stroke="#a855f7"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <circle
                    cx={40 + (lambdaVal / 5.0) * 240}
                    cy={130}
                    r="5"
                    fill="#a855f7"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  <text
                    x={40 + (lambdaVal / 5.0) * 240}
                    y={20}
                    fill="#a855f7"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    λ = {lambdaVal.toFixed(1)}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Technical Explanatory Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">L1 Lasso Sparsity Geometry</span>
            <span className="text-emerald-400">Min MSE + λ·(|w₁| + |w₂|)</span>
            <div className="text-[11px] text-slate-300 mt-1">
              The L1 diamond boundary has sharp corners residing exactly on axes. Elliptical loss contours hit corners where w₂ = 0, executing automatic feature pruning.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">L2 Ridge Smooth Contraction</span>
            <span className="text-cyan-300">Min MSE + λ·(w₁² + w₂²)</span>
            <div className="text-[11px] text-slate-400 mt-1">
              The spherical L2 penalty shrinks all weights smoothly towards the origin, reducing variance while keeping all predictors active.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     18. FEATURE SCALING & NORMALIZATION VISUALIZER
     ───────────────────────────────────────────────────────────── */
  const renderFeatureScaling = () => {
    const method = editableValues.method || mem.method || 'unscaled';
    const isScaled = method !== 'unscaled';
    const conditionNumber = method === 'standard' ? 1.0 : method === 'minmax' ? 1.4 : 120.0;
    const gdSteps = method === 'standard' ? 8 : method === 'minmax' ? 12 : 145;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Transform:</span>
            <span className="text-cyan-400 font-bold">{method.toUpperCase()}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Condition Number:</span>
            <span className={conditionNumber > 10 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              κ = {conditionNumber.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">GD Steps:</span>
            <span className="text-amber-400 font-bold">{gdSteps} iterations</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Speedup:</span>
            <span className="text-emerald-400 font-bold">{isScaled ? '18x Faster' : 'Baseline 1x'}</span>
          </div>
        </div>

        {/* Dual Panels: Unscaled Loss Ravine vs Scaled Concentric Circles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Panel 1: Ill-Conditioned Ravine */}
          <div className={`border p-3 flex flex-col items-center transition-colors ${
            !isScaled ? 'border-rose-500/80 bg-[#0f0a0d]' : 'border-slate-800 bg-[#080b13] opacity-60'
          }`}>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 w-full flex justify-between">
              <span>Unscaled: Anisotropic Ravine (κ = 120)</span>
              <span className="text-rose-400 font-mono">145 Steps</span>
            </div>

            <svg viewBox="0 0 280 220" className="w-full h-auto select-none">
              {/* Central axes */}
              <line x1={20} y1={110} x2={260} y2={110} stroke="#334155" strokeWidth="1" />
              <line x1={140} y1={20} x2={140} y2={200} stroke="#334155" strokeWidth="1" />

              {/* Highly elongated elliptical contours */}
              {[25, 50, 75, 100].map((r, idx) => (
                <ellipse
                  key={`ravine-${idx}`}
                  cx={140}
                  cy={110}
                  rx={r * 1.2}
                  ry={r * 0.28}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                  strokeOpacity={0.7}
                />
              ))}

              {/* Wild Zig-zag GD Trajectory */}
              <polyline
                points="40,30 65,185 85,45 105,160 120,75 130,135 140,110"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
              />

              {/* Starting & Minimum Points */}
              <circle cx={40} cy={30} r="4" fill="#f59e0b" />
              <circle cx={140} cy={110} r="5" fill="#10b981" />
              <text x={40} y={22} fill="#f59e0b" fontSize="8" fontFamily="monospace">Start</text>
              <text x={140} y={125} fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">Min</text>
            </svg>
            <div className="text-[10px] text-rose-300 font-mono text-center mt-1">
              Gradients bounce across narrow walls instead of moving along valley
            </div>
          </div>

          {/* Panel 2: Isotropic Spherical Contours */}
          <div className={`border p-3 flex flex-col items-center transition-colors ${
            isScaled ? 'border-emerald-500/80 bg-[#08120d]' : 'border-slate-800 bg-[#080b13] opacity-60'
          }`}>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 w-full flex justify-between">
              <span>Scaled: Isotropic Spheres (κ ≈ 1.15)</span>
              <span className="text-emerald-400 font-mono">8 Steps</span>
            </div>

            <svg viewBox="0 0 280 220" className="w-full h-auto select-none">
              {/* Central axes */}
              <line x1={20} y1={110} x2={260} y2={110} stroke="#334155" strokeWidth="1" />
              <line x1={140} y1={20} x2={140} y2={200} stroke="#334155" strokeWidth="1" />

              {/* Concentric Circular Contours */}
              {[25, 50, 75, 95].map((r, idx) => (
                <circle
                  key={`circle-${idx}`}
                  cx={140}
                  cy={110}
                  r={r}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                  strokeOpacity={0.7}
                />
              ))}

              {/* Direct Linear Vector Trajectory */}
              <polyline
                points="40,30 75,55 105,80 125,95 135,105 140,110"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.2"
              />

              {/* Starting & Minimum Points */}
              <circle cx={40} cy={30} r="4" fill="#06b6d4" />
              <circle cx={140} cy={110} r="5" fill="#10b981" />
              <text x={40} y={22} fill="#06b6d4" fontSize="8" fontFamily="monospace">Start</text>
              <text x={140} y={125} fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">Min</text>
            </svg>
            <div className="text-[10px] text-emerald-300 font-mono text-center mt-1">
              Gradients point directly towards global minimum: 18x faster convergence
            </div>
          </div>
        </div>

        {/* Technical Explanatory Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">StandardScaler Transformation</span>
            <span className="text-cyan-300">z = (x - μ) / σ &nbsp;|&nbsp; μ = 0, σ² = 1</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Equalizes feature variances so gradient updates scale uniformly across all dimensions, eliminating anisotropic curvature.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Condition Number (κ)</span>
            <span className="text-emerald-400">κ = λ_max / λ_min &nbsp;(120.0 → 1.15)</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Lowering condition number allows using large learning rate (α = 0.10) without inducing gradient divergence or valley oscillation.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     19. SINGLE PERCEPTRON VISUALIZER
     ───────────────────────────────────────────────────────────── */
  const renderSinglePerceptron = () => {
    const gate = editableValues.gate || mem.gate || 'AND';
    const w1 = editableValues.w1 !== undefined ? Number(editableValues.w1) : (mem.w1 !== undefined ? Number(mem.w1) : 0.6);
    const w2 = mem.w2 !== undefined ? Number(mem.w2) : 0.6;
    const b = editableValues.b !== undefined ? Number(editableValues.b) : (mem.b !== undefined ? Number(mem.b) : -0.9);
    const epoch = mem.epoch !== undefined ? mem.epoch : 3;
    const isXor = gate === 'XOR';

    const points = [
      { id: 1, x1: 0, x2: 0, y: 0, pred: (b >= 0 ? 1 : 0), label: '(0,0)' },
      { id: 2, x1: 0, x2: 1, y: gate === 'OR' ? 1 : 0, pred: (w2 + b >= 0 ? 1 : 0), label: '(0,1)' },
      { id: 3, x1: 1, x2: 0, y: gate === 'OR' ? 1 : 0, pred: (w1 + b >= 0 ? 1 : 0), label: '(1,0)' },
      { id: 4, x1: 1, x2: 1, y: 1, pred: (w1 + w2 + b >= 0 ? 1 : 0), label: '(1,1)' },
    ];
    const misclassified = points.filter(p => p.pred !== p.y).length;

    // Coordinate mapping: x1: [-0.3, 1.3] => [35, 245], x2: [-0.3, 1.3] => [225, 25]
    const mapPx = (x1: number) => 35 + ((x1 + 0.3) / 1.6) * 210;
    const mapPy = (x2: number) => 225 - ((x2 + 0.3) / 1.6) * 200;

    // Decision boundary line: w1*x1 + w2*x2 + b = 0 => x2 = -(w1*x1 + b)/w2
    const calcX2 = (x1: number) => (w2 !== 0 ? -(w1 * x1 + b) / w2 : 0);

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Gate:</span>
            <span className="text-cyan-400 font-bold">{gate} Logic</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Epoch:</span>
            <span className="text-purple-400 font-bold">#{epoch}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Hyperplane:</span>
            <span className="text-amber-400 font-bold">
              {w1.toFixed(2)}x₁ + {w2.toFixed(2)}x₂ {b >= 0 ? `+ ${b.toFixed(2)}` : `- ${Math.abs(b).toFixed(2)}`} = 0
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Errors:</span>
            <span className={misclassified === 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {misclassified} misclassified
            </span>
          </div>
        </div>

        {/* Dual Stage: 2D Feature Plane + Perceptron Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left: 2D Linear Hyperplane */}
          <div className="border border-slate-800 bg-[#080b13] p-3 flex flex-col items-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 w-full flex justify-between">
              <span>Feature Space (x₁, x₂) & Decision Boundary</span>
              <span className={misclassified === 0 ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>
                {isXor ? 'XOR: Inseparable' : misclassified === 0 ? 'Linearly Separated' : 'Epoch Tuning'}
              </span>
            </div>

            <svg viewBox="0 0 280 250" className="w-full h-auto select-none">
              {/* Axes */}
              <line x1={mapPx(-0.2)} y1={mapPy(0)} x2={mapPx(1.2)} y2={mapPy(0)} stroke="#334155" strokeWidth="1" />
              <line x1={mapPx(0)} y1={mapPy(-0.2)} x2={mapPx(0)} y2={mapPy(1.2)} stroke="#334155" strokeWidth="1" />
              <text x={mapPx(1.2)} y={mapPy(0) + 12} fill="#64748b" fontSize="9" fontFamily="monospace">x₁</text>
              <text x={mapPx(0) - 10} y={mapPy(1.2)} fill="#64748b" fontSize="9" fontFamily="monospace">x₂</text>

              {/* Decision Boundary Line */}
              <line
                x1={mapPx(-0.2)}
                y1={mapPy(calcX2(-0.2))}
                x2={mapPx(1.2)}
                y2={mapPy(calcX2(1.2))}
                stroke={isXor ? '#f43f5e' : '#06b6d4'}
                strokeWidth="2.5"
                strokeDasharray={isXor ? '4 3' : 'none'}
              />

              {/* Data Points */}
              {points.map(p => {
                const cx = mapPx(p.x1);
                const cy = mapPy(p.x2);
                const isPositive = p.y === 1;
                const isError = p.pred !== p.y;
                return (
                  <g key={`pt-${p.id}`}>
                    {isError && (
                      <circle cx={cx} cy={cy} r="12" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="7"
                      fill={isPositive ? '#06b6d4' : '#f59e0b'}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                    <text
                      x={cx}
                      y={cy - 10}
                      fill="#e2e8f0"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {p.label}={p.y}
                    </text>
                  </g>
                );
              })}

              {/* Inseparable warning label on XOR */}
              {isXor && (
                <text x={140} y={235} fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  Single straight line mathematically cannot solve XOR
                </text>
              )}
            </svg>
          </div>

          {/* Right: Perceptron Neuron Diagram */}
          <div className="border border-slate-800 bg-[#080b13] p-3 flex flex-col items-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 w-full flex justify-between">
              <span>Perceptron Synaptic Topology</span>
              <span className="text-cyan-400 font-mono">y = step(Σ wᵢxᵢ + b)</span>
            </div>

            <svg viewBox="0 0 280 250" className="w-full h-auto select-none">
              {/* Input Nodes */}
              <circle cx={40} cy={55} r="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              <text x={40} y={59} fill="#06b6d4" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">x₁</text>

              <circle cx={40} cy={125} r="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              <text x={40} y={129} fill="#06b6d4" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">x₂</text>

              <circle cx={40} cy={195} r="14" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
              <text x={40} y={199} fill="#a855f7" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">+1</text>

              {/* Synapses to Summer Node */}
              <line x1={54} y1={55} x2={135} y2={125} stroke="#38bdf8" strokeWidth="1.8" />
              <text x={90} y={80} fill="#38bdf8" fontSize="8" fontFamily="monospace">w₁={w1.toFixed(2)}</text>

              <line x1={54} y1={125} x2={135} y2={125} stroke="#38bdf8" strokeWidth="1.8" />
              <text x={90} y={120} fill="#38bdf8" fontSize="8" fontFamily="monospace">w₂={w2.toFixed(2)}</text>

              <line x1={54} y1={195} x2={135} y2={125} stroke="#a855f7" strokeWidth="1.8" />
              <text x={90} y={170} fill="#a855f7" fontSize="8" fontFamily="monospace">b={b.toFixed(2)}</text>

              {/* Summation Node Σ */}
              <circle cx={145} cy={125} r="18" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x={145} y={130} fill="#f59e0b" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">∑</text>

              {/* Synapse to Activation Box */}
              <line x1={163} y1={125} x2={195} y2={125} stroke="#64748b" strokeWidth="1.5" />

              {/* Step Activation Box */}
              <rect x={195} y={107} width={34} height={36} fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <polyline points="202,135 212,135 212,117 222,117" fill="none" stroke="#10b981" strokeWidth="1.8" />

              {/* Output Synapse & Node */}
              <line x1={229} y1={125} x2={255} y2={125} stroke="#10b981" strokeWidth="2" />
              <text x={265} y={129} fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">ŷ</text>
            </svg>
          </div>
        </div>

        {/* Technical Explanatory Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Perceptron Learning Rule</span>
            <span className="text-cyan-300">w_i ← w_i + η·(y - ŷ)·x_i</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Weights update only upon misclassification. If the problem is linearly separable, the Perceptron Convergence Theorem guarantees zero error in finite steps.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Minsky-Papert XOR Barrier</span>
            <span className="text-rose-400">XOR requires non-linear hidden representations</span>
            <div className="text-[11px] text-slate-400 mt-1">
              A single linear neuron cannot solve XOR logic because positive samples are diagonally opposite. Solving XOR requires multi-layer networks (MLPs).
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     20. MULTI-LAYER PERCEPTRON (BACKPROP) VISUALIZER
     ───────────────────────────────────────────────────────────── */
  const renderMlpBackpropagation = () => {
    const lr = editableValues.learningRate !== undefined ? Number(editableValues.learningRate) : 0.20;
    const dynamicLoss = Math.max(0.02, 0.967 * Math.exp(-2.0 * lr));
    const yHat = editableValues.learningRate !== undefined ? Math.min(0.96, 0.38 + 0.9 * lr) : (mem.yHat !== undefined ? Number(mem.yHat) : 0.38);
    const loss = editableValues.learningRate !== undefined ? dynamicLoss : (mem.loss !== undefined ? Number(mem.loss) : 0.967);
    const delta2 = mem.delta2 !== undefined ? Number(mem.delta2) : -0.62;
    const h1 = mem.h ? mem.h[0] : 0.85;
    const h2 = mem.h ? mem.h[1] : 0.0;
    const phase = mem.phase || 'FORWARD_PASS';
    const isBackprop = phase === 'BACKWARD_FLOW';

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Architecture:</span>
            <span className="text-cyan-400 font-bold">2 → 2 → 1 MLP</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Prediction:</span>
            <span className="text-purple-400 font-bold">ŷ = {yHat.toFixed(2)} (y = 1)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Cross-Entropy Loss:</span>
            <span className={loss < 0.1 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              L = {loss.toFixed(3)}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Phase:</span>
            <span className="text-cyan-300 font-bold">{phase}</span>
          </div>
        </div>

        {/* Neural Topology & Activation Flow SVG */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-2 flex justify-center rounded-none overflow-hidden">
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-75 select-none">
            {/* Layer Background Guides */}
            <text x={90} y={25} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">INPUT LAYER</text>
            <text x={300} y={25} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">HIDDEN LAYER (ReLU)</text>
            <text x={510} y={25} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">OUTPUT (Sigmoid)</text>

            {/* Synaptic Lines Input -> Hidden */}
            {[
              { fromY: 85, toY: 85, w: 'W1[0,0]=1.8' },
              { fromY: 85, toY: 175, w: 'W1[0,1]=-1.6' },
              { fromY: 175, toY: 85, w: 'W1[1,0]=-1.5' },
              { fromY: 175, toY: 175, w: 'W1[1,1]=1.9' },
            ].map((syn, idx) => (
              <line
                key={`ih-${idx}`}
                x1={105}
                y1={syn.fromY}
                x2={285}
                y2={syn.toY}
                stroke={isBackprop ? '#f59e0b' : '#38bdf8'}
                strokeWidth={isBackprop ? '2' : '1.5'}
                strokeDasharray={isBackprop ? '4 2' : 'none'}
              />
            ))}

            {/* Synaptic Lines Hidden -> Output */}
            {[
              { fromY: 85, toY: 130, w: 'W2[0]=2.1' },
              { fromY: 175, toY: 130, w: 'W2[1]=2.3' },
            ].map((syn, idx) => (
              <line
                key={`ho-${idx}`}
                x1={315}
                y1={syn.fromY}
                x2={495}
                y2={syn.toY}
                stroke={isBackprop ? '#f43f5e' : '#a855f7'}
                strokeWidth="2.2"
                strokeDasharray={isBackprop ? '4 2' : 'none'}
              />
            ))}

            {/* Input Neurons */}
            <g>
              <circle cx={90} cy={85} r="18" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
              <text x={90} y={89} fill="#06b6d4" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">x₁=1</text>

              <circle cx={90} cy={175} r="18" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
              <text x={90} y={179} fill="#06b6d4" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">x₂=0</text>
            </g>

            {/* Hidden Neurons (h1, h2) */}
            <g>
              <circle cx={300} cy={85} r="20" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x={300} y={83} fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">h₁</text>
              <text x={300} y={96} fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">{h1.toFixed(2)}</text>

              <circle cx={300} cy={175} r="20" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x={300} y={173} fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">h₂</text>
              <text x={300} y={186} fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">{h2.toFixed(2)}</text>
            </g>

            {/* Output Neuron */}
            <g>
              <circle cx={510} cy={130} r="22" fill="#1e293b" stroke={loss < 0.1 ? '#10b981' : '#a855f7'} strokeWidth="2.5" />
              <text x={510} y={127} fill="#a855f7" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ŷ</text>
              <text x={510} y={141} fill="#e2e8f0" fontSize="10" fontFamily="monospace" textAnchor="middle">{yHat.toFixed(2)}</text>
            </g>

            {/* Error Delta Indicator Callout */}
            {isBackprop && (
              <g>
                <rect x={440} y={70} width={140} height={24} fill="#090d16" stroke="#f43f5e" strokeWidth="1" />
                <text x={510} y={86} fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  δ^[2] = ŷ - y = {delta2.toFixed(2)}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Technical Explanatory Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Non-Linear Manifold Warping</span>
            <span className="text-cyan-300">h = ReLU(W^[1]·x + b^[1])</span>
            <div className="text-[11px] text-slate-300 mt-1">
              The hidden layer warps the 2D input space, collapsing (0,0) and (1,1) onto one side so that XOR becomes strictly linearly separable.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Chain Rule Gradient Backprop</span>
            <span className="text-rose-400">δ^[1] = ((W^[2])ᵀ·δ^[2]) ⊙ ReLU'(z^[1])</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Error δ^[2] is propagated backwards through matrix transpose (W^[2])^T, calculating exact partial derivatives ∂L/∂W to update all network weights.
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────
     21. ACTIVATION FUNCTIONS & GRADIENTS VISUALIZER
     ───────────────────────────────────────────────────────────── */
  const renderActivationFunctions = () => {
    const currentFn = editableValues.currentFn || mem.currentFn || 'sigmoid';
    const probeZ = editableValues.probeZ !== undefined ? Number(editableValues.probeZ) : (mem.probeZ !== undefined ? Number(mem.probeZ) : 2.2);
    let outputVal = 0;
    let gradVal = 0;
    if (currentFn === 'sigmoid') {
      outputVal = 1 / (1 + Math.exp(-probeZ));
      gradVal = outputVal * (1 - outputVal);
    } else if (currentFn === 'tanh') {
      outputVal = Math.tanh(probeZ);
      gradVal = 1 - Math.pow(outputVal, 2);
    } else {
      outputVal = Math.max(0, probeZ);
      gradVal = probeZ > 0 ? 1 : 0;
    }
    const deep4 = Math.pow(gradVal, 4);

    // Coordinate mapping: z: [-3.5, 3.5] => [30, 250]
    const mapZ = (z: number) => 30 + ((z + 3.5) / 7.0) * 220;
    const mapActY = (y: number) => 170 - ((y + 1.2) / 3.4) * 140; // covers [-1.2, 2.2]
    const mapGradY = (g: number) => 170 - (g / 1.1) * 140; // covers [0, 1.1]

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Metric Bar */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-slate-800 text-xs font-mono rounded-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Activation:</span>
            <span className="text-cyan-400 font-bold">{String(currentFn).toUpperCase()}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Input z:</span>
            <span className="text-purple-400 font-bold">{probeZ.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Output f(z):</span>
            <span className="text-cyan-300 font-bold">{outputVal.toFixed(3)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Gradient f'(z):</span>
            <span className={gradVal < 0.1 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {gradVal.toFixed(3)}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">4-Layer Flow:</span>
            <span className={deep4 < 0.05 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {deep4.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Dual Stage: Activation Curve f(z) vs Derivative Curve f'(z) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Canvas: Activation Curve f(z) */}
          <div className="border border-slate-800 bg-[#080b13] p-3 flex flex-col items-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 w-full flex justify-between">
              <span>Activation Curve f(z)</span>
              <span className="text-cyan-400 font-mono">z ∈ [-3.5, +3.5]</span>
            </div>

            <svg viewBox="0 0 280 190" className="w-full h-auto select-none">
              {/* Axes */}
              <line x1={30} y1={mapActY(0)} x2={250} y2={mapActY(0)} stroke="#334155" strokeWidth="1" />
              <line x1={mapZ(0)} y1={20} x2={mapZ(0)} y2={180} stroke="#334155" strokeWidth="1" />

              {/* Curve rendering based on currentFn */}
              {currentFn === 'sigmoid' && (
                <path
                  d="M 30 160 Q 90 155 140 120 T 250 82"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />
              )}
              {currentFn === 'tanh' && (
                <path
                  d="M 30 168 Q 100 160 140 120 T 250 72"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                />
              )}
              {(currentFn === 'relu' || currentFn === 'comparison') && (
                <path
                  d="M 30 120 L 140 120 L 250 30"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
              )}

              {/* Probe Point */}
              <circle cx={mapZ(probeZ)} cy={mapActY(outputVal)} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
              <text x={mapZ(probeZ)} y={mapActY(outputVal) - 8} fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                f({probeZ.toFixed(1)}) = {outputVal.toFixed(2)}
              </text>
            </svg>
          </div>

          {/* Right Canvas: First Derivative / Gradient f'(z) */}
          <div className="border border-slate-800 bg-[#080b13] p-3 flex flex-col items-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 w-full flex justify-between">
              <span>Derivative Gradient f'(z)</span>
              <span className={gradVal < 0.1 ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
                {gradVal < 0.1 ? 'Gradient Saturation' : 'Sustained Flow'}
              </span>
            </div>

            <svg viewBox="0 0 280 190" className="w-full h-auto select-none">
              {/* Axes */}
              <line x1={30} y1={mapGradY(0)} x2={250} y2={mapGradY(0)} stroke="#334155" strokeWidth="1" />
              <line x1={mapZ(0)} y1={20} x2={mapZ(0)} y2={180} stroke="#334155" strokeWidth="1" />

              {/* Derivative Curve */}
              {currentFn === 'sigmoid' && (
                // Bell curve max 0.25 at z=0
                <path
                  d="M 30 168 Q 140 125 140 138 T 250 168"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                />
              )}
              {currentFn === 'tanh' && (
                // Bell curve max 1.0 at z=0
                <path
                  d="M 30 168 Q 120 45 140 43 T 250 168"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                />
              )}
              {(currentFn === 'relu' || currentFn === 'comparison') && (
                // Step function: 0 for z<0, 1 for z>0
                <path
                  d="M 30 170 L 140 170 L 140 43 L 250 43"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
              )}

              {/* Probe Point on Gradient */}
              <circle cx={mapZ(probeZ)} cy={mapGradY(gradVal)} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.2" />
              <text x={mapZ(probeZ)} y={mapGradY(gradVal) - 8} fill="#f43f5e" fontSize="8" fontFamily="monospace" textAnchor="middle">
                f'={gradVal.toFixed(3)}
              </text>
            </svg>
          </div>
        </div>

        {/* Deep 4-Layer Backflow Comparison Bar */}
        <div className="border border-slate-800 bg-[#080b13] p-2.5">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex justify-between">
            <span>4-Layer Error Backpropagation Signal Decay (δ_out = 1.0)</span>
            <span className="text-emerald-400 font-mono">ReLU vs Sigmoid</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
            <div className="p-2 bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-[9px]">Layer 4 (Output)</div>
              <div className="text-cyan-400 font-bold mt-0.5">δ₄ = 1.000</div>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-[9px]">Layer 3</div>
              <div className="text-slate-300 font-bold mt-0.5">
                {currentFn === 'sigmoid' ? 'δ₃ = 0.250' : 'δ₃ = 1.000'}
              </div>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-[9px]">Layer 2</div>
              <div className="text-slate-300 font-bold mt-0.5">
                {currentFn === 'sigmoid' ? 'δ₂ = 0.022' : 'δ₂ = 1.000'}
              </div>
            </div>
            <div className={`p-2 border ${
              deep4 < 0.05 ? 'bg-rose-950/40 border-rose-500 text-rose-300' : 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
            }`}>
              <div className="text-[9px]">Layer 1 (Input)</div>
              <div className="font-bold mt-0.5">
                δ₁ = {deep4.toFixed(4)} ({deep4 < 0.05 ? 'Dead Signal' : 'Active'})
              </div>
            </div>
          </div>
        </div>

        {/* Technical Explanatory Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Vanishing Gradient Problem</span>
            <span className="text-rose-400">Sigmoid: max σ'(z) = 0.25</span>
            <div className="text-[11px] text-slate-300 mt-1">
              Multiplying gradients across L layers yields (0.25)^L. For 4 layers, gradient drops below 0.002, freezing early weights and stalling training.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">ReLU Constant Gradient Advantage</span>
            <span className="text-emerald-400">ReLU: f'(z) = 1.0 for z &gt; 0</span>
            <div className="text-[11px] text-slate-400 mt-1">
              Because ReLU derivative is identically 1.0 on positive inputs, error signals flow backward unimpeded across 100+ layer architectures.
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── TOPIC 22: CNN CONVOLUTION & POOLING ──────────────────────────────────
  const renderCnnConvolution = () => {
    const inputGrid: number[][] = mem.inputGrid || [
      [1.2, 1.5, 1.8, 4.8, 5.2, 5.5],
      [1.4, 1.8, 2.2, 5.0, 5.6, 6.0],
      [1.6, 2.0, 2.5, 5.2, 5.8, 6.2],
      [2.0, 2.2, 2.8, 5.5, 6.0, 6.5],
      [2.2, 2.5, 3.0, 5.8, 6.2, 6.8],
      [2.5, 2.8, 3.2, 6.0, 6.5, 7.0],
    ];

    const kernelType = editableValues.kernelType || 'sobel';
    const kernel: number[][] = kernelType === 'sharpen'
      ? [[0, -1, 0], [-1, 5, -1], [0, -1, 0]]
      : kernelType === 'blur'
      ? [[0.11, 0.11, 0.11], [0.11, 0.11, 0.11], [0.11, 0.11, 0.11]]
      : (mem.kernel || [
          [-1, 0, 1],
          [-2, 0, 2],
          [-1, 0, 1],
        ]);

    const windowPos = mem.windowPos || { r: 0, c: 0 };
    const computedVal = mem.computedVal !== undefined ? Number(mem.computedVal) : 14.8;
    const phase = editableValues.kernelType ? `${kernelType.toUpperCase()} FILTER` : (mem.phase || 'KERNEL_INITIALIZED');

    // 4x4 Output Feature Map
    const featureMap = [
      [14.8, 15.2, 16.0, 2.5],
      [15.0, 15.8, 16.2, 2.8],
      [15.4, 16.0, 16.4, 3.0],
      [15.8, 16.2, 16.6, 3.2],
    ];

    // 2x2 Max Pooled Map
    const pooledMap = [
      [15.8, 16.2],
      [16.2, 16.6],
    ];

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Dataset Attribution Header */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-cyan-900/60 text-xs font-mono rounded-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 border border-cyan-800">
              Benchmark Dataset
            </span>
            <span className="text-slate-300 font-bold">Multi-Class Biomarkers X₁, X₂ (6×6 Spatial Sub-Grid)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Operation:</span>
            <span className="text-amber-400 font-bold">3×3 Cross-Correlation</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Phase:</span>
            <span className="text-purple-400 font-bold">{phase}</span>
          </div>
        </div>

        {/* Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">Input Dimensions</span>
            <span className="text-cyan-400 font-bold text-sm">6 × 6 Matrix (36 cells)</span>
          </div>
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">Kernel Filter</span>
            <span className="text-amber-400 font-bold text-sm">3 × 3 Sobel (Edge)</span>
          </div>
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">Feature Map Dim</span>
            <span className="text-purple-400 font-bold text-sm">4 × 4 Valid (16 cells)</span>
          </div>
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">Max-Pool Dim</span>
            <span className="text-emerald-400 font-bold text-sm">2 × 2 Downsampled</span>
          </div>
        </div>

        {/* Visual Stage Container: Pipeline */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-3 rounded-none flex flex-col lg:flex-row items-center justify-between gap-4 overflow-x-auto">
          {/* Step A: 6x6 Input Grid with Sliding Window */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-[11px] font-mono text-slate-300 font-bold flex items-center gap-2">
              <span>Input Grid I</span>
              <span className="text-[9px] text-cyan-400 font-normal">(Biomarker Intensities)</span>
            </div>
            <div className="grid grid-cols-6 gap-1 p-1.5 bg-[#05070c] border border-slate-800">
              {inputGrid.map((row, r) =>
                row.map((val, c) => {
                  const inWindow =
                    r >= windowPos.r &&
                    r < windowPos.r + 3 &&
                    c >= windowPos.c &&
                    c < windowPos.c + 3;
                  return (
                    <div
                      key={`in-${r}-${c}`}
                      className={`w-9 h-9 flex items-center justify-center text-[10px] font-mono border transition-all ${
                        inWindow
                          ? 'border-amber-400 bg-amber-950/60 text-amber-200 font-bold'
                          : 'border-slate-800/80 bg-slate-900/40 text-slate-400'
                      }`}
                    >
                      {val.toFixed(1)}
                    </div>
                  );
                })
              )}
            </div>
            <div className="text-[10px] font-mono text-amber-400">
              Active Window: [{windowPos.r}:{windowPos.r + 2}, {windowPos.c}:{windowPos.c + 2}]
            </div>
          </div>

          {/* Math Operator: * Kernel */}
          <div className="flex flex-col items-center justify-center gap-1 text-slate-500 font-mono">
            <span className="text-base text-cyan-400 font-bold">⊗</span>
            <div className="text-[10px] text-center text-slate-400">Convolution</div>
          </div>

          {/* Step B: 3x3 Kernel */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-[11px] font-mono text-slate-300 font-bold flex items-center gap-2">
              <span>Kernel K</span>
              <span className="text-[9px] text-amber-400 font-normal">(Sobel Edge)</span>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1.5 bg-[#05070c] border border-amber-900/60">
              {kernel.map((row, r) =>
                row.map((kval, c) => (
                  <div
                    key={`k-${r}-${c}`}
                    className={`w-9 h-9 flex items-center justify-center text-[11px] font-mono border ${
                      kval > 0
                        ? 'border-emerald-700 bg-emerald-950/40 text-emerald-300 font-bold'
                        : kval < 0
                        ? 'border-rose-700 bg-rose-950/40 text-rose-300 font-bold'
                        : 'border-slate-800 bg-slate-900/40 text-slate-500'
                    }`}
                  >
                    {kval > 0 ? `+${kval}` : kval}
                  </div>
                ))
              )}
            </div>
            <div className="text-[10px] font-mono text-slate-400">Weights [-1, 0, +1]</div>
          </div>

          {/* Math Operator: = Output */}
          <div className="flex flex-col items-center justify-center gap-1 text-slate-500 font-mono">
            <span className="text-base text-purple-400 font-bold">➔</span>
            <div className="text-[10px] text-center text-slate-400">Σ(I·K)</div>
          </div>

          {/* Step C: 4x4 Convolved Feature Map */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-[11px] font-mono text-slate-300 font-bold flex items-center gap-2">
              <span>Feature Map O</span>
              <span className="text-[9px] text-purple-400 font-normal">(4×4 Activations)</span>
            </div>
            <div className="grid grid-cols-4 gap-1 p-1.5 bg-[#05070c] border border-slate-800">
              {featureMap.map((row, r) =>
                row.map((fval, c) => {
                  const isCurrent = r === windowPos.r && c === windowPos.c;
                  const isVisible =
                    phase === 'FEATURE_MAP_COMPLETE' ||
                    phase === 'MAX_POOLING_COMPLETE' ||
                    (r < windowPos.r || (r === windowPos.r && c <= windowPos.c));
                  return (
                    <div
                      key={`fm-${r}-${c}`}
                      className={`w-9 h-9 flex items-center justify-center text-[10px] font-mono border transition-all ${
                        isCurrent
                          ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 font-bold'
                          : isVisible
                          ? 'border-purple-800/80 bg-purple-950/40 text-purple-200'
                          : 'border-slate-800/40 bg-slate-900/20 text-slate-600'
                      }`}
                    >
                      {isVisible ? (isCurrent ? computedVal.toFixed(1) : fval.toFixed(1)) : '·'}
                    </div>
                  );
                })
              )}
            </div>
            <div className="text-[10px] font-mono text-purple-400">
              {phase === 'FEATURE_MAP_COMPLETE' || phase === 'MAX_POOLING_COMPLETE'
                ? 'Full Feature Map Complete'
                : `Computing cell (${windowPos.r}, ${windowPos.c})`}
            </div>
          </div>

          {/* Math Operator: Max-Pooling */}
          <div className="flex flex-col items-center justify-center gap-1 text-slate-500 font-mono">
            <span className="text-base text-emerald-400 font-bold">➔</span>
            <div className="text-[10px] text-center text-slate-400">Max(2×2)</div>
          </div>

          {/* Step D: 2x2 Max-Pooling Subsampled Map */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-[11px] font-mono text-slate-300 font-bold flex items-center gap-2">
              <span>Pooled Map P</span>
              <span className="text-[9px] text-emerald-400 font-normal">(2×2 Downsampled)</span>
            </div>
            <div className="grid grid-cols-2 gap-1 p-1.5 bg-[#05070c] border border-slate-800">
              {pooledMap.map((row, r) =>
                row.map((pval, c) => {
                  const isPooled = phase === 'MAX_POOLING_COMPLETE';
                  return (
                    <div
                      key={`pool-${r}-${c}`}
                      className={`w-9 h-9 flex items-center justify-center text-[11px] font-mono border transition-all ${
                        isPooled
                          ? 'border-emerald-500 bg-emerald-950/70 text-emerald-200 font-bold'
                          : 'border-slate-800/40 bg-slate-900/20 text-slate-600'
                      }`}
                    >
                      {isPooled ? pval.toFixed(1) : '·'}
                    </div>
                  );
                })
              )}
            </div>
            <div className="text-[10px] font-mono text-emerald-400">
              {phase === 'MAX_POOLING_COMPLETE' ? '75% Spatial Compression' : 'Awaiting Pooling'}
            </div>
          </div>
        </div>

        {/* Calculation & Convolution Formula Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
              Active Convolution Dot Product
            </span>
            <span className="text-cyan-300 font-bold">
              (I * K)({windowPos.r}, {windowPos.c}) = {computedVal.toFixed(1)}
            </span>
            <div className="text-[11px] text-slate-300 mt-1">
              Sum of 9 element-wise products across the active window. Highlights the sharp biomarker transition between low-grade and high-grade clusters.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
              Spatial Invariance & Pooling
            </span>
            <span className="text-emerald-400 font-bold">
              Pool Size: 2×2, Stride: 2 (Output: 2×2)
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              Max-pooling preserves the most salient edge features while providing translation invariance and reducing memory footprint for downstream dense layers.
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── TOPIC 23: REINFORCEMENT LEARNING (Q-LEARNING) ────────────────────────
  const renderQLearningGrid = () => {
    const agentPos = mem.agentPos || { r: 0, c: 0 };
    const episode = mem.episode || 1;
    const epsilon = editableValues.epsilon !== undefined ? Number(editableValues.epsilon) : (mem.epsilon !== undefined ? Number(mem.epsilon) : 0.30);
    const gamma = editableValues.gamma !== undefined ? Number(editableValues.gamma) : 0.90;
    const lastReward = mem.lastReward !== undefined ? Number(mem.lastReward) : 0;
    const tdError = editableValues.epsilon !== undefined ? Number((0.45 * epsilon * gamma).toFixed(3)) : (mem.tdError !== undefined ? Number(mem.tdError) : 0.0);
    const phase = editableValues.epsilon !== undefined ? `TUNING ε=${epsilon.toFixed(2)} γ=${gamma.toFixed(2)}` : (mem.phase || 'ENV_INITIALIZED');
    const isConverged = phase === 'POLICY_CONVERGED';

    const hazards = [{ r: 1, c: 2 }, { r: 2, c: 1 }];
    const goal = { r: 3, c: 3 };

    const policyArrows: Record<string, string> = {
      '0-0': '→',
      '0-1': '→',
      '0-2': '→',
      '0-3': '↓',
      '1-0': '↓',
      '1-1': '↑',
      '1-3': '↓',
      '2-0': '↓',
      '2-2': '→',
      '2-3': '↓',
      '3-0': '→',
      '3-1': '→',
      '3-2': '→',
    };

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Manifold Attribution Header */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-emerald-900/60 text-xs font-mono rounded-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-800">
              Benchmark Manifold
            </span>
            <span className="text-slate-300 font-bold">Regression Manifold: Engine Load vs Temperature Response Surface</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Objective:</span>
            <span className="text-amber-400 font-bold">Max Return (Optimal Sweetspot)</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Phase:</span>
            <span className="text-cyan-400 font-bold">{phase}</span>
          </div>
        </div>

        {/* Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">Training Episode</span>
            <span className="text-cyan-400 font-bold text-sm">Episode {episode} / 50</span>
          </div>
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">Current State & Reward</span>
            <span className="text-amber-400 font-bold text-sm">
              s=({agentPos.r}, {agentPos.c}) | r={lastReward > 0 ? `+${lastReward}` : lastReward}
            </span>
          </div>
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">TD Error δ</span>
            <span className={`font-bold text-sm ${tdError !== 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              δ = {tdError.toFixed(2)}
            </span>
          </div>
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">Policy Status</span>
            <span className={`font-bold text-sm ${isConverged ? 'text-emerald-400' : 'text-purple-400'}`}>
              {isConverged ? 'π* Converged' : `Exploration ε=${epsilon.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* 4x4 GridWorld Visual Canvas */}
        <div className="w-full bg-[#080b13] border border-slate-800 p-4 flex flex-col items-center justify-center rounded-none">
          <div className="grid grid-cols-4 gap-2 w-full max-w-lg">
            {[0, 1, 2, 3].map(r =>
              [0, 1, 2, 3].map(c => {
                const isAgent = agentPos.r === r && agentPos.c === c;
                const isHazard = hazards.some(h => h.r === r && h.c === c);
                const isGoal = goal.r === r && goal.c === c;
                const isStart = r === 0 && c === 0;
                const arrow = policyArrows[`${r}-${c}`];

                return (
                  <div
                    key={`grid-${r}-${c}`}
                    className={`relative h-20 border font-mono flex flex-col justify-between p-1.5 transition-all rounded-none ${
                      isAgent
                        ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400/50'
                        : isGoal
                        ? 'border-emerald-600/80 bg-emerald-950/40 text-emerald-200'
                        : isHazard
                        ? 'border-rose-700/80 bg-rose-950/40 text-rose-300'
                        : isStart
                        ? 'border-cyan-800/80 bg-cyan-950/30 text-cyan-300'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400'
                    }`}
                  >
                    {/* Top Row: Coordinates & Cell Tag */}
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-slate-400">({r},{c})</span>
                      {isStart && <span className="text-cyan-400 font-bold">START</span>}
                      {isHazard && <span className="text-rose-400 font-bold">-50 HAZARD</span>}
                      {isGoal && <span className="text-emerald-400 font-bold">+100 GOAL</span>}
                    </div>

                    {/* Middle: Agent Marker or Policy Arrow */}
                    <div className="flex items-center justify-center flex-1">
                      {isAgent ? (
                        <div className="flex items-center gap-1 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 border border-amber-300">
                          <span>AGENT</span>
                        </div>
                      ) : isConverged && arrow && !isGoal && !isHazard ? (
                        <div className="text-2xl text-emerald-400 font-bold">
                          {arrow}
                        </div>
                      ) : !isHazard && !isGoal ? (
                        <div className="text-[9px] text-slate-400 font-mono">
                          r = -1.0
                        </div>
                      ) : null}
                    </div>

                    {/* Bottom: Q-value preview */}
                    <div className="text-[9px] text-right font-mono">
                      {isGoal ? (
                        <span className="text-emerald-400 font-bold">V* = 100.0</span>
                      ) : isHazard ? (
                        <span className="text-rose-400 font-bold">V* = -50.0</span>
                      ) : isConverged ? (
                        <span className="text-slate-300">max Q: {(80 - (r + c) * 4).toFixed(1)}</span>
                      ) : (
                        <span className="text-slate-400">Q(s,a)</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-cyan-950 border border-cyan-500 inline-block"></span> Start State (0,0)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-rose-950 border border-rose-500 inline-block"></span> Thermal Hazards (-50)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-emerald-950 border border-emerald-500 inline-block"></span> Efficiency Sweetspot (+100)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-500 inline-block"></span> Agent Beacon
            </span>
          </div>
        </div>

        {/* Bellman Optimality Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
              Bellman TD Update Equation
            </span>
            <span className="text-cyan-300 font-bold">
              Q(s, a) ← Q(s, a) + α · [r + γ · max_&#123;a'&#125; Q(s', a') - Q(s, a)]
            </span>
            <div className="text-[11px] text-slate-300 mt-1">
              Temporal Difference error δ drives value iteration without needing an environmental model. The agent learns from sample trajectories on the manifold.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
              Convergence & Hazard Circumvention
            </span>
            <span className="text-emerald-400 font-bold">
              Optimal Policy π*(s) = argmax_a Q(s, a)
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              Negative rewards from thermal hazards (1,2) and (2,1) propagate backward, forcing the greedy policy to navigate perimeter channels directly to the sweetspot.
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── TOPIC 24: HIERARCHICAL CLUSTERING (DENDROGRAM) ───────────────────────
  const renderHierarchicalClustering = () => {
    interface SamplePoint {
      id: number;
      x1: number;
      x2: number;
      trueCluster: number;
    }

    const samples: SamplePoint[] = mem.samples || [
      { id: 1, x1: 1.5, x2: 2.5, trueCluster: 0 },
      { id: 2, x1: 1.8, x2: 1.4, trueCluster: 0 },
      { id: 3, x1: 2.2, x2: 2.0, trueCluster: 0 },
      { id: 4, x1: 2.8, x2: 1.6, trueCluster: 0 },
      { id: 5, x1: 4.8, x2: 6.0, trueCluster: 1 },
      { id: 6, x1: 5.2, x2: 5.8, trueCluster: 1 },
      { id: 7, x1: 5.8, x2: 5.5, trueCluster: 1 },
      { id: 8, x1: 6.5, x2: 5.8, trueCluster: 1 },
      { id: 9, x1: 1.8, x2: 6.5, trueCluster: 2 },
      { id: 10, x1: 2.5, x2: 6.0, trueCluster: 2 },
      { id: 11, x1: 3.2, x2: 6.8, trueCluster: 2 },
      { id: 12, x1: 7.6, x2: 2.5, trueCluster: -1 },
    ];

    const cutHeight = editableValues.cutHeight !== undefined ? Number(editableValues.cutHeight) : (mem.cutHeight ?? 2.80);
    const dynamicK = cutHeight >= 4.0 ? 2 : cutHeight >= 2.2 ? 3 : cutHeight >= 1.2 ? 4 : 6;
    const activeCount = editableValues.cutHeight !== undefined ? dynamicK : (mem.activeClustersCount ?? 12);
    const phase = editableValues.cutHeight !== undefined ? `DENDROGRAM_CUT_K${dynamicK}` : (mem.phase || 'SINGLETON_CLUSTERS');
    const isCut = editableValues.cutHeight !== undefined ? true : (phase === 'DENDROGRAM_CUT_K3');

    const map2dX = (x1: number) => 40 + (x1 / 9.0) * 220;
    const map2dY = (x2: number) => 220 - (x2 / 8.0) * 190;

    const getClusterColor = (c: number) => {
      if (c === 0) return '#f59e0b';
      if (c === 1) return '#06b6d4';
      if (c === 2) return '#a855f7';
      return '#f43f5e';
    };

    const leafX: Record<number, number> = {
      1: 45, 2: 65, 3: 85, 4: 105,
      5: 135, 6: 155, 7: 175, 8: 195,
      9: 220, 10: 240, 11: 260,
      12: 285,
    };

    const mapDendroY = (h: number) => 220 - (h / 6.0) * 190;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Dataset Attribution Header */}
        <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#0a0d16] border border-purple-900/60 text-xs font-mono rounded-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 border border-purple-800">
              Benchmark Dataset
            </span>
            <span className="text-slate-300 font-bold">Multi-Class Biomarkers X₁, X₂ (12 Representative Observations)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Linkage:</span>
            <span className="text-amber-400 font-bold">Ward's Minimum Variance</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Phase:</span>
            <span className="text-cyan-400 font-bold">{phase}</span>
          </div>
        </div>

        {/* Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">Dataset Size</span>
            <span className="text-cyan-400 font-bold text-sm">N = 12 Samples</span>
          </div>
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">Active Partition Count</span>
            <span className="text-purple-400 font-bold text-sm">{activeCount} Clusters</span>
          </div>
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">Cut Height Threshold</span>
            <span className="text-amber-400 font-bold text-sm">h_cut = {cutHeight.toFixed(2)}</span>
          </div>
          <div className="p-2 bg-[#080b13] border border-slate-800 rounded-none">
            <span className="text-slate-400 text-[10px] block">Extracted Partitions</span>
            <span className={`font-bold text-sm ${isCut ? 'text-emerald-400' : 'text-slate-400'}`}>
              {isCut ? 'K = 3 Discrete Classes' : 'Hierarchical Tree'}
            </span>
          </div>
        </div>

        {/* Visual Dual Panel: 2D Feature Space vs Binary Tree Dendrogram */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Panel 1: 2D Feature Scatter with Cluster Boundaries */}
          <div className="bg-[#080b13] border border-slate-800 p-3 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs font-mono mb-2 text-slate-300">
              <span className="font-bold">2D Biomarker Feature Space</span>
              <span className="text-[10px] text-slate-400">X₁ vs X₂</span>
            </div>
            <svg viewBox="0 0 290 250" className="w-full h-auto select-none">
              {/* Grid Lines */}
              {[2, 4, 6, 8].map(gx => (
                <line key={`gx-${gx}`} x1={map2dX(gx)} y1={30} x2={map2dX(gx)} y2={220} stroke="#1e293b" strokeWidth="1" />
              ))}
              {[2, 4, 6].map(gy => (
                <line key={`gy-${gy}`} x1={40} y1={map2dY(gy)} x2={260} y2={map2dY(gy)} stroke="#1e293b" strokeWidth="1" />
              ))}

              {/* Axes */}
              <line x1={40} y1={30} x2={40} y2={220} stroke="#475569" strokeWidth="1.5" />
              <line x1={40} y1={220} x2={260} y2={220} stroke="#475569" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x={260} y={235} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">X₁ (Biomarker 1)</text>
              <text x={35} y={35} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">X₂</text>

              {/* Cluster Enclosing Hulls when Cut is Active */}
              {isCut && (
                <g>
                  {/* Cluster 0 Hull (Amber) */}
                  <ellipse cx={map2dX(2.0)} cy={map2dY(1.9)} rx="32" ry="24" fill="#f59e0b" fillOpacity="0.12" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" />
                  {/* Cluster 1 Hull (Cyan) */}
                  <ellipse cx={map2dX(5.6)} cy={map2dY(5.8)} rx="34" ry="22" fill="#06b6d4" fillOpacity="0.12" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 3" />
                  {/* Cluster 2 Hull (Purple) */}
                  <ellipse cx={map2dX(2.5)} cy={map2dY(6.4)} rx="30" ry="20" fill="#a855f7" fillOpacity="0.12" stroke="#a855f7" strokeWidth="1.2" strokeDasharray="3 3" />
                </g>
              )}

              {/* Data Points */}
              {samples.map((s: SamplePoint) => {
                const color = getClusterColor(s.trueCluster);
                const px = map2dX(s.x1);
                const py = map2dY(s.x2);
                return (
                  <g key={`pt-${s.id}`}>
                    <circle cx={px} cy={py} r="5" fill={color} stroke="#0b0e17" strokeWidth="1.5" />
                    <text x={px + 7} y={py + 3} fill={color} fontSize="9" fontFamily="monospace" fontWeight="bold">
                      #{s.id}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span className="text-amber-400 font-bold">● Class 0</span>
              <span className="text-cyan-400 font-bold">● Class 1</span>
              <span className="text-purple-400 font-bold">● Class 2</span>
              <span className="text-rose-400 font-bold">● Outlier #12</span>
            </div>
          </div>

          {/* Panel 2: Agglomerative Tree Dendrogram */}
          <div className="bg-[#080b13] border border-slate-800 p-3 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs font-mono mb-2 text-slate-300">
              <span className="font-bold">Agglomerative Dendrogram</span>
              <span className="text-[10px] text-amber-400">Ward Linkage Height</span>
            </div>
            <svg viewBox="0 0 310 250" className="w-full h-auto select-none">
              {/* Distance Axis */}
              <line x1={30} y1={30} x2={30} y2={220} stroke="#475569" strokeWidth="1.5" />
              {[0, 1, 2, 3, 4, 5].map(d => (
                <g key={`d-${d}`}>
                  <line x1={27} y1={mapDendroY(d)} x2={30} y2={mapDendroY(d)} stroke="#64748b" strokeWidth="1" />
                  <text x={24} y={mapDendroY(d) + 3} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="end">
                    {d}.0
                  </text>
                </g>
              ))}

              {/* Leaf labels (Bottom) */}
              {samples.map((s: SamplePoint) => {
                const color = getClusterColor(s.trueCluster);
                const x = leafX[s.id];
                return (
                  <text key={`lf-${s.id}`} x={x} y={234} fill={color} fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    #{s.id}
                  </text>
                );
              })}

              {/* Dendrogram Branches (Bottom-up Hierarchy) */}
              {phase !== 'SINGLETON_CLUSTERS' && (
                <g strokeWidth="1.5">
                  {/* Micro-merges: (1,2) at h=0.45 */}
                  <line x1={leafX[1]} y1={220} x2={leafX[1]} y2={mapDendroY(0.45)} stroke="#f59e0b" />
                  <line x1={leafX[2]} y1={220} x2={leafX[2]} y2={mapDendroY(0.45)} stroke="#f59e0b" />
                  <line x1={leafX[1]} y1={mapDendroY(0.45)} x2={leafX[2]} y2={mapDendroY(0.45)} stroke="#f59e0b" />

                  {/* Micro-merges: (3,4) at h=0.60 */}
                  <line x1={leafX[3]} y1={220} x2={leafX[3]} y2={mapDendroY(0.60)} stroke="#f59e0b" />
                  <line x1={leafX[4]} y1={220} x2={leafX[4]} y2={mapDendroY(0.60)} stroke="#f59e0b" />
                  <line x1={leafX[3]} y1={mapDendroY(0.60)} x2={leafX[4]} y2={mapDendroY(0.60)} stroke="#f59e0b" />

                  {/* Micro-merges: (5,6) at h=0.48 */}
                  <line x1={leafX[5]} y1={220} x2={leafX[5]} y2={mapDendroY(0.48)} stroke="#06b6d4" />
                  <line x1={leafX[6]} y1={220} x2={leafX[6]} y2={mapDendroY(0.48)} stroke="#06b6d4" />
                  <line x1={leafX[5]} y1={mapDendroY(0.48)} x2={leafX[6]} y2={mapDendroY(0.48)} stroke="#06b6d4" />

                  {/* Micro-merges: (7,8) at h=0.72 */}
                  <line x1={leafX[7]} y1={220} x2={leafX[7]} y2={mapDendroY(0.72)} stroke="#06b6d4" />
                  <line x1={leafX[8]} y1={220} x2={leafX[8]} y2={mapDendroY(0.72)} stroke="#06b6d4" />
                  <line x1={leafX[7]} y1={mapDendroY(0.72)} x2={leafX[8]} y2={mapDendroY(0.72)} stroke="#06b6d4" />

                  {/* Micro-merges: (9,10) at h=0.65 */}
                  <line x1={leafX[9]} y1={220} x2={leafX[9]} y2={mapDendroY(0.65)} stroke="#a855f7" />
                  <line x1={leafX[10]} y1={220} x2={leafX[10]} y2={mapDendroY(0.65)} stroke="#a855f7" />
                  <line x1={leafX[9]} y1={mapDendroY(0.65)} x2={leafX[10]} y2={mapDendroY(0.65)} stroke="#a855f7" />

                  {/* Mid-level merges (Step 3 & 4) */}
                  {(phase === 'FULL_DENDROGRAM' || isCut) && (
                    <g>
                      {/* Cluster 0 trunk: (1,2) with (3,4) at h=1.40 */}
                      <line x1={(leafX[1] + leafX[2]) / 2} y1={mapDendroY(0.45)} x2={(leafX[1] + leafX[2]) / 2} y2={mapDendroY(1.40)} stroke="#f59e0b" />
                      <line x1={(leafX[3] + leafX[4]) / 2} y1={mapDendroY(0.60)} x2={(leafX[3] + leafX[4]) / 2} y2={mapDendroY(1.40)} stroke="#f59e0b" />
                      <line x1={(leafX[1] + leafX[2]) / 2} y1={mapDendroY(1.40)} x2={(leafX[3] + leafX[4]) / 2} y2={mapDendroY(1.40)} stroke="#f59e0b" />

                      {/* Cluster 1 trunk: (5,6) with (7,8) at h=1.55 */}
                      <line x1={(leafX[5] + leafX[6]) / 2} y1={mapDendroY(0.48)} x2={(leafX[5] + leafX[6]) / 2} y2={mapDendroY(1.55)} stroke="#06b6d4" />
                      <line x1={(leafX[7] + leafX[8]) / 2} y1={mapDendroY(0.72)} x2={(leafX[7] + leafX[8]) / 2} y2={mapDendroY(1.55)} stroke="#06b6d4" />
                      <line x1={(leafX[5] + leafX[6]) / 2} y1={mapDendroY(1.55)} x2={(leafX[7] + leafX[8]) / 2} y2={mapDendroY(1.55)} stroke="#06b6d4" />

                      {/* Cluster 2 trunk: (9,10) with 11 at h=1.35 */}
                      <line x1={(leafX[9] + leafX[10]) / 2} y1={mapDendroY(0.65)} x2={(leafX[9] + leafX[10]) / 2} y2={mapDendroY(1.35)} stroke="#a855f7" />
                      <line x1={leafX[11]} y1={220} x2={leafX[11]} y2={mapDendroY(1.35)} stroke="#a855f7" />
                      <line x1={(leafX[9] + leafX[10]) / 2} y1={mapDendroY(1.35)} x2={leafX[11]} y2={mapDendroY(1.35)} stroke="#a855f7" />

                      {/* High-level trunk joins: Cluster 1 + Cluster 2 at h=4.2 */}
                      <line x1={165} y1={mapDendroY(1.55)} x2={165} y2={mapDendroY(4.2)} stroke="#64748b" />
                      <line x1={240} y1={mapDendroY(1.35)} x2={240} y2={mapDendroY(4.2)} stroke="#64748b" />
                      <line x1={165} y1={mapDendroY(4.2)} x2={240} y2={mapDendroY(4.2)} stroke="#64748b" />

                      {/* Global root: Cluster 0 joins with above at h=5.4 */}
                      <line x1={75} y1={mapDendroY(1.40)} x2={75} y2={mapDendroY(5.4)} stroke="#64748b" />
                      <line x1={202} y1={mapDendroY(4.2)} x2={202} y2={mapDendroY(5.4)} stroke="#64748b" />
                      <line x1={75} y1={mapDendroY(5.4)} x2={202} y2={mapDendroY(5.4)} stroke="#64748b" />

                      {/* Outlier 12 joins at h=5.8 */}
                      <line x1={leafX[12]} y1={220} x2={leafX[12]} y2={mapDendroY(5.8)} stroke="#f43f5e" />
                      <line x1={138} y1={mapDendroY(5.4)} x2={138} y2={mapDendroY(5.8)} stroke="#64748b" />
                      <line x1={138} y1={mapDendroY(5.8)} x2={leafX[12]} y2={mapDendroY(5.8)} stroke="#64748b" />
                    </g>
                  )}
                </g>
              )}

              {/* Horizontal Cut Threshold Line at h = 2.80 */}
              {isCut && (
                <g>
                  <line x1={30} y1={mapDendroY(cutHeight)} x2={300} y2={mapDendroY(cutHeight)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
                  <rect x={180} y={mapDendroY(cutHeight) - 16} width="115" height="15" fill="#0b0e17" stroke="#f59e0b" strokeWidth="1" />
                  <text x={237} y={mapDendroY(cutHeight) - 5} fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    Cut h = 2.80 → K = 3
                  </text>
                </g>
              )}
            </svg>
            <div className="w-full text-[10px] font-mono text-slate-400 mt-1 text-center">
              Tree height correlates with Ward's within-cluster variance increase.
            </div>
          </div>
        </div>

        {/* Technical Dendrogram Analysis Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
              Hierarchical Agglomeration Logic
            </span>
            <span className="text-cyan-300 font-bold">
              Pairwise Ward Linkage: ΔESS = (n_A·n_B / (n_A + n_B)) · ||m_A - m_B||²
            </span>
            <div className="text-[11px] text-slate-300 mt-1">
              At each stage, the algorithm greedily merges the two clusters that minimize the increase in total within-cluster variance. No prior specification of K is needed.
            </div>
          </div>
          <div className="p-2.5 bg-[#0a0d16] border border-slate-800 rounded-none">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
              Threshold Cut & Partition Selection
            </span>
            <span className="text-emerald-400 font-bold">
              Horizontal Slice h = 2.80 cuts 3 main branches
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              Cutting across the longest vertical branches isolates the three natural biomarker clusters, demonstrating robust unsupervised taxonomy discovery.
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center p-3 md:p-6 overflow-y-auto bg-transparent">
      <div
        className="w-full max-w-4xl flex flex-col gap-4 transition-transform duration-150"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        {topic === 'linear_regression' && renderLinearRegression()}
        {topic === 'gradient_descent' && renderGradientDescent()}
        {topic === 'polynomial_regression' && renderPolynomialRegression()}
        {topic === 'logistic_regression' && renderLogisticRegression()}
        {topic === 'knn_classification' && renderKnnClassification()}
        {topic === 'decision_tree' && renderDecisionTree()}
        {topic === 'naive_bayes' && renderNaiveBayes()}
        {topic === 'svm' && renderSvm()}
        {topic === 'svm_kernel' && renderSvmKernel()}
        {topic === 'random_forest' && renderRandomForest()}
        {topic === 'adaboost' && renderAdaBoost()}
        {topic === 'gradient_boosting' && renderGradientBoosting()}
        {topic === 'kmeans_clustering' && renderKMeans()}
        {topic === 'dbscan' && renderDbscan()}
        {topic === 'pca' && renderPca()}
        {topic === 'confusion_matrix_metrics' && renderConfusionMatrix()}
        {topic === 'bias_variance_regularization' && renderRegularization()}
        {topic === 'feature_scaling' && renderFeatureScaling()}
        {topic === 'single_perceptron' && renderSinglePerceptron()}
        {topic === 'mlp_backpropagation' && renderMlpBackpropagation()}
        {topic === 'activation_functions' && renderActivationFunctions()}
        {topic === 'cnn_convolution' && renderCnnConvolution()}
        {topic === 'q_learning_grid' && renderQLearningGrid()}
        {topic === 'hierarchical_clustering' && renderHierarchicalClustering()}
      </div>
    </div>
  );
};



