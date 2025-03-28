import { supabase } from '../lib/supabase';
import type { EmailTemplate } from '../types/email';

interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  variables: Record<string, any>;
  preferences?: string;
}

class EmailService {
  private static instance: EmailService;
  private templates: Map<string, EmailTemplate> = new Map();

  private constructor() {
    this.loadTemplates();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async loadTemplates() {
    try {
      const { data: templates, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('active', true);

      if (error) throw error;

      templates?.forEach(template => {
        this.templates.set(template.name, template);
      });
    } catch (error) {
      console.error('Failed to load email templates:', error);
    }
  }

  private async checkPreferences(email: string, preference: string): Promise<boolean> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('email', email)
        .single();

      return profile?.notification_preferences?.[preference] ?? false;
    } catch (error) {
      console.error('Error checking email preferences:', error);
      return false;
    }
  }

  private async getEmailSecret(): Promise<string | null> {
    try {
      const { data: secret, error } = await supabase.rpc('get_secret', {
        secret_name: 'email_api_key'
      });

      if (error) throw error;
      return secret;
    } catch (error) {
      console.error('Failed to get email API key:', error);
      return null;
    }
  }

  private compileTemplate(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
  }

  public async sendEmail({ to, subject, template, variables, preferences }: SendEmailOptions): Promise<boolean> {
    try {
      // Check preferences if specified
      if (preferences && !(await this.checkPreferences(to, preferences))) {
        console.log(`User ${to} has opted out of ${preferences} emails`);
        return false;
      }

      const emailTemplate = this.templates.get(template);
      if (!emailTemplate) {
        throw new Error(`Template ${template} not found`);
      }

      const apiKey = await this.getEmailSecret();
      if (!apiKey) {
        throw new Error('Email API key not found');
      }

      const compiledContent = this.compileTemplate(emailTemplate.content, variables);

      // Send email using email service (e.g., Resend)
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'AI Career Pro <noreply@aicareerpro.com>',
          to,
          subject: this.compileTemplate(emailTemplate.subject, variables),
          html: compiledContent
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      // Log email sent
      await supabase.from('email_logs').insert({
        recipient: to,
        template: template,
        status: 'sent',
        metadata: { variables }
      });

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Log email failure
      await supabase.from('email_logs').insert({
        recipient: to,
        template: template,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { variables }
      });

      return false;
    }
  }
}

export const emailService = EmailService.getInstance();