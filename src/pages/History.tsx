import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Mail, 
  MessageSquareText,
  Calendar,
  Download,
  Trash2,
  Search,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { ErrorAlert } from '../components/shared/ErrorAlert';
import { DownloadButton } from '../components/shared/DownloadButton';
import { cn } from '../lib/utils';
import {
  getCoverLetters,
  getCVs,
  getEmails,
  deleteCoverLetter,
  deleteCV,
  deleteEmail
} from '../services/database';
import type { CoverLetter, CV, Email } from '../types/database';

type ContentType = 'cover-letters' | 'cvs' | 'emails';
type SortField = 'date' | 'title' | 'company';
type SortOrder = 'asc' | 'desc';

interface HistoryItem {
  id: string;
  type: ContentType;
  title: string;
  company?: string;
  recipient?: string;
  content: string;
  created_at: string;
}

const tabs = [
  { id: 'cover-letters', name: 'Cover Letters', icon: MessageSquareText },
  { id: 'cvs', name: 'CVs', icon: FileText },
  { id: 'emails', name: 'Emails', icon: Mail },
] as const;

export function History() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ContentType>('cover-letters');
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) return;
    loadItems();
  }, [user, activeTab]);

  const loadItems = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      let data: HistoryItem[] = [];

      switch (activeTab) {
        case 'cover-letters':
          const letters = await getCoverLetters(user.id);
          data = letters.map(letter => ({
            id: letter.id,
            type: 'cover-letters',
            title: letter.title,
            company: letter.company,
            content: letter.content,
            created_at: letter.created_at
          }));
          break;

        case 'cvs':
          const cvs = await getCVs(user.id);
          data = cvs.map(cv => ({
            id: cv.id,
            type: 'cvs',
            title: cv.title,
            company: cv.industry,
            content: cv.content,
            created_at: cv.created_at
          }));
          break;

        case 'emails':
          const emails = await getEmails(user.id);
          data = emails.map(email => ({
            id: email.id,
            type: 'emails',
            title: email.title,
            company: email.company,
            recipient: email.recipient,
            content: email.content,
            created_at: email.created_at
          }));
          break;
      }

      setItems(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: HistoryItem) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      switch (item.type) {
        case 'cover-letters':
          await deleteCoverLetter(item.id);
          break;
        case 'cvs':
          await deleteCV(item.id);
          break;
        case 'emails':
          await deleteEmail(item.id);
          break;
      }

      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    }
  };

  const filteredItems = items.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.company?.toLowerCase().includes(searchLower) ||
      item.recipient?.toLowerCase().includes(searchLower)
    );
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'date':
        comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'company':
        comparison = (a.company || '').localeCompare(b.company || '');
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const paginatedItems = sortedItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="History"
        description="View and manage your generated content"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorAlert message={error} className="mb-6" />}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className={cn(
                    'mr-2 h-5 w-5',
                    activeTab === tab.id
                      ? 'text-indigo-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  )} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => toggleSort('date')}
              className="flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Date
              <ArrowUpDown className="h-4 w-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => toggleSort('title')}
              className="flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Title
              <ArrowUpDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : paginatedItems.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">No items found</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {paginatedItems.map((item) => (
              <Card key={item.id}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.title}
                    </h3>
                    {item.company && (
                      <p className="text-sm text-gray-500">{item.company}</p>
                    )}
                    {item.recipient && (
                      <p className="text-sm text-gray-500">
                        Recipient: {item.recipient}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      <Calendar className="inline-block h-4 w-4 mr-1" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DownloadButton
                      content={item.content}
                      filename={item.title}
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}