import { supabase } from '../lib/supabase';

export interface PromoCode {
  code: string;
  description?: string;
  discountPercent: number;
  discountFixed?: number;
  validFrom: string;
  validUntil?: string;
  maxUses?: number;
  currentUses: number;
  minPurchaseAmount?: number;
  applicableTiers: Array<'pro' | 'enterprise'>;
  active: boolean;
}

export interface PriceHistory {
  id: string;
  serviceId: string;
  tier: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
  reason?: string;
  createdAt: string;
}

export async function validatePromoCode(
  code: string,
  tier: string,
  amount: number
): Promise<{
  valid: boolean;
  discount?: number;
  message?: string;
}> {
  const { data, error } = await supabase.rpc('validate_promo_code', {
    p_code: code,
    p_tier: tier,
    p_amount: amount
  });

  if (error) throw error;
  return data;
}

export async function getPriceHistory(serviceId: string): Promise<PriceHistory[]> {
  const { data, error } = await supabase
    .from('price_history')
    .select(`
      id,
      service_id,
      tier,
      old_price,
      new_price,
      changed_by,
      reason,
      created_at
    `)
    .eq('service_id', serviceId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPromoCode(promoCode: Omit<PromoCode, 'currentUses'>): Promise<PromoCode> {
  const { data, error } = await supabase
    .from('promo_codes')
    .insert({
      code: promoCode.code,
      description: promoCode.description,
      discount_percent: promoCode.discountPercent,
      discount_fixed: promoCode.discountFixed,
      valid_from: promoCode.validFrom,
      valid_until: promoCode.validUntil,
      max_uses: promoCode.maxUses,
      min_purchase_amount: promoCode.minPurchaseAmount,
      applicable_tiers: promoCode.applicableTiers,
      active: promoCode.active
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function trackPriceChange(
  serviceId: string,
  tier: string,
  oldPrice: number,
  newPrice: number,
  reason?: string
): Promise<void> {
  const { error } = await supabase
    .from('price_history')
    .insert({
      service_id: serviceId,
      tier,
      old_price: oldPrice,
      new_price: newPrice,
      reason
    });

  if (error) throw error;
}

export async function trackUsageAnalytics(
  userId: string,
  service: string,
  action: string,
  metadata?: Record<string, any>
): Promise<void> {
  const { error } = await supabase
    .from('usage_analytics')
    .insert({
      user_id: userId,
      service,
      action,
      metadata
    });

  if (error) throw error;
}