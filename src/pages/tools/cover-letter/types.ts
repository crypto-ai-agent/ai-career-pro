import { z } from 'zod';

export const coverLetterSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  recipientDescription: z.string(),
  keySkills: z.string().min(1, 'Key skills are required'),
  experience: z.string().min(1, 'Experience is required'),
  tone: z.enum(['professional', 'enthusiastic', 'confident']),
  language: z.string(),
  length: z.enum(['short', 'medium', 'long'])
});

export type CoverLetterFormData = z.infer<typeof coverLetterSchema>;

export const initialFormData: CoverLetterFormData = {
  jobTitle: '',
  company: '',
  recipientDescription: '',
  keySkills: '',
  experience: '',
  tone: 'professional',
  language: 'English',
  length: 'medium'
};