-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop auth_events policies
  DROP POLICY IF EXISTS "Users can read own auth events" ON auth_events;
  DROP POLICY IF EXISTS "Admins can read all auth events" ON auth_events;
  
  -- Drop interviews policies
  DROP POLICY IF EXISTS "Users can read own interviews" ON interviews;
  DROP POLICY IF EXISTS "Users can create own interviews" ON interviews;
  DROP POLICY IF EXISTS "Users can update own interviews" ON interviews;
  DROP POLICY IF EXISTS "Users can delete own interviews" ON interviews;
END $$;

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

-- Create interviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  interview_type text NOT NULL,
  role text NOT NULL,
  score integer NOT NULL,
  feedback jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE auth_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auth_events
CREATE POLICY "Users can read own auth events"
  ON auth_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all auth events"
  ON auth_events FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ));

-- Create RLS policies for interviews
CREATE POLICY "Users can read own interviews"
  ON interviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interviews"
  ON interviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interviews"
  ON interviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_events_user_id ON auth_events(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_events_created_at ON auth_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_created_at ON interviews(created_at DESC);