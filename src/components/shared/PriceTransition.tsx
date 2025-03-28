import React from 'react';
import { useSpring, animated } from '@react-spring/web';

interface PriceTransitionProps {
  price: number;
  currency?: string;
  className?: string;
  showAgentPrice?: boolean;
  agentDiscount?: number;
}

export function PriceTransition({ 
  price, 
  currency = '$', 
  className,
  showAgentPrice,
  agentDiscount = 0
}: PriceTransitionProps) {
  const { number } = useSpring({
    from: { number: 0 },
    number: showAgentPrice ? price * (1 - agentDiscount / 100) : price,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  return (
    <animated.span className={className}>
      {currency}
      {number.to(n => n.toFixed(2))}
    </animated.span>
  );
}