import React from 'react';
import { Shield, Laptop, Smartphone, Globe } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';

export function SessionManagement() {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  // Initialize session timeout hook
  useSessionTimeout();

  const handleSignOutAllDevices = async () => {
    try {
      // Sign out from all devices
      await Promise.all([
        localStorage.clear(),
        sessionStorage.clear()
      ]);
      
      addToast('success', 'Signed out from all devices');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      addToast('error', 'Failed to sign out from all devices');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Shield className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">
          Session Security
        </h3>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">
                  Current Session
                </p>
                <p className="text-sm text-gray-500">
                  Started: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <Button
            variant="outline"
            onClick={handleSignOutAllDevices}
            className="w-full"
          >
            Sign Out From All Devices
          </Button>
          <p className="mt-2 text-sm text-gray-500 text-center">
            This will sign you out from all devices where you're currently logged in.
          </p>
        </div>
      </div>
    </div>
  );
}