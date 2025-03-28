import { supabase } from '../../lib/supabase';
import type { Plan } from '../../types/admin';

export async function getSubscriptionPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateSubscriptionPlan(id: string, updates: Partial<Plan>): Promise<Plan> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createSubscriptionPlan(plan: Omit<Plan, 'id'>): Promise<Plan> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .insert({
      ...plan,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSubscriptionPlan(id: string): Promise<void> {
  const { error } = await supabase
    .from('subscription_plans')
    .delete()
    .eq('id', id);

  if (error) throw error;
}