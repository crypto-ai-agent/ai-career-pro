/*
  # Add Active Sessions Management

  1. New Tables
    - `active_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `device` (text)
      - `ip_address` (text)
      - `last_active` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `active_sessions` table
    - Add policies for user access
*/

-- Create active_sessions table
CREATE TABLE active_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  device text NOT NULL,
  ip_address text NOT NULL,
  last_active timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for updated_at
CREATE TRIGGER update_active_sessions_updated_at
  BEFORE UPDATE ON active_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own sessions"
  ON active_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON active_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON active_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON active_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX idx_active_sessions_last_active ON active_sessions(last_active DESC);

-- Create function to clean up old sessions
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM active_sessions
  WHERE last_active < now() - interval '30 days';
END;
$$;

-- Create function to update session activity
CREATE OR REPLACE FUNCTION update_session_activity(session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE active_sessions
  SET last_active = now(),
      updated_at = now()
  WHERE id = session_id;
END;
$$;