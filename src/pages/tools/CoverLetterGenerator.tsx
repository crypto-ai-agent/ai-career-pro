import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { FormData } from '../../types/coverLetter';
import { generateCoverLetter } from '../../services/api';
import { useForm } from '../../hooks/useForm';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { FormField, Input, TextArea, Select } from '../../components/ui/Form';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/layout/PageHeader';
import { RecentItems } from '../../components/shared/RecentItems';
import { EmptyState } from '../../components/shared/EmptyState';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const initialFormData: FormData = {
  jobTitle: '',
  company: '',
  recipientDescription: '',
  keySkills: '',
  experience: '',
  tone: 'professional',
  language: 'English',
  length: 'medium'
};

export function CoverLetterGenerator() {
  const {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleSubmit
  } = useForm<FormData>(initialFormData);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [recentLetters, setRecentLetters] = useLocalStorage('recentLetters', []);

  const onSubmit = async (e: React.FormEvent) => {
    handleSubmit(e, async (data) => {
      const letter = await generateCoverLetter(data);
      setGeneratedLetter(letter);
      
      // Add to recent letters
      const newLetter = {
        id: Date.now(),
        title: `${data.jobTitle} at ${data.company}`,
        company: data.company,
        date: new Date().toISOString(),
        content: letter
      };
      
      setRecentLetters((prev: any[]) => [newLetter, ...prev.slice(0, 4)]);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="AI Cover Letter Generator"
        description="Create a professional cover letter in minutes"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className={`${generatedLetter ? 'lg:w-1/3' : 'lg:w-2/3'} transition-all duration-300`}>
            <Card>
              {error && <ErrorAlert message={error} />}

              <form onSubmit={onSubmit} className="space-y-6">
                <FormField label="Job Title">
                  <Input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
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

                <FormField label="Key Skills">
                  <TextArea
                    name="keySkills"
                    value={formData.keySkills}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </FormField>

                <FormField label="Relevant Experience">
                  <TextArea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </FormField>

                <FormField label="Tone">
                  <Select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                  >
                    <option value="professional">Professional</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="confident">Confident</option>
                  </Select>
                </FormField>

                <FormField label="Length">
                  <Select
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                  >
                    <option value="short">Short (~250 words, ½ page)</option>
                    <option value="medium">Medium (~400 words, ¾ page)</option>
                    <option value="long">Long (~600 words, 1 page)</option>
                  </Select>
                </FormField>

                <div className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                  </Button>
                </div>

                {showAdvanced && (
                  <div className="space-y-6 pt-4">
                    <FormField label="Recipient Description (Optional)">
                      <TextArea
                        name="recipientDescription"
                        value={formData.recipientDescription}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="e.g., Hiring Manager, Department Head, etc."
                      />
                    </FormField>

                    <FormField label="Language">
                      <Select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                      >
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Spanish">Spanish</option>
                      </Select>
                    </FormField>
                  </div>
                )}

                <Button type="submit" isLoading={isLoading}>
                  Generate Cover Letter
                </Button>
              </form>
            </Card>
          </div>

          {/* Generated Letter Section */}
          <div className={`${generatedLetter ? 'lg:w-2/3' : 'lg:w-1/3'} transition-all duration-300`}>
            {generatedLetter ? (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Cover Letter</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(generatedLetter)}
                  >
                    Copy to Clipboard
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {generatedLetter}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="Ready to Generate"
                description="Fill out the form to generate your cover letter"
              />
            )}
          </div>
        </div>

        <RecentItems
          title="Recent Cover Letters"
          items={recentLetters}
          renderItem={(item: any) => (
            <Card key={item.id}>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.company}</p>
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