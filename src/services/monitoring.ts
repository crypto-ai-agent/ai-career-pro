import { supabase } from '../lib/supabase';

interface ErrorDetails {
  message: string;
  stack?: string;
  context?: Record<string, any>;
}

export async function trackError(error: Error, context?: Record<string, any>) {
  try {
    const { error: dbError } = await supabase
      .from('error_logs')
      .insert({
        error_type: error.name,
        message: error.message,
        stack_trace: error.stack,
        context,
        severity: 'error',
        created_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

    // Send to external monitoring if configured
    if (import.meta.env.VITE_MONITORING_ENDPOINT) {
      await fetch(import.meta.env.VITE_MONITORING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'error',
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack
          },
          context,
          timestamp: new Date().toISOString()
        })
      });
    }
  } catch (err) {
    console.error('Failed to track error:', err);
  }
}

export async function trackPerformanceMetric(
  name: string,
  value: number,
  unit: string,
  context?: Record<string, any>
) {
  try {
    const { error: dbError } = await supabase
      .from('performance_metrics')
      .insert({
        metric_name: name,
        value,
        unit,
        context,
        created_at: new Date().toISOString()
      });

    if (dbError) throw dbError;
  } catch (err) {
    console.error('Failed to track metric:', err);
  }
}

export function getRecoveryMessage(error: Error): string {
  // Common error recovery suggestions
  const recoveryMessages: Record<string, string> = {
    NetworkError: 'Please check your internet connection and try again',
    AuthenticationError: 'Your session may have expired. Please try signing in again',
    ValidationError: 'Please check your input and try again',
    RateLimitError: 'You\'ve reached the usage limit. Please try again later or upgrade your plan',
    TimeoutError: 'The request timed out. Please try again',
    default: 'An unexpected error occurred. Please try again or contact support if the issue persists'
  };

  // Match error type or return default message
  return recoveryMessages[error.name] || recoveryMessages.default;
}