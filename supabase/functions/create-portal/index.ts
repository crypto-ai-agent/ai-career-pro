import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const stripe = new Stripe('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', {
  apiVersion: '2023-10-16',
});

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    const { userId } = await req.json();

    // Get Stripe customer ID from Supabase
    const { data: subscription, error } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (error || !subscription?.stripe_customer_id) {
      throw new Error('No Stripe customer found');
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${req.headers.get('origin')}/settings`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Portal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
});