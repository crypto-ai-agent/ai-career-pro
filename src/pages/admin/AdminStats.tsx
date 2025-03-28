import React, { useEffect, useState } from 'react';
import { Users, CreditCard, FileText, Mail } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import { getAdminStats } from '../../services/admin';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import type { AdminStats as AdminStatsType } from '../../types/admin';

export function AdminStats() {
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      if (data) {
        setStats({
          totalUsers: data.totalUsers || 0,
          activeSubscriptions: data.activeSubscriptions || 0,
          free: data.free || 0,
          pro: data.pro || 0,
          enterprise: data.enterprise || 0,
          documentsGenerated: data.documentsGenerated || 0
        });
      }
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const displayStats = [
    {
      name: 'Total Users',
      value: stats?.totalUsers?.toLocaleString() || '0',
      icon: Users
    },
    {
      name: 'Active Subscriptions',
      value: stats?.activeSubscriptions?.toLocaleString() || '0',
      details: [
        `Free: ${stats?.free || 0}`,
        `Pro: ${stats?.pro || 0}`,
        `Enterprise: ${stats?.enterprise || 0}`
      ],
      icon: CreditCard
    },
    {
      name: 'Documents Generated',
      value: stats?.documentsGenerated?.toLocaleString() || '0',
      icon: FileText
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.name}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  {stat.details && (
                    <div className="mt-1">
                      {stat.details.map((detail, i) => (
                        <p key={i} className="text-xs text-gray-500">{detail}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}