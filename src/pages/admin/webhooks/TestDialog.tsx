import React, { useState } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

interface TestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  webhook: {
    name: string;
    event: string;
    url: string;
  };
  onTest: () => Promise<void>;
}

const sampleData = {
  'cover_letter.generate': {
    jobTitle: 'Software Engineer',
    company: 'Example Corp',
    keySkills: 'React, TypeScript, Node.js',
    experience: '5 years of software development',
    tone: 'professional',
    length: 'medium'
  },
  'cv.optimize': {
    targetRole: 'Senior Developer',
    industry: 'Technology',
    experienceLevel: 'senior',
    keySkills: 'JavaScript, React, Node.js, AWS'
  },
  'email.prepare': {
    emailType: 'application',
    recipient: 'Hiring Manager',
    company: 'Tech Corp',
    role: 'Full Stack Developer',
    context: 'Following up on job application',
    tone: 'professional'
  },
  'interview.practice': {
    role: 'Software Engineer',
    interviewType: 'technical',
    experienceLevel: 'senior',
    industry: 'Technology'
  }
};

export function TestDialog({ isOpen, onClose, webhook, onTest }: TestDialogProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    request: {
      url: string;
      method: string;
      headers: Record<string, string>;
      body: any;
    };
    response: {
      status: number;
      statusText: string;
      body: any;
    };
  } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setStatus('loading');
    setError(null);
    let timeoutId: NodeJS.Timeout;

    try {
      // Set a timeout to fail the test if it takes too long
      const testPromise = onTest();
      timeoutId = setTimeout(() => {
        throw new Error('Webhook test timed out after 10 seconds');
      }, 10000);

      const result = await onTest();
      setTestResult(result);
      clearTimeout(timeoutId);
      setStatus('success');
    } catch (err) {
      clearTimeout(timeoutId);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Test failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Dialog panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Test Webhook: {webhook.name}
                  </h3>
                  <Button variant="outline" onClick={onClose} className="p-1">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">URL:</p>
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded">{webhook.url}</p>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Sample Payload:</p>
                  <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(sampleData[webhook.event as keyof typeof sampleData] || {}, null, 2)}
                  </pre>
                </div>

                {status === 'error' && error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">{error}</div>
                      </div>
                    </div>
                  </div>
                )}

                {status === 'success' && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Success</h3>
                        <div className="mt-2 text-sm text-green-700">
                          Webhook test completed successfully
                        </div>
                        {testResult && (
                          <div className="mt-4 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-green-800">Response Status:</h4>
                              <p className="text-sm text-green-700">
                                {testResult.response.status} {testResult.response.statusText}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-green-800">Response Body:</h4>
                              <pre className="text-sm bg-green-50 p-2 rounded overflow-auto max-h-40">
                                {JSON.stringify(testResult.response.body, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              onClick={handleTest}
              isLoading={status === 'loading'}
              disabled={status === 'loading'}
              className="w-full sm:ml-3 sm:w-auto"
            >
              {status === 'loading' ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Testing...
                </>
              ) : (
                'Test Webhook'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}