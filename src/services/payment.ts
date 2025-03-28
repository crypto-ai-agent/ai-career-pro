import { supabase } from '../lib/supabase';
import { STRIPE_CONFIG } from '../config/stripe';
import type { Subscription } from '../types/database';

/**
 * Creates a Stripe checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string, 
  priceId: string
): Promise<void> {
  try {
    const { data: { session_url }, error } = await supabase.functions.invoke('create-checkout', {
      body: { 
        priceId,
        userId,
        successUrl: STRIPE_CONFIG.SUCCESS_URL,
        cancelUrl: STRIPE_CONFIG.CANCEL_URL
      }
    });

    if (error) throw error;
    if (!session_url) throw new Error('No checkout URL returned');

    // Redirect to checkout
    window.location.href = session_url;
  } catch (error) {
    console.error('Checkout error:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Creates a Stripe billing portal session
 */
export async function createPortalSession(userId: string): Promise<void> {
  try {
    const { data: { url }, error } = await supabase.functions.invoke('create-portal', {
      body: { 
        userId,
        returnUrl: STRIPE_CONFIG.PORTAL_CONFIG.returnUrl
      }
    });

    if (error) throw error;
    if (!url) throw new Error('No portal URL returned');

    // Redirect to portal
    window.location.href = url;
  } catch (error) {
    console.error('Portal error:', error);
    throw new Error('Failed to create portal session');
  }
}

/**
 * Gets the current subscription for a user
 */
export async function getSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Cancels a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId);

  if (error) throw error;
}

/**
 * Gets billing history for a user
 */
export async function getBillingHistory(userId: string): Promise<Array<{
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  created_at: string;
}>> {
  const { data, error } = await supabase
    .from('billing_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}