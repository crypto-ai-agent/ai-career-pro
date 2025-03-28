import React from 'react';
import { SEOMetadataList } from './seo/SEOMetadataList';
import { SEOMetadataHeader } from './seo/SEOMetadataHeader';
import { SEOMetadataProvider } from './seo/SEOMetadataContext';

export function SEOMetadata() {
  return (
    <SEOMetadataProvider>
      <div className="space-y-6">
        <SEOMetadataHeader />
        <SEOMetadataList />
      </div>
    </SEOMetadataProvider>
  );
}