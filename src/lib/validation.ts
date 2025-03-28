import { z } from 'zod';

// Common validation patterns
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const URL_REGEX = /^https?:\/\/.+/;

// Common validation messages
export const ValidationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character',
  url: 'Please enter a valid URL starting with http:// or https://',
  match: (field: string) => `Must match ${field}`,
  min: (n: number) => `Must be at least ${n} characters`,
  max: (n: number) => `Must be at most ${n} characters`
};

// Common validation schemas
const passwordSchema = z.string()
  .min(8, ValidationMessages.min(8))
  .regex(PASSWORD_REGEX, ValidationMessages.password);

const emailSchema = z.string()
  .email(ValidationMessages.email)
  .min(1, ValidationMessages.required);

const urlSchema = z.string()
  .regex(URL_REGEX, ValidationMessages.url);

// Form validation schemas
export const profileSchema = z.object({
  fullName: z.string().min(1, ValidationMessages.required),
  email: emailSchema,
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  experienceLevel: z.enum(['entry-level', 'mid-level', 'senior', 'executive'])
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const resetPasswordSchema = z.object({
  email: emailSchema
});

export const updatePasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
// ... rest of the file remains unchanged