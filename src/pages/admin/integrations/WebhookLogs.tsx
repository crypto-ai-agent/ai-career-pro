import React, { useState } from 'react';
import { Webhook, Search, Filter, RefreshCw } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Form';

interface WebhookLog {
  id: string;
  webhook_id: string;
  request_body: any;
  response_body: any;
  status_code: number;
  success: boolean;
  retry_count: number;
  created_at: string;
}

export function WebhookLogs() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'failed'>('all');

  const filteredLogs = logs
    .filter(log => 
      filter === 'all' || 
      (filter === 'failed' && !log.success)
    )
    .filter(log =>
      JSON.stringify(log.request_body).toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.response_body).toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleRetry = async (webhookId: string) => {
    // Implement retry logic
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Webhook className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Webhook Logs</h3>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'failed')}
                className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Logs</option>
                <option value="failed">Failed Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    log.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {log.status_code} - {log.success ? 'Success' : 'Failed'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                {!log.success && (
                  <Button
                    variant="outline"
                    onClick={() => handleRetry(log.webhook_id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Request</h4>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(log.request_body, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Response</h4>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(log.response_body, null, 2)}
                  </pre>
                </div>
              </div>

              {log.retry_count > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Retry attempts: {log.retry_count}
                </p>
              )}
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Webhook className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No webhook logs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : filter === 'failed'
                  ? 'No failed webhook calls'
                  : 'No webhook logs have been recorded'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}