import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { getRecoveryMessage } from '../../services/monitoring';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Track error in analytics
    if (window.gtag) {
      window.gtag('event', 'error', {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack,
        error_info: JSON.stringify(errorInfo)
      });
    }
    
    // Send error to backend for logging
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        errorInfo,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    }).catch(console.error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {this.state.error?.message || 'Something went wrong'}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {getRecoveryMessage(this.state.error!)}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Error ID: {Date.now().toString(36)}
            </p>
            <div className="mt-6">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mr-4"
              >
                Try again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}