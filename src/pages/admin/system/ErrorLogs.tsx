import React, { useState } from 'react';
import { AlertTriangle, Search, Filter } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Form';

interface ErrorLog {
  id: string;
  error_type: string;
  message: string;
  severity: string;
  created_at: string;
  resolved: boolean;
}

interface ErrorLogsProps {
  errors: ErrorLog[];
}

export function ErrorLogs({ errors }: ErrorLogsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unresolved'>('unresolved');

  const filteredErrors = errors
    .filter(error => 
      filter === 'all' || 
      (filter === 'unresolved' && !error.resolved)
    )
    .filter(error =>
      error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.error_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const severityColors = {
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Error Logs</h3>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search errors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unresolved')}
                className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Errors</option>
                <option value="unresolved">Unresolved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredErrors.map((error) => (
            <div
              key={error.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    severityColors[error.severity as keyof typeof severityColors]
                  }`}>
                    {error.severity}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(error.created_at).toLocaleString()}
                  </span>
                </div>
                {!error.resolved && (
                  <Button variant="outline" size="sm">
                    Mark as Resolved
                  </Button>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {error.error_type}
              </p>
              <p className="text-sm text-gray-600">
                {error.message}
              </p>
            </div>
          ))}

          {filteredErrors.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No errors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : filter === 'unresolved'
                  ? 'No unresolved errors'
                  : 'No errors have been logged'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}