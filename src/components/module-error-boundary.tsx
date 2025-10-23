import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ModuleErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

interface ModuleErrorBoundaryProps {
  children: ReactNode;
  moduleName: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  showRetry?: boolean;
  showDetails?: boolean;
}

class ModuleErrorBoundary extends Component<
  ModuleErrorBoundaryProps,
  ModuleErrorBoundaryState
> {
  constructor(props: ModuleErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<ModuleErrorBoundaryState> {
    const errorId = `module_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.state.errorId);
    }

    // Log error
    console.error(
      `Error in ${this.props.moduleName} module:`,
      error,
      errorInfo
    );
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: '',
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default module error UI
      return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <h3 className="text-lg font-semibold text-white mb-2">
            {this.props.moduleName} Module Error
          </h3>

          <p className="text-gray-400 mb-4">
            Something went wrong in the {this.props.moduleName.toLowerCase()}{' '}
            module. This won't affect other parts of the application.
          </p>

          {/* Error ID */}
          {this.state.errorId && (
            <p className="text-xs text-gray-500 mb-4 font-mono">
              Error ID: {this.state.errorId}
            </p>
          )}

          {/* Retry Button */}
          {this.props.showRetry !== false && (
            <button
              onClick={this.handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Retry {this.props.moduleName}
            </button>
          )}

          {/* Development Error Details */}
          {this.props.showDetails &&
            process.env.NODE_ENV === 'development' &&
            this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                  Show Error Details
                </summary>
                <div className="mt-2 bg-gray-900 rounded p-3 overflow-auto">
                  <pre className="text-xs text-red-400 whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                </div>
              </details>
            )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ModuleErrorBoundary;
