import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { ContentPages } from './ContentPages';
import { SEOMetadata } from './SEOMetadata';
import { SocialLinks } from './SocialLinks';
import { ContactInfo } from './ContactInfo';
import { FAQManagement } from './FAQManagement';
import { NewsletterManagement } from './NewsletterManagement';
import { TeamMembers } from './TeamMembers';
import { ContentNav, sections } from './ContentNav';
import { cn } from '../../../lib/utils';

export function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState('pages');

  const getComponent = (id: string) => {
    switch (id) {
      case 'pages':
        return ContentPages;
      case 'seo':
        return SEOMetadata;
      case 'faqs':
        return FAQManagement;
      case 'social':
        return SocialLinks;
      case 'newsletters':
        return NewsletterManagement;
      case 'contact':
        return ContactInfo;
      case 'team':
        return TeamMembers;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          </div>
        </div>
      

        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <ContentNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="transition-opacity duration-200">
          {(() => {
            const Component = getComponent(activeTab);
            return Component ? <Component /> : null;
          })()}
        </div>
      </div>
    </div>
  );
}