import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  isChunkError: boolean;
}

// ─── Detect Vite/Rollup chunk load failures ────────────────────────────────────
const isChunkLoadError = (error: Error): boolean => {
  const msg = error?.message?.toLowerCase() ?? '';
  const name = error?.name?.toLowerCase() ?? '';
  return (
    name.includes('chunkloaderror') ||
    msg.includes('failed to fetch dynamically imported module') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('importing a module script failed') ||
    msg.includes('unable to preload css') ||
    msg.includes('chunk')
  );
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    isChunkError: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      isChunkError: isChunkLoadError(error),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (isChunkLoadError(error)) {
      // Auto-recover from Vite stale chunk: reload ONCE then stop to prevent loops
      const RELOAD_FLAG = 'flowtrace_chunk_reload';
      const alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG);
      if (!alreadyReloaded) {
        sessionStorage.setItem(RELOAD_FLAG, '1');
        window.location.reload();
        return;
      }
      // If already reloaded once, clear flag and show generic error UI
      sessionStorage.removeItem(RELOAD_FLAG);
    }
    console.error('Uncaught Visualizer error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    sessionStorage.removeItem('flowtrace_chunk_reload');
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false, isChunkError: false });
  };

  public render() {
    if (this.state.hasError) {
      // Chunk error: show minimal spinner while auto-reload fires
      if (this.state.isChunkError) {
        return (
          <div className="w-full h-full min-h-87.5 flex items-center justify-center bg-slate-950/80">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-xs font-mono">Reloading updated module...</p>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full h-full min-h-87.5 flex items-center justify-center p-6 bg-slate-950/80 text-white font-mono select-none">
          <div className="max-w-lg w-full bg-slate-900/95 border border-rose-500/40 rounded-3xl p-6 text-center shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-lg shadow-rose-500/20">
              <AlertTriangle size={32} />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-wide text-white uppercase">Something went wrong</h2>
              <p className="text-xs text-rose-300 font-sans mt-1">
                {this.props.fallbackMessage || 'The Programming Visualizer encountered a runtime component error.'}
              </p>
            </div>

            {/* Exact Error Message Box */}
            {this.state.error && (
              <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-3 text-left">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                  Error Cause:
                </span>
                <p className="text-xs text-rose-200 font-mono break-all font-bold">
                  {this.state.error.name}: {this.state.error.message}
                </p>
              </div>
            )}

            {/* Expandable Stack Trace */}
            {this.state.errorInfo && (
              <div className="text-left">
                <button
                  onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mx-auto py-1"
                >
                  <ChevronDown size={14} className={`transition-transform ${this.state.showDetails ? 'rotate-180' : ''}`} />
                  {this.state.showDetails ? 'Hide Technical Log' : 'Show Technical Log'}
                </button>

                {this.state.showDetails && (
                  <pre className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-slate-300 overflow-x-auto max-h-40 break-all whitespace-pre-wrap">
                    {this.state.error?.stack || this.state.error?.toString()}
                    {'\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> Try Repair / Retry
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-500/30"
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
