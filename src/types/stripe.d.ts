declare global {
  interface Window {
    Stripe?: stripe.StripeStatic;
  }
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete';
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: {
    data: Array<{
      price: {
        id: string;
        product: string;
      };
    }>;
  };
}

export interface StripePrice {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: 'month' | 'year';
  };
  product: string;
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
}