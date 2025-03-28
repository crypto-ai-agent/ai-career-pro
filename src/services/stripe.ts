import { supabase } from '../lib/supabase';

export async function createCheckoutSession(userId: string, priceId: string) {
  const { data: { url }, error } = await supabase
    .functions.invoke('create-checkout-session', {
      body: { priceId, userId }
    });

  if (error) throw error;
  window.location.href = url;
}

export async function createPortalSession(userId: string) {
  const { data: { url }, error } = await supabase
    .functions.invoke('create-portal-session', {
      body: { userId }
    });

  if (error) throw error;
  window.location.href = url;
}

export async function handleWebhook(event: any) {
  const { type, data: { object } } = event;

  switch (type) {
    case 'checkout.session.completed':
      await handleSuccessfulSubscription(object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancellation(object);
      break;
  }
}

async function handleSuccessfulSubscription(session: any) {
  const { customer, subscription } = session;
  
  const { error } = await supabase
    .from('subscriptions')
    .update({
      stripe_customer_id: customer,
      stripe_subscription_id: subscription,
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', session.client_reference_id);

  if (error) throw error;
}

async function handleSubscriptionUpdate(subscription: any) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) throw error;
}

async function handleSubscriptionCancellation(subscription: any) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) throw error;
}