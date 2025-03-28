import { z } from 'zod';

export const interviewSchema = z.object({
  interviewType: z.enum(['technical', 'behavioral', 'leadership', 'role-specific']),
  role: z.string().min(1, 'Role is required'),
  industry: z.string().min(1, 'Industry is required'),
  experienceLevel: z.enum(['entry-level', 'mid-level', 'senior', 'executive']),
  specificFocus: z.string().optional(),
  preferredLanguage: z.string().default('English')
});

export type InterviewFormData = z.infer<typeof interviewSchema>;

export const initialFormData: InterviewFormData = {
  interviewType: 'behavioral',
  role: '',
  industry: '',
  experienceLevel: 'mid-level',
  specificFocus: '',
  preferredLanguage: 'English'
};

export interface InterviewQuestion {
  id: string;
  question: string;
  context?: string;
  type: InterviewFormData['interviewType'];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  technicalAccuracy?: number;
  communicationClarity: number;
  structureAndOrganization: number;
  nextSteps: string[];
}

export interface InterviewSession {
  id: string;
  type: InterviewFormData['interviewType'];
  role: string;
  date: string;
  score: number;
  questions: InterviewQuestion[];
  feedback: InterviewFeedback;
}