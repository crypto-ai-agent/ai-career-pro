import { loadStripe, Stripe } from '@stripe/stripe-js';

export const STRIPE_CONFIG = {
  PRICES: {
    PACKAGE: {
      PRO: {
        MONTHLY: 'price_Ra6MwhYadkU7vK',
        YEARLY: 'price_Ra6MwhYadkU7vK_yearly'
      },
      ENTERPRISE: {
        MONTHLY: 'price_Ra6MwhYadkU7vK_enterprise',
        YEARLY: 'price_Ra6MwhYadkU7vK_enterprise_yearly'
      }
    }
  },
  SUCCESS_URL: `${window.location.origin}/dashboard?payment=success`,
  CANCEL_URL: `${window.location.origin}/pricing?payment=cancelled`,
  PORTAL_CONFIG: {
    returnUrl: `${window.location.origin}/settings`
  }
} as const;

// Clé publique Stripe
const stripePublicKey = 'pk_live_51Qgv2OH9IOyemgAhLuxxLI5hrIqSVtb9hhmGVRlHFsH1bit7OwFuNj5WbbRrImQxy2N80mbFfC4cq7bNg2hb5ASs00rOjKQznm';

if (!stripePublicKey) {
  throw new Error('Missing Stripe public key');
}

// Fonction pour charger Stripe
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};
