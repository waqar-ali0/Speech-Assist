import React from 'react';
import { ActivityItem } from '../types';

interface RecentActivityProps {
  items: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
        No recent activity. Start practicing!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-gray-500 text-sm font-medium min-w-[3rem]">{item.date}</span>
            <span className="text-gray-700 font-medium">
              {item.description} - {item.scoreLabel}
            </span>
          </div>
          {item.improvement && (
            <span className="text-green-500 font-bold bg-green-50 px-2 py-1 rounded text-sm">
              +{item.improvement}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;