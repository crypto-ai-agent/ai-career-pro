import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserFeedback {
  id: string;
  user_id: string;
  type: string;
  content: string;
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export function useUserFeedback() {
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const { data, error: err } = await supabase
        .from('user_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;

      setFeedback(data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading user feedback:', err);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (
    userId: string,
    type: string,
    content: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    try {
      const { data, error: err } = await supabase
        .from('user_feedback')
        .insert({
          user_id: userId,
          type,
          content,
          priority,
          status: 'pending'
        })
        .select()
        .single();

      if (err) throw err;

      setFeedback(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error submitting feedback:', err);
      throw err;
    }
  };

  const updateFeedback = async (
    id: string,
    updates: Partial<Omit<UserFeedback, 'id' | 'user_id' | 'created_at'>>
  ) => {
    try {
      const { data, error: err } = await supabase
        .from('user_feedback')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;

      setFeedback(prev => prev.map(f => f.id === id ? data : f));
      return data;
    } catch (err) {
      console.error('Error updating feedback:', err);
      throw err;
    }
  };

  return {
    feedback,
    loading,
    error,
    refresh: loadFeedback,
    submitFeedback,
    updateFeedback
  };
}