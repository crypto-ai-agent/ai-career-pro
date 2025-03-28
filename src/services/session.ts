import { supabase } from '../lib/supabase';

export interface Session {
  id: string;
  user_id: string;
  device: string;
  ip_address: string;
  last_active: string;
  created_at: string;
}

export async function getCurrentSessions(userId: string): Promise<Session[]> {
  const { data, error } = await supabase
    .from('active_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('last_active', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function terminateSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('active_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
}

export async function terminateAllOtherSessions(userId: string, currentSessionId: string): Promise<void> {
  const { error } = await supabase
    .from('active_sessions')
    .delete()
    .eq('user_id', userId)
    .neq('id', currentSessionId);

  if (error) throw error;
}

export async function updateSessionActivity(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('active_sessions')
    .update({ last_active: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) throw error;
}