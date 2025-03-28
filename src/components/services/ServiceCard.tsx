import React from 'react';
import { Link } from 'react-router-dom';
import type { ServiceConfig } from '../../services/services';

interface ServiceCardProps {
  service: {
    icon: React.ElementType;
    name: string;
    description: string;
    pricing: ServiceConfig['pricing'];
    slug: string;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;
  const serviceUrl = `/services/${service.slug}`;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <Icon className="h-12 w-12 text-indigo-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>

        <div className="space-y-4 mb-6">
          {(['free', 'pro', 'enterprise'] as const).map((tier) => (
            <div key={tier} className="flex justify-between items-center text-sm">
              <span className="capitalize">{tier}</span>
              <span className="font-medium">
                ${service.pricing[tier].price}/mo
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-2">
          <Link
            to={serviceUrl}
            className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Learn More
          </Link>
          <Link
            to={`/tools/${service.slug}`}
            className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Try Now
          </Link>
        </div>
      </div>
    </div>
  );
}