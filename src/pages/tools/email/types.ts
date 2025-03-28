import { z } from 'zod';

export const emailSchema = z.object({
  emailType: z.enum(['application', 'followup', 'networking', 'custom']),
  recipient: z.string().min(1, 'Recipient is required'),
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  context: z.string().min(1, 'Context is required'),
  tone: z.enum(['professional', 'friendly', 'formal']),
  additionalNotes: z.string()
});

export type EmailFormData = z.infer<typeof emailSchema>;

export const initialFormData: EmailFormData = {
  emailType: 'application',
  recipient: '',
  company: '',
  role: '',
  context: '',
  tone: 'professional',
  additionalNotes: ''
};