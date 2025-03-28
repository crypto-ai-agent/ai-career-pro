import { ENDPOINTS } from './constants';

/**
 * Service Configuration
 */
export const SERVICES = {
  COVER_LETTER: {
    endpoint: ENDPOINTS.COVER_LETTER,
    limits: {
      free: 1,
      pro: -1,
      enterprise: -1
    },
    pricing: {
      free: 0,
      pro: 7.99,
      enterprise: 19.99
    }
  },
  CV: {
    endpoint: ENDPOINTS.CV,
    limits: {
      free: 1,
      pro: -1,
      enterprise: -1
    },
    pricing: {
      free: 0,
      pro: 9.99,
      enterprise: 24.99
    }
  },
  EMAIL: {
    endpoint: ENDPOINTS.EMAIL,
    limits: {
      free: 2,
      pro: -1,
      enterprise: -1
    },
    pricing: {
      free: 0,
      pro: 5.99,
      enterprise: 14.99
    }
  },
  INTERVIEW: {
    endpoint: ENDPOINTS.INTERVIEW,
    limits: {
      free: 1,
      pro: 10,
      enterprise: -1
    },
    pricing: {
      free: 0,
      pro: 12.99,
      enterprise: 29.99
    }
  }
} as const;