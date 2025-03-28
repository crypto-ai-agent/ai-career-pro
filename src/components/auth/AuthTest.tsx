import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export function AuthTest() {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [authStatus, setAuthStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Test database connection
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
        .single();
        
      if (dbError) throw dbError;
      setDbStatus('connected');

      // Test auth connection
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      
      setSession(session);
      setAuthStatus('connected');
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      setDbStatus('error');
      setAuthStatus('error');
    }
  };

  const handleTestSignUp = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      setError('Sign up successful! Check email for confirmation.');
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : 'Sign up failed');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Connection Test</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Database Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Database Connection:</span>
          {dbStatus === 'checking' ? (
            <LoadingSpinner size="sm" />
          ) : dbStatus === 'connected' ? (
            <span className="text-green-600">Connected</span>
          ) : (
            <span className="text-red-600">Error</span>
          )}
        </div>

        {/* Auth Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Auth Connection:</span>
          {authStatus === 'checking' ? (
            <LoadingSpinner size="sm" />
          ) : authStatus === 'connected' ? (
            <span className="text-green-600">Connected</span>
          ) : (
            <span className="text-red-600">Error</span>
          )}
        </div>

        {/* Session Info */}
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Session Status:</h3>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({ session }, null, 2)}
          </pre>
        </div>

        {/* Test Sign Up */}
        <div className="pt-4">
          <Button 
            onClick={handleTestSignUp}
            disabled={dbStatus !== 'connected' || authStatus !== 'connected'}
          >
            Test Sign Up
          </Button>
        </div>
      </div>
    </Card>
  );
}