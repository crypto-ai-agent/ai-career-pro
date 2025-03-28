import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { Input } from '../ui/Form';
import { Button } from '../ui/Button';
import { useToast } from '../../hooks/useToast';
import { validatePromoCode } from '../../services/pricing';

interface PromoCodeInputProps {
  onApply: (discount: number) => void;
  tier: string;
  amount: number;
}

export function PromoCodeInput({ onApply, tier, amount }: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { addToast } = useToast();

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsValidating(true);
    try {
      const result = await validatePromoCode(code, tier, amount);
      
      if (result.valid && result.discount) {
        onApply(result.discount);
        addToast('success', `Promo code applied! You saved $${result.discount.toFixed(2)}`);
      } else {
        addToast('error', result.message || 'Invalid promo code');
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      addToast('error', 'Failed to validate promo code');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter promo code"
          className="pl-10"
        />
      </div>
      <Button
        onClick={handleApply}
        isLoading={isValidating}
        disabled={!code.trim()}
      >
        Apply
      </Button>
    </div>
  );
}