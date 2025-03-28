/*
  # SEO Metadata Table

  1. New Tables
    - `seo_metadata` table for storing SEO information
  
  2. Security
    - Enable RLS
    - Public read access
    - Admin-only write access
*/

-- Create SEO metadata table
CREATE TABLE seo_metadata (
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

-- Create trigger for updated_at
CREATE TRIGGER update_seo_metadata_updated_at
  BEFORE UPDATE ON seo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "SEO metadata is publicly readable"
  ON seo_metadata FOR SELECT
  TO PUBLIC
  USING (true);

-- Create separate policies for each operation type
CREATE POLICY "Admins can insert SEO metadata"
  ON seo_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update SEO metadata"
  ON seo_metadata
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete SEO metadata"
  ON seo_metadata
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Insert initial SEO metadata
INSERT INTO seo_metadata (path, title, description) VALUES
  ('/', 'AI Career Pro - AI-Powered Career Tools', 'Advance your career with AI-powered tools for CV optimization, cover letters, and interview preparation'),
  ('/about', 'About Us - AI Career Pro', 'Learn about our mission to revolutionize career advancement with AI'),
  ('/services', 'Our Services - AI Career Pro', 'Explore our comprehensive suite of AI-powered career advancement tools'),
  ('/pricing', 'Pricing Plans - AI Career Pro', 'Choose the perfect plan for your career advancement needs'),
  ('/contact', 'Contact Us - AI Career Pro', 'Get in touch with our team for support and inquiries'),
  ('/dashboard', 'Dashboard - AI Career Pro', 'Access all your AI-powered career tools in one place'),
  ('/tools/cv', 'CV Optimizer - AI Career Pro', 'Optimize your CV with AI-powered suggestions and improvements'),
  ('/tools/cover-letter', 'Cover Letter Generator - AI Career Pro', 'Create compelling cover letters tailored to your job applications'),
  ('/tools/email', 'Email Preparer - AI Career Pro', 'Draft professional emails for job applications and follow-ups'),
  ('/tools/interview', 'Interview Coach - AI Career Pro', 'Practice interviews and get instant AI feedback');