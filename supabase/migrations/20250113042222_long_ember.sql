-- Create secrets table
CREATE TABLE IF NOT EXISTS secrets (
  name text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Only admins can manage secrets"
  ON secrets
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

-- Create function to get secret
CREATE OR REPLACE FUNCTION get_secret(secret_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN (
    SELECT value
    FROM secrets
    WHERE name = secret_name
  );
END;
$$;

-- Create function to set secret
CREATE OR REPLACE FUNCTION set_secret(secret_name text, secret_value text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Insert or update secret
  INSERT INTO secrets (name, value, updated_at)
  VALUES (secret_name, secret_value, now())
  ON CONFLICT (name) DO UPDATE
  SET value = EXCLUDED.value,
      updated_at = EXCLUDED.updated_at;
END;
$$;