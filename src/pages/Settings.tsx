import React, { useState } from 'react';
import { User, Bell, CreditCard, Shield } from 'lucide-react';
import { TabButton } from '../components/settings/TabButton';
import { TabPanel } from '../components/settings/TabPanel';
import { TabContent } from '../components/settings/TabContent';
import { SecuritySettings } from '../components/settings/SecuritySettings';
import { SubscriptionSettings } from '../components/settings/SubscriptionSettings';
import { EmailPreferences } from '../components/settings/EmailPreferences';
import { SessionManagement } from '../components/settings/SessionManagement';
import { ProfileSection } from '../components/profile/ProfileSection';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { useLoadingState } from '../hooks/useLoadingState';
import { PageHeader } from '../components/layout/PageHeader';
import { DataExport } from '../components/settings/DataExport';
import { UsageStats } from '../components/dashboard/UsageStats';
import { ResponsiveContainer } from '../components/shared/ResponsiveContainer';

const tabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'security', name: 'Security', icon: Shield }
] as const;

type SettingsTab = typeof tabs[number]['id'];

function Settings() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { isLoading, error } = useLoadingState();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <ResponsiveContainer className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <TabButton
                    key={tab.id}
                    icon={tab.icon}
                    label={tab.name}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <TabContent isLoading={isLoading} error={error}>
              <TabPanel id="profile" isActive={activeTab === 'profile'}>
                <div className="bg-white rounded-lg shadow-sm">
                  <ProfileSection />
                </div>
              </TabPanel>

              <TabPanel id="notifications" isActive={activeTab === 'notifications'}>
                <div className="bg-white rounded-lg shadow-sm">
                  <EmailPreferences />
                </div>
              </TabPanel>

              <TabPanel id="billing" isActive={activeTab === 'billing'}>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm">
                    <SubscriptionSettings
                      currentPlan={subscription?.plan || 'free'}
                      billingCycle={subscription?.billing_cycle || 'monthly'}
                      nextBillingDate={subscription?.current_period_end || new Date().toISOString()}
                    />
                  </div>
                  <div className="bg-white rounded-lg shadow-sm">
                    <UsageStats />
                  </div>
                </div>
              </TabPanel>

              <TabPanel id="security" isActive={activeTab === 'security'}>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm">
                    <SecuritySettings />
                  </div>
                  <div className="bg-white rounded-lg shadow-sm">
                    <SessionManagement />
                  </div>
                  <div className="bg-white rounded-lg shadow-sm">
                    <DataExport />
                  </div>
                </div>
              </TabPanel>
            </TabContent>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}

export default Settings;