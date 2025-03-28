import React, { useState, useEffect } from 'react';
import { Clock, Filter, Download, Search } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { getAuditLogs } from '../../../services/admin/audit';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import type { AuditLog } from '../../../services/admin/audit';

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    userId: '',
    entityType: '',
    action: '',
    startDate: '',
    endDate: ''
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { addToast } = useToast();

  useEffect(() => {
    loadLogs();
  }, [page, filters]);

  const loadLogs = async () => {
    try {
      const { logs, total } = await getAuditLogs(filters, page);
      setLogs(logs);
      setTotal(total);
      setError(null);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      setError('Failed to load audit logs');
      addToast('error', 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'Changes'],
      ...logs.map(log => [
        new Date(log.created_at).toLocaleString(),
        log.user_id,
        log.action,
        log.entity_type,
        log.entity_id,
        JSON.stringify(log.changes)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Entity Type">
              <Select
                value={filters.entityType}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  entityType: e.target.value
                }))}
              >
                <option value="">All Types</option>
                <option value="user">User</option>
                <option value="subscription">Subscription</option>
                <option value="service">Service</option>
                <option value="webhook">Webhook</option>
              </Select>
            </FormField>

            <FormField label="Action">
              <Select
                value={filters.action}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  action: e.target.value
                }))}
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
              </Select>
            </FormField>

            <FormField label="Date Range">
              <div className="flex space-x-4">
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                />
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                />
              </div>
            </FormField>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Changes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.entity_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(log.changes, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 20 >= total}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * 20 + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * 20, total)}</span> of{' '}
                <span className="font-medium">{total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * 20 >= total}
                  variant="outline"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}