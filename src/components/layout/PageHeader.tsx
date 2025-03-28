import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-indigo-100">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}