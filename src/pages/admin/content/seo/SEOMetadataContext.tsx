import React, { createContext, useContext, useState } from 'react';

interface SEOMetadataContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const SEOMetadataContext = createContext<SEOMetadataContextType | undefined>(undefined);

export function SEOMetadataProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  return (
    <SEOMetadataContext.Provider value={{
      searchQuery,
      setSearchQuery,
      showForm,
      setShowForm
    }}>
      {children}
    </SEOMetadataContext.Provider>
  );
}

export function useSEOMetadataContext() {
  const context = useContext(SEOMetadataContext);
  if (context === undefined) {
    throw new Error('useSEOMetadataContext must be used within a SEOMetadataProvider');
  }
  return context;
}