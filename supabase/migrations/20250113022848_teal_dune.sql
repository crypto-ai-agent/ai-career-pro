/*
  # Fix RLS Policies

  This migration fixes the RLS policies by:
  1. Dropping existing problematic policies
  2. Creating new, optimized policies that avoid using OLD references
  3. Separating admin and regular user policies
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can do everything" ON profiles;
DROP POLICY IF EXISTS "Only admins can update admin status" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new, optimized policies
CREATE POLICY "Profiles are readable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Regular users can update their own non-admin profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id 
    AND NOT EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  )
  WITH CHECK (
    auth.uid() = id 
    AND is_admin = false
  );

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Recreate SEO metadata policies
DROP POLICY IF EXISTS "Only admins can modify SEO metadata" ON seo_metadata;
DROP POLICY IF EXISTS "SEO metadata is publicly readable" ON seo_metadata;

CREATE POLICY "SEO metadata is publicly readable"
  ON seo_metadata FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admins can modify SEO metadata"
  ON seo_metadata FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );