import React from 'react';
import { Mail, Send } from 'lucide-react';
import { SEOHead } from '../components/shared/SEOHead';
import { useSEO } from '../hooks/useSEO';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { FormField, Input, TextArea } from '../components/ui/Form';
import { Button } from '../components/ui/Button';
import { useForm } from '../hooks/useForm';
import { useToast } from '../hooks/useToast';
import { sendContactEmail } from '../services/email';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

export function Contact() {
  const {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset
  } = useForm({
    initialData: initialFormData,
    onSubmit: handleContactSubmission
  });

  const { addToast } = useToast();

  async function handleContactSubmission(data: ContactFormData) {
    try {
      await sendContactEmail(data);
      addToast('success', 'Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      addToast('error', 'Failed to send message. Please try again.');
      throw error;
    }
  }

  const { metadata } = useSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Contact Us - AI Career Pro"}
        description={metadata?.description || "Get in touch with our team for support and inquiries"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/contact"
      />
      <PageHeader
        title="Contact Us"
        description="Get in touch with our team"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* AI Integration Notice */}
        <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-indigo-900 mb-2">
            AI-Powered Support
          </h2>
          <p className="text-indigo-700">
            As part of the crypto-ai-agent ecosystem, our support system is powered by advanced AI agents. 
            This allows us to provide 24/7 assistance while maintaining high-quality, consistent support. 
            Your inquiries are handled by AI agents trained specifically for career-related support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Name">
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField label="Email">
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField label="Subject">
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField label="Message">
                  <TextArea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </FormField>

                <Button type="submit" isLoading={isSubmitting}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  AI Career Pro Support
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-indigo-600 mr-3" />
                    <a
                      href="mailto:support@aicareerpro.com"
                      className="text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      support@aicareerpro.com
                    </a>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    A venture of crypto-ai-agent
                    <br />
                    Fully autonomous AI-powered operations
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Office Hours
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Response Time
                </h3>
                <p className="text-gray-600">
                  We aim to respond to all inquiries within 24 hours during business days.
                  For urgent matters, please include "URGENT" in your subject line.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}