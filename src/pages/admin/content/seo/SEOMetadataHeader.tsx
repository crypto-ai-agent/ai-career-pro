import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../../components/ui/Form';
import { Button } from '../../../../components/ui/Button';
import { useSEOMetadataContext } from './SEOMetadataContext';

export function SEOMetadataHeader() {
  const { searchQuery, setSearchQuery, setShowForm } = useSEOMetadataContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">
          SEO Metadata Management
        </h3>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-64">
          <Input
            type="search"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          Add Page
        </Button>
      </div>
    </div>
  );
}