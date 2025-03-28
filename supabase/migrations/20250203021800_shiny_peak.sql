-- Insert SEO metadata for coming-soon page
INSERT INTO seo_metadata (path, title, description, keywords)
VALUES
  (
    '/coming-soon',
    'Coming Soon - AI Career Pro',
    'Discover our upcoming AI-powered features revolutionizing the job search process with Crypto-AI-Agent technology',
    'ai job search, automated job applications, voice interview training, cv matching, blockchain, agent token, crypto-ai-agent'
  )
ON CONFLICT (path) 
DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords;