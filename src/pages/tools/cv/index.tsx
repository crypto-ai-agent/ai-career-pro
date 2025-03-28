import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { SEOHead } from '../../../components/shared/SEOHead';
import { useSEO } from '../../../hooks/useSEO';
import { optimizeCV } from '../../../services/api';
import { useForm } from '../../../hooks/useForm';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/layout/PageHeader';
import { UsageLimitIndicator } from '../../../components/shared/UsageLimitIndicator';
import { RecentItems } from '../../../components/shared/RecentItems';
import { GeneratedContent } from '../../../components/shared/GeneratedContent';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import { DownloadButton } from '../../../components/shared/DownloadButton';
import { CVForm } from './CVForm';
import { CVFormData, initialFormData } from './types';
import { useAuth } from '../../../contexts/AuthContext';
import { getCVs, createCV } from '../../../services/database';
import type { CV } from '../../../types/database';

export function CVOptimizer() {
  const { user } = useAuth();
  const {
    formData,
    isLoading,
    error,
    handleChange: handleInputChange,
    handleSubmit
  } = useForm({
    initialData: initialFormData,
    onSubmit: handleCVOptimization
  });

  const [optimizedCV, setOptimizedCV] = useState<string>('');
  const [recentCVs, setRecentCVs] = useState<CV[]>([]);
  const [loadingCVs, setLoadingCVs] = useState(true);

  useEffect(() => {
    async function loadRecentCVs() {
      if (!user) return;
      try {
        const cvs = await getCVs(user.id);
        setRecentCVs(cvs.slice(0, 4));
      } catch (error) {
        console.error('Error loading recent CVs:', error);
      } finally {
        setLoadingCVs(false);
      }
    }

    loadRecentCVs();
  }, [user]);

  async function handleCVOptimization(data: CVFormData) {
    if (!user) return;

    const result = await optimizeCV(data);
    setOptimizedCV(result);
    
    const newCV = await createCV({
      user_id: user.id,
      title: data.targetRole,
      content: result,
      industry: data.industry,
      target_role: data.targetRole,
      experience_level: data.experienceLevel
    });
    
    setRecentCVs(prev => [newCV, ...prev.slice(0, 3)]);
  }

  const { metadata } = useSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "CV Optimizer Tool - AI Career Pro"}
        description={metadata?.description || "Optimize your CV with AI-powered suggestions and improvements"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/tools/cv"
      />
      <PageHeader 
        title="AI CV Optimizer"
        description="Optimize your CV for your target role"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UsageLimitIndicator feature="cv-optimizer" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`${optimizedCV ? 'lg:w-1/3' : 'lg:w-2/3'} transition-all duration-300`}>
            <Card>
              {error && <ErrorAlert message={error} />}
              <CVForm
                  formData={formData}
                  isLoading={isLoading}
                  onInputChange={handleInputChange}
                  onFileChange={(file) => {
                // Update the formData with the uploaded file
                handleInputChange({
                  target: { name: 'currentCV', value: file },
                } as React.ChangeEvent<HTMLInputElement>);
                      }}
                    onSubmit={handleSubmit}
/>

            </Card>
          </div>

          <div className={`${optimizedCV ? 'lg:w-2/3' : 'lg:w-1/3'} transition-all duration-300`}>
            <GeneratedContent
              content={optimizedCV}
              icon={FileText}
              emptyTitle="Ready to Optimize"
              emptyDescription="Upload your CV and fill out the form to get optimization suggestions"
            />
          </div>
        </div>

        <RecentItems
          title="Recent CVs"
          items={recentCVs}
          renderItem={(item) => (
            <Card key={item.id}>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.industry}</p>
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