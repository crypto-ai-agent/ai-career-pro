import React from 'react';
import { FileText, Mail, MessageSquareText, UserRound } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const sections = [
  {
    id: 'cv',
    name: 'CV Optimizer',
    icon: FileText,
    description: 'CV optimization service configuration'
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter',
    icon: MessageSquareText,
    description: 'Cover letter generation service'
  },
  {
    id: 'email',
    name: 'Email Preparer',
    icon: Mail,
    description: 'Email preparation service'
  },
  {
    id: 'interview',
    name: 'Interview Coach',
    icon: UserRound,
    description: 'Interview practice service'
  }
];

interface ServiceNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ServiceNav({ activeTab, onTabChange }: ServiceNavProps) {
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