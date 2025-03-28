import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { AdminGuard } from './components/shared/AdminGuard';
import * as routes from './config/routes';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProfileCompletion } from './components/auth/ProfileCompletion';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { CVOptimizerService } from './pages/services/CVOptimizer';
import { CoverLetterService } from './pages/services/CoverLetter';
import { EmailPreparerService } from './pages/services/EmailPreparer';
import { InterviewCoachService } from './pages/services/InterviewCoach';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/legal/Privacy';
import { Terms } from './pages/legal/Terms';
import { Login } from './pages/auth/Login';
import { ComingSoon } from './pages/ComingSoon';
import { ResetPassword } from './pages/auth/ResetPassword';
import { UpdatePassword } from './pages/auth/UpdatePassword';
import { AuthCallback } from './pages/auth/AuthCallback';
import { Signup } from './pages/auth/Signup';
import { AuthTestPage } from './pages/auth/AuthTest';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ContentManagementPage } from './pages/admin/content';
import { NewsletterManagement } from './pages/admin/content/NewsletterManagement';
import { ServicesManagementPage } from './pages/admin/services';
import { AnalyticsPage } from './pages/admin/analytics';
import { EmailManagementPage } from './pages/admin/email';
import { IntegrationsPage } from './pages/admin/integrations';
import { SystemHealthPage } from './pages/admin/system';
import { ApiKeysPage } from './pages/admin/api-keys';
import { SubscriptionsPage } from './pages/admin/subscriptions';
import { WebhooksPage } from './pages/admin/webhooks';
import { SettingsPage } from './pages/admin/settings';
import { UsersPage } from './pages/admin/users';
import { History } from './pages/History';
import { CoverLetterGenerator } from './pages/tools/cover-letter';
import { CVOptimizer } from './pages/tools/cv';
import { EmailPreparer } from './pages/tools/email';
import { InterviewCoach } from './pages/tools/interview';
import { NotFound } from './pages/NotFound';
import { ServerError } from './pages/ServerError';
import { GlobalErrorBoundary } from './components/shared/GlobalErrorBoundary';
import { AuthErrorBoundary } from './components/auth/AuthErrorBoundary';
import { ToastContainer } from './components/shared/ToastContainer';
import { useToast } from './hooks/useToast';

export default function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <ThemeProvider>
      <AuthProvider>
        <GlobalErrorBoundary>
          <HelmetProvider>
            <AuthErrorBoundary>
              <Router>
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <LoadingSpinner size="lg" />
                  </div>
                }>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Layout />}>
                      <Route index element={<routes.Home />} />
                      <Route path="about" element={<About />} />
                      <Route path="services" element={<Services />} />
                      <Route path="services/cv" element={<CVOptimizerService />} />
                      <Route path="services/cover-letter" element={<CoverLetterService />} />
                      <Route path="services/email" element={<EmailPreparerService />} />
                      <Route path="services/interview" element={<InterviewCoachService />} />
                      <Route path="pricing" element={<Pricing />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="coming-soon" element={<ComingSoon />} />
                      <Route path="privacy" element={<Privacy />} />
                      <Route path="terms" element={<Terms />} />
                    </Route>
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/auth/test" element={<AuthTestPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/update-password" element={<UpdatePassword />} />
                    <Route
                      path="/complete-profile"
                      element={
                        <ProtectedRoute requireVerification={false}>
                          <ProfileCompletion />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Protected Routes */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/tools/cover-letter" element={<CoverLetterGenerator />} />
                      <Route path="/tools/cv" element={<CVOptimizer />} />
                      <Route path="/tools/email" element={<EmailPreparer />} />
                      <Route path="/tools/interview" element={<InterviewCoach />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>
                  
                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <AdminGuard>
                          <AdminLayout />
                        </AdminGuard>
                      }
                    >
                      <Route index element={<AdminDashboard />} />
                      <Route path="analytics" element={<AnalyticsPage />} />
                      <Route path="content" element={<ContentManagementPage />} />
                      <Route path="content/newsletters" element={<NewsletterManagement />} />
                      <Route path="services" element={<ServicesManagementPage />} />
                      <Route path="email" element={<EmailManagementPage />} />
                      <Route path="integrations" element={<IntegrationsPage />} />
                      <Route path="system" element={<SystemHealthPage />} />
                      <Route path="users" element={<UsersPage />} />
                      <Route path="api-keys" element={<ApiKeysPage />} />
                      <Route path="subscriptions" element={<SubscriptionsPage />} />
                      <Route path="webhooks" element={<WebhooksPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Route>

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <ToastContainer toasts={toasts} onClose={removeToast} />
              </Router> 
            </AuthErrorBoundary>
          </HelmetProvider>
        </GlobalErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}