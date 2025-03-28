import { supabase } from '../lib/supabase';
import { getSubscription } from './database';

const USAGE_LIMITS = {
  free: {
    coverLetters: 1,
    cvs: 1,
    emails: 2,
    interviews: 1
  },
  pro: {
    coverLetters: 10,
    cvs: 5,
    emails: 20,
    interviews: 10
  },
  enterprise: {
    coverLetters: Infinity,
    cvs: Infinity,
    emails: Infinity,
    interviews: Infinity
  }
};

export async function trackUsage(userId: string, type: keyof typeof USAGE_LIMITS.free): Promise<void> {
  const { error } = await supabase.rpc('increment_usage', {
    p_user_id: userId,
    p_type: type,
    p_date: new Date().toISOString().split('T')[0]
  });

  if (error) throw error;
}

export async function checkUsageLimit(userId: string, type: keyof typeof USAGE_LIMITS.free): Promise<boolean> {
  const subscription = await getSubscription(userId);
  if (!subscription || subscription.status !== 'active') {
    return false;
  }

  const { data: usage } = await supabase
    .from('usage_metrics')
    .select('count')
    .eq('user_id', userId)
    .eq('type', type)
    .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .single();

  const currentUsage = usage?.count || 0;
  const limit = USAGE_LIMITS[subscription.plan][type];

  return currentUsage < limit;
}