import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
          <div className="w-20 h-20 bg-destructive/10 text-destructive flex items-center justify-center rounded-full mb-8">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif italic mb-4">Something went wrong</h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed uppercase tracking-widest text-[10px] font-bold">
            An unexpected error has occurred in our editorial system. Our team has been notified.
          </p>
          <Button 
            onClick={this.handleReset}
            className="bg-primary text-on-primary rounded-none px-12 py-8 text-[10px] uppercase tracking-[0.3em] font-bold shadow-2xl hover:bg-primary/90 transition-all flex items-center gap-3"
          >
            <RotateCcw className="w-4 h-4" />
            Return to Gallery
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
