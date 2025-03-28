import React, { useState } from 'react';
import { Settings, Mail, Flag, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, TextArea, Select } from '../../../components/ui/Form';
import { PaymentGatewaySettings } from './PaymentGatewaySettings';
import { TranslationSettings } from './TranslationSettings';
import { useToast } from '../../../hooks/useToast';

export function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      // Add settings update logic here
      addToast('success', 'Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      addToast('error', 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Email Settings */}
          <Card className="bg-white">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Email Settings
                </h3>
              </div>

              <div className="space-y-4">
                <FormField label="From Email">
                  <Input
                    defaultValue="noreply@aicareerpro.com"
                    placeholder="Email address for sending emails"
                  />
                </FormField>

                <FormField label="Reply-To Email">
                  <Input
                    defaultValue="support@aicareerpro.com"
                    placeholder="Email address for replies"
                  />
                </FormField>

                <FormField label="Email Footer">
                  <TextArea
                    rows={3}
                    defaultValue="© 2024 AI Career Pro. All rights reserved."
                    placeholder="Footer text for all emails"
                  />
                </FormField>
              </div>
            </div>
          </Card>

          {/* Feature Flags */}
          <Card className="bg-white">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Flag className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Feature Flags
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Beta Features</p>
                    <p className="text-sm text-gray-500">Enable beta features for testing</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">AI Suggestions</p>
                    <p className="text-sm text-gray-500">Enable AI-powered suggestions</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Translation Settings */}
          <TranslationSettings />

          {/* Payment Gateway Settings */}
          <PaymentGatewaySettings />

          {/* Maintenance Mode */}
          <Card className="bg-white">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Maintenance Mode
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Enable Maintenance Mode</p>
                    <p className="text-sm text-gray-500">
                      Put the site in maintenance mode. Only admins can access.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <FormField label="Maintenance Message">
                  <TextArea
                    rows={3}
                    defaultValue="We're currently performing maintenance. Please check back soon."
                    placeholder="Message to show during maintenance"
                  />
                </FormField>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              isLoading={loading}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}