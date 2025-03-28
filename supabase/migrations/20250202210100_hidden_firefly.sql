-- Enable pgcrypto extension for cryptographic functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create two_factor_attempts table
CREATE TABLE IF NOT EXISTS two_factor_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  ip_address text NOT NULL,
  success boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for rate limiting
CREATE INDEX idx_2fa_attempts_user_ip ON two_factor_attempts(user_id, ip_address);
CREATE INDEX idx_2fa_attempts_created_at ON two_factor_attempts(created_at);

-- Create function to check rate limit
CREATE OR REPLACE FUNCTION check_2fa_rate_limit(p_user_id uuid, p_ip_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_count int;
BEGIN
  SELECT COUNT(*)
  INTO attempt_count
  FROM two_factor_attempts
  WHERE user_id = p_user_id
    AND ip_address = p_ip_address
    AND created_at > now() - interval '15 minutes'
    AND NOT success;
    
  RETURN attempt_count < 5;
END;
$$;

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
  -- Generate secret using pgcrypto
  v_secret := encode(gen_random_bytes(20), 'base32');
  
  -- Generate backup codes
  v_backup_codes := ARRAY(
    SELECT encode(gen_random_bytes(4), 'hex')
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
    'otpauth://totp/AI%%20Career%%20Pro:%s?secret=%s&issuer=AI%%20Career%%20Pro&algorithm=SHA1&digits=6&period=30',
    (SELECT email FROM profiles WHERE id = p_user_id),
    v_secret
  ) INTO v_qr_code;

  RETURN json_build_object(
    'secret', v_secret,
    'qrCode', v_qr_code,
    'backupCodes', v_backup_codes
  );
END;
$$;

-- Create function to verify 2FA token
CREATE OR REPLACE FUNCTION verify_two_factor(p_user_id uuid, p_token text, p_ip_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_secret text;
  v_backup_codes text[];
  v_rate_limited boolean;
BEGIN
  -- Check rate limit
  SELECT check_2fa_rate_limit(p_user_id, p_ip_address) INTO v_rate_limited;
  IF NOT v_rate_limited THEN
    RETURN false;
  END IF;

  -- Get user's secret and backup codes
  SELECT secret, backup_codes INTO v_secret, v_backup_codes
  FROM two_factor_auth
  WHERE user_id = p_user_id;

  IF v_secret IS NULL THEN
    RETURN false;
  END IF;

  -- Track attempt
  INSERT INTO two_factor_attempts (user_id, ip_address, success)
  VALUES (p_user_id, p_ip_address, false);

  -- Check if token matches a backup code
  IF p_token = ANY(v_backup_codes) THEN
    -- Remove used backup code and mark attempt as successful
    UPDATE two_factor_auth
    SET backup_codes = array_remove(backup_codes, p_token),
        enabled = true,
        updated_at = now()
    WHERE user_id = p_user_id;

    UPDATE two_factor_attempts
    SET success = true
    WHERE user_id = p_user_id
    AND ip_address = p_ip_address
    AND created_at = (
      SELECT created_at
      FROM two_factor_attempts
      WHERE user_id = p_user_id
      AND ip_address = p_ip_address
      ORDER BY created_at DESC
      LIMIT 1
    );

    RETURN true;
  END IF;

  -- For development, accept '000000' as a valid token
  -- In production, implement proper TOTP validation here
  IF p_token = '000000' THEN
    UPDATE two_factor_auth
    SET enabled = true,
        updated_at = now()
    WHERE user_id = p_user_id;

    UPDATE two_factor_attempts
    SET success = true
    WHERE user_id = p_user_id
    AND ip_address = p_ip_address
    AND created_at = (
      SELECT created_at
      FROM two_factor_attempts
      WHERE user_id = p_user_id
      AND ip_address = p_ip_address
      ORDER BY created_at DESC
      LIMIT 1
    );

    RETURN true;
  END IF;

  RETURN false;
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