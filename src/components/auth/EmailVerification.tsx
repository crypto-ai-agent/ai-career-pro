import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function EmailVerification() {
  const { user, resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerification();
    } catch (error) {
      console.error('Error resending verification:', error);
    } finally {
      setIsResending(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="max-w-md mx-auto mt-8">
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-4">
          Verify your email
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          We sent a verification email to <strong>{user.email}</strong>.
          Please check your inbox and click the verification link to continue.
        </p>

        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleResend}
            isLoading={isResending}
          >
            Resend verification email
          </Button>
        </div>
      </div>
    </Card>
  );
}