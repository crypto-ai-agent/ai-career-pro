import { supabase } from '../../lib/supabase';
import type { AdminStats } from '../../types/admin';

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