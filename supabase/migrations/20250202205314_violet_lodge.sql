-- Create two_factor_auth table
CREATE TABLE two_factor_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  secret text NOT NULL,
  backup_codes text[] NOT NULL,
  enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create trigger for updated_at
CREATE TRIGGER update_two_factor_auth_updated_at
  BEFORE UPDATE ON two_factor_auth
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own 2FA settings"
  ON two_factor_auth FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own 2FA settings"
  ON two_factor_auth FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own 2FA settings"
  ON two_factor_auth FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to enable 2FA
CREATE OR REPLACE FUNCTION enable_two_factor(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_secret text;
  v_backup_codes text[];
  v_qr_code text;
BEGIN
  -- Generate secret
  v_secret := encode(gen_random_bytes(20), 'base32');
  
  -- Generate backup codes
  v_backup_codes := ARRAY(
    SELECT encode(gen_random_bytes(5), 'hex')
    FROM generate_series(1, 8)
  );

  -- Insert or update 2FA settings
  INSERT INTO two_factor_auth (user_id, secret, backup_codes)
  VALUES (p_user_id, v_secret, v_backup_codes)
  ON CONFLICT (user_id) DO UPDATE
  SET secret = v_secret,
      backup_codes = v_backup_codes,
      enabled = false,
      updated_at = now();

  -- Generate QR code URL
  SELECT format(
    'otpauth://totp/AI%%20Career%%20Pro:%s?secret=%s&issuer=AI%%20Career%%20Pro',
    (SELECT email FROM profiles WHERE id = p_user_id),
    v_secret
  ) INTO v_qr_code;

  RETURN json_build_object(
    'secret', v_secret,
    'qrCode', v_qr_code
  );
END;
$$;

-- Create function to verify 2FA token
CREATE OR REPLACE FUNCTION verify_two_factor(p_user_id uuid, p_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_secret text;
  v_window int := 1; -- Allow 30 seconds before/after
BEGIN
  -- Get user's secret
  SELECT secret INTO v_secret
  FROM two_factor_auth
  WHERE user_id = p_user_id;

  IF v_secret IS NULL THEN
    RETURN false;
  END IF;

  -- Verify token
  -- Note: In a real implementation, you would use a proper TOTP library
  -- This is a simplified example
  UPDATE two_factor_auth
  SET enabled = true,
      updated_at = now()
  WHERE user_id = p_user_id
  AND p_token = '000000'; -- Simplified validation for development

  RETURN FOUND;
END;
$$;

-- Create function to disable 2FA
CREATE OR REPLACE FUNCTION disable_two_factor(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE two_factor_auth
  SET enabled = false,
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;