import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { exportUserData } from '../../services/export';

export function DataExport() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      const blob = await exportUserData(user.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addToast('success', 'Your data has been exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      addToast('error', 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Export Your Data
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Download a copy of all your data including your profile, documents, and usage history.
          </p>
        </div>
        <Button
          onClick={handleExport}
          isLoading={isExporting}
          variant="outline"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
}