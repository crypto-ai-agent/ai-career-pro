import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export function useUserActivity(userId?: string) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadActivities();
    }
  }, [userId]);

  const loadActivities = async () => {
    try {
      let query = supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error: err } = await query;
      if (err) throw err;

      setActivities(data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading user activities:', err);
      setError('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const trackActivity = async (
    userId: string,
    action: string,
    details?: Record<string, any>
  ) => {
    try {
      await supabase.rpc('track_user_activity', {
        p_user_id: userId,
        p_action: action,
        p_details: details
      });
      loadActivities();
    } catch (err) {
      console.error('Error tracking activity:', err);
    }
  };

  return {
    activities,
    loading,
    error,
    refresh: loadActivities,
    trackActivity
  };
}