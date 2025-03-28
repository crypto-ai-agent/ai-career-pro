import React from 'react';
import { Check, Loader } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  progress: number;
}

export function ProgressSteps({ steps, currentStep, progress }: ProgressStepsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Steps */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 -translate-y-1/2 bg-gray-200">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
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
                    'w-8 h-8 rounded-full flex items-center justify-center transition-colors relative z-10',
                    isComplete ? 'bg-indigo-600' : 
                    isCurrent ? 'bg-indigo-100 border-2 border-indigo-600' : 
                    'bg-gray-100 border-2 border-gray-200'
                  )}
                >
                  {isComplete ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : isCurrent ? (
                    <Loader className="w-5 h-5 text-indigo-600 animate-spin" />
                  ) : (
                    <span className="w-4 h-4 text-gray-400">{index + 1}</span>
                  )}
                </div>
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
  );
}