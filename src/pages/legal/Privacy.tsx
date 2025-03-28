import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/SEOHead';
import { useSEO } from '../../hooks/useSEO';
import { PageHeader } from '../../components/layout/PageHeader';
import { getPage } from '../../services/cms';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../components/shared/ErrorAlert';

export function Privacy() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { metadata } = useSEO();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const data = await getPage('privacy');
      setContent(data.content);
    } catch (err) {
      console.error('Error loading privacy policy:', err);
      setError('Failed to load privacy policy');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Privacy Policy"
          description="How we handle and protect your data"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorAlert message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Privacy Policy - AI Career Pro"}
        description={metadata?.description || "Learn how we protect and handle your data"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/privacy"
      />
      <PageHeader
        title="Privacy Policy"
        description="How we handle and protect your data"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 prose max-w-none">
          {content?.sections?.map((section: any, index: number) => (
            <div key={index}>
              <h2>{section.title}</h2>
              <div className="whitespace-pre-wrap">{section.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}