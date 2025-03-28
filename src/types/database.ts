export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  company?: string;
  job_title?: string;
  experience_level?: string;
  notification_preferences?: {
    newFeatures: boolean;
    tips: boolean;
    marketing: boolean;
  };
  created_at: string;
  updated_at: string;
}

export type UpdateProfile = Partial<Omit<Profile, 'id' | 'created_at'>>;

export interface Subscription {
  id: string;
  user_id: string;
  services: {
    cv_optimizer?: 'free' | 'pro' | 'enterprise';
    cover_letter?: 'free' | 'pro' | 'enterprise';
    email_preparer?: 'free' | 'pro' | 'enterprise';
    interview_coach?: 'free' | 'pro' | 'enterprise';
  };
  package_plan?: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export type InsertSubscription = Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSubscription = Partial<Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export interface CoverLetter {
  id: string;
  user_id: string;
  title: string;
  company: string;
  content: string;
  job_title: string;
  recipient: string;
  created_at: string;
  updated_at: string;
}

export type InsertCoverLetter = Omit<CoverLetter, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCoverLetter = Partial<Omit<CoverLetter, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export interface CV {
  id: string;
  user_id: string;
  title: string;
  content: string;
  industry: string;
  target_role: string;
  experience_level: string;
  created_at: string;
  updated_at: string;
}

export type InsertCV = Omit<CV, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCV = Partial<Omit<CV, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export interface Email {
  id: string;
  user_id: string;
  title: string;
  content: string;
  recipient: string;
  email_type: string;
  company: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export type InsertEmail = Omit<Email, 'id' | 'created_at' | 'updated_at'>;
export type UpdateEmail = Partial<Omit<Email, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export interface Interview {
  id: string;
  user_id: string;
  title: string;
  interview_type: string;
  role: string;
  score: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    communicationClarity: number;
    structureAndOrganization: number;
    nextSteps: string[];
  };
  created_at: string;
  updated_at: string;
}

export type InsertInterview = Omit<Interview, 'id' | 'created_at' | 'updated_at'>;
export type UpdateInterview = Partial<Omit<Interview, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export interface Newsletter {
  id: string;
  subject: string;
  content: string;
  type: string;
  sent_to: number;
  sent_at: string;
}