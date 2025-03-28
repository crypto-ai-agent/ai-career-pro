-- Create price_history table
CREATE TABLE price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES service_configs(id) ON DELETE CASCADE,
  tier text NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
  old_price numeric NOT NULL,
  new_price numeric NOT NULL,
  changed_by uuid REFERENCES profiles(id),
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Create promo_codes table
CREATE TABLE promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  discount_percent integer NOT NULL CHECK (discount_percent BETWEEN 0 AND 100),
  discount_fixed numeric,
  valid_from timestamptz NOT NULL,
  valid_until timestamptz,
  max_uses integer,
  current_uses integer DEFAULT 0,
  min_purchase_amount numeric,
  applicable_tiers text[] DEFAULT '{pro,enterprise}'::text[],
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create usage_analytics table
CREATE TABLE usage_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  service text NOT NULL,
  action text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create triggers
CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Price history is readable by authenticated users"
  ON price_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert price history"
  ON price_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

CREATE POLICY "Promo codes are readable by authenticated users"
  ON promo_codes FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Only admins can manage promo codes"
  ON promo_codes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

CREATE POLICY "Usage analytics are readable by admins"
  ON usage_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

CREATE POLICY "Users can insert own usage analytics"
  ON usage_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_price_history_service_id ON price_history(service_id);
CREATE INDEX idx_price_history_created_at ON price_history(created_at);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_valid_dates ON promo_codes(valid_from, valid_until);
CREATE INDEX idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_service ON usage_analytics(service);
CREATE INDEX idx_usage_analytics_created_at ON usage_analytics(created_at);

-- Create function to validate promo code
CREATE OR REPLACE FUNCTION validate_promo_code(
  p_code text,
  p_tier text,
  p_amount numeric
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_promo promo_codes;
  v_discount numeric;
BEGIN
  SELECT * INTO v_promo
  FROM promo_codes
  WHERE code = p_code
    AND active = true
    AND valid_from <= now()
    AND (valid_until IS NULL OR valid_until >= now())
    AND (max_uses IS NULL OR current_uses < max_uses)
    AND (min_purchase_amount IS NULL OR min_purchase_amount <= p_amount)
    AND (p_tier = ANY(applicable_tiers));

  IF v_promo IS NULL THEN
    RETURN json_build_object(
      'valid', false,
      'message', 'Invalid or expired promo code'
    );
  END IF;

  -- Calculate discount
  IF v_promo.discount_fixed IS NOT NULL THEN
    v_discount := v_promo.discount_fixed;
  ELSE
    v_discount := (p_amount * v_promo.discount_percent / 100);
  END IF;

  RETURN json_build_object(
    'valid', true,
    'discount', v_discount,
    'description', v_promo.description
  );
END;
$$;

-- Create function to track price change
CREATE OR REPLACE FUNCTION track_price_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.pricing != NEW.pricing THEN
    INSERT INTO price_history (
      service_id,
      tier,
      old_price,
      new_price,
      changed_by,
      reason
    )
    SELECT
      NEW.id,
      tier.key,
      (OLD.pricing->tier.key->>'price')::numeric,
      (NEW.pricing->tier.key->>'price')::numeric,
      auth.uid(),
      'Price update'
    FROM jsonb_object_keys(NEW.pricing) AS tier(key)
    WHERE (OLD.pricing->tier.key->>'price')::numeric != 
          (NEW.pricing->tier.key->>'price')::numeric;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for price tracking
CREATE TRIGGER track_service_price_changes
  BEFORE UPDATE ON service_configs
  FOR EACH ROW
  EXECUTE FUNCTION track_price_change();