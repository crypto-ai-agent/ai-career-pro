import React from 'react';
import { SEOMetadataList } from './SEOMetadataList';
import { SEOMetadataHeader } from './SEOMetadataHeader';
import { SEOMetadataProvider } from './SEOMetadataContext';

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