import React, { useState, useEffect } from 'react';
import { Mail, Send, Users, History } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, TextArea, Select } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { getNewsletterStats, sendNewsletter, getNewsletterHistory } from '../../../services/database';

export function NewsletterManagement() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{
    subscribedCount: number;
    totalEmails: number;
  } | null>(null);
  const [history, setHistory] = useState<Array<{
    id: string;
    subject: string;
    sentTo: number;
    sentAt: string;
    type: string;
  }>>([]);

  useEffect(() => {
    loadStats();
    loadHistory();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getNewsletterStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      addToast('error', 'Failed to load newsletter stats');
    }
  };

  const loadHistory = async () => {
    try {
      const data = await getNewsletterHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
      addToast('error', 'Failed to load newsletter history');
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        subject: formData.get('subject') as string,
        content: formData.get('content') as string,
        type: formData.get('type') as string,
      };

      await sendNewsletter(data);
      addToast('success', 'Newsletter sent successfully');
      loadStats();
      loadHistory();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error sending newsletter:', error);
      addToast('error', 'Failed to send newsletter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Subscribed Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.subscribedCount || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Emails Sent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.totalEmails || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <History className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Recent Campaigns</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {history.length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* New Newsletter Form */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Send Newsletter</h3>
          
          <form onSubmit={handleSendNewsletter} className="space-y-6">
            <FormField label="Type">
              <Select name="type" required>
                <option value="newFeatures">New Features</option>
                <option value="tips">Tips & Tutorials</option>
                <option value="marketing">Marketing</option>
              </Select>
            </FormField>

            <FormField label="Subject">
              <Input name="subject" required />
            </FormField>

            <FormField label="Content">
              <TextArea name="content" rows={10} required />
            </FormField>

            <div className="flex justify-end">
              <Button type="submit" isLoading={loading}>
                <Send className="w-4 h-4 mr-2" />
                Send Newsletter
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* History */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Newsletter History</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sentTo} users
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.sentAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}