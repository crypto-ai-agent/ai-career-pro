import { AES, enc } from 'crypto-js';

// Get encryption key from environment variable
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  throw new Error('Missing encryption key in environment variables');
}

// Encrypt sensitive data
export function encryptData(data: string): string {
  return AES.encrypt(data, ENCRYPTION_KEY).toString();
}

// Decrypt sensitive data
export function decryptData(encryptedData: string): string {
  const bytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(enc.Utf8);
}

// Session timeout duration in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Check if session has timed out
export function hasSessionTimedOut(lastActivity: number): boolean {
  return Date.now() - lastActivity > SESSION_TIMEOUT;
}

// Update last activity timestamp
export function updateLastActivity(): void {
  localStorage.setItem('lastActivity', Date.now().toString());
}

// Get last activity timestamp
export function getLastActivity(): number {
  const lastActivity = localStorage.getItem('lastActivity');
  return lastActivity ? parseInt(lastActivity, 10) : Date.now();
}

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '');
}

// Generate secure random string for API keys etc
export async function generateApiKey(length: number = 32): Promise<string> {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Validate password strength
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}