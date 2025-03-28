import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { SEOHead } from '../../../components/shared/SEOHead';
import { useSEO } from '../../../hooks/useSEO';
import { generateEmail } from '../../../services/api';
import { useForm } from '../../../hooks/useForm';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/layout/PageHeader';
import { RecentItems } from '../../../components/shared/RecentItems';
import { GeneratedContent } from '../../../components/shared/GeneratedContent';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import { DownloadButton } from '../../../components/shared/DownloadButton';
import { EmailForm } from './EmailForm';
import { EmailFormData, initialFormData } from './types';
import { useAuth } from '../../../contexts/AuthContext';
import { getEmails, createEmail } from '../../../services/database';
import type { Email } from '../../../types/database';

export function EmailPreparer() {
  const { user } = useAuth();
  const {
    formData,
    isLoading,
    error,
    handleChange: handleInputChange,
    handleSubmit
  } = useForm({
    initialData: initialFormData,
    onSubmit: handleEmailGeneration
  });

  const [generatedEmail, setGeneratedEmail] = React.useState<string>('');
  const [recentEmails, setRecentEmails] = useState<Email[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(true);

  useEffect(() => {
    async function loadRecentEmails() {
      if (!user) return;
      try {
        const emails = await getEmails(user.id);
        setRecentEmails(emails.slice(0, 4));
      } catch (error) {
        console.error('Error loading recent emails:', error);
      } finally {
        setLoadingEmails(false);
      }
    }

    loadRecentEmails();
  }, [user]);

  async function handleEmailGeneration(data: EmailFormData) {
    if (!user) return;

    const result = await generateEmail(data);
    setGeneratedEmail(result);
    
    const newEmail = await createEmail({
      user_id: user.id,
      title: `${data.emailType} - ${data.company}`,
      content: result,
      recipient: data.recipient,
      email_type: data.emailType,
      company: data.company,
      role: data.role
    });
    
    setRecentEmails(prev => [newEmail, ...prev.slice(0, 3)]);
  }

  const { metadata } = useSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Email Preparer Tool - AI Career Pro"}
        description={metadata?.description || "Create professional job application and follow-up emails"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/tools/email"
      />
      <PageHeader 
        title="AI Email Preparer"
        description="Create professional emails for your job search"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`${generatedEmail ? 'lg:w-1/3' : 'lg:w-2/3'} transition-all duration-300`}>
            <Card>
              {error && <ErrorAlert message={error} />}
              <EmailForm
                formData={formData}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
              />
            </Card>
          </div>

          <div className={`${generatedEmail ? 'lg:w-2/3' : 'lg:w-1/3'} transition-all duration-300`}>
            <GeneratedContent
              content={generatedEmail}
              icon={Mail}
              emptyTitle="Ready to Write"
              emptyDescription="Fill out the form to generate your professional email"
            />
          </div>
        </div>

        <RecentItems
          title="Recent Emails"
          items={recentEmails}
          renderItem={(item) => (
            <Card key={item.id}>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.recipient}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <DownloadButton
                  content={item.content}
                  filename={item.title}
                />
              </div>
            </Card>
          )}
        />
      </div>
    </div>
  );
}