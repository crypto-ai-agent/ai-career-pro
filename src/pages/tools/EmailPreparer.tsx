import React from 'react';
import { Mail } from 'lucide-react';
import { EmailFormData } from '../../types/email';
import { generateEmail } from '../../services/api';
import { useForm } from '../../hooks/useForm';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card } from '../../components/ui/Card';
import { FormField, Input, TextArea, Select } from '../../components/ui/Form';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/layout/PageHeader';
import { RecentItems } from '../../components/shared/RecentItems';
import { GeneratedContent } from '../../components/shared/GeneratedContent';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { EMAIL_TYPES, EMAIL_TONES } from '../../lib/constants';

const initialFormData: EmailFormData = {
  emailType: 'application',
  recipient: '',
  company: '',
  role: '',
  context: '',
  tone: 'professional',
  additionalNotes: '',
};

export function EmailPreparer() {
  const {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleSubmit
  } = useForm<EmailFormData>(initialFormData);

  const [generatedEmail, setGeneratedEmail] = React.useState<string>('');
  const [recentEmails, setRecentEmails] = useLocalStorage('recentEmails', []);

  const onSubmit = async (e: React.FormEvent) => {
    handleSubmit(e, async (data) => {
      const result = await generateEmail(data);
      setGeneratedEmail(result);
      
      // Add to recent emails
      const newEmail = {
        id: Date.now(),
        title: `${data.emailType} - ${data.company}`,
        recipient: data.recipient,
        date: new Date().toISOString(),
        content: result
      };
      
      setRecentEmails((prev: any[]) => [newEmail, ...prev.slice(0, 4)]);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="AI Email Preparer"
        description="Create professional emails for your job search"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className={`${generatedEmail ? 'lg:w-1/3' : 'lg:w-2/3'} transition-all duration-300`}>
            <Card>
              {error && <ErrorAlert message={error} />}

              <form onSubmit={onSubmit} className="space-y-6">
                <FormField label="Email Type">
                  <Select
                    name="emailType"
                    value={formData.emailType}
                    onChange={handleInputChange}
                  >
                    {EMAIL_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Recipient">
                  <Input
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleInputChange}
                    placeholder="e.g., Hiring Manager, John Smith"
                    required
                  />
                </FormField>

                <FormField label="Company">
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </FormField>

                <FormField label="Role">
                  <Input
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                </FormField>

                <FormField label="Context">
                  <TextArea
                    name="context"
                    value={formData.context}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Add any relevant context or specific points you'd like to mention"
                    required
                  />
                </FormField>

                <FormField label="Tone">
                  <Select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                  >
                    {EMAIL_TONES.map(tone => (
                      <option key={tone.value} value={tone.value}>
                        {tone.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Additional Notes (Optional)">
                  <TextArea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Any additional information you'd like to include"
                  />
                </FormField>

                <Button type="submit" isLoading={isLoading}>
                  Generate Email
                </Button>
              </form>
            </Card>
          </div>

          {/* Results Section */}
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
          renderItem={(item: any) => (
            <Card key={item.id}>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.recipient}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(item.date).toLocaleDateString()}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([item.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${item.title.replace(/\s+/g, '-')}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download
                </Button>
              </div>
            </Card>
          )}
        />
      </div>
    </div>
  );
}