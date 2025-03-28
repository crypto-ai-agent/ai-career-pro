import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormField, TextArea, Select } from '../ui/Form';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { submitFeedback } from '../../services/feedback';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackDialog({ isOpen, onClose }: FeedbackDialogProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [type, setType] = useState<'bug' | 'feature' | 'improvement' | 'other'>('improvement');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({
        user_id: user.id,
        type,
        content,
        status: 'pending',
        priority: 'medium'
      });

      addToast('success', 'Thank you for your feedback!');
      onClose();
      setContent('');
      setType('improvement');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      addToast('error', 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center mb-6">
            <MessageSquare className="w-6 h-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Share Your Feedback
            </h2>
          </div>

          <div className="space-y-4">
            <FormField label="Feedback Type">
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                required
              >
                <option value="bug">Report a Bug</option>
                <option value="feature">Request a Feature</option>
                <option value="improvement">Suggest an Improvement</option>
                <option value="other">Other</option>
              </Select>
            </FormField>

            <FormField label="Your Feedback">
              <TextArea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Tell us what you think..."
                required
              />
            </FormField>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Submit Feedback
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}