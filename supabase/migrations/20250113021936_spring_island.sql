/*
  # Fix SEO Metadata Policies
  
  This migration:
  1. Drops existing policies before recreating them
  2. Ensures clean policy creation
  3. Adds any missing SEO metadata
  
  Note: Uses IF EXISTS checks to prevent errors
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "SEO metadata is publicly readable" ON seo_metadata;
DROP POLICY IF EXISTS "Only admins can modify SEO metadata" ON seo_metadata;
DROP POLICY IF EXISTS "Admins can insert SEO metadata" ON seo_metadata;
DROP POLICY IF EXISTS "Admins can update SEO metadata" ON seo_metadata;
DROP POLICY IF EXISTS "Admins can delete SEO metadata" ON seo_metadata;

-- Create new policies
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

-- Insert any missing SEO metadata
INSERT INTO seo_metadata (path, title, description)
SELECT v.path, v.title, v.description
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
WHERE NOT EXISTS (
  SELECT 1 FROM seo_metadata s
  WHERE s.path = v.path
);