import React, { useState } from 'react';
import { REGRESSION_DATASET, CLASSIFICATION_DATASET, getDatasetStats } from '../../../lessons/ml/datasets';

interface MlDatasetBannerProps {
  onClose?: () => void;
}

export const MlDatasetBanner: React.FC<MlDatasetBannerProps> = ({ onClose }) => {
  const [selectedDataset, setSelectedDataset] = useState<'regression' | 'classification'>('regression');
  const stats = getDatasetStats();

  // Mini scatter coordinate mapping for the preview canvas
  const mapRegX = (x1: number) => 35 + ((x1 - 1.0) / 7.2) * 230;
  const mapRegY = (y: number) => 135 - ((y - 3.0) / 9.5) * 115;

  const mapClsX = (x1: number) => 35 + ((x1 - 0.8) / 7.2) * 230;
  const mapClsY = (x2: number) => 135 - ((x2 - 1.0) / 7.0) * 115;

  return (
    <div className="w-full bg-[#0a0d14] border border-slate-800 text-slate-200 font-mono mb-6 rounded-none select-none overflow-hidden">
      {/* ── Minimal Header: Dataset Selector & Close Action ── */}
      <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#07090f] border-b border-slate-800 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Dataset:</span>
          <button
            onClick={() => setSelectedDataset('regression')}
            className={`py-1 px-2.5 text-[11px] border transition-colors rounded-none ${
              selectedDataset === 'regression'
                ? 'bg-slate-800 border-slate-600 text-white font-semibold'
                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
            }`}
          >
            01. Continuous Regression ({stats.regression.count} samples)
          </button>
          <button
            onClick={() => setSelectedDataset('classification')}
            className={`py-1 px-2.5 text-[11px] border transition-colors rounded-none ${
              selectedDataset === 'classification'
                ? 'bg-slate-800 border-slate-600 text-white font-semibold'
                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
            }`}
          >
            02. Classification & Clustering ({stats.classification.count} samples)
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-[11px] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/60 px-2 py-0.5 transition-colors rounded-none"
          >
            Close ✕
          </button>
        )}
      </div>

      {/* ── Content: Clean Metrics + Mini Plot + Data Table ── */}
      <div className="p-3 space-y-3 bg-[#0a0d14]">
        {/* Dataset Schema Summary */}
        {selectedDataset === 'regression' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="bg-[#0e121b] p-2 border border-slate-800/80">
              <div className="text-slate-500 text-[10px]">Observations</div>
              <div className="text-slate-200 font-semibold text-xs mt-0.5">50 Samples (40 train / 10 test)</div>
            </div>
            <div className="bg-[#0e121b] p-2 border border-slate-800/80">
              <div className="text-slate-500 text-[10px]">Features</div>
              <div className="text-slate-200 text-xs mt-0.5">X₁ ∈ [1.2, 8.0], X₂ ∈ [0.8, 6.5]</div>
            </div>
            <div className="bg-[#0e121b] p-2 border border-slate-800/80">
              <div className="text-slate-500 text-[10px]">Continuous Target</div>
              <div className="text-slate-200 text-xs mt-0.5">Y ∈ [3.10, 12.30] (Mean: {stats.regression.meanY})</div>
            </div>
            <div className="bg-[#0e121b] p-2 border border-slate-800/80">
              <div className="text-slate-500 text-[10px]">Used By</div>
              <div className="text-slate-300 text-[11px] mt-0.5">Linear Reg, Poly, GBDT, Q-Learning</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="bg-[#0e121b] p-2 border border-slate-800/80">
              <div className="text-slate-500 text-[10px]">Observations</div>
              <div className="text-slate-200 font-semibold text-xs mt-0.5">54 Samples (42 train / 12 test)</div>
            </div>
            <div className="bg-[#0e121b] p-2 border border-slate-800/80">
              <div className="text-slate-500 text-[10px]">Class Breakdown</div>
              <div className="text-slate-200 text-xs mt-0.5">C0: 18 | C1: 20 | C2: 12</div>
            </div>
            <div className="bg-[#0e121b] p-2 border border-slate-800/80">
              <div className="text-slate-500 text-[10px]">Density Outliers</div>
              <div className="text-slate-200 text-xs mt-0.5">{stats.classification.outliers} Noise Points</div>
            </div>
            <div className="bg-[#0e121b] p-2 border border-slate-800/80">
              <div className="text-slate-500 text-[10px]">Used By</div>
              <div className="text-slate-300 text-[11px] mt-0.5">Logistic, KNN, Trees, SVM, Clustering</div>
            </div>
          </div>
        )}

        {/* Dual Panel: Scatter Canvas + Sample Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Scatter Canvas */}
          <div className="border border-slate-800/80 bg-[#07090f] p-2 flex flex-col items-center">
            <div className="text-[10px] text-slate-400 font-medium mb-1 w-full flex justify-between">
              <span>2D Feature Distribution</span>
              <span className="text-slate-500">Coordinate Range [0, 8]</span>
            </div>
            <svg viewBox="0 0 280 150" className="w-full h-auto select-none">
              {/* Axes */}
              <line x1={35} y1={135} x2={270} y2={135} stroke="#273142" strokeWidth="1" />
              <line x1={35} y1={15} x2={35} y2={135} stroke="#273142" strokeWidth="1" />

              {/* Regression Scatter */}
              {selectedDataset === 'regression' && (
                <>
                  <line x1={35} y1={125} x2={265} y2={25} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                  {REGRESSION_DATASET.map(p => (
                    <circle
                      key={`regprev-${p.id}`}
                      cx={mapRegX(p.x1)}
                      cy={mapRegY(p.y)}
                      r={2.5}
                      fill={p.split === 'train' ? '#38bdf8' : '#cbd5e1'}
                    />
                  ))}
                </>
              )}

              {/* Classification Scatter */}
              {selectedDataset === 'classification' && (
                <>
                  {CLASSIFICATION_DATASET.map(p => {
                    const color = p.isOutlier
                      ? '#ef4444'
                      : p.label === 0
                      ? '#f59e0b'
                      : p.label === 1
                      ? '#38bdf8'
                      : '#a855f7';
                    return (
                      <circle
                        key={`clsprev-${p.id}`}
                        cx={mapClsX(p.x1)}
                        cy={mapClsY(p.x2)}
                        r={p.isOutlier ? 3 : 2.5}
                        fill={color}
                      />
                    );
                  })}
                </>
              )}
            </svg>
          </div>

          {/* Table */}
          <div className="border border-slate-800/80 bg-[#07090f] p-2 overflow-x-auto">
            <div className="text-[10px] text-slate-400 font-medium mb-1 flex justify-between">
              <span>Sample Rows (First 6 Records)</span>
              <span className="text-slate-500">Universal Reference Pool</span>
            </div>
            <table className="w-full text-[10px] font-mono text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-1 px-1.5 font-normal">ID</th>
                  <th className="py-1 px-1.5 font-normal">X₁</th>
                  <th className="py-1 px-1.5 font-normal">X₂</th>
                  <th className="py-1 px-1.5 font-normal">{selectedDataset === 'regression' ? 'Target Y' : 'Class'}</th>
                  <th className="py-1 px-1.5 font-normal">Split</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {selectedDataset === 'regression'
                  ? REGRESSION_DATASET.slice(0, 6).map(row => (
                      <tr key={`regrow-${row.id}`}>
                        <td className="py-1 px-1.5 text-slate-500">#{row.id}</td>
                        <td className="py-1 px-1.5 text-slate-300">{row.x1.toFixed(1)}</td>
                        <td className="py-1 px-1.5 text-slate-300">{row.x2.toFixed(1)}</td>
                        <td className="py-1 px-1.5 text-slate-200 font-medium">{row.y.toFixed(2)}</td>
                        <td className="py-1 px-1.5 text-slate-400 uppercase text-[9px]">{row.split}</td>
                      </tr>
                    ))
                  : CLASSIFICATION_DATASET.slice(0, 6).map(row => (
                      <tr key={`clsrow-${row.id}`}>
                        <td className="py-1 px-1.5 text-slate-500">#{row.id}</td>
                        <td className="py-1 px-1.5 text-slate-300">{row.x1.toFixed(1)}</td>
                        <td className="py-1 px-1.5 text-slate-300">{row.x2.toFixed(1)}</td>
                        <td className="py-1 px-1.5 font-medium text-slate-200">
                          Class {row.label}
                        </td>
                        <td className="py-1 px-1.5 text-slate-400 uppercase text-[9px]">{row.split}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
