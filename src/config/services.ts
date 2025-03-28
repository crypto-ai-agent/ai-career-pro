import { emailService } from '../lib/emailService';
import { supabase } from '../lib/supabase';
import type { ApiKey } from '../types/admin';

// Export singleton service instances
export { emailService };

// Service configuration
export const SERVICE_CONFIG = {
  EMAIL: {
    FROM_ADDRESS: 'AI Career Pro <noreply@aicareerpro.com>',
    SUPPORT_EMAIL: 'support@aicareerpro.com',
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
  API: {
    BASE_URL: 'https://shayldon.app.n8n.cloud/webhook-test',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
  SUPABASE: {
    URL: import.meta.env.VITE_SUPABASE_URL,
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  API_KEYS: {
    TABLE: 'api_keys',
    MAX_KEYS: 10,
    KEY_LENGTH: 32,
  }
} as const;

// Service endpoints
export const ENDPOINTS = {
  COVER_LETTER: `${SERVICE_CONFIG.API.BASE_URL}/1c328895-2736-4acd-811c-e199dcbdb312`,
  CV: `${SERVICE_CONFIG.API.BASE_URL}/1c328895-2736-4acd-811c-e199dcbdb312`,
  EMAIL: `${SERVICE_CONFIG.API.BASE_URL}/1c328895-2736-4acd-811c-e199dcbdb312`,
  INTERVIEW: `${SERVICE_CONFIG.API.BASE_URL}/1c328895-2736-4acd-811c-e199dcbdb312`,
} as const;

// API key utilities
export async function generateApiKey(): Promise<string> {
  const bytes = new Uint8Array(SERVICE_CONFIG.API_KEYS.KEY_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Service utilities
export async function getServiceSecret(name: string): Promise<string> {
  const { data: secret, error } = await supabase.rpc('get_secret', {
    secret_name: name
  });

  if (error || !secret) {
    throw new Error(`Failed to get secret: ${name}`);
  }

  return secret;
}