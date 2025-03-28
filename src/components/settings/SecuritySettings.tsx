import React, { useState, useEffect } from 'react';
import { Shield, Key, Smartphone, History, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormField, Input } from '../ui/Form';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { getLoginHistory, deleteAccount } from '../../services/security';
import { enable2FA, verify2FA, disable2FA } from '../../services/2fa';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { supabase } from '../../lib/supabase';

function SecuritySettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const { addToast } = useToast();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorData, setTwoFactorData] = useState({
    secret: '',
    qrCode: '',
    token: '',
    backupCodes: [] as string[]
  });
  const [loginHistory, setLoginHistory] = useState<Array<{
    id: string;
    ip_address: string;
    user_agent: string;
    location: string;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load login history when component mounts
  useEffect(() => {
    if (user) {
      loadLoginHistory();
    }
  }, [user]); // Only re-run if user changes

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      addToast('success', 'Password updated successfully');
    } catch (err) {
      setError('Failed to update password');
      console.error('Error updating password:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableTwoFactor = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { secret, qrCode, backupCodes } = await enable2FA(user.id);
      setTwoFactorData({ secret, qrCode, token: '', backupCodes });
      setShowTwoFactorSetup(true);
    } catch (err) {
      setError('Failed to enable two-factor authentication');
      console.error('Error enabling 2FA:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTwoFactor = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const verified = await verify2FA(user.id, twoFactorData.token);
      if (verified) {
        setShowTwoFactorSetup(false);
        setTwoFactorData({ secret: '', qrCode: '', token: '', backupCodes: [] });
        addToast('success', 'Two-factor authentication enabled successfully');
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('Failed to verify two-factor authentication');
      console.error('Error verifying 2FA:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      await disable2FA(user.id);
      setShowTwoFactorSetup(false);
      setTwoFactorData({ secret: '', qrCode: '', token: '', backupCodes: [] });
      addToast('success', 'Two-factor authentication disabled');
    } catch (err) {
      setError('Failed to disable two-factor authentication');
      console.error('Error disabling 2FA:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLoginHistory = async () => {
    if (!user) return;
    try {
      const history = await getLoginHistory(user.id);
      setLoginHistory(history);
    } catch (err) {
      console.error('Error loading login history:', err);
    }
  };

  const handleDelete = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      await deleteAccount(user.id);
      addToast('info', 'Your account has been deleted');
      navigate('/');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmLabel="Delete Account"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDestructive
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
          {error}
        </div>
      )}

      {/* Password Change */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Key className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Password
              </h3>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Change Password
            </Button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <FormField label="Current Password">
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  required
                />
              </FormField>

              <FormField label="New Password">
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  required
                />
              </FormField>

              <FormField label="Confirm New Password">
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  required
                />
              </FormField>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={loading}>
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Two-Factor Authentication
              </h3>
            </div>
            {!showTwoFactorSetup ? (
              <Button onClick={handleEnableTwoFactor}>
                Enable 2FA
              </Button>
            ) : (
              <Button variant="outline" onClick={handleDisableTwoFactor}>
                Disable 2FA
              </Button>
            )}
          </div>

          {showTwoFactorSetup && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  Scan this QR code with your authenticator app:
                </p>
                <img
                  src={twoFactorData.qrCode}
                  alt="2FA QR Code"
                  className="mx-auto"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Or enter this code manually: {twoFactorData.secret}
                </p>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Backup Codes
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Save these backup codes in a secure place. Each code can only be used once.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {twoFactorData.backupCodes.map((code, index) => (
                      <code key={index} className="text-xs bg-gray-100 p-1 rounded">
                        {code}
                      </code>
                    ))}
                  </div>
                </div>
              </div>

              <FormField label="Verification Code">
                <Input
                  value={twoFactorData.token}
                  onChange={(e) => setTwoFactorData(prev => ({
                    ...prev,
                    token: e.target.value
                  }))}
                  placeholder="Enter 6-digit code"
                  required
                />
              </FormField>

              <Button
                onClick={handleVerifyTwoFactor}
                isLoading={loading}
                className="w-full"
              >
                Verify and Enable
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Login History */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <History className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Login History
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {loginHistory.map((login) => (
              <div
                key={login.id}
                className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {login.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    {login.ip_address} • {login.user_agent}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(login.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Account Deletion */}
      <Card>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Delete Account
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}

export { SecuritySettings }