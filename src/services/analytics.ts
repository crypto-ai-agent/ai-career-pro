```typescript
import { supabase } from '../lib/supabase';

export async function trackEvent(
  userId: string,
  event: string,
  properties: Record<string, any> = {}
) {
  const { error } = await supabase
    .from('analytics_events')
    .insert({
      user_id: userId,
      event,
      properties,
      created_at: new Date().toISOString()
    });

  if (error) throw error;
}

export async function trackPageView(userId: string, page: string) {
  await trackEvent(userId, 'page_view', { page });
}

export async function trackFeatureUsage(
  userId: string,
  feature: string,
  properties: Record<string, any> = {}
) {
  await trackEvent(userId, 'feature_usage', { feature, ...properties });
}

export async function trackSubscriptionEvent(
  userId: string,
  action: 'subscribe' | 'upgrade' | 'downgrade' | 'cancel',
  plan: string
) {
  await trackEvent(userId, 'subscription', { action, plan });
}

export async function trackError(
  userId: string,
  error: Error,
  context: Record<string, any> = {}
) {
  await trackEvent(userId, 'error', {
    message: error.message,
    stack: error.stack,
    ...context
  });
}
```