import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@1.0.0';

const resend = new Resend('RESEND_API_KEY_HERE');

const TEMPLATES = {
  welcome: {
    subject: 'Welcome to AI Career Pro!',
    html: (data: any) => `
      <h1>Welcome to AI Career Pro, ${data.name}!</h1>
      <p>We're excited to help you advance your career with our AI-powered tools.</p>
      <p>Get started by:</p>
      <ul>
        <li>Optimizing your CV</li>
        <li>Creating a cover letter</li>
        <li>Preparing for interviews</li>
      </ul>
    `
  },
  'password-reset': {
    subject: 'Reset Your Password',
    html: (data: any) => `
      <h1>Password Reset Request</h1>
      <p>Click the button below to reset your password:</p>
      <a href="${data.resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
        Reset Password
      </a>
    `
  },
  'subscription-confirmation': {
    subject: 'Subscription Confirmed!',
    html: (data: any) => `
      <h1>Thank You for Subscribing!</h1>
      <p>Your ${data.plan} plan is now active.</p>
      <p>You now have access to all ${data.plan} features.</p>
    `
  },
  'usage-limit-warning': {
    subject: 'Usage Limit Warning',
    html: (data: any) => `
      <h1>Usage Limit Warning</h1>
      <p>You're approaching your usage limit for ${data.feature}.</p>
      <p>Consider upgrading your plan to get more usage.</p>
      <a href="${data.upgradeUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
        Upgrade Plan
      </a>
    `
  }
};

serve(async (req) => {
  try {
    const { to, templateId, data } = await req.json();
    
    if (!TEMPLATES[templateId]) {
      return new Response(
        JSON.stringify({ error: 'Invalid template ID' }),
        { status: 400 }
      );
    }

    const template = TEMPLATES[templateId];
    const { error } = await resend.emails.send({
      from: 'AI Career Pro <noreply@aicareerpro.com>',
      to,
      subject: template.subject,
      html: template.html(data)
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
});