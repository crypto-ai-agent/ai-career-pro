import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../hooks/useToast';
import { uploadProfilePicture, deleteProfilePicture } from '../../services/storage';
import { useAuth } from '../../contexts/AuthContext';

interface ProfilePictureProps {
  url?: string | null;
  onUpdate: (url: string | null) => Promise<void>;
}

export function ProfilePicture({ url, onUpdate }: ProfilePictureProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      addToast('error', 'Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      addToast('error', 'Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const newUrl = await uploadProfilePicture(user.id, file);
      await onUpdate(newUrl);
      addToast('success', 'Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      addToast('error', 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    try {
      await deleteProfilePicture(user.id);
      await onUpdate(null);
      addToast('success', 'Profile picture removed');
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      addToast('error', 'Failed to remove profile picture');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {url ? (
            <img
              src={url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        <label
          htmlFor="profile-picture"
          className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
        >
          <Camera className="w-4 h-4" />
          <input
            type="file"
            id="profile-picture"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-600">
          Upload a profile picture (max 5MB)
        </p>
        {url && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Remove Photo
          </Button>
        )}
      </div>
    </div>
  );
}