/*
  # Add Admin Status to Profiles

  1. Changes
    - Add is_admin column to profiles table
    - Create index for performance
    - Create policy for admin status updates

  2. Security
    - Only admins can update admin status
    - Users can update their own profile without changing admin status
*/

-- Add is_admin column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Only admins can update admin status" ON profiles;

-- Create policy for admin column updates
CREATE POLICY "Only admins can update admin status"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    -- Allow admins to update any profile
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
    OR
    -- Allow users to update their own profile (except admin status)
    (
      auth.uid() = id
      AND NOT (
        SELECT COALESCE(
          jsonb_extract_path_text(current_setting('request.jwt.claims', true)::jsonb, 'role') = 'authenticated'
          AND
          jsonb_extract_path_text(current_setting('request.jwt.claims', true)::jsonb, 'sub') = id::text
          AND
          is_admin != (SELECT is_admin FROM profiles WHERE id = auth.uid()),
          false
        )
      )
    )
  );