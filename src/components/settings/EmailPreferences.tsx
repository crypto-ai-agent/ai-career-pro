import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast'; 
import { getProfile, upsertProfile } from '../../services/database';

interface NotificationPreferences {
  newFeatures: boolean;
  tips: boolean;
  marketing: boolean;
  toolCompletions: boolean;
  usageLimits: boolean;
}

interface EmailPreference {
  id: keyof NotificationPreferences;
  label: string;
  description: string;
}

const preferences: EmailPreference[] = [
  {
    id: 'newFeatures',
    label: 'New Features',
    description: 'Get notified when we release new features and updates'
  },
  {
    id: 'tips',
    label: 'Tips & Tutorials',
    description: 'Receive helpful tips and tutorials for using our tools'
  },
  {
    id: 'toolCompletions',
    label: 'Tool Completions',
    description: 'Get notifications when your CV, cover letter, or other tools are ready'
  },
  {
    id: 'usageLimits',
    label: 'Usage Limits',
    description: 'Receive alerts when you are approaching usage limits'
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Receive marketing and promotional emails'
  }
];

const defaultPreferences: NotificationPreferences = {
  newFeatures: true,
  tips: true,
  marketing: false,
  toolCompletions: true,
  usageLimits: true
};

export function EmailPreferences() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState<NotificationPreferences>(defaultPreferences);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;
    try {
      const profile = await getProfile(user.id);
      if (profile?.notification_preferences) {
        setEmailPreferences({
          ...defaultPreferences,
          ...profile.notification_preferences
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      addToast('error', 'Failed to load email preferences');
    }
  };

  const handleToggle = async (preferenceId: keyof NotificationPreferences) => {
    if (!user) return;
    if (!user.email) return;

    const currentValue = emailPreferences[preferenceId];
    const label = preferences.find(p => p.id === preferenceId)?.label;
    setSaving(true);
    try {
      addToast('info', 'Saving preference...');
      const updatedPreferences = {
        ...emailPreferences,
        [preferenceId]: !currentValue
      };

      await upsertProfile({
        id: user.id,
        email: user.email,
        notification_preferences: updatedPreferences,
        updated_at: new Date().toISOString()
      });

      setEmailPreferences(updatedPreferences);
      addToast('success', `${label} notifications ${!currentValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating preferences:', error);
      addToast('error', 'Failed to update preferences');
      // Revert the toggle if update fails
      setEmailPreferences(prev => ({
        ...prev,
        [preferenceId]: currentValue
      }));
    } finally {
      setSaving(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    if (!user) return;
    if (!user.email) return;

    setSaving(true);
    addToast('info', 'Updating preferences...');
    try {
      const updatedPreferences = Object.keys(emailPreferences).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {} as NotificationPreferences);

      await upsertProfile({
        id: user.id,
        email: user.email,
        notification_preferences: updatedPreferences,
        updated_at: new Date().toISOString()
      });

      setEmailPreferences(updatedPreferences);
      addToast('success', 'Successfully unsubscribed from all email notifications');
    } catch (error) {
      console.error('Error updating preferences:', error);
      addToast('error', 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Bell className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Email Preferences
          </h3>
        </div>

        <div className="space-y-4">
          {preferences.map((preference) => (
            <div key={preference.id} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={preference.id}
                  type="checkbox"
                  checked={emailPreferences[preference.id]}
                  onChange={() => handleToggle(preference.id)}
                  disabled={saving}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3">
                <label htmlFor={preference.id} className="font-medium text-gray-700">
                  {preference.label}
                </label>
                <p className="text-sm text-gray-500">
                  {preference.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleUnsubscribeAll}
            disabled={saving}
          >
            Unsubscribe from all
          </Button>
        </div>
      </div>
    </Card>
  );
}