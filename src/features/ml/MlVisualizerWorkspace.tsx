import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Sparkles } from 'lucide-react';
import { LinearRegressionStage } from './components/LinearRegressionStage';
import { PolynomialRegressionStage } from './components/PolynomialRegressionStage';
import { LogisticRegressionStage } from './components/LogisticRegressionStage';
import { KnnClassificationStage } from './components/KnnClassificationStage';
import { DecisionTreeStage } from './components/DecisionTreeStage';
import { SvmStage } from './components/SvmStage';
import { KMeansClusteringStage } from './components/KMeansClusteringStage';
import { GradientDescentStage } from './components/GradientDescentStage';
import { OverfittingUnderfittingStage } from './components/OverfittingUnderfittingStage';
import { QLearningGridStage } from './components/QLearningGridStage';
import { SinglePerceptronStage } from './components/SinglePerceptronStage';

interface MlVisualizerWorkspaceProps {
  topicId?: string;
  programId?: string;
}

export const MlVisualizerWorkspace: React.FC<MlVisualizerWorkspaceProps> = ({ topicId = 'linear_regression' }) => {
  const navigate = useNavigate();

  // Topic Metadata map
  const topicMap: Record<string, { title: string; category: string; description: string }> = {
    linear_regression: {
      title: '01. Linear Regression',
      category: 'Supervised Learning · Regression',
      description: 'Find the optimal best-fit line by minimizing sum of squared residuals (MSE).',
    },
    polynomial_regression: {
      title: '02. Polynomial Regression',
      category: 'Supervised Learning · Regression',
      description: 'Fit non-linear parabolic and polynomial curves to complex curved distributions.',
    },
    logistic_regression: {
      title: '03. Logistic Regression',
      category: 'Supervised Learning · Classification',
      description: 'Separate binary classes using a Sigmoid probability mapping threshold.',
    },
    knn_classification: {
      title: '04. K-Nearest Neighbors (KNN)',
      category: 'Supervised Learning · Classification',
      description: 'Classify data points through local proximity voting of closest K neighbors.',
    },
    decision_tree: {
      title: '05. Decision Tree Classifier',
      category: 'Supervised Learning · Classification',
      description: 'Recursively partition 2D feature space using orthogonal decision splits.',
    },
    svm: {
      title: '06. Support Vector Machine (SVM)',
      category: 'Supervised Learning · Classification',
      description: 'Maximize the geometric margin separating two opposing classes.',
    },
    kmeans_clustering: {
      title: '07. K-Means Clustering',
      category: 'Unsupervised Learning · Clustering',
      description: 'Group unlabelled data points by iteratively updating K centroid positions.',
    },
    gradient_descent: {
      title: '08. Gradient Descent',
      category: 'Optimization · Loss Landscapes',
      description: 'Roll down convex loss valleys to find optimal global weight parameters.',
    },
    overfitting_underfitting: {
      title: '09. Overfitting vs Underfitting',
      category: 'Model Evaluation · Bias-Variance',
      description: 'Explore the delicate balance between high bias and high variance.',
    },
    q_learning_grid: {
      title: '10. Grid World (Q-Learning)',
      category: 'Reinforcement Learning · Markov Decision',
      description: 'Train an agent in a 2D environment using rewards and penalty feedback.',
    },
    single_perceptron: {
      title: '11. Single Perceptron',
      category: 'Neural Networks · Feedforward',
      description: 'The fundamental biological neuron with synaptic weights and step activation.',
    },
  };

  const currentTopic = topicMap[topicId] || topicMap['linear_regression'];

  // Render the selected topic's interactive stage
  const renderStage = () => {
    switch (topicId) {
      case 'linear_regression':
        return <LinearRegressionStage />;
      case 'polynomial_regression':
        return <PolynomialRegressionStage />;
      case 'logistic_regression':
        return <LogisticRegressionStage />;
      case 'knn_classification':
        return <KnnClassificationStage />;
      case 'decision_tree':
        return <DecisionTreeStage />;
      case 'svm':
        return <SvmStage />;
      case 'kmeans_clustering':
        return <KMeansClusteringStage />;
      case 'gradient_descent':
        return <GradientDescentStage />;
      case 'overfitting_underfitting':
        return <OverfittingUnderfittingStage />;
      case 'q_learning_grid':
        return <QLearningGridStage />;
      case 'single_perceptron':
        return <SinglePerceptronStage />;
      default:
        return <LinearRegressionStage />;
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#070913] text-slate-100 overflow-hidden select-none">
      {/* Sleek Minimal Header */}
      <header className="h-12 px-4 border-b border-slate-800 bg-[#0a0d1a] flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/topics/ml')}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all flex items-center gap-1 text-xs cursor-pointer active:scale-95"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back to ML Topics</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BrainCircuit size={14} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-none">
                  {currentTopic.title}
                </h1>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 uppercase font-bold">
                  {currentTopic.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info badge */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <Sparkles size={13} className="text-amber-400" />
          <span className="text-[11px] font-medium text-slate-400">{currentTopic.description}</span>
        </div>
      </header>

      {/* Main Simulation Stage Body */}
      <main className="flex-1 flex overflow-hidden relative">
        {renderStage()}
      </main>
    </div>
  );
};
