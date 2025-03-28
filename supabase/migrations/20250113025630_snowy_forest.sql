-- Create auth_events table
CREATE TABLE IF NOT EXISTS auth_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  ip_address text NOT NULL,
  user_agent text NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE auth_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own auth events"
  ON auth_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all auth events"
  ON auth_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Create indexes for performance
CREATE INDEX idx_auth_events_user_id ON auth_events(user_id);
CREATE INDEX idx_auth_events_event_type ON auth_events(event_type);
CREATE INDEX idx_auth_events_created_at ON auth_events(created_at DESC);

-- Create function to track login events
CREATE OR REPLACE FUNCTION track_login_event()
RETURNS trigger AS $$
BEGIN
  INSERT INTO auth_events (
    user_id,
    event_type,
    ip_address,
    user_agent,
    location
  ) VALUES (
    NEW.id,
    'login',
    current_setting('request.headers')::json->>'x-real-ip',
    current_setting('request.headers')::json->>'user-agent',
    'Unknown' -- In a real app, you'd use IP geolocation here
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to track logins
CREATE TRIGGER on_auth_user_login
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION track_login_event();