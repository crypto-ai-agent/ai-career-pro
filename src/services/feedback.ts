import { supabase } from '../lib/supabase';
import type { UserFeedback } from '../types/feedback';

export async function submitFeedback(feedback: Omit<UserFeedback, 'id' | 'created_at' | 'updated_at'>): Promise<UserFeedback> {
  const { data, error } = await supabase
    .from('user_feedback')
    .insert(feedback)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserFeedback(userId: string): Promise<UserFeedback[]> {
  const { data, error } = await supabase
    .from('user_feedback')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateFeedbackStatus(
  feedbackId: string,
  status: 'pending' | 'in_progress' | 'resolved',
  assignedTo?: string
): Promise<void> {
  const { error } = await supabase
    .from('user_feedback')
    .update({
      status,
      assigned_to: assignedTo,
      updated_at: new Date().toISOString()
    })
    .eq('id', feedbackId);

  if (error) throw error;
}