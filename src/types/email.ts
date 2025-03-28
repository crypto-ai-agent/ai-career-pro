export interface EmailOptions {
  to: string;
  template: string;
  variables: Record<string, unknown>;
  preferences?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailFormData {
  emailType: 'application' | 'followup' | 'networking' | 'custom';
  recipient: string;
  company: string;
  role: string;
  context: string;
  tone: 'professional' | 'friendly' | 'formal';
  additionalNotes: string;
}