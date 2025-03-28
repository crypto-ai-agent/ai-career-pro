import React from 'react';
import { User } from 'lucide-react';
import { ProfileForm } from './ProfileForm';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getProfile, upsertProfile } from '../../services/database';
import { useLoadingState } from '../../hooks/useLoadingState';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorAlert } from '../shared/ErrorAlert';
import { ProfilePicture } from './ProfilePicture';

export function ProfileSection() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { isLoading, error, withLoading } = useLoadingState();
  const [profile, setProfile] = React.useState(null);

  React.useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    await withLoading(async () => {
      const data = await getProfile(user!.id);
      setProfile(data);
    });
  };

  const handleSave = async (data: any) => {
    if (!user) return;

    const prevProfile = { ...profile };
    const email = user.email;
    if (!email) {
      addToast('error', 'User email not found');
      return;
    }

    try {
      addToast('info', 'Saving changes...');
      const updated = await upsertProfile({
        id: user.id,
        email,
        full_name: data.fullName,
        company: data.company,
        job_title: data.jobTitle,
        experience_level: data.experienceLevel,
        updated_at: new Date().toISOString()
      });

      setProfile(updated);
      addToast('success', 'Profile updated successfully. Changes will be reflected shortly.');
    } catch (err) {
      console.error('Error updating profile:', err);
      addToast('error', 'Failed to update profile');
      setProfile(prevProfile); // Revert changes on error
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ProfilePicture
        url={profile.photo_url}
        onUpdate={async (url) => {
          await handleSave({ ...profile, photo_url: url });
        }}
      />
      <div className="flex items-center">
        <User className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">
          Profile Information
        </h3>
      </div>

      <ProfileForm 
        profile={profile} 
        onSave={handleSave} 
      />
    </div>
  );
}