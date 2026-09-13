import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Planner:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('planner_last_active_id');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-400 mb-4 shadow-xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-100 mb-2">Something went wrong</h1>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || 'An unexpected runtime error occurred.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              Reload Page
            </button>
            <button
              onClick={this.handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-semibold shadow-lg shadow-brand-500/20 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
