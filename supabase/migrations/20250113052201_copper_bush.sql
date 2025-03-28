-- Insert or update SEO metadata for legal pages
INSERT INTO seo_metadata (path, title, description, keywords)
VALUES
  (
    '/privacy',
    'Privacy Policy - AI Career Pro',
    'Learn how we protect and handle your data',
    'privacy policy, data protection, user privacy, data handling, security'
  ),
  (
    '/terms',
    'Terms of Service - AI Career Pro',
    'Read our terms of service and usage conditions',
    'terms of service, user agreement, legal terms, conditions of use'
  )
ON CONFLICT (path) 
DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords;

-- Create index for path lookups
CREATE INDEX IF NOT EXISTS idx_seo_metadata_path ON seo_metadata(path);