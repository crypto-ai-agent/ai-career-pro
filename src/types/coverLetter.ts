export interface FormData {
  jobTitle: string;
  company: string;
  recipientDescription: string;
  keySkills: string;
  experience: string;
  tone: 'professional' | 'enthusiastic' | 'confident';
  language: string;
  length: 'short' | 'medium' | 'long';
}