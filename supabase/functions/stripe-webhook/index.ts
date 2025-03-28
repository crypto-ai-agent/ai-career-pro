import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const stripe = new Stripe('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', {
  apiVersion: '2023-10-16',
});

// Get webhook secret from environment variable
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
if (!webhookSecret) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET');
}

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No signature found');
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoiceSuccess(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoiceFailed(event.data.object);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleCheckoutCompleted(session: any) {
  const { client_reference_id: userId, subscription } = session;
  
  const { data: { plan } } = await supabaseAdmin
    .from('subscriptions')
    .update({
      stripe_subscription_id: subscription,
      stripe_customer_id: session.customer,
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select('plan')
    .single();

  // Send confirmation email
  await fetch(new URL('/functions/v1/send-email', Deno.env.get('SUPABASE_URL')), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
    },
    body: JSON.stringify({
      to: session.customer_details.email,
      templateId: 'subscription-confirmation',
      data: { plan }
    })
  });
}

async function handleSubscriptionUpdated(subscription: any) {
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription: any) {
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleInvoiceSuccess(invoice: any) {
  // Update subscription status and payment history
  await supabaseAdmin
    .from('billing_history')
    .insert({
      user_id: invoice.customer_id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'paid',
      invoice_id: invoice.id,
      created_at: new Date().toISOString()
    });
}

async function handleInvoiceFailed(invoice: any) {
  // Update subscription status and send notification
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', invoice.customer);

  // Send failed payment notification
  await fetch(new URL('/functions/v1/send-email', Deno.env.get('SUPABASE_URL')), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
    },
    body: JSON.stringify({
      to: invoice.customer_email,
      templateId: 'payment-failed',
      data: { 
        amount: invoice.amount_due,
        currency: invoice.currency
      }
    })
  });
}