import React from 'react';
import { AuthTest } from '../../components/auth/AuthTest';

export function AuthTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthTest />
      </div>
    </div>
  );
}