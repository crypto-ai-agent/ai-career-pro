import { emailService } from '../config/services';

export type { EmailOptions } from '../types/email';

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  // Send to support
  await emailService.send({
    to: 'support@aicareerpro.com',
    template: 'contact-form-support',
    variables: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message
    }
  });

  // Send confirmation to user
  await emailService.send({
    to: data.email,
    template: 'contact-form-confirmation',
    variables: {
      name: data.name,
      message: data.message
    }
  });
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  await emailService.send({
    to: email,
    template: 'welcome_email',
    variables: { name }
  });
}

export async function sendCVOptimizationEmail(
  email: string, 
  cvTitle: string, 
  downloadUrl: string
): Promise<void> {
  await emailService.send({
    to: email,
    template: 'cv_optimization_complete',
    variables: { cvTitle, downloadUrl },
    preferences: 'toolCompletions'
  });
}

export async function sendCoverLetterEmail(
  email: string, 
  company: string, 
  role: string, 
  downloadUrl: string
): Promise<void> {
  await emailService.send({
    to: email,
    template: 'cover_letter_complete',
    variables: { company, role, downloadUrl },
    preferences: 'toolCompletions'
  });
}

export async function sendInterviewFeedbackEmail(
  email: string, 
  role: string, 
  score: number, 
  feedback: any
): Promise<void> {
  await emailService.send({
    to: email,
    template: 'interview_feedback',
    variables: { role, score, feedback },
    preferences: 'toolCompletions'
  });
}

export async function sendEmail(
  email: string, 
  emailType: string, 
  downloadUrl: string
): Promise<void> {
  await emailService.send({
    to: email,
    template: 'email_preparation_complete',
    variables: { emailType, downloadUrl },
    preferences: 'toolCompletions'
  });
}

export async function sendUsageLimitWarning(email: string, feature: string, remaining: number): Promise<void> {
  await emailService.send({
    to: email,
    template: 'usage_limit_warning',
    variables: { feature, remaining }
  });
}