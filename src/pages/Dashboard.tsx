import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/shared/SEOHead';
import { useSEO } from '../hooks/useSEO';
import { UsageStats } from '../components/dashboard/UsageStats';
import { FileText, Mail, UserRound, MessageSquareText, History, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/database';
import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

function Dashboard() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const profile = await getProfile(user!.id);
      setIsAdmin(profile?.is_admin || false);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const { metadata } = useSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Dashboard - AI Career Pro"}
        description={metadata?.description || "Access all your AI-powered career tools in one place"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/dashboard"
      />
      {/* Welcome Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to your Dashboard</h1>
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="text-indigo-600"
              >
                Admin Dashboard
              </Button>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Access all your AI-powered career tools in one place
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <UsageStats />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* CV Optimizer */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">CV Optimizer</h2>
            <p className="text-gray-600 mb-4">
              Upload your CV and let our AI optimize it for your target job position.
            </p>
            <Link
              to="/tools/cv"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary w-full transition-colors"
            >
              Optimize CV
            </Link>
          </div>

          {/* Cover Letter Generator */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <MessageSquareText className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Cover Letter Generator</h2>
            <p className="text-gray-600 mb-4">
              Create personalized cover letters tailored to your target job position.
            </p>
            <Link
              to="/tools/cover-letter"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary w-full transition-colors"
            >
              Generate Letter
            </Link>
          </div>

          {/* Email Preparer */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Email Preparer</h2>
            <p className="text-gray-600 mb-4">
              Draft professional emails for job applications and follow-ups.
            </p>
            <Link
              to="/tools/email"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary w-full transition-colors"
            >
              Prepare Email
            </Link>
          </div>

          {/* Interview Coach */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <UserRound className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Interview Coach</h2>
            <p className="text-gray-600 mb-4">
              Practice interviews with AI and get instant feedback on your responses.
            </p>
            <Link
              to="/tools/interview"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary w-full transition-colors"
            >
              Start Practice
            </Link>
          </div>

          {/* History */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">History</h2>
            <p className="text-gray-600 mb-4">
              Access your previously generated documents and interview sessions.
            </p>
            <Link
              to="/history"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 w-full"
            >
              View History
            </Link>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Account Settings</h2>
            <p className="text-gray-600 mb-4">
              Manage your account preferences and subscription settings.
            </p>
            <Link
              to="/settings"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 w-full"
            >
              Manage Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;