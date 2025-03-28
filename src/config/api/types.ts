/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    code: number;
    message: string;
    details?: any;
  };
}

/**
 * Service Types
 */
export interface ServiceConfig {
  endpoint: string;
  limits: {
    free: number;
    pro: number;
    enterprise: number;
  };
  pricing: {
    free: number;
    pro: number;
    enterprise: number;
  };
}