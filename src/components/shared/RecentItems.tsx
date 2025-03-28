import React from 'react';
import { Link } from 'react-router-dom';
import { RecentItem } from '../../types/shared';
import { Card } from '../ui/Card';

interface RecentItemsProps<T extends RecentItem> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function RecentItems<T extends RecentItem>({ 
  title, 
  items, 
  renderItem 
}: RecentItemsProps<T>) {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <Link
          to="/history"
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          View All History
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.length > 0 ? (
          items.map(renderItem)
        ) : (
          <Card>
            <p className="text-gray-500 text-sm">No recent items</p>
          </Card>
        )}
      </div>
    </div>
  );
}