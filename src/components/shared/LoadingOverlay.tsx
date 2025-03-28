import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '../../lib/utils';

interface LoadingOverlayProps {
  message?: string;
  progress?: number;
  steps?: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  currentStep?: number;
}

export function LoadingOverlay({ 
  message = 'Loading...', 
  progress,
  steps,
  currentStep = 0
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <LoadingSpinner size="lg" className="text-indigo-600 mb-4" />
        <p className="text-gray-700 font-medium">{message}</p>
        
        {steps && (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute left-0 top-1/2 w-full h-0.5 -translate-y-1/2 bg-gray-200">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
              </div>
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const isComplete = index < currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full transition-colors relative z-10',
                          isComplete ? 'bg-indigo-600' : 
                          isCurrent ? 'bg-indigo-100 border-2 border-indigo-600' : 
                          'bg-gray-200'
                        )}
                      />
                      <div className="mt-2 text-center">
                        <p className={cn(
                          'text-sm font-medium',
                          isComplete ? 'text-indigo-600' :
                          isCurrent ? 'text-gray-900' :
                          'text-gray-500'
                        )}>
                          {step.label}
                        </p>
                        {step.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {progress !== undefined && !steps && (
          <div className="mt-4 w-48 mx-auto">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">{progress}%</p>
          </div>
        )}
      </div>
    </div>
  );
}