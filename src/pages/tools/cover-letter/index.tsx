import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { SEOHead } from '../../../components/shared/SEOHead';
import { useSEO } from '../../../hooks/useSEO';
import { generateCoverLetter } from '../../../services/api';
import { useForm } from '../../../hooks/useForm';
import { LoadingOverlay } from '../../../components/shared/LoadingOverlay';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/layout/PageHeader';
import { RecentItems } from '../../../components/shared/RecentItems';
import { GeneratedContent } from '../../../components/shared/GeneratedContent';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import { DownloadButton } from '../../../components/shared/DownloadButton';
import { CoverLetterForm } from './CoverLetterForm';
import { CoverLetterFormData, initialFormData } from './types';
import { useAuth } from '../../../contexts/AuthContext';
import { getCoverLetters, createCoverLetter } from '../../../services/database';
import type { CoverLetter } from '../../../types/database';

export function CoverLetterGenerator() {
  const { user } = useAuth();

  const {
    formData,
    isLoading,
    error,
    handleChange: handleInputChange,
    handleSubmit
  } = useForm({
    initialData: initialFormData,
    onSubmit: handleCoverLetterGeneration
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [recentLetters, setRecentLetters] = useState<CoverLetter[]>([]);
  const [loadingLetters, setLoadingLetters] = useState(true);

  useEffect(() => {
    async function loadRecentLetters() {
      if (!user) return;
      try {
        const letters = await getCoverLetters(user.id);
        setRecentLetters(letters.slice(0, 4));
      } catch (error) {
        console.error('Error loading recent letters:', error);
      } finally {
        setLoadingLetters(false);
      }
    }

    loadRecentLetters();
  }, [user]);

  async function handleCoverLetterGeneration(data: CoverLetterFormData) {
    if (!user) return;

    try {
      const letter = await generateCoverLetter(data);
      setGeneratedLetter(letter);
      
      const newLetter = await createCoverLetter({
        user_id: user.id,
        title: `${data.jobTitle} at ${data.company}`,
        company: data.company,
        content: letter,
        job_title: data.jobTitle,
        recipient: data.recipientDescription || 'Hiring Manager'
      });
      setRecentLetters(prev => [newLetter, ...prev.slice(0, 3)]);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw error;
    }
  }

  const { metadata } = useSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Cover Letter Generator Tool - AI Career Pro"}
        description={metadata?.description || "Generate professional cover letters tailored to your job applications"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/tools/cover-letter"
      />
      <PageHeader 
        title="AI Cover Letter Generator"
        description="Create a professional cover letter in minutes"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <LoadingOverlay
            message="Generating your cover letter... This may take a few moments."
          />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`${generatedLetter ? 'lg:w-1/3' : 'lg:w-2/3'} transition-all duration-300`}>
            <Card>
              {error && <ErrorAlert message={error} />}
              <CoverLetterForm
                formData={formData}
                showAdvanced={showAdvanced}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                onSubmit={handleSubmit}
              />
            </Card>
          </div>

          <div className={`${generatedLetter ? 'lg:w-2/3' : 'lg:w-1/3'} transition-all duration-300`}>
            <GeneratedContent
              content={generatedLetter}
              icon={Sparkles}
              emptyTitle="Ready to Generate"
              emptyDescription="Fill out the form to generate your cover letter"
            />
          </div>
        </div>

        <RecentItems
          title="Recent Cover Letters"
          items={recentLetters}
          renderItem={(item) => (
            <Card key={item.id}>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.company}</p>
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