/*
  # Fix Database Dependencies
  
  This migration:
  1. Safely adds is_admin column to profiles
  2. Creates SEO metadata table with proper dependencies
  3. Avoids trigger conflicts by checking existence
  
  Note: Uses IF NOT EXISTS and DO blocks to prevent conflicts
*/

-- Add is_admin column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Create index for admin lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Drop existing admin-related policies if they exist
DROP POLICY IF EXISTS "Only admins can update admin status" ON profiles;
DROP POLICY IF EXISTS "Admins can do everything" ON profiles;

-- Create new admin policy
CREATE POLICY "Admins can do everything"
  ON profiles
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

-- Create SEO metadata table if it doesn't exist
CREATE TABLE IF NOT EXISTS seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  keywords text,
  og_title text,
  og_description text,
  og_image text,
  canonical_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for SEO metadata if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_seo_metadata_updated_at'
  ) THEN
    CREATE TRIGGER update_seo_metadata_updated_at
      BEFORE UPDATE ON seo_metadata
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable RLS on SEO metadata
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for SEO metadata
DROP POLICY IF EXISTS "SEO metadata is publicly readable" ON seo_metadata;
DROP POLICY IF EXISTS "Only admins can modify SEO metadata" ON seo_metadata;

CREATE POLICY "SEO metadata is publicly readable"
  ON seo_metadata FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Only admins can modify SEO metadata"
  ON seo_metadata
  FOR ALL
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

-- Insert initial SEO metadata if table is empty
INSERT INTO seo_metadata (path, title, description)
SELECT path, title, description
FROM (VALUES
  ('/', 'AI Career Pro - AI-Powered Career Tools', 'Advance your career with AI-powered tools for CV optimization, cover letters, and interview preparation'),
  ('/about', 'About Us - AI Career Pro', 'Learn about our mission to revolutionize career advancement with AI'),
  ('/services', 'Our Services - AI Career Pro', 'Explore our comprehensive suite of AI-powered career advancement tools'),
  ('/pricing', 'Pricing Plans - AI Career Pro', 'Choose the perfect plan for your career advancement needs'),
  ('/contact', 'Contact Us - AI Career Pro', 'Get in touch with our team for support and inquiries'),
  ('/dashboard', 'Dashboard - AI Career Pro', 'Access all your AI-powered career tools in one place'),
  ('/tools/cv', 'CV Optimizer - AI Career Pro', 'Optimize your CV with AI-powered suggestions and improvements'),
  ('/tools/cover-letter', 'Cover Letter Generator - AI Career Pro', 'Create compelling cover letters tailored to your job applications'),
  ('/tools/email', 'Email Preparer - AI Career Pro', 'Draft professional emails for job applications and follow-ups'),
  ('/tools/interview', 'Interview Coach - AI Career Pro', 'Practice interviews and get instant AI feedback')
) AS v(path, title, description)
WHERE NOT EXISTS (SELECT 1 FROM seo_metadata LIMIT 1);