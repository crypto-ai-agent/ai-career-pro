import React from 'react';
import { Sparkles, Target, Shield } from 'lucide-react';

export function ServiceFeatures() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Advanced AI technology that understands your needs and industry requirements.'
    },
    {
      icon: Target,
      title: 'Personalized',
      description: 'Tailored content that matches your unique skills and career goals.'
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Your data is protected with enterprise-grade security measures.'
    }
  ];

  return (
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Services?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="bg-white rounded-lg shadow-sm p-6">
            <Icon className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}