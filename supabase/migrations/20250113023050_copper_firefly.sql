/*
  # Create Admin and Content Management Tables

  This migration creates:
  1. Content management tables (pages, FAQs, social links)
  2. Analytics and revenue tracking tables
  3. Newsletter management tables
  4. Required functions for analytics
*/

-- Create content_pages table
CREATE TABLE IF NOT EXISTS content_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  display_order integer NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text,
  active boolean DEFAULT true,
  display_order integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletter_history table
CREATE TABLE IF NOT EXISTS newsletter_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  sent_to integer NOT NULL,
  sent_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create revenue_metrics table
CREATE TABLE IF NOT EXISTS revenue_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  mrr numeric NOT NULL DEFAULT 0,
  new_subscriptions integer NOT NULL DEFAULT 0,
  churned_subscriptions integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  properties jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create triggers
CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON content_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON social_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create calculate_mrr function
CREATE OR REPLACE FUNCTION calculate_mrr()
RETURNS numeric AS $$
DECLARE
  total_mrr numeric;
BEGIN
  SELECT COALESCE(SUM(
    CASE 
      WHEN s.plan = 'pro' THEN 
        CASE WHEN s.billing_cycle = 'yearly' THEN 29.99 * 0.9 ELSE 29.99 END
      WHEN s.plan = 'enterprise' THEN
        CASE WHEN s.billing_cycle = 'yearly' THEN 79.99 * 0.9 ELSE 79.99 END
      ELSE 0
    END
  ), 0)
  INTO total_mrr
  FROM subscriptions s
  WHERE s.status = 'active';

  RETURN total_mrr;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Content pages are publicly readable when published"
  ON content_pages FOR SELECT
  TO PUBLIC
  USING (published = true);

CREATE POLICY "Admins can manage content pages"
  ON content_pages
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "FAQs are publicly readable when active"
  ON faqs FOR SELECT
  TO PUBLIC
  USING (active = true);

CREATE POLICY "Admins can manage FAQs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "Social links are publicly readable"
  ON social_links FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admins can manage social links"
  ON social_links
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "Only admins can access newsletter history"
  ON newsletter_history
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "Only admins can access revenue metrics"
  ON revenue_metrics
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "Analytics events are readable by admins"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "Users can create own analytics events"
  ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert initial content
INSERT INTO content_pages (slug, title, content, published) VALUES
('privacy', 'Privacy Policy', '{"sections":[{"title":"Introduction","content":"This Privacy Policy describes how we collect, use, and handle your information."},{"title":"Information We Collect","content":"We collect information that you provide directly to us..."},{"title":"How We Use Information","content":"We use the information we collect to provide and improve our services..."}]}', true),
('terms', 'Terms of Service', '{"sections":[{"title":"Agreement to Terms","content":"By accessing our service, you agree to be bound by these terms."},{"title":"Use License","content":"Permission is granted to temporarily use our service..."},{"title":"Disclaimer","content":"The materials on our service are provided on an as is basis..."}]}', true);

INSERT INTO social_links (platform, url, display_order) VALUES
('twitter', 'https://twitter.com/aicareerpro', 1),
('linkedin', 'https://linkedin.com/company/aicareerpro', 2),
('github', 'https://github.com/aicareerpro', 3);

INSERT INTO faqs (question, answer, category, display_order) VALUES
('What is AI Career Pro?', 'AI Career Pro is a platform that uses artificial intelligence to help you advance your career through optimized CVs, cover letters, and interview preparation.', 'General', 1),
('How does the CV optimizer work?', 'Our CV optimizer uses AI to analyze your CV against job requirements and industry standards, providing specific recommendations for improvement.', 'Features', 2),
('What payment methods do you accept?', 'We accept all major credit cards, PayPal, and bank transfers for annual plans.', 'Billing', 3),
('Is my data secure?', 'Yes, we use enterprise-grade encryption and security measures to protect your data. We never share your information with third parties.', 'Security', 4);