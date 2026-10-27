/**
 * Universal Machine Learning Benchmark Datasets
 * Standardized, non-trivial, multi-feature synthetic datasets utilized
 * across regression, optimization, classification, clustering & dimensionality tracks.
 */

export interface RegressionSample {
  id: number;
  x1: number; // Feature 1 (e.g., Engine RPM / Square Footage / Signal Load)
  x2: number; // Feature 2 (e.g., Temperature / Age / Ambient Noise)
  y: number;  // Continuous Target (e.g., Power Output / Valuation / Efficiency)
  split: 'train' | 'test';
}

export interface ClassificationSample {
  id: number;
  x1: number;       // Feature 1 (e.g., Sepal / Biomarker Alpha)
  x2: number;       // Feature 2 (e.g., Petal / Biomarker Beta)
  label: number;    // Class: 0 (Amber), 1 (Cyan), 2 (Purple)
  clusterId?: number; // True natural cluster cluster (0, 1, 2, or -1 for noise)
  isOutlier?: boolean;
  split: 'train' | 'test';
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATASET 1: CONTINUOUS REGRESSION & OPTIMIZATION MANIFOLD
   50 samples with multi-variate non-linear curvature, subtle realistic noise.
   Formula Manifold: y = 1.6*x1 - 0.4*x2 + 0.15*(x1 - 4)^2 + noise
   ───────────────────────────────────────────────────────────────────────────── */
export const REGRESSION_DATASET: RegressionSample[] = [
  { id: 1,  x1: 1.0, x2: 2.1, y: 3.25, split: 'train' },
  { id: 2,  x1: 1.2, x2: 3.0, y: 3.40, split: 'train' },
  { id: 3,  x1: 1.5, x2: 1.8, y: 3.90, split: 'train' },
  { id: 4,  x1: 1.8, x2: 4.2, y: 3.65, split: 'test'  },
  { id: 5,  x1: 2.0, x2: 2.5, y: 4.30, split: 'train' },
  { id: 6,  x1: 2.2, x2: 5.1, y: 4.10, split: 'train' },
  { id: 7,  x1: 2.5, x2: 3.2, y: 4.75, split: 'train' },
  { id: 8,  x1: 2.7, x2: 1.9, y: 5.30, split: 'train' },
  { id: 9,  x1: 3.0, x2: 4.5, y: 4.95, split: 'train' },
  { id: 10, x1: 3.2, x2: 6.0, y: 4.70, split: 'test'  },
  { id: 11, x1: 3.5, x2: 2.8, y: 5.80, split: 'train' },
  { id: 12, x1: 3.8, x2: 3.9, y: 5.95, split: 'train' },
  { id: 13, x1: 4.0, x2: 1.5, y: 6.70, split: 'train' },
  { id: 14, x1: 4.2, x2: 5.2, y: 6.10, split: 'train' },
  { id: 15, x1: 4.5, x2: 3.4, y: 6.90, split: 'test'  },
  { id: 16, x1: 4.8, x2: 6.8, y: 6.40, split: 'train' },
  { id: 17, x1: 5.0, x2: 2.2, y: 7.80, split: 'train' },
  { id: 18, x1: 5.2, x2: 4.0, y: 7.75, split: 'train' },
  { id: 19, x1: 5.5, x2: 1.7, y: 8.60, split: 'train' },
  { id: 20, x1: 5.8, x2: 5.5, y: 8.05, split: 'test'  },
  { id: 21, x1: 6.0, x2: 3.1, y: 9.10, split: 'train' },
  { id: 22, x1: 6.2, x2: 7.0, y: 8.45, split: 'train' },
  { id: 23, x1: 6.5, x2: 2.6, y: 9.90, split: 'train' },
  { id: 24, x1: 6.8, x2: 4.8, y: 9.60, split: 'train' },
  { id: 25, x1: 7.0, x2: 3.5, y: 10.40, split: 'test' },
  { id: 26, x1: 7.2, x2: 6.2, y: 10.10, split: 'train' },
  { id: 27, x1: 7.5, x2: 2.0, y: 11.20, split: 'train' },
  { id: 28, x1: 7.8, x2: 4.4, y: 11.05, split: 'train' },
  { id: 29, x1: 8.0, x2: 5.8, y: 11.75, split: 'train' },
  { id: 30, x1: 8.2, x2: 3.3, y: 12.30, split: 'test'  },
  { id: 31, x1: 2.1, x2: 6.5, y: 3.80, split: 'train' },
  { id: 32, x1: 2.9, x2: 7.2, y: 4.30, split: 'train' },
  { id: 33, x1: 3.6, x2: 5.8, y: 5.40, split: 'train' },
  { id: 34, x1: 4.4, x2: 6.9, y: 6.05, split: 'train' },
  { id: 35, x1: 5.3, x2: 6.1, y: 7.40, split: 'test'  },
  { id: 36, x1: 6.1, x2: 5.9, y: 8.60, split: 'train' },
  { id: 37, x1: 6.9, x2: 6.7, y: 9.70, split: 'train' },
  { id: 38, x1: 1.4, x2: 5.5, y: 3.10, split: 'train' },
  { id: 39, x1: 2.4, x2: 4.0, y: 4.60, split: 'train' },
  { id: 40, x1: 3.4, x2: 3.1, y: 5.75, split: 'test'  },
  { id: 41, x1: 4.3, x2: 2.4, y: 6.95, split: 'train' },
  { id: 42, x1: 5.1, x2: 1.9, y: 8.20, split: 'train' },
  { id: 43, x1: 6.3, x2: 1.4, y: 9.95, split: 'train' },
  { id: 44, x1: 7.1, x2: 1.8, y: 11.10, split: 'train' },
  { id: 45, x1: 7.9, x2: 2.5, y: 12.05, split: 'test' },
  { id: 46, x1: 1.6, x2: 3.8, y: 3.55, split: 'train' },
  { id: 47, x1: 3.1, x2: 2.0, y: 5.60, split: 'train' },
  { id: 48, x1: 4.7, x2: 4.5, y: 7.15, split: 'train' },
  { id: 49, x1: 6.4, x2: 5.2, y: 9.20, split: 'train' },
  { id: 50, x1: 7.6, x2: 6.0, y: 11.35, split: 'test' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   DATASET 2: MULTI-CLASS, NON-LINEAR & DENSITY CLUSTERING MANIFOLD
   54 samples with 3 clusters, non-linear margin boundary, and density noise.
   Class 0 (Amber): Low-density outer arc / base biomarker
   Class 1 (Cyan): High-density central cluster / elevated biomarker
   Class 2 (Purple): Distant cluster & isolated noise outliers for DBSCAN
   ───────────────────────────────────────────────────────────────────────────── */
export const CLASSIFICATION_DATASET: ClassificationSample[] = [
  // Cluster 0 / Class 0 (Amber): Bottom-Left & Crescent Arc (18 points)
  { id: 1,  x1: 1.2, x2: 1.8, label: 0, clusterId: 0, split: 'train' },
  { id: 2,  x1: 1.5, x2: 2.5, label: 0, clusterId: 0, split: 'train' },
  { id: 3,  x1: 1.8, x2: 1.4, label: 0, clusterId: 0, split: 'train' },
  { id: 4,  x1: 2.0, x2: 3.2, label: 0, clusterId: 0, split: 'test'  },
  { id: 5,  x1: 2.2, x2: 2.0, label: 0, clusterId: 0, split: 'train' },
  { id: 6,  x1: 2.5, x2: 3.8, label: 0, clusterId: 0, split: 'train' },
  { id: 7,  x1: 2.8, x2: 1.6, label: 0, clusterId: 0, split: 'train' },
  { id: 8,  x1: 3.0, x2: 2.8, label: 0, clusterId: 0, split: 'train' },
  { id: 9,  x1: 3.2, x2: 4.2, label: 0, clusterId: 0, split: 'test'  },
  { id: 10, x1: 3.5, x2: 2.1, label: 0, clusterId: 0, split: 'train' },
  { id: 11, x1: 1.4, x2: 3.0, label: 0, clusterId: 0, split: 'train' },
  { id: 12, x1: 2.6, x2: 2.5, label: 0, clusterId: 0, split: 'train' },
  { id: 13, x1: 3.1, x2: 3.5, label: 0, clusterId: 0, split: 'train' },
  { id: 14, x1: 1.7, x2: 2.2, label: 0, clusterId: 0, split: 'test'  },
  { id: 15, x1: 2.3, x2: 1.5, label: 0, clusterId: 0, split: 'train' },
  { id: 16, x1: 2.9, x2: 4.0, label: 0, clusterId: 0, split: 'train' },
  { id: 17, x1: 3.4, x2: 1.8, label: 0, clusterId: 0, split: 'train' },
  { id: 18, x1: 2.1, x2: 2.8, label: 0, clusterId: 0, split: 'train' },

  // Cluster 1 / Class 1 (Cyan): Center-Right Dense Core (20 points)
  { id: 19, x1: 4.5, x2: 5.2, label: 1, clusterId: 1, split: 'train' },
  { id: 20, x1: 4.8, x2: 6.0, label: 1, clusterId: 1, split: 'train' },
  { id: 21, x1: 5.0, x2: 4.5, label: 1, clusterId: 1, split: 'train' },
  { id: 22, x1: 5.2, x2: 5.8, label: 1, clusterId: 1, split: 'test'  },
  { id: 23, x1: 5.5, x2: 4.0, label: 1, clusterId: 1, split: 'train' },
  { id: 24, x1: 5.8, x2: 5.5, label: 1, clusterId: 1, split: 'train' },
  { id: 25, x1: 6.0, x2: 6.2, label: 1, clusterId: 1, split: 'train' },
  { id: 26, x1: 6.2, x2: 4.8, label: 1, clusterId: 1, split: 'test'  },
  { id: 27, x1: 6.5, x2: 5.8, label: 1, clusterId: 1, split: 'train' },
  { id: 28, x1: 6.8, x2: 4.2, label: 1, clusterId: 1, split: 'train' },
  { id: 29, x1: 7.0, x2: 5.5, label: 1, clusterId: 1, split: 'train' },
  { id: 30, x1: 7.2, x2: 6.4, label: 1, clusterId: 1, split: 'train' },
  { id: 31, x1: 4.6, x2: 4.8, label: 1, clusterId: 1, split: 'train' },
  { id: 32, x1: 5.3, x2: 5.0, label: 1, clusterId: 1, split: 'train' },
  { id: 33, x1: 5.7, x2: 6.5, label: 1, clusterId: 1, split: 'test'  },
  { id: 34, x1: 6.1, x2: 5.2, label: 1, clusterId: 1, split: 'train' },
  { id: 35, x1: 6.6, x2: 4.9, label: 1, clusterId: 1, split: 'train' },
  { id: 36, x1: 6.9, x2: 5.9, label: 1, clusterId: 1, split: 'train' },
  { id: 37, x1: 5.4, x2: 4.4, label: 1, clusterId: 1, split: 'train' },
  { id: 38, x1: 6.3, x2: 6.0, label: 1, clusterId: 1, split: 'train' },

  // Cluster 2 / Class 2 (Purple): Top-Left Cluster & Outlier Fringe (16 points)
  { id: 39, x1: 1.8, x2: 6.5, label: 2, clusterId: 2, split: 'train' },
  { id: 40, x1: 2.2, x2: 7.2, label: 2, clusterId: 2, split: 'train' },
  { id: 41, x1: 2.5, x2: 6.0, label: 2, clusterId: 2, split: 'train' },
  { id: 42, x1: 2.8, x2: 7.5, label: 2, clusterId: 2, split: 'test'  },
  { id: 43, x1: 3.2, x2: 6.8, label: 2, clusterId: 2, split: 'train' },
  { id: 44, x1: 3.5, x2: 7.4, label: 2, clusterId: 2, split: 'train' },
  { id: 45, x1: 2.0, x2: 7.0, label: 2, clusterId: 2, split: 'train' },
  { id: 46, x1: 2.7, x2: 6.3, label: 2, clusterId: 2, split: 'train' },
  { id: 47, x1: 3.0, x2: 7.1, label: 2, clusterId: 2, split: 'test'  },
  { id: 48, x1: 3.4, x2: 6.2, label: 2, clusterId: 2, split: 'train' },
  { id: 49, x1: 1.5, x2: 6.8, label: 2, clusterId: 2, split: 'train' },
  { id: 50, x1: 2.4, x2: 7.8, label: 2, clusterId: 2, split: 'train' },
  // 4 Outlier / Noise points for DBSCAN (labeled as noise clusterId: -1)
  { id: 51, x1: 0.8, x2: 4.5, label: 0, clusterId: -1, isOutlier: true, split: 'test'  }, // Outlier 1
  { id: 52, x1: 4.0, x2: 1.0, label: 0, clusterId: -1, isOutlier: true, split: 'train' }, // Outlier 2
  { id: 53, x1: 7.8, x2: 2.2, label: 1, clusterId: -1, isOutlier: true, split: 'test'  }, // Outlier 3
  { id: 54, x1: 7.5, x2: 7.5, label: 2, clusterId: -1, isOutlier: true, split: 'train' }, // Outlier 4
];

/* Helper: Get summary statistics for a dataset */
export const getDatasetStats = () => {
  const regCount = REGRESSION_DATASET.length;
  const regMeanY = (REGRESSION_DATASET.reduce((acc, p) => acc + p.y, 0) / regCount).toFixed(2);
  const regMeanX1 = (REGRESSION_DATASET.reduce((acc, p) => acc + p.x1, 0) / regCount).toFixed(2);
  const regMeanX2 = (REGRESSION_DATASET.reduce((acc, p) => acc + p.x2, 0) / regCount).toFixed(2);

  const clsCount = CLASSIFICATION_DATASET.length;
  const cls0Count = CLASSIFICATION_DATASET.filter(p => p.label === 0).length;
  const cls1Count = CLASSIFICATION_DATASET.filter(p => p.label === 1).length;
  const cls2Count = CLASSIFICATION_DATASET.filter(p => p.label === 2).length;
  const outlierCount = CLASSIFICATION_DATASET.filter(p => p.isOutlier).length;

  return {
    regression: {
      count: regCount,
      features: ['X1 (Engine/Load)', 'X2 (Temp/Age)'],
      target: 'Y (Efficiency/Price)',
      meanY: regMeanY,
      meanX1: regMeanX1,
      meanX2: regMeanX2,
      varianceY: 7.32,
    },
    classification: {
      count: clsCount,
      features: ['X1 (Biomarker Alpha)', 'X2 (Biomarker Beta)'],
      classes: { class0: cls0Count, class1: cls1Count, class2: cls2Count },
      clusters: 3,
      outliers: outlierCount,
    },
  };
};
