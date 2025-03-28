/*
  # Create Admin Tables

  1. New Tables
    - `api_keys` - For managing API access keys
    - `webhooks` - For managing service webhooks
    - `subscription_plans` - For managing subscription plans and pricing

  2. Security
    - Enable RLS on all tables
    - Add policies for admin-only access
*/

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  value text NOT NULL,
  description text,
  last_used timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  event text NOT NULL,
  description text,
  headers jsonb DEFAULT '{}'::jsonb,
  active boolean DEFAULT true,
  last_triggered timestamptz,
  last_status text CHECK (last_status IN ('success', 'error')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  interval text NOT NULL CHECK (interval IN ('month', 'year')),
  features text[] NOT NULL DEFAULT '{}',
  limits jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create triggers for updated_at
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at
  BEFORE UPDATE ON webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for api_keys
CREATE POLICY "Only admins can manage API keys"
  ON api_keys
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

-- Create RLS policies for webhooks
CREATE POLICY "Only admins can manage webhooks"
  ON webhooks
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

-- Create RLS policies for subscription_plans
CREATE POLICY "Subscription plans are publicly readable"
  ON subscription_plans
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Only admins can manage subscription plans"
  ON subscription_plans
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

-- Insert initial subscription plans
INSERT INTO subscription_plans (name, price, interval, features, limits) VALUES
(
  'Free Plan',
  0,
  'month',
  ARRAY[
    'Basic access to all tools',
    'Limited monthly usage',
    'Community support'
  ],
  '{"monthly_cvs": 1, "monthly_cover_letters": 1, "monthly_emails": 2, "monthly_interviews": 1}'
),
(
  'Pro Plan',
  29.99,
  'month',
  ARRAY[
    'Full access to all tools',
    'Unlimited usage of most features',
    'Priority support',
    'Save 20% vs. individual plans'
  ],
  '{"monthly_cvs": -1, "monthly_cover_letters": -1, "monthly_emails": -1, "monthly_interviews": 10}'
),
(
  'Enterprise Plan',
  79.99,
  'month',
  ARRAY[
    'Everything in Pro package',
    'Custom branding',
    'API access',
    'Dedicated account manager',
    'Save 25% vs. individual plans'
  ],
  '{"monthly_cvs": -1, "monthly_cover_letters": -1, "monthly_emails": -1, "monthly_interviews": -1}'
);

-- Insert initial webhooks
INSERT INTO webhooks (name, url, event, description) VALUES
(
  'Cover Letter Generator',
  'https://shayldon.app.n8n.cloud/webhook-test/1c328895-2736-4acd-811c-e199dcbdb312',
  'cover_letter.generate',
  'Webhook for generating cover letters'
),
(
  'CV Optimizer',
  'https://shayldon.app.n8n.cloud/webhook-test/cv-optimizer',
  'cv.optimize',
  'Webhook for optimizing CVs'
),
(
  'Email Preparer',
  'https://shayldon.app.n8n.cloud/webhook-test/email-preparer',
  'email.prepare',
  'Webhook for preparing emails'
),
(
  'Interview Coach',
  'https://shayldon.app.n8n.cloud/webhook-test/interview-coach',
  'interview.practice',
  'Webhook for interview practice sessions'
);