import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getRemainingUsage } from '../../services/rateLimit';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface UsageLimitIndicatorProps {
  feature: 'cv-optimizer' | 'cover-letter' | 'email-preparer' | 'interview-coach';
}

export function UsageLimitIndicator({ feature }: UsageLimitIndicatorProps) {
  const { user } = useAuth();
  const [usage, setUsage] = useState<{ remaining: number; resetTime: Date } | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadUsage();
    }
  }, [user, feature]);

  useEffect(() => {
    if (usage?.resetTime) {
      const interval = setInterval(() => {
        const diff = usage.resetTime.getTime() - Date.now();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [usage]);

  const loadUsage = async () => {
    if (!user) return;
    const data = await getRemainingUsage(user.id, feature);
    setUsage(data);
  };

  if (!usage || usage.remaining === Infinity) return null;

  const getIndicatorColor = (remaining: number) => {
    if (remaining <= 1) return 'bg-red-50 border-red-200 text-red-700';
    if (remaining <= 3) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  return (
    <Card className={cn(
      'p-4 mb-4 border',
      getIndicatorColor(usage.remaining)
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">
            {usage.remaining} {usage.remaining === 1 ? 'use' : 'uses'} remaining
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-1" />
          Resets in: {timeLeft}
        </div>
      </div>
    </Card>
  );
}