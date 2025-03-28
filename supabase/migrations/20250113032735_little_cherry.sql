-- Update SEO metadata paths to match actual service URLs
UPDATE seo_metadata 
SET path = CASE 
  WHEN path = '/services/cv-optimizer' THEN '/services/cv'
  WHEN path = '/services/cover-letter-generator' THEN '/services/cover-letter'
  WHEN path = '/services/email-preparer' THEN '/services/email'
  WHEN path = '/services/interview-coach' THEN '/services/interview'
  ELSE path
END
WHERE path IN (
  '/services/cv-optimizer',
  '/services/cover-letter-generator',
  '/services/email-preparer',
  '/services/interview-coach'
);

-- Insert any missing service paths
INSERT INTO seo_metadata (path, title, description, keywords)
VALUES
  (
    '/services/cv',
    'CV Optimizer - AI Career Pro',
    'Transform your CV with AI-powered optimization and get more interviews',
    'cv optimization, resume builder, ai cv writer, professional resume, job application'
  ),
  (
    '/services/cover-letter',
    'Cover Letter Generator - AI Career Pro',
    'Create compelling cover letters in minutes with our AI-powered generator',
    'cover letter generator, ai cover letter, professional cover letter, job application letter'
  ),
  (
    '/services/email',
    'Email Preparer - AI Career Pro',
    'Craft professional emails for job applications and follow-ups',
    'professional email, job application email, follow up email, business communication'
  ),
  (
    '/services/interview',
    'Interview Coach - AI Career Pro',
    'Practice interviews with AI feedback and improve your interview skills',
    'interview practice, ai interview coach, interview preparation, job interview'
  )
ON CONFLICT (path) 
DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords;