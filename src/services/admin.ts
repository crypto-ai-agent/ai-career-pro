import { supabase } from '../lib/supabase';
import type { AdminStats, UserListResponse } from '../types/admin';

export async function getAdminStats(): Promise<AdminStats> {
  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Get subscription stats
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('plan, status');

  const subscriptionStats = subscriptions?.reduce((acc, sub) => {
    if (sub.status === 'active') {
      acc.activeSubscriptions++;
      acc[sub.plan]++;
    }
    return acc;
  }, {
    activeSubscriptions: 0,
    free: 0,
    pro: 0,
    enterprise: 0
  });

  // Get document counts
  const { count: coverLetters } = await supabase
    .from('cover_letters')
    .select('*', { count: 'exact', head: true });

  const { count: cvs } = await supabase
    .from('cvs')
    .select('*', { count: 'exact', head: true });

  const { count: emails } = await supabase
    .from('emails')
    .select('*', { count: 'exact', head: true });

  return {
    totalUsers: totalUsers || 0,
    ...subscriptionStats,
    documentsGenerated: (coverLetters || 0) + (cvs || 0) + (emails || 0)
  };
}

export async function getUsers(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<UserListResponse> {
  let query = supabase
    .from('profiles')
    .select(`
      id,
      email,
      full_name,
      company,
      job_title,
      experience_level,
      is_admin,
      created_at,
      subscriptions (
        plan,
        status,
        billing_cycle
      )
    `, { count: 'exact' });

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .range((page - 1) * limit, page * limit - 1)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return {
    users: data || [],
    total: count || 0,
    page,
    limit
  };
}

export async function updateUser(userId: string, updates: {
  is_admin?: boolean;
  [key: string]: any;
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) throw error;
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('is_admin', { user_id: userId });

  if (error) throw error;
  return data || false;
}