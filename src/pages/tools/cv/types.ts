import { z } from 'zod';

export const cvSchema = z.object({
  currentCV: z.instanceof(File).nullable(),
  targetRole: z.string().min(1, 'Target role is required'),
  industry: z.string().min(1, 'Industry is required'),
  experienceLevel: z.enum(['entry-level', 'mid-level', 'senior', 'executive']),
  keySkills: z.string().min(1, 'Key skills are required')
});

export type CVFormData = z.infer<typeof cvSchema>;

export const initialFormData: CVFormData = {
  currentCV: null,
  targetRole: '',
  industry: '',
  experienceLevel: 'mid-level',
  keySkills: ''
};