import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { FormField, Input } from '../ui/Form';
import { Button } from '../ui/Button';
import { upsertProfile } from '../../services/database';
import { useToast } from '../../hooks/useToast';

interface ProfileFormData {
  fullName: string;
  company: string;
  jobTitle: string;
  email: string;
}

export function ProfileCompletion() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    jobTitle: '',
    email: user?.email || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setIsLoading(true);
    setError(null);

    try {
      await upsertProfile({
        id: user.id,
        email: user.email,
        full_name: formData.fullName,
        company: formData.company,
        job_title: formData.jobTitle,
        updated_at: new Date().toISOString()
      });

      addToast('success', 'Profile completed successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error('Error saving profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (!user?.email) return;
    
    // Create basic profile with just email
    upsertProfile({
      id: user.id,
      email: user.email,
      updated_at: new Date().toISOString()
    }).then(() => {
      addToast('info', 'You can complete your profile later in Settings');
      navigate('/dashboard');
    }).catch(err => {
      console.error('Error creating basic profile:', err);
      addToast('error', 'Failed to initialize profile');
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!user?.email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <FormField label="Full Name">
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Company (Optional)">
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Job Title (Optional)">
                <Input
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </FormField>

              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                >
                  Skip for Now
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  Complete Profile
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}