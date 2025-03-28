import React, { useEffect, useState } from 'react';
import { BarChart, FileText, Mail, UserRound } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface UsageStats {
  cvs: number;
  coverLetters: number;
  emails: number;
  interviews: number;
}

export function UsageStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: usage } = await supabase
        .from('usage_metrics')
        .select('type, count')
        .eq('user_id', user!.id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const stats = usage?.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + curr.count;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        cvs: stats?.['cv-optimizer'] || 0,
        coverLetters: stats?.['cover-letter'] || 0,
        emails: stats?.['email-preparer'] || 0,
        interviews: stats?.['interview-coach'] || 0
      });
    } catch (error) {
      console.error('Error loading usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!stats) return null;

  const statItems = [
    { label: 'CVs Optimized', value: stats.cvs, icon: FileText, color: 'text-blue-600 bg-blue-100' },
    { label: 'Cover Letters', value: stats.coverLetters, icon: Mail, color: 'text-green-600 bg-green-100' },
    { label: 'Emails Prepared', value: stats.emails, icon: Mail, color: 'text-purple-600 bg-purple-100' },
    { label: 'Interview Sessions', value: stats.interviews, icon: UserRound, color: 'text-orange-600 bg-orange-100' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <div className="p-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}