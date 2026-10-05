import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackRoute?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class SimulationErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected graphics error occurred.',
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[3D Simulation Sandbox Catch]:', error, errorInfo);
  }

  private handleReturn = () => {
    window.location.href = '#/languages';
  };

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="max-w-md w-full p-6 rounded-lg border border-rose-900/50 bg-[#0d090d] text-slate-200">
            <div className="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-1.5 font-mono">
              Simulation Sandbox Guard Triggered
            </h3>
            
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              The 3D graphics runtime encountered an issue or WebGL context was lost. Because this module is completely sandboxed, your main application session is safe.
            </p>

            {this.state.errorMessage && (
              <div className="p-2.5 mb-5 rounded bg-[#160e14] border border-rose-950 text-left font-mono text-[11px] text-rose-300 break-all">
                {this.state.errorMessage}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReturn}
                className="px-4 py-2 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Home
              </button>
              <button
                type="button"
                onClick={this.handleRetry}
                className="px-4 py-2 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
