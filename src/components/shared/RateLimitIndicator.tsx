import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface RateLimitIndicatorProps {
  remaining: number;
  resetTime: Date;
  total: number;
}

export function RateLimitIndicator({ remaining, resetTime, total }: RateLimitIndicatorProps) {
  const [timeLeft, setTimeLeft] = React.useState<string>('');

  React.useEffect(() => {
    const updateTimeLeft = () => {
      const diff = resetTime.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Reset');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    };

    const interval = setInterval(updateTimeLeft, 1000);
    updateTimeLeft();

    return () => clearInterval(interval);
  }, [resetTime]);

  const percentage = (remaining / total) * 100;
  const getIndicatorColor = () => {
    if (percentage <= 25) return 'bg-red-50 border-red-200 text-red-700';
    if (percentage <= 50) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  return (
    <Card className={cn(
      'p-4 mb-4 border',
      getIndicatorColor()
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">
            {remaining} {remaining === 1 ? 'request' : 'requests'} remaining
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-1" />
          Resets in: {timeLeft}
        </div>
      </div>
      <div className="mt-2 h-2 bg-white/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-current transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Card>
  );
}