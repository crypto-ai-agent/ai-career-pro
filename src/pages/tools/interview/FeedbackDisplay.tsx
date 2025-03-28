import React from 'react';
import { CheckCircle, XCircle, BarChart, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { InterviewFeedback } from './types';

interface FeedbackDisplayProps {
  feedback: InterviewFeedback;
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
            <span className="text-2xl font-bold text-indigo-600">
              {feedback.score}%
            </span>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Interview Performance
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-800 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Strengths
            </h4>
            <ul className="mt-2 space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-green-700">
                  • {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-medium text-red-800 flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              Areas for Improvement
            </h4>
            <ul className="mt-2 space-y-2">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="text-sm text-red-700">
                  • {improvement}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 flex items-center">
              <BarChart className="w-5 h-5 mr-2" />
              Metrics
            </h4>
            <div className="mt-2 space-y-2">
              {feedback.technicalAccuracy !== undefined && (
                <div className="text-sm text-blue-700">
                  Technical Accuracy: {feedback.technicalAccuracy}%
                </div>
              )}
              <div className="text-sm text-blue-700">
                Communication: {feedback.communicationClarity}%
              </div>
              <div className="text-sm text-blue-700">
                Structure: {feedback.structureAndOrganization}%
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-900 flex items-center mb-3">
            <ArrowRight className="w-5 h-5 mr-2" />
            Next Steps
          </h4>
          <ul className="space-y-2">
            {feedback.nextSteps.map((step, index) => (
              <li key={index} className="text-sm text-gray-700">
                {index + 1}. {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}