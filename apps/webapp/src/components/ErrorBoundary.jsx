import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7] text-center space-y-6 px-4">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-black">Something went wrong</h2>
          <p className="text-muted-foreground text-lg max-w-md">
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-furco-yellow text-black hover:bg-black hover:text-white rounded-full px-8 py-3 font-bold transition-all duration-300 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.history.back()} 
              className="rounded-full px-8 py-3 font-bold"
            >
              Go Back
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left max-w-2xl">
              <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;