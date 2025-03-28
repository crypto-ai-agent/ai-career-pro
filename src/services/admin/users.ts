import { supabase } from '../../lib/supabase';
import type { UserListResponse } from '../../types/admin';

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