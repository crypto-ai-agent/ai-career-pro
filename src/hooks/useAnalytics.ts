import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Interface for analytics data returned by the hook
 */
interface AnalyticsData {
  mrr: number;
  totalUsers: number;
  activeSubscriptions: number;
  documentsGenerated: number;
  revenueGrowth: number;
  userGrowth: number;
}

/**
 * Hook for fetching and managing analytics data
 * @returns {Object} Analytics data and management functions
 * @property {AnalyticsData | null} data - The current analytics data
 * @property {boolean} loading - Whether data is currently being loaded
 * @property {string | null} error - Any error that occurred during loading
 * @property {() => Promise<void>} refresh - Function to refresh the analytics data
 */
export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  /**
   * Loads analytics data from the database
   * Calculates growth rates and updates state
   */
  const loadAnalytics = async () => {
    try {
      // Get MRR data
      const { data: mrrData, error: mrrError } = await supabase.rpc('calculate_mrr');
      if (mrrError) throw new Error('critical: Failed to calculate MRR');
      const mrr = mrrData?.mrr || 0;
      
      // Get user counts
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get subscription stats
      const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get document counts
      const { count: documents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .in('event_type', ['cv_generated', 'cover_letter_generated', 'email_generated']);

      // Calculate growth rates with error handling
      const previousMonth = new Date();
      previousMonth.setMonth(previousMonth.getMonth() - 1);

      const { data: previousRevenue } = await supabase
        .from('revenue_metrics')
        .select('mrr')
        .eq('date', previousMonth.toISOString().split('T')[0]);

      const revenueGrowth = previousRevenue?.[0]?.mrr 
        ? ((mrr - previousRevenue[0].mrr) / previousRevenue[0].mrr) * 100 
        : 0;

      const { count: previousUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', previousMonth.toISOString());

      const userGrowth = previousUsers 
        ? ((totalUsers! - previousUsers) / previousUsers) * 100 
        : 0;

      setData({
        mrr,
        totalUsers: totalUsers || 0,
        activeSubscriptions: activeSubscriptions || 0,
        documentsGenerated: documents || 0,
        revenueGrowth,
        userGrowth
      });
      setError(null);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh: loadAnalytics };
}