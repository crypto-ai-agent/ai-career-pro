/*
  # Create System Monitoring Tables

  1. New Tables
    - `error_logs` - For tracking system errors
    - `performance_metrics` - For tracking system performance
    - `alert_history` - For tracking system alerts
    - `email_templates` - For managing email templates
    - `email_campaigns` - For tracking email campaigns

  2. Security
    - Enable RLS on all tables
    - Add admin-only access policies
*/

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type text NOT NULL,
  message text NOT NULL,
  stack_trace text,
  context jsonb,
  severity text NOT NULL CHECK (severity IN ('error', 'warning', 'info')),
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create performance_metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  context jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create alert_history table
CREATE TABLE IF NOT EXISTS alert_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  severity text NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  triggered_value jsonb,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  variables text[] NOT NULL DEFAULT '{}',
  category text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create email_campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  template_id uuid REFERENCES email_templates(id),
  segment_criteria jsonb NOT NULL DEFAULT '{}'::jsonb,
  scheduled_at timestamptz,
  sent_at timestamptz,
  status text NOT NULL CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for updated_at
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for error_logs
CREATE POLICY "Only admins can access error logs"
  ON error_logs
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

-- Create RLS policies for performance_metrics
CREATE POLICY "Only admins can access performance metrics"
  ON performance_metrics
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

-- Create RLS policies for alert_history
CREATE POLICY "Only admins can access alert history"
  ON alert_history
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

-- Create RLS policies for email_templates
CREATE POLICY "Only admins can manage email templates"
  ON email_templates
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

-- Create RLS policies for email_campaigns
CREATE POLICY "Only admins can manage email campaigns"
  ON email_campaigns
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

-- Insert initial email templates
INSERT INTO email_templates (name, subject, content, variables, category) VALUES
(
  'Welcome Email',
  'Welcome to AI Career Pro!',
  'Hi {{name}},\n\nWelcome to AI Career Pro! We''re excited to help you advance your career with our AI-powered tools.\n\nBest regards,\nThe AI Career Pro Team',
  ARRAY['name'],
  'onboarding'
),
(
  'Password Reset',
  'Reset Your Password',
  'Hi {{name}},\n\nClick the link below to reset your password:\n\n{{resetLink}}\n\nIf you didn''t request this, please ignore this email.',
  ARRAY['name', 'resetLink'],
  'transactional'
),
(
  'Usage Limit Warning',
  'Approaching Usage Limit',
  'Hi {{name}},\n\nYou''re approaching your usage limit for {{feature}}. You have {{remaining}} uses remaining this month.\n\nConsider upgrading your plan to get more usage.',
  ARRAY['name', 'feature', 'remaining'],
  'notification'
);

-- Create indexes for performance
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX idx_error_logs_severity ON error_logs(severity);
CREATE INDEX idx_error_logs_resolved ON error_logs(resolved);
CREATE INDEX idx_performance_metrics_created_at ON performance_metrics(created_at DESC);
CREATE INDEX idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX idx_alert_history_created_at ON alert_history(created_at DESC);
CREATE INDEX idx_alert_history_severity ON alert_history(severity);
CREATE INDEX idx_alert_history_resolved ON alert_history(resolved);
CREATE INDEX idx_email_templates_category ON email_templates(category);
CREATE INDEX idx_email_templates_active ON email_templates(active);
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_email_campaigns_scheduled_at ON email_campaigns(scheduled_at);