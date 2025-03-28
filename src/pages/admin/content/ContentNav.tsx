import React from 'react';
import { FileText, Globe, Mail, Phone, Users, HelpCircle, Search } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const sections = [
  {
    id: 'pages',
    name: 'Pages',
    icon: FileText,
    description: 'Website pages and legal content'
  },
  {
    id: 'seo',
    name: 'SEO',
    icon: Search,
    description: 'SEO metadata management'
  },
  {
    id: 'faqs',
    name: 'FAQs',
    icon: HelpCircle,
    description: 'Frequently asked questions'
  },
  {
    id: 'social',
    name: 'Social',
    icon: Globe,
    description: 'Social media links'
  },
  {
    id: 'newsletters',
    name: 'Newsletters',
    icon: Mail,
    description: 'Email campaigns'
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: Phone,
    description: 'Contact details'
  },
  {
    id: 'team',
    name: 'Team',
    icon: Users,
    description: 'Team profiles'
  }
];

interface ContentNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ContentNav({ activeTab, onTabChange }: ContentNavProps) {
  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeTab === section.id;
        return (
          <button
            key={section.id}
            onClick={() => onTabChange(section.id)}
            className={cn(
              'flex items-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap',
              isActive 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-700'
            )}
          >
            <Icon className={cn(
              'w-4 h-4 mr-2',
              isActive ? 'text-white' : 'text-gray-400'
            )} />
            <span className="font-medium">{section.name}</span>
          </button>
        );
      })}
    </div>
  );
}