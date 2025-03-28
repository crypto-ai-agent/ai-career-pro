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
    const { priceId, userId } = await req.json();

    // Get user email from Supabase
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.email) {
      throw new Error('User not found');
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/dashboard?payment=success`,
      cancel_url: `${req.headers.get('origin')}/pricing?payment=cancelled`,
      client_reference_id: userId,
      customer_email: profile.email,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          user_id: userId
        }
      },
      metadata: {
        user_id: userId
      }
    });

    return new Response(
      JSON.stringify({ session_url: session.url }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Checkout error:', error);
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