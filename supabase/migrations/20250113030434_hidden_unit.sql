/*
  # Add missing tables for system monitoring

  1. New Tables
    - `error_logs`
    - `performance_metrics`
    - `alert_history`
    - `auth_events`
    - `email_templates`

  2. Security
    - Enable RLS on all tables
    - Add admin-only access policies
*/

-- Create error_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('error', 'warning', 'info')),
  stack_trace text,
  context jsonb,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create performance_metrics table if it doesn't exist
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  context jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create alert_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS alert_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  severity text NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  triggered_value jsonb,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create auth_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  ip_address text NOT NULL,
  user_agent text NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create email_templates table if it doesn't exist
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

-- Enable RLS
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Error logs policies
  DROP POLICY IF EXISTS "Only admins can access error logs" ON error_logs;
  
  -- Performance metrics policies
  DROP POLICY IF EXISTS "Only admins can access performance metrics" ON performance_metrics;
  
  -- Alert history policies
  DROP POLICY IF EXISTS "Only admins can access alert history" ON alert_history;
  
  -- Auth events policies
  DROP POLICY IF EXISTS "Users can read own auth events" ON auth_events;
  
  -- Email templates policies
  DROP POLICY IF EXISTS "Only admins can manage email templates" ON email_templates;
END $$;

-- Create new policies
CREATE POLICY "Only admins can access error logs"
  ON error_logs FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "Only admins can access performance metrics"
  ON performance_metrics FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "Only admins can access alert history"
  ON alert_history FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "Users can read own auth events"
  ON auth_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage email templates"
  ON email_templates FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ));