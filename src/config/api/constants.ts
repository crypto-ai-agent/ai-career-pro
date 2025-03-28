/**
 * API Base Configuration
 */
export const API_BASE = 'https://shayldon.app.n8n.cloud/webhook-test';

/**
 * API Endpoints Configuration
 */
export const ENDPOINTS = {
  COVER_LETTER: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
  CV: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
  EMAIL: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
  INTERVIEW: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
} as const;

/**
 * API Request Configuration
 */
export const REQUEST_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

/**
 * API Error Codes
 */
export const ERROR_CODES = {
  RATE_LIMIT: 429,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const;