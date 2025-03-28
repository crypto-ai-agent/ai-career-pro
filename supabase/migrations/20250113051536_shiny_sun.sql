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

-- Create function to handle single row SEO metadata queries
CREATE OR REPLACE FUNCTION get_seo_metadata(page_path text)
RETURNS TABLE (
  path text,
  title text,
  description text,
  keywords text,
  og_title text,
  og_description text,
  og_image text,
  canonical_url text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM seo_metadata
  WHERE seo_metadata.path = page_path
  LIMIT 1;
END;
$$;