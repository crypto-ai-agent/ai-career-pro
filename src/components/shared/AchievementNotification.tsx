import React from 'react';
import { Trophy } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Achievement } from '../../types/achievements';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const tierColors = {
    bronze: 'bg-orange-100 text-orange-800',
    silver: 'bg-gray-100 text-gray-800',
    gold: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <Card className="p-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tierColors[achievement.tier]}`}>
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Achievement Unlocked!
            </h3>
            <p className="text-sm text-gray-600">
              {achievement.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              +{achievement.points} points
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}