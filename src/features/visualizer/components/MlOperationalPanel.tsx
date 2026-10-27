import React from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';

export const MlOperationalPanel: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const currentStep = useLessonStore(s => s.currentStep);
  const currentStepIndex = useLessonStore(s => s.currentStepIndex);
  const goToStep = useLessonStore(s => s.goToStep);
  const editableValues = useLessonStore(s => s.editableValues) || {};
  const setEditableValue = useLessonStore(s => s.setEditableValue);

  const topic = lesson?.topic || 'linear_regression';
  const mem = currentStep?.memorySnapshot || {};

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0e17] border border-slate-800 text-slate-200 select-none overflow-hidden rounded-none">
      
      {/* ── Header: Topic & Formal Math Definition ── */}
      <div className="p-3 border-b border-slate-800 bg-[#080b12] shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-bold">
            {topic === 'linear_regression'
              ? 'LINEAR REGRESSION'
              : topic === 'gradient_descent'
              ? 'GRADIENT DESCENT'
              : topic === 'polynomial_regression'
              ? 'POLYNOMIAL REGRESSION'
              : topic === 'logistic_regression'
              ? 'LOGISTIC REGRESSION'
              : topic === 'knn_classification'
              ? 'K-NEAREST NEIGHBORS'
              : topic === 'decision_tree'
              ? 'DECISION TREE'
              : topic === 'naive_bayes'
              ? 'NAIVE BAYES CLASSIFIER'
              : topic === 'svm'
              ? 'SUPPORT VECTOR MACHINE'
              : topic === 'svm_kernel'
              ? 'KERNEL SVM (NON-LINEAR)'
              : topic === 'random_forest'
              ? 'RANDOM FOREST'
              : topic === 'adaboost'
              ? 'ADABOOST ENSEMBLE'
              : topic === 'gradient_boosting'
              ? 'GRADIENT BOOSTED TREES'
              : topic === 'kmeans_clustering'
              ? 'K-MEANS CLUSTERING'
              : topic === 'dbscan'
              ? 'DBSCAN DENSITY CLUSTERING'
              : topic === 'pca'
              ? 'PRINCIPAL COMPONENT ANALYSIS'
              : topic === 'confusion_matrix_metrics'
              ? 'EVALUATION METRICS & ROC-AUC'
              : topic === 'bias_variance_regularization'
              ? 'L1 / L2 REGULARIZATION'
              : topic === 'feature_scaling'
              ? 'FEATURE SCALING & NORMALIZATION'
              : topic === 'single_perceptron'
              ? 'SINGLE PERCEPTRON'
              : topic === 'mlp_backpropagation'
              ? 'MLP & BACKPROPAGATION'
              : topic === 'activation_functions'
              ? 'ACTIVATION FUNCTIONS & GRADIENTS'
              : topic === 'cnn_convolution'
              ? 'CNN 2D CONVOLUTION & POOLING'
              : topic === 'q_learning_grid'
              ? 'Q-LEARNING (BELLMAN OPTIMALITY)'
              : topic === 'hierarchical_clustering'
              ? 'HIERARCHICAL CLUSTERING'
              : 'ML SIMULATOR'}
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-none">
            {topic === 'linear_regression'
              ? 'y = mx + c'
              : topic === 'gradient_descent'
              ? 'w ← w - α·∇J'
              : topic === 'polynomial_regression'
              ? 'y = Σ wᵢ·xⁱ'
              : topic === 'logistic_regression'
              ? 'P = 1/(1+e^-z)'
              : topic === 'knn_classification'
              ? 'k-NN Vote'
              : topic === 'decision_tree'
              ? 'Gini = 1 - Σ pᵢ²'
              : topic === 'naive_bayes'
              ? 'P(C|x) ∝ P(C)·P(x|C)'
              : topic === 'svm'
              ? 'Max Margin: 2/||w||'
              : topic === 'svm_kernel'
              ? 'ϕ(x) = [x₁, x₂, x₁²+x₂²]'
              : topic === 'random_forest'
              ? 'ŷ = Mode(T₁...T_B)'
              : topic === 'adaboost'
              ? 'H(x) = sign(Σ αₘ·hₘ)'
              : topic === 'gradient_boosting'
              ? 'Fₘ = Fₘ₋₁ + η·hₘ'
              : topic === 'kmeans_clustering'
              ? 'Min Σ ||xᵢ - μ_k||²'
              : topic === 'dbscan'
              ? 'N_ε(p) ≥ MinPts (3)'
              : topic === 'pca'
              ? 'Σ·v = λ·v (PC1: 89%)'
              : topic === 'confusion_matrix_metrics'
              ? 'F1 = 2·(P·R)/(P+R)'
              : topic === 'bias_variance_regularization'
              ? 'Min MSE + λ·||w||_p'
              : topic === 'feature_scaling'
              ? 'z = (x - μ) / σ'
              : topic === 'single_perceptron'
              ? 'ŷ = step(wᵀx + b)'
              : topic === 'mlp_backpropagation'
              ? 'δˡ = (Wˡ⁺¹)ᵀδˡ⁺¹ ⊙ σ\'(zˡ)'
              : topic === 'activation_functions'
              ? '∂L/∂z = δ, ReLU: f\'=1'
              : topic === 'cnn_convolution'
              ? '(I * K)(i,j) = Σ Σ I·K'
              : topic === 'q_learning_grid'
              ? 'Q ← Q + α[r + γ·max Q - Q]'
              : topic === 'hierarchical_clustering'
              ? 'd(A, B) = min ||a - b||'
              : 'ML MODEL'}
          </span>
        </div>
      </div>

      {/* ── Middle Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">

        {/* ── TOPIC 01: LINEAR REGRESSION CONTROLS ── */}
        {topic === 'linear_regression' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {(editableValues.m !== undefined || editableValues.c !== undefined) && (
                  <button
                    onClick={() => {
                      setEditableValue('m', undefined);
                      setEditableValue('c', undefined);
                    }}
                    className="text-[9px] text-cyan-400 hover:text-cyan-300"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Slope m:</span>
                  <span className="text-cyan-300 font-bold">{(editableValues.m !== undefined ? Number(editableValues.m) : (mem.m !== undefined ? Number(mem.m) : 1.98)).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.5"
                  step="0.05"
                  value={editableValues.m !== undefined ? Number(editableValues.m) : (mem.m !== undefined ? Number(mem.m) : 1.98)}
                  onChange={e => setEditableValue('m', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Intercept c:</span>
                  <span className="text-cyan-300 font-bold">{(editableValues.c !== undefined ? Number(editableValues.c) : (mem.c !== undefined ? Number(mem.c) : 0.22)).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-1.5"
                  max="2.5"
                  step="0.05"
                  value={editableValues.c !== undefined ? Number(editableValues.c) : (mem.c !== undefined ? Number(mem.c) : 0.22)}
                  onChange={e => setEditableValue('c', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Parameters & Model State</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Slope (m)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{editableValues.m !== undefined ? Number(editableValues.m).toFixed(2) : (mem.m !== undefined ? Number(mem.m).toFixed(2) : '1.98')}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Intercept (c)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{editableValues.c !== undefined ? Number(editableValues.c).toFixed(2) : (mem.c !== undefined ? Number(mem.c).toFixed(2) : '0.22')}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Loss (MSE)</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">{mem.mse !== undefined ? Number(mem.mse).toFixed(2) : '0.04'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Phase</div>
                  <div className="text-emerald-400 font-bold text-[11px] mt-1">{mem.phase || 'OPTIMAL'}</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Preset Data Stages</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Init Line
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mid Fit
                </button>
                <button
                  onClick={() => goToStep(5)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 5 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Optimal OLS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 02: GRADIENT DESCENT CONTROLS ── */}
        {topic === 'gradient_descent' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {(editableValues.alpha !== undefined || editableValues.w !== undefined) && (
                  <button
                    onClick={() => {
                      setEditableValue('alpha', undefined);
                      setEditableValue('w', undefined);
                    }}
                    className="text-[9px] text-cyan-400 hover:text-cyan-300"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Learning Rate α:</span>
                  <span className="text-emerald-400 font-bold">{(editableValues.alpha !== undefined ? Number(editableValues.alpha) : (mem.alpha !== undefined ? Number(mem.alpha) : 0.20)).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.45"
                  step="0.01"
                  value={editableValues.alpha !== undefined ? Number(editableValues.alpha) : (mem.alpha !== undefined ? Number(mem.alpha) : 0.20)}
                  onChange={e => setEditableValue('alpha', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-emerald-400 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Probe Weight w:</span>
                  <span className="text-cyan-300 font-bold">{(editableValues.w !== undefined ? Number(editableValues.w) : (mem.w !== undefined ? Number(mem.w) : 4.0)).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-4.0"
                  max="4.0"
                  step="0.1"
                  value={editableValues.w !== undefined ? Number(editableValues.w) : (mem.w !== undefined ? Number(mem.w) : 4.0)}
                  onChange={e => setEditableValue('w', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Descent State Matrix</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Weight (w)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{editableValues.w !== undefined ? Number(editableValues.w).toFixed(3) : (mem.w !== undefined ? Number(mem.w).toFixed(3) : '4.000')}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Loss J(w)</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">{mem.loss !== undefined ? Number(mem.loss).toFixed(3) : '16.000'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Gradient (dJ/dw)</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">{mem.grad !== undefined ? Number(mem.grad).toFixed(3) : '8.000'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Learning Rate (α)</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{editableValues.alpha !== undefined ? Number(editableValues.alpha).toFixed(2) : (mem.alpha !== undefined ? Number(mem.alpha).toFixed(2) : '0.20')}</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Epoch Quick Select</div>
              <div className="grid grid-cols-6 gap-1">
                {[0, 1, 2, 3, 4, 5].map(ep => (
                  <button
                    key={ep}
                    onClick={() => goToStep(ep)}
                    className={`py-1.5 text-[10px] text-center border font-mono rounded-none transition-colors ${
                      currentStepIndex === ep ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    e{ep}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 03: POLYNOMIAL REGRESSION CONTROLS ── */}
        {topic === 'polynomial_regression' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.degree !== undefined && (
                  <button onClick={() => setEditableValue('degree', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">Select Degree d:</span>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 5].map(d => (
                    <button
                      key={d}
                      onClick={() => setEditableValue('degree', d)}
                      className={`py-1 text-[10px] border font-mono rounded-none transition-colors ${
                        (editableValues.degree ?? mem.degree ?? 2) === d
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      d = {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Model Capacity & Errors</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Polynomial Degree</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">d = {editableValues.degree ?? mem.degree ?? 2}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Train Error (MSE)</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{mem.trainMse !== undefined ? Number(mem.trainMse).toFixed(2) : '0.28'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Test Error (MSE)</div>
                  <div className={`font-bold text-sm mt-0.5 ${mem.degree === 5 ? 'text-red-400' : 'text-amber-400'}`}>
                    {mem.testMse !== undefined ? Number(mem.testMse).toFixed(2) : '0.31'}
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Bias-Variance</div>
                  <div className={`font-bold text-[10px] mt-1 ${
                    mem.biasVariance === 'HIGH_BIAS' ? 'text-amber-400' : mem.biasVariance === 'HIGH_VARIANCE' ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {mem.biasVariance || 'OPTIMAL'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Degree Comparison</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  d=1 (Underfit)
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  d=2 (Optimal)
                </button>
                <button
                  onClick={() => goToStep(4)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 4 ? 'bg-red-950/60 border-red-500 text-red-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  d=5 (Overfit)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 04: LOGISTIC REGRESSION CONTROLS ── */}
        {topic === 'logistic_regression' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.threshold !== undefined && (
                  <button onClick={() => setEditableValue('threshold', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Decision Threshold τ:</span>
                  <span className="text-cyan-300 font-bold">{(editableValues.threshold !== undefined ? Number(editableValues.threshold) : 0.50).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={editableValues.threshold !== undefined ? Number(editableValues.threshold) : 0.50}
                  onChange={e => setEditableValue('threshold', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Sigmoid State & Boundary</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Weight (w)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{mem.w !== undefined ? Number(mem.w).toFixed(2) : '2.40'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Bias (b)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{mem.b !== undefined ? Number(mem.b).toFixed(2) : '-8.64'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Boundary (x*)</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">x = {mem.boundaryX !== undefined ? Number(mem.boundaryX).toFixed(2) : '3.60'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Log-Loss</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">{mem.logLoss !== undefined ? Number(mem.logLoss).toFixed(2) : '0.06'}</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Stage Quick Select</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw Data
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sigmoid
                </button>
                <button
                  onClick={() => goToStep(5)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 5 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Boundary
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 05: KNN CLASSIFICATION CONTROLS ── */}
        {topic === 'knn_classification' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {(editableValues.k !== undefined || editableValues.queryX1 !== undefined) && (
                  <button onClick={() => { setEditableValue('k', undefined); setEditableValue('queryX1', undefined); }} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">Neighbor Count k:</span>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 3, 5, 7].map(kVal => (
                    <button
                      key={kVal}
                      onClick={() => setEditableValue('k', kVal)}
                      className={`py-1 text-[10px] border font-mono rounded-none transition-colors ${
                        (editableValues.k ?? mem.k ?? 5) === kVal
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      k = {kVal}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Query Point X₁:</span>
                  <span className="text-cyan-300 font-bold">{(editableValues.queryX1 !== undefined ? Number(editableValues.queryX1) : 4.2).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="6.5"
                  step="0.1"
                  value={editableValues.queryX1 !== undefined ? Number(editableValues.queryX1) : 4.2}
                  onChange={e => setEditableValue('queryX1', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Neighborhood Voting Matrix</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">k Parameter</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">k = {editableValues.k ?? mem.k ?? 5}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Search Radius</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">R = {mem.radius ? Number(mem.radius).toFixed(2) : '2.15'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Votes (A vs B)</div>
                  <div className="text-slate-200 font-bold text-sm mt-0.5">
                    <span className="text-amber-400">{mem.votes?.A ?? 2} A</span> : <span className="text-cyan-400">{mem.votes?.B ?? 3} B</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Decision</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">
                    Class {mem.assignedClass || 'B'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">k Value Sweep</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  k = 1 (Noisy)
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  k = 3 (Balanced)
                </button>
                <button
                  onClick={() => goToStep(4)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 4 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  k = 5 (Robust)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 06: DECISION TREE CONTROLS ── */}
        {topic === 'decision_tree' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.splitX1 !== undefined && (
                  <button onClick={() => setEditableValue('splitX1', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Split Threshold X₁:</span>
                  <span className="text-emerald-400 font-bold">{(editableValues.splitX1 !== undefined ? Number(editableValues.splitX1) : 3.5).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="6.0"
                  step="0.1"
                  value={editableValues.splitX1 !== undefined ? Number(editableValues.splitX1) : 3.5}
                  onChange={e => setEditableValue('splitX1', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Impurity & Partition State</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Tree Depth</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">d = {mem.depth ?? 2}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Gini Impurity</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">{mem.gini !== undefined ? Number(mem.gini).toFixed(2) : '0.00'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Splits Made</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">{mem.splits?.length ?? 2} Axis Cuts</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Leaf Purity</div>
                  <div className="text-emerald-400 font-bold text-[11px] mt-1">100% PURE</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Partition Steps</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Root Mixed
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Split 1 (X1)
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Split 2 (X2)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 07: NAIVE BAYES CONTROLS ── */}
        {topic === 'naive_bayes' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.prior0 !== undefined && (
                  <button onClick={() => setEditableValue('prior0', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Prior P(C₀):</span>
                  <span className="text-amber-400 font-bold">{(editableValues.prior0 !== undefined ? Number(editableValues.prior0) : 0.50).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={editableValues.prior0 !== undefined ? Number(editableValues.prior0) : 0.50}
                  onChange={e => setEditableValue('prior0', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Class Priors & Gaussian Parameters</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-amber-400 text-[10px] font-bold">Class 0 (Prior {(editableValues.prior0 !== undefined ? Number(editableValues.prior0) : 0.50).toFixed(2)})</div>
                  <div className="text-slate-300 text-[11px] mt-0.5">μ₀ = {mem.mu0 ?? 3.0}, σ₀ = {mem.std0 ?? 1.0}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-cyan-400 text-[10px] font-bold">Class 1 (Prior {(1 - (editableValues.prior0 !== undefined ? Number(editableValues.prior0) : 0.50)).toFixed(2)})</div>
                  <div className="text-slate-300 text-[11px] mt-0.5">μ₁ = {mem.mu1 ?? 6.0}, σ₁ = {mem.std1 ?? 1.2}</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Posterior Inference (x = {mem.xQuery ?? 4.8})</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Likelihood P(x|C₀)</div>
                  <div className="text-amber-300 font-bold text-sm mt-0.5">{mem.lik0 !== undefined ? Number(mem.lik0).toFixed(3) : '0.079'}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">P(C₀|x): {mem.post0 !== undefined ? `${(Number(mem.post0) * 100).toFixed(1)}%` : '28.5%'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Likelihood P(x|C₁)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{mem.lik1 !== undefined ? Number(mem.lik1).toFixed(3) : '0.198'}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">P(C₁|x): {mem.post1 !== undefined ? `${(Number(mem.post1) * 100).toFixed(1)}%` : '71.5%'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Bayes Threshold (x*)</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">{mem.boundaryX ?? 4.35}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">MAP Decision</div>
                  <div className="text-emerald-400 font-bold text-[11px] mt-1">{mem.decision || 'PENDING'}</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Preset Inference Stages</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Gaussian Fits
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Probe (x=4.8)
                </button>
                <button
                  onClick={() => goToStep(4)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 4 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Posterior Normalization
                </button>
                <button
                  onClick={() => goToStep(5)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 5 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  MAP Decision
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 08: SUPPORT VECTOR MACHINE (SVM) CONTROLS ── */}
        {topic === 'svm' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.margin !== undefined && (
                  <button onClick={() => setEditableValue('margin', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Margin Width (2/||w||):</span>
                  <span className="text-emerald-400 font-bold">{(editableValues.margin !== undefined ? Number(editableValues.margin) : 1.58).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.6"
                  step="0.1"
                  value={editableValues.margin !== undefined ? Number(editableValues.margin) : 1.58}
                  onChange={e => setEditableValue('margin', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Hyperplane & Margin State</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Weight Vector (w)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">
                    [{mem.w1 !== undefined ? Number(mem.w1).toFixed(2) : '1.20'}, {mem.w2 !== undefined ? Number(mem.w2).toFixed(2) : '0.40'}]
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Bias (b)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{mem.b !== undefined ? Number(mem.b).toFixed(2) : '4.80'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Margin Width (2/||w||)</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{editableValues.margin !== undefined ? Number(editableValues.margin).toFixed(2) : (mem.margin !== undefined ? Number(mem.margin).toFixed(2) : '1.58')}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Support Vectors</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">
                    {Array.isArray(mem.supportVectorIds) ? `${mem.supportVectorIds.length} Points` : '3 Points'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Optimization Presets</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw Data
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Suboptimal Cut
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Max Margin
                </button>
                <button
                  onClick={() => goToStep(4)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 4 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Support Vectors
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 09: KERNEL SVM CONTROLS ── */}
        {topic === 'svm_kernel' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.gamma !== undefined && (
                  <button onClick={() => setEditableValue('gamma', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">RBF Gamma γ:</span>
                  <span className="text-purple-300 font-bold">{(editableValues.gamma !== undefined ? Number(editableValues.gamma) : 1.0).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={editableValues.gamma !== undefined ? Number(editableValues.gamma) : 1.0}
                  onChange={e => setEditableValue('gamma', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-purple-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Kernel Projection & Boundary</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Mapping ϕ(x)</div>
                  <div className="text-purple-300 font-bold text-[11px] mt-0.5">[x₁, x₂, x₁²+x₂²]</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">3D Plane Slice</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">z = 4.41</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">2D Cut Radius (r)</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{mem.radiusThreshold ? `${mem.radiusThreshold}` : '2.10'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Accuracy</div>
                  <div className={`font-bold text-sm mt-0.5 ${Number(mem.accuracy) > 90 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {mem.accuracy !== undefined ? `${Number(mem.accuracy).toFixed(1)}%` : '100.0%'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Space Projection Stages</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Concentric 2D
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-rose-950/60 border-rose-500 text-rose-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Linear Cut Fail
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  3D Elevation
                </button>
                <button
                  onClick={() => goToStep(4)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 4 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  2D Circular Cut
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 10: RANDOM FOREST CONTROLS ── */}
        {topic === 'random_forest' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.forestSize !== undefined && (
                  <button onClick={() => setEditableValue('forestSize', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">Tree Count B:</span>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 3, 5, 9].map(bVal => (
                    <button
                      key={bVal}
                      onClick={() => setEditableValue('forestSize', bVal)}
                      className={`py-1 text-[10px] border font-mono rounded-none transition-colors ${
                        (editableValues.forestSize ?? 3) === bVal
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      B = {bVal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Ensemble Bagging State</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Forest Size</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">B = {editableValues.forestSize ?? 3} Trees</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Query Point Q</div>
                  <div className="text-purple-300 font-bold text-[11px] mt-0.5">(3.50, 4.80)</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Vote Tally</div>
                  <div className="text-slate-200 font-bold text-[11px] mt-0.5">
                    <span className="text-cyan-400">Cyan: {mem.tally?.class1 ?? 2}</span> | <span className="text-amber-400">Amb: {mem.tally?.class0 ?? 1}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Variance Drop</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{mem.varianceReduction || '58%'}</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Voting Stages</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw Dataset
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  3 Bootstrap Trees
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tree 1 Vote
                </button>
                <button
                  onClick={() => goToStep(5)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 5 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Majority Winner
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 11: ADABOOST CONTROLS ── */}
        {topic === 'adaboost' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.boostRounds !== undefined && (
                  <button onClick={() => setEditableValue('boostRounds', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">Boosting Rounds M:</span>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map(mVal => (
                    <button
                      key={mVal}
                      onClick={() => setEditableValue('boostRounds', mVal)}
                      className={`py-1 text-[10px] border font-mono rounded-none transition-colors ${
                        (editableValues.boostRounds ?? 3) === mVal
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      M = {mVal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Sequential Stump Metrics</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Active Stump</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">m = {mem.stumpIndex ?? 1} / {editableValues.boostRounds ?? 3}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Stump Weight (αₘ)</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">{mem.alpha !== undefined ? Number(mem.alpha).toFixed(3) : '0.549'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Weighted Error (εₘ)</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">{mem.errorRate !== undefined ? `${(Number(mem.errorRate) * 100).toFixed(1)}%` : '25.0%'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Penalized Samples</div>
                  <div className="text-rose-400 font-bold text-[11px] mt-1">
                    {Array.isArray(mem.misclassifiedIds) && mem.misclassifiedIds.length > 0 ? `#${mem.misclassifiedIds.join(', #')}` : 'None (0 Error)'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Adaptive Rounds</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Uniform (w=1/8)
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Stump 1 Cut
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Re-weighting
                </button>
                <button
                  onClick={() => goToStep(5)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 5 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Strong Classifier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 12: GRADIENT BOOSTING CONTROLS ── */}
        {topic === 'gradient_boosting' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {(editableValues.gbdtEta !== undefined || editableValues.gbdtTrees !== undefined) && (
                  <button onClick={() => { setEditableValue('gbdtEta', undefined); setEditableValue('gbdtTrees', undefined); }} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Learning Rate η:</span>
                  <span className="text-purple-300 font-bold">{(editableValues.gbdtEta !== undefined ? Number(editableValues.gbdtEta) : 0.40).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.50"
                  step="0.05"
                  value={editableValues.gbdtEta !== undefined ? Number(editableValues.gbdtEta) : 0.40}
                  onChange={e => setEditableValue('gbdtEta', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-purple-400 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">Tree Count M:</span>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 5].map(mVal => (
                    <button
                      key={mVal}
                      onClick={() => setEditableValue('gbdtTrees', mVal)}
                      className={`py-1 text-[10px] border font-mono rounded-none transition-colors ${
                        (editableValues.gbdtTrees ?? 3) === mVal
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      M = {mVal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">GBDT Residual Fit Metrics</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Boost Stage</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">m = {mem.stage ?? 0} / {editableValues.gbdtTrees ?? 3}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Shrinkage (η)</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">{editableValues.gbdtEta !== undefined ? Number(editableValues.gbdtEta).toFixed(2) : (mem.eta ?? 0.40)}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Residual MSE Loss</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">{mem.mse !== undefined ? Number(mem.mse).toFixed(2) : '6.82'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Convergence</div>
                  <div className="text-emerald-400 font-bold text-[11px] mt-1">
                    {mem.stage === 0 ? 'Baseline (Mean)' : mem.stage === 1 ? '-64% MSE' : mem.stage === 2 ? '-89% MSE' : '-98% Optimal'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Sequential Stages</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Stage 0 (Mean)
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Residuals
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tree 1 Fit
                </button>
                <button
                  onClick={() => goToStep(4)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 4 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Final GBDT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 13: K-MEANS CLUSTERING CONTROLS ── */}
        {topic === 'kmeans_clustering' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.clusterK !== undefined && (
                  <button onClick={() => setEditableValue('clusterK', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">Clusters K:</span>
                <div className="grid grid-cols-3 gap-1">
                  {[2, 3, 4].map(kVal => (
                    <button
                      key={kVal}
                      onClick={() => setEditableValue('clusterK', kVal)}
                      className={`py-1 text-[10px] border font-mono rounded-none transition-colors ${
                        (editableValues.clusterK ?? 3) === kVal
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      K = {kVal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Clustering Inertia & Centroids</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Clusters K</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">K = {editableValues.clusterK ?? 3}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Iteration</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">Iter {mem.iteration ?? 0} / 3</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">WCSS Inertia</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">{mem.wcss !== undefined ? Number(mem.wcss).toFixed(1) : '124.6'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Status</div>
                  <div className="text-emerald-400 font-bold text-[11px] mt-1">
                    {mem.phase === 'CONVERGED' ? 'Optimal Converged' : mem.phase === 'RAW_UNLABELLED' ? 'Unassigned' : 'Iterating'}
                  </div>
                </div>
              </div>
            </div>

            {/* Centroids Coordinates */}
            {Array.isArray(mem.centroids) && (mem.centroids as any[]).length > 0 && (
              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-1.5">Centroid Coordinates (μ_k)</div>
                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  {(mem.centroids as Array<{ id: number; x: number; y: number; label: string }>).map((c, i) => (
                    <div key={i} className="p-1.5 bg-slate-900 border border-slate-800 text-center">
                      <div className={i === 0 ? 'text-amber-400 font-bold' : i === 1 ? 'text-cyan-400 font-bold' : 'text-purple-400 font-bold'}>
                        C{i}
                      </div>
                      <div className="text-slate-300 mt-0.5">({c.x.toFixed(2)}, {c.y.toFixed(2)})</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Clustering Stages</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw Data
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Seeds (K=3)
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Assignment
                </button>
                <button
                  onClick={() => goToStep(4)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 4 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Converged
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 14: DBSCAN DENSITY CLUSTERING CONTROLS ── */}
        {topic === 'dbscan' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {(editableValues.eps !== undefined || editableValues.minPts !== undefined) && (
                  <button onClick={() => { setEditableValue('eps', undefined); setEditableValue('minPts', undefined); }} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Radius ε:</span>
                  <span className="text-cyan-300 font-bold">{(editableValues.eps !== undefined ? Number(editableValues.eps) : 1.20).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.1"
                  value={editableValues.eps !== undefined ? Number(editableValues.eps) : 1.20}
                  onChange={e => setEditableValue('eps', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">MinPts:</span>
                <div className="grid grid-cols-3 gap-1">
                  {[2, 3, 4].map(pts => (
                    <button
                      key={pts}
                      onClick={() => setEditableValue('minPts', pts)}
                      className={`py-1 text-[10px] border font-mono rounded-none transition-colors ${
                        (editableValues.minPts ?? 3) === pts
                          ? 'bg-purple-950/70 border-purple-500 text-purple-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      MinPts = {pts}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Density Neighborhood Thresholds</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Radius (ε)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">ε = {editableValues.eps !== undefined ? Number(editableValues.eps).toFixed(2) : (mem.eps ?? 1.20)}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Min Points</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">MinPts ≥ {editableValues.minPts ?? mem.minPts ?? 3}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Core Points</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{mem.coreCount ?? 0} Identified</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Noise Outliers</div>
                  <div className="text-rose-400 font-bold text-sm mt-0.5">{mem.noiseCount ?? 0} Isolated (-1)</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Algorithm Steps</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Parameters
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Core Detection
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cluster Reach
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-rose-950/60 border-rose-500 text-rose-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Noise Outliers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 15: PCA DIMENSIONALITY REDUCTION CONTROLS ── */}
        {topic === 'pca' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.pcaDim !== undefined && (
                  <button onClick={() => setEditableValue('pcaDim', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">Projection Subspace:</span>
                <div className="grid grid-cols-2 gap-1">
                  {['1d', '2d'].map(dim => (
                    <button
                      key={dim}
                      onClick={() => setEditableValue('pcaDim', dim)}
                      className={`py-1 text-[10px] border font-mono rounded-none transition-colors ${
                        (editableValues.pcaDim ?? '1d') === dim
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {dim === '1d' ? '1D (PC1 Eigen)' : '2D (Raw Manifold)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Eigen Decomposition & Variance</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Dimension Reduction</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{editableValues.pcaDim === '2d' ? '2D (Raw)' : '2D → 1D (PC1)'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Variance Retained</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{editableValues.pcaDim === '2d' ? '100%' : (mem.varianceExplained ?? '89.4%')}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Centroid (x̄₁, x̄₂)</div>
                  <div className="text-amber-400 font-bold text-[11px] mt-1">({mem.meanX ?? '4.72'}, {mem.meanY ?? '4.54'})</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">PC1 Vector</div>
                  <div className="text-purple-300 font-bold text-[11px] mt-1">{mem.pc1 ? `[${mem.pc1.v1}, ${mem.pc1.v2}]` : 'Pending'}</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Projection Steps</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw 2D Data
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mean Centering
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  PC1 Vector
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1D Projection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 16: CONFUSION MATRIX & ROC-AUC CONTROLS ── */}
        {topic === 'confusion_matrix_metrics' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.threshold !== undefined && (
                  <button onClick={() => setEditableValue('threshold', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Operating Cut τ:</span>
                  <span className="text-cyan-300 font-bold">{(editableValues.threshold !== undefined ? Number(editableValues.threshold) : 0.50).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={editableValues.threshold !== undefined ? Number(editableValues.threshold) : 0.50}
                  onChange={e => setEditableValue('threshold', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Decision Cut & Classification Metrics</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Decision Cut (τ)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">τ = {editableValues.threshold !== undefined ? Number(editableValues.threshold).toFixed(2) : (mem.threshold !== undefined ? Number(mem.threshold).toFixed(2) : '0.50')}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Accuracy</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{mem.accuracy !== undefined ? (mem.accuracy * 100).toFixed(1) + '%' : '82.5%'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Precision / Recall</div>
                  <div className="text-slate-200 font-bold text-[11px] mt-1">
                    <span className="text-amber-400">{mem.precision !== undefined ? (mem.precision * 100).toFixed(1) + '%' : '84.2%'}</span>
                    <span className="text-slate-500"> / </span>
                    <span className="text-purple-400">{mem.recall !== undefined ? (mem.recall * 100).toFixed(1) + '%' : '80.0%'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">F1 / ROC-AUC</div>
                  <div className="text-cyan-400 font-bold text-[11px] mt-1">
                    F1: {mem.f1 !== undefined ? Number(mem.f1).toFixed(2) : '0.82'} | AUC: {mem.auc ?? 0.91}
                  </div>
                </div>
              </div>
            </div>

            {/* 2x2 Matrix Mini Grid */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">2×2 Confusion Matrix (N = {mem.total ?? 40})</div>
              <div className="grid grid-cols-2 gap-1.5 text-center text-[10px]">
                <div className="p-2 bg-emerald-950/40 border border-emerald-700/60">
                  <div className="text-emerald-400 font-bold">TP: {mem.tp ?? 16}</div>
                  <div className="text-slate-400 text-[9px]">True Positive</div>
                </div>
                <div className="p-2 bg-rose-950/40 border border-rose-700/60">
                  <div className="text-rose-400 font-bold">FP: {mem.fp ?? 3}</div>
                  <div className="text-slate-400 text-[9px]">Type I Error</div>
                </div>
                <div className="p-2 bg-rose-950/40 border border-rose-700/60">
                  <div className="text-rose-400 font-bold">FN: {mem.fn ?? 4}</div>
                  <div className="text-slate-400 text-[9px]">Type II Error</div>
                </div>
                <div className="p-2 bg-cyan-950/40 border border-cyan-700/60">
                  <div className="text-cyan-400 font-bold">TN: {mem.tn ?? 17}</div>
                  <div className="text-slate-400 text-[9px]">True Negative</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Threshold Operating Presets</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Balanced (τ=0.50)
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  High Recall (τ=0.30)
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  High Precision (τ=0.70)
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ROC-AUC Sweep
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 17: BIAS-VARIANCE REGULARIZATION (L1/L2) CONTROLS ── */}
        {topic === 'bias_variance_regularization' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {(editableValues.lambdaVal !== undefined || editableValues.regType !== undefined) && (
                  <button onClick={() => { setEditableValue('lambdaVal', undefined); setEditableValue('regType', undefined); }} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Penalty λ:</span>
                  <span className="text-cyan-300 font-bold">{(editableValues.lambdaVal !== undefined ? Number(editableValues.lambdaVal) : 1.5).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="5.0"
                  step="0.1"
                  value={editableValues.lambdaVal !== undefined ? Number(editableValues.lambdaVal) : 1.5}
                  onChange={e => setEditableValue('lambdaVal', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">Norm Constraint:</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'none', label: 'None (OLS)' },
                    { id: 'l2', label: 'L2 (Ridge)' },
                    { id: 'l1', label: 'L1 (Lasso)' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setEditableValue('regType', t.id)}
                      className={`py-1 text-[10px] border font-mono rounded-none transition-colors ${
                        (editableValues.regType ?? 'l2') === t.id
                          ? 'bg-purple-950/70 border-purple-500 text-purple-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Regularization & Weight Shrinkage</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Penalty (λ)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">λ = {editableValues.lambdaVal !== undefined ? Number(editableValues.lambdaVal).toFixed(1) : (mem.lambdaVal !== undefined ? Number(mem.lambdaVal).toFixed(1) : '1.5')}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Test Error</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{mem.testError !== undefined ? Number(mem.testError).toFixed(2) : '0.92'}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Coefficients (w₁, w₂)</div>
                  <div className="text-slate-200 font-bold text-[11px] mt-1">
                    w₁: <span className="text-cyan-400">{mem.w1 !== undefined ? Number(mem.w1).toFixed(2) : '1.62'}</span> | w₂: <span className={mem.w2 === 0 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{mem.w2 !== undefined ? Number(mem.w2).toFixed(2) : '-0.42'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Bias² vs Variance</div>
                  <div className="text-slate-300 text-[10px] mt-1">
                    B²: {mem.biasSq ?? 0.04} | Var: {mem.variance ?? 0.88}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Constraint Geometries</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  OLS (λ=0)
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  L2 Ridge (Circle)
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  L1 Lasso (Sparsity)
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sweetspot Curve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 18: FEATURE SCALING & NORMALIZATION CONTROLS ── */}
        {topic === 'feature_scaling' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.method !== undefined && (
                  <button onClick={() => setEditableValue('method', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">Scaler Operator:</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'unscaled', label: 'Raw (Unscaled)' },
                    { id: 'standard', label: 'StandardScaler' },
                    { id: 'minmax', label: 'MinMaxScaler' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setEditableValue('method', m.id)}
                      className={`py-1 text-[10px] border font-mono rounded-none transition-colors ${
                        (editableValues.method ?? 'unscaled') === m.id
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Conditioning & GD Convergence</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Scaling Transform</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{editableValues.method ? String(editableValues.method).toUpperCase() : (mem.method ? String(mem.method).toUpperCase() : 'RAW')}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Condition Number (κ)</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">κ = {editableValues.method === 'standard' ? 1.0 : editableValues.method === 'minmax' ? 1.4 : 120.0}</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">GD Steps Needed</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">{editableValues.method === 'standard' ? 8 : editableValues.method === 'minmax' ? 12 : 145} Iterations</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Descent Trajectory</div>
                  <div className="text-emerald-400 font-bold text-[11px] mt-1">{editableValues.method && editableValues.method !== 'unscaled' ? 'Smooth Direct' : (mem.convergenceStatus ?? 'Oscillation')}</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Scaling Methods</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw (Ravine)
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  StandardScaler
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  MinMax [0, 1]
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  18x Speedup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 19: SINGLE PERCEPTRON CONTROLS ── */}
        {topic === 'single_perceptron' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {(editableValues.w1 !== undefined || editableValues.b !== undefined || editableValues.gate !== undefined) && (
                  <button onClick={() => { setEditableValue('w1', undefined); setEditableValue('b', undefined); setEditableValue('gate', undefined); }} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Weight w₁:</span>
                  <span className="text-cyan-300 font-bold">{(editableValues.w1 !== undefined ? Number(editableValues.w1) : 0.6).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.05"
                  value={editableValues.w1 !== undefined ? Number(editableValues.w1) : 0.6}
                  onChange={e => setEditableValue('w1', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Bias b:</span>
                  <span className="text-amber-300 font-bold">{(editableValues.b !== undefined ? Number(editableValues.b) : -0.9).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-2.0"
                  max="1.0"
                  step="0.05"
                  value={editableValues.b !== undefined ? Number(editableValues.b) : -0.9}
                  onChange={e => setEditableValue('b', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-amber-400 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">Target Logic Gate:</span>
                <div className="grid grid-cols-3 gap-1">
                  {['AND', 'OR', 'XOR'].map(g => (
                    <button
                      key={g}
                      onClick={() => setEditableValue('gate', g)}
                      className={`py-1 text-[10px] border font-mono rounded-none transition-colors ${
                        (editableValues.gate ?? 'AND') === g
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Synaptic Parameters & Gate Status</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Gate Task</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{editableValues.gate ?? mem.gate ?? 'AND'} Logic Gate</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Epoch & Learning Rate</div>
                  <div className="text-purple-300 font-bold text-[11px] mt-1">Epoch {mem.epoch ?? 0} (η = {mem.eta ?? 0.20})</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Weights (w₁, w₂, b)</div>
                  <div className="text-amber-400 font-bold text-[11px] mt-1">
                    w₁: {editableValues.w1 !== undefined ? Number(editableValues.w1).toFixed(2) : (mem.w1 !== undefined ? Number(mem.w1).toFixed(2) : '0.60')} | w₂: 0.60 | b: {editableValues.b !== undefined ? Number(editableValues.b).toFixed(2) : (mem.b !== undefined ? Number(mem.b).toFixed(2) : '-0.90')}
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Classification Status</div>
                  <div className="text-emerald-400 font-bold text-[11px] mt-1">
                    {editableValues.gate === 'XOR' ? 'Linearly Inseparable' : 'Epoch Active'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Training Steps & XOR Limit</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Init Weights
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Weight Update
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  AND Solved
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-rose-950/60 border-rose-500 text-rose-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  XOR Dilemma
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 20: MULTI-LAYER PERCEPTRON (BACKPROP) CONTROLS ── */}
        {topic === 'mlp_backpropagation' && (
          <div className="space-y-3">
            {/* Interactive Semi-Dynamic Tuning */}
            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Interactive Tuning</span>
                {editableValues.learningRate !== undefined && (
                  <button onClick={() => setEditableValue('learningRate', undefined)} className="text-[9px] text-cyan-400 hover:text-cyan-300">Reset</button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Learning Rate η:</span>
                  <span className="text-cyan-300 font-bold">{(editableValues.learningRate !== undefined ? Number(editableValues.learningRate) : 0.20).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={editableValues.learningRate !== undefined ? Number(editableValues.learningRate) : 0.20}
                  onChange={e => setEditableValue('learningRate', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Network State & Backpropagation</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Architecture</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">2 → 2 → 1 MLP</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Output vs Target</div>
                  <div className="text-purple-300 font-bold text-[11px] mt-1">ŷ = {editableValues.learningRate !== undefined ? Math.min(0.96, 0.38 + 0.9 * Number(editableValues.learningRate)).toFixed(2) : (mem.yHat ?? '0.38')} (y = 1)</div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Cross-Entropy Loss</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">
                    L = {editableValues.learningRate !== undefined ? (0.967 * Math.exp(-2.0 * Number(editableValues.learningRate))).toFixed(3) : (mem.loss !== undefined ? Number(mem.loss).toFixed(3) : '0.967')}
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Output Error Gradient</div>
                  <div className="text-rose-400 font-bold text-[11px] mt-1">δ^[2] = {mem.delta2 ?? -0.62}</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Backpropagation Sequence</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => goToStep(0)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Forward Pass
                </button>
                <button
                  onClick={() => goToStep(1)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 1 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Loss Evaluation
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 2 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Backprop Flow
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                    currentStepIndex === 3 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  XOR Solved
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOPIC 21: ACTIVATION FUNCTIONS CONTROLS ── */}
        {topic === 'activation_functions' && (() => {
          const effFn = (editableValues.currentFn as string) || (mem.currentFn as string) || 'sigmoid';
          const effZ = editableValues.probeZ !== undefined ? Number(editableValues.probeZ) : (mem.probeZ !== undefined ? Number(mem.probeZ) : 2.2);
          let effOut = 0;
          let effGrad = 0;
          if (effFn === 'sigmoid') {
            effOut = 1 / (1 + Math.exp(-effZ));
            effGrad = effOut * (1 - effOut);
          } else if (effFn === 'tanh') {
            effOut = Math.tanh(effZ);
            effGrad = 1 - Math.pow(effOut, 2);
          } else {
            effOut = Math.max(0, effZ);
            effGrad = effZ > 0 ? 1 : 0;
          }
          const effDeep = Math.pow(effGrad, 4);

          return (
            <div className="space-y-3">
              {/* Interactive Semi-Dynamic Tuning */}
              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                  <span>Interactive Tuning</span>
                  {(editableValues.probeZ !== undefined || editableValues.currentFn !== undefined) && (
                    <button
                      onClick={() => {
                        setEditableValue('probeZ', undefined);
                        setEditableValue('currentFn', undefined);
                      }}
                      className="text-[9px] text-cyan-400 hover:text-cyan-300"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Input z Probe Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Input Probe z:</span>
                    <span className="text-purple-300 font-bold">{effZ.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-3.5"
                    max="3.5"
                    step="0.1"
                    value={effZ}
                    onChange={e => setEditableValue('probeZ', parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 accent-purple-400 cursor-pointer"
                  />
                </div>

                {/* Activation Function Selector */}
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400">Activation Function:</div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['sigmoid', 'tanh', 'relu'] as const).map(fn => (
                      <button
                        key={fn}
                        onClick={() => setEditableValue('currentFn', fn)}
                        className={`py-1 px-1.5 text-[10px] text-center border font-mono transition-colors rounded-none uppercase ${
                          effFn === fn
                            ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {fn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Activation & Vanishing Gradient Check</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Activation Function</div>
                    <div className="text-cyan-300 font-bold text-sm mt-0.5">{effFn.toUpperCase()}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Probe Input z</div>
                    <div className="text-purple-300 font-bold text-sm mt-0.5">z = {effZ.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Output f(z) / Gradient f'(z)</div>
                    <div className="text-slate-200 font-bold text-[11px] mt-1">
                      f: <span className="text-cyan-400">{effOut.toFixed(3)}</span> | f': <span className={effGrad < 0.1 ? 'text-rose-400' : 'text-emerald-400'}>{effGrad.toFixed(3)}</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">4-Layer Signal Retention</div>
                    <div className={effDeep < 0.05 ? 'text-rose-400 font-bold text-[11px] mt-1' : 'text-emerald-400 font-bold text-[11px] mt-1'}>
                      {effDeep.toFixed(4)} ({effDeep < 0.05 ? 'Vanished' : 'Intact'})
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Activation Modes</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => goToStep(0)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 0 ? 'bg-rose-950/60 border-rose-500 text-rose-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sigmoid (Saturate)
                  </button>
                  <button
                    onClick={() => goToStep(1)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 1 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tanh (Zero-Center)
                  </button>
                  <button
                    onClick={() => goToStep(2)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 2 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ReLU (Const Grad)
                  </button>
                  <button
                    onClick={() => goToStep(3)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 3 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Deep Comparison
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── TOPIC 22: CNN CONVOLUTION CONTROLS ── */}
        {topic === 'cnn_convolution' && (() => {
          const currentKernel = (editableValues.kernelType as string) || 'sobel';
          const kernelLabel = currentKernel === 'sharpen' ? '3×3 Sharpen' : currentKernel === 'blur' ? '3×3 Gaussian Blur' : '3×3 Sobel (Edge)';

          return (
            <div className="space-y-3">
              {/* Benchmark Dataset Attribution Badge */}
              <div className="border border-cyan-800/60 bg-cyan-950/20 p-2 rounded-none">
                <div className="text-[10px] uppercase text-cyan-400 font-bold flex items-center justify-between">
                  <span>Dataset Attribution</span>
                  <span className="text-[9px] text-cyan-300/80 bg-cyan-900/50 px-1.5 py-0.2 border border-cyan-700/60">Benchmark Classification</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-1">
                  6x6 2D Feature Map constructed from Biomarker <span className="text-cyan-300 font-bold">X₁</span> & <span className="text-cyan-300 font-bold">X₂</span> spatial density grid across 3 classes.
                </div>
              </div>

              {/* Interactive Semi-Dynamic Tuning */}
              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                  <span>Interactive Tuning</span>
                  {editableValues.kernelType !== undefined && (
                    <button
                      onClick={() => setEditableValue('kernelType', undefined)}
                      className="text-[9px] text-cyan-400 hover:text-cyan-300"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Kernel Filter:</span>
                    <span className="text-cyan-300 font-bold">{kernelLabel}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'sobel', label: 'Sobel Edge' },
                      { id: 'sharpen', label: 'Sharpen' },
                      { id: 'blur', label: 'Gaussian Blur' },
                    ].map(k => (
                      <button
                        key={k.id}
                        onClick={() => setEditableValue('kernelType', k.id)}
                        className={`py-1 px-1.5 text-[10px] text-center border font-mono transition-colors rounded-none ${
                          currentKernel === k.id
                            ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {k.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Convolution & Pooling Hyperparameters</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Kernel Operator</div>
                    <div className="text-cyan-300 font-bold text-sm mt-0.5">{kernelLabel}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Stride & Padding</div>
                    <div className="text-slate-200 font-bold text-sm mt-0.5">s = 1 (Valid)</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Feature Map Size</div>
                    <div className="text-purple-300 font-bold text-sm mt-0.5">4×4 Output (16 cells)</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Max-Pooling Kernel</div>
                    <div className="text-emerald-300 font-bold text-sm mt-0.5">2×2 (75% Reduction)</div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Active Sliding State</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Active Window (r, c)</div>
                    <div className="text-amber-300 font-bold text-sm mt-0.5">
                      ({mem.windowPos?.r ?? 0}, {mem.windowPos?.c ?? 0})
                    </div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Convolved Dot Product Σ(I·K)</div>
                    <div className="text-cyan-300 font-bold text-sm mt-0.5">
                      {mem.computedVal !== undefined ? Number(mem.computedVal).toFixed(1) : '16.0'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Stage Progression Presets</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => goToStep(0)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    6x6 Input Matrix
                  </button>
                  <button
                    onClick={() => goToStep(1)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 1 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sliding 3x3 Window
                  </button>
                  <button
                    onClick={() => goToStep(2)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 2 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    4x4 Feature Map
                  </button>
                  <button
                    onClick={() => goToStep(3)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 3 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    2x2 Max-Pooling
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── TOPIC 23: Q-LEARNING GRIDWORLD CONTROLS ── */}
        {topic === 'q_learning_grid' && (() => {
          const effEps = editableValues.epsilon !== undefined ? Number(editableValues.epsilon) : (mem.epsilon !== undefined ? Number(mem.epsilon) : 0.30);
          const effGamma = editableValues.gamma !== undefined ? Number(editableValues.gamma) : 0.90;
          const effTd = editableValues.epsilon !== undefined ? (0.45 * effEps * effGamma) : (mem.tdError !== undefined ? Number(mem.tdError) : 0.0);

          return (
            <div className="space-y-3">
              {/* Benchmark Dataset Attribution Badge */}
              <div className="border border-emerald-800/60 bg-emerald-950/20 p-2 rounded-none">
                <div className="text-[10px] uppercase text-emerald-400 font-bold flex items-center justify-between">
                  <span>Manifold Attribution</span>
                  <span className="text-[9px] text-emerald-300/80 bg-emerald-900/50 px-1.5 py-0.2 border border-emerald-700/60">Benchmark Regression</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-1">
                  4×4 State Space discretized from Engine Load vs Temperature response surface with sweetspot peak at (3,3).
                </div>
              </div>

              {/* Interactive Semi-Dynamic Tuning */}
              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                  <span>Interactive Tuning</span>
                  {(editableValues.epsilon !== undefined || editableValues.gamma !== undefined) && (
                    <button
                      onClick={() => {
                        setEditableValue('epsilon', undefined);
                        setEditableValue('gamma', undefined);
                      }}
                      className="text-[9px] text-cyan-400 hover:text-cyan-300"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Exploration Rate Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Exploration Rate ε:</span>
                    <span className="text-amber-300 font-bold">{effEps.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.80"
                    step="0.05"
                    value={effEps}
                    onChange={e => setEditableValue('epsilon', parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Discount Factor Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Discount Factor γ:</span>
                    <span className="text-cyan-300 font-bold">{effGamma.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="0.99"
                    step="0.01"
                    value={effGamma}
                    onChange={e => setEditableValue('gamma', parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">RL Hyperparameters & State</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Learning Rate (α) / Disc (γ)</div>
                    <div className="text-cyan-300 font-bold text-sm mt-0.5">α=0.20 | γ={effGamma.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Exploration (ε)</div>
                    <div className="text-amber-300 font-bold text-sm mt-0.5">ε = {effEps.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Agent Position (r, c)</div>
                    <div className="text-emerald-300 font-bold text-sm mt-0.5">
                      ({mem.agentPos?.r ?? 0}, {mem.agentPos?.c ?? 0})
                    </div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">TD Error δ</div>
                    <div className="text-rose-300 font-bold text-sm mt-0.5">
                      {effTd.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800 col-span-2">
                    <div className="text-slate-400 text-[10px]">Reward Landscape</div>
                    <div className="text-slate-200 font-bold text-[11px] mt-0.5 flex justify-between">
                      <span>Step: -1.0</span>
                      <span className="text-rose-400">Hazards (1,2),(2,1): -50</span>
                      <span className="text-emerald-400">Goal (3,3): +100</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Training Episodes & Convergence</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => goToStep(0)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Env Init (4x4 Grid)
                  </button>
                  <button
                    onClick={() => goToStep(1)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 1 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Ep 1: Bellman Update
                  </button>
                  <button
                    onClick={() => goToStep(2)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 2 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Ep 15: Goal Discovery
                  </button>
                  <button
                    onClick={() => goToStep(3)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 3 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Ep 50: Optimal Policy
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── TOPIC 24: HIERARCHICAL CLUSTERING CONTROLS ── */}
        {/* ── TOPIC 24: HIERARCHICAL CLUSTERING CONTROLS ── */}
        {topic === 'hierarchical_clustering' && (() => {
          const effCut = editableValues.cutHeight !== undefined ? Number(editableValues.cutHeight) : 2.80;
          const dynamicK = effCut >= 4.0 ? 2 : effCut >= 2.2 ? 3 : effCut >= 1.2 ? 4 : 6;
          const activeClusters = editableValues.cutHeight !== undefined ? dynamicK : (mem.activeClustersCount ?? 12);
          const partitionsText = editableValues.cutHeight !== undefined ? `K = ${dynamicK} Clusters` : (mem.phase === 'DENDROGRAM_CUT_K3' ? 'K = 3 Clusters' : 'Uncut Tree');

          return (
            <div className="space-y-3">
              {/* Benchmark Dataset Attribution Badge */}
              <div className="border border-purple-800/60 bg-purple-950/20 p-2 rounded-none">
                <div className="text-[10px] uppercase text-purple-400 font-bold flex items-center justify-between">
                  <span>Dataset Attribution</span>
                  <span className="text-[9px] text-purple-300/80 bg-purple-900/50 px-1.5 py-0.2 border border-purple-700/60">Benchmark Classification</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-1">
                  Agglomerative linkage executed on 12 representative points across Classes 0, 1, 2 + noise outlier.
                </div>
              </div>

              {/* Interactive Semi-Dynamic Tuning */}
              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                  <span>Interactive Tuning</span>
                  {editableValues.cutHeight !== undefined && (
                    <button
                      onClick={() => setEditableValue('cutHeight', undefined)}
                      className="text-[9px] text-cyan-400 hover:text-cyan-300"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Dendrogram Cut Height Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Dendrogram Cut Height h:</span>
                    <span className="text-emerald-300 font-bold">{effCut.toFixed(2)} (K={dynamicK})</span>
                  </div>
                  <input
                    type="range"
                    min="0.80"
                    max="5.50"
                    step="0.10"
                    value={effCut}
                    onChange={e => setEditableValue('cutHeight', parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Dendrogram Hierarchy State</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Linkage Metric</div>
                    <div className="text-purple-300 font-bold text-sm mt-0.5">Ward's Minimum Var</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Active Clusters</div>
                    <div className="text-cyan-300 font-bold text-sm mt-0.5">{activeClusters} / 12</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Dendrogram Cut Threshold</div>
                    <div className="text-emerald-300 font-bold text-sm mt-0.5">h = {effCut.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Resulting Partitions</div>
                    <div className="text-amber-300 font-bold text-sm mt-0.5">{partitionsText}</div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-800 bg-[#07090e] p-2.5 rounded-none">
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Agglomerative Merge Stages</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => goToStep(0)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 0 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    N=12 Singleton Leaves
                  </button>
                  <button
                    onClick={() => goToStep(1)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 1 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Nearest Cluster Merges
                  </button>
                  <button
                    onClick={() => goToStep(2)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 2 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Full Dendrogram Tree
                  </button>
                  <button
                    onClick={() => goToStep(3)}
                    className={`py-1.5 px-2 text-[10px] text-center border font-mono transition-colors rounded-none ${
                      currentStepIndex === 3 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Horizontal Cut (K=3)
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Status Explanation Bar (Concise, technical) ── */}
        <div className="border border-slate-800 bg-[#080b12] p-2.5 rounded-none">
          <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Step Simulation State</div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            {currentStep?.explanationEnglish || 'Simulation initialized. Click Play or Step Next to advance.'}
          </p>
        </div>

      </div>
    </div>
  );
};
