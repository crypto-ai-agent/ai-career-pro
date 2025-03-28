import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Users, CreditCard, Webhook, Key, LayoutDashboard } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile } from '../../services/database';
import { AdminStats } from './AdminStats';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      checkAdmin();
    }
  }, [user]);

  const checkAdmin = async () => {
    try {
      const profile = await getProfile(user!.id);
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      setIsAdmin(profile?.is_admin || false);
      if (!profile?.is_admin) {
        addToast('error', 'You do not have admin access');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      const errorMessage = 'Unable to verify admin status. Please try again later.';
      setError(errorMessage);
      addToast('error', errorMessage);
      setTimeout(() => navigate('/dashboard'), 1500);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-8">
        <ErrorAlert message={error} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting to dashboard...</p>
          <LoadingSpinner size="sm" />
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: 'API Configuration',
      icon: Key,
      description: 'Manage API keys and integrations',
      to: '/admin/api-keys',
      items: [
        'Stripe API Keys',
        'PayPal Integration',
        'OpenAI API Keys',
        'Email Service Keys'
      ]
    },
    {
      title: 'User Management',
      icon: Users,
      description: 'Manage users and permissions',
      to: '/admin/users',
      items: [
        'User List',
        'Role Management',
        'Access Control',
        'User Analytics'
      ]
    },
    {
      title: 'Subscription Plans',
      icon: CreditCard,
      description: 'Configure pricing and plans',
      to: '/admin/subscriptions',
      items: [
        'Plan Configuration',
        'Feature Limits',
        'Pricing Rules',
        'Discount Management'
      ]
    },
    {
      title: 'Webhook Management',
      icon: Webhook,
      description: 'Configure service webhooks',
      to: '/admin/webhooks',
      items: [
        'N8N Webhooks',
        'API Endpoints',
        'Webhook Logs',
        'Error Tracking'
      ]
    },
    {
      title: 'System Settings',
      icon: Settings,
      description: 'Configure system settings',
      to: '/admin/settings',
      items: [
        'Email Templates',
        'System Variables',
        'Feature Flags',
        'Maintenance Mode'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <LayoutDashboard className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
          </div>
          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              Admin Dashboard
            </Button>
          )}
        </div>
        
        <AdminStats />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 ml-3">
                      {section.title}
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {section.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {section.items.map((item) => (
                      <div key={item} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(section.to)}
                    className="w-full mt-4 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Manage {section.title}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}