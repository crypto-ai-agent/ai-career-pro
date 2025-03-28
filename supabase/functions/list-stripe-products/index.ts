import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  try {
    // List all active products
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    });

    // Get all prices for each product
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true
        });

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          prices: prices.data.map(price => ({
            id: price.id,
            nickname: price.nickname,
            unit_amount: price.unit_amount,
            currency: price.currency,
            recurring: price.recurring
          }))
        };
      })
    );

    return new Response(
      JSON.stringify(productsWithPrices),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error listing products:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});