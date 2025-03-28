export interface ApiKey {
  id: string;
  name: string;
  value: string;
  description: string;
  last_used?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: Record<string, number>;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  free: number;
  pro: number;
  enterprise: number;
  documentsGenerated: number;
}

export interface UserListResponse {
  users: Array<{
    id: string;
    email: string;
    full_name?: string;
    company?: string;
    job_title?: string;
    experience_level?: string;
    is_admin: boolean;
    created_at: string;
    subscriptions?: Array<{
      plan: string;
      status: string;
      billing_cycle: string;
    }>;
  }>;
  total: number;
  page: number;
  limit: number;
}