import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SystemHealth {
  errors: Array<{
    id: string;
    error_type: string;
    message: string;
    severity: string;
    created_at: string;
    resolved: boolean;
  }>;
  performance: Array<{
    id: string;
    metric_name: string;
    value: number;
    unit: string;
    created_at: string;
  }>;
  alerts: Array<{
    id: string;
    name: string;
    triggered_value: any;
    created_at: string;
    resolved: boolean;
  }>;
}

export function useSystemHealth() {
  const [data, setData] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSystemHealth();
  }, []);

  const loadSystemHealth = async () => {
    try {
      // Load recent errors
      const { data: errors } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Load performance metrics
      const { data: performance } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Load recent alerts
      const { data: alerts } = await supabase
        .from('alert_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      setData({
        errors: errors || [],
        performance: performance || [],
        alerts: alerts || []
      });
      setError(null);
    } catch (err) {
      console.error('Error loading system health:', err);
      setError('Failed to load system health data');
    } finally {
      setLoading(false);
    }
  };

  const logError = async (
    error_type: string,
    message: string,
    stack_trace?: string,
    context?: Record<string, any>
  ) => {
    try {
      await supabase.rpc('log_error', {
        p_error_type: error_type,
        p_message: message,
        p_stack_trace: stack_trace,
        p_context: context
      });
      loadSystemHealth();
    } catch (err) {
      console.error('Error logging error:', err);
    }
  };

  const trackMetric = async (
    name: string,
    value: number,
    unit: string,
    context?: Record<string, any>
  ) => {
    try {
      await supabase.rpc('track_performance_metric', {
        p_metric_name: name,
        p_value: value,
        p_unit: unit,
        p_context: context
      });
      loadSystemHealth();
    } catch (err) {
      console.error('Error tracking metric:', err);
    }
  };

  return {
    data,
    loading,
    error,
    refresh: loadSystemHealth,
    logError,
    trackMetric
  };
}