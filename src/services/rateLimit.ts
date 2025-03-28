import { supabase } from '../lib/supabase';

const RATE_LIMITS = {
  'cv-optimizer': { points: 10, interval: '1 hour' },
  'cover-letter': { points: 10, interval: '1 hour' },
  'email-preparer': { points: 20, interval: '1 hour' },
  'interview-coach': { points: 5, interval: '1 hour' }
};

export async function checkRateLimit(userId: string, feature: keyof typeof RATE_LIMITS): Promise<boolean> {
  const { data: usage } = await supabase
    .from('usage_metrics')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('type', feature)
    .gte('created_at', new Date(Date.now() - 3600000).toISOString());

  const count = usage?.length || 0;
  return count < RATE_LIMITS[feature].points;
}

export async function incrementRateLimit(userId: string, feature: keyof typeof RATE_LIMITS): Promise<void> {
  await supabase
    .from('usage_metrics')
    .insert({
      user_id: userId,
      type: feature,
      count: 1,
      created_at: new Date().toISOString()
    });
}

export async function getRemainingUsage(userId: string, feature: keyof typeof RATE_LIMITS): Promise<{
  remaining: number;
  resetTime: Date;
}> {
  const { data: usage } = await supabase
    .from('usage_metrics')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('type', feature)
    .gte('created_at', new Date(Date.now() - 3600000).toISOString());

  const used = usage?.length || 0;
  const limit = RATE_LIMITS[feature].points;
  const resetTime = new Date(Date.now() + 3600000);

  return {
    remaining: Math.max(0, limit - used),
    resetTime
  };
}