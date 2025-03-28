/**
 * Central API configuration
 */

// Base URLs
export const API_BASE = 'https://n8n.crypto-ai-agent.com/workflow';

// API Endpoints
export const API_ENDPOINTS = {
  COVER_LETTER: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
  CV: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
  EMAIL: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
  INTERVIEW: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
};


// Endpoints
export const ENDPOINTS = {
  COVER_LETTER: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
  CV: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
  EMAIL: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
  INTERVIEW: `${API_BASE}/1c328895-2736-4acd-811c-e199dcbdb312`,
};



// API Configuration
export const REQUEST_CONFIG = {
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  ERROR_CODES: {
    RATE_LIMIT: 429,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  }
} as const;



// API Configuration
export const API_CONFIG = {
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  ERROR_CODES: {
    RATE_LIMIT: 429,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  }
} as const;