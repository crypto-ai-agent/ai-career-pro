import { supabase } from './supabase';
import type { EmailTemplate, EmailOptions } from '../types/email';

class EmailService {
  private static instance: EmailService;
  private templates: Map<string, EmailTemplate> = new Map();

  private constructor() {
    this.loadTemplates().catch(console.error);
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async loadTemplates(): Promise<void> {
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

  private async checkPreferences(email: string, preference?: string): Promise<boolean> {
    if (!preference) return true;
    
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

  private async getEmailSecret(): Promise<string> {
    const { data: secret, error } = await supabase.rpc('get_secret', {
      secret_name: 'email_api_key'
    });

    if (error || !secret) {
      throw new Error('Failed to get email API key');
    }

    return secret;
  }

  private compileTemplate(template: string, variables: Record<string, unknown>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => 
      String(variables[key] ?? '')
    );
  }

  public async send({ 
    to, 
    template, 
    variables, 
    preferences 
  }: EmailOptions): Promise<boolean> {
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
      const compiledContent = this.compileTemplate(emailTemplate.content, variables);
      const compiledSubject = this.compileTemplate(emailTemplate.subject, variables);

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
          subject: compiledSubject,
          html: this.addUnsubscribeLink(compiledContent, to)
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      // Log success
      await this.logEmailSent(to, template, variables);
      return true;
    } catch (error) {
      // Log failure
      await this.logEmailError(to, template, error, variables);
      throw error;
    }
  }

  private async logEmailSent(
    to: string, 
    template: string, 
    metadata: Record<string, unknown>
  ): Promise<void> {
    await supabase.from('email_logs').insert({
      recipient: to,
      template,
      status: 'sent',
      metadata
    });
  }

  private async logEmailError(
    to: string, 
    template: string, 
    error: unknown, 
    metadata: Record<string, unknown>
  ): Promise<void> {
    await supabase.from('email_logs').insert({
      recipient: to,
      template,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata
    });
  }

  private addUnsubscribeLink(html: string, email: string): string {
    const unsubscribeUrl = `https://aicareerpro.com/settings?email=${encodeURIComponent(email)}#email-preferences`;
    
    return `${html}
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5E7EB; text-align: center;">
        <p style="color: #6B7280; font-size: 12px;">
          You received this email because you're an AI Career Pro user.
          <a href="${unsubscribeUrl}" style="color: #4F46E5; text-decoration: underline;">
            Manage email preferences
          </a>
        </p>
      </div>`;
  }
}

export const emailService = EmailService.getInstance();