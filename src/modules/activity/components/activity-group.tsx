import React from 'react';
import { ActivityCard } from './activity-card';
import type { ActivityGroup as ActivityGroupType } from '@/modules/activity/types';

interface ActivityGroupProps {
  group: ActivityGroupType;
}

export const ActivityGroup: React.FC<ActivityGroupProps> = ({ group }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="mb-8">
      {/* Date Header */}
      <h2 className="text-white text-lg font-medium mb-4">
        {formatDate(group.date)}
      </h2>

      {/* Activity Cards */}
      <div className="space-y-3">
        {group.activities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};
