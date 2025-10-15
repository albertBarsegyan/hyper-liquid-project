import React, { lazy, Suspense } from 'react';
import type { ActivityGroup as ActivityGroupType } from '@/modules/activity/types';
import { FullScreenLoader } from '@/modules/shared/components/loader';

// Lazy load ActivityCard component
const ActivityCard = lazy(() => import('./activity-card'));

interface ActivityGroupProps {
  group: ActivityGroupType;
}

const ActivityGroup: React.FC<ActivityGroupProps> = ({ group }) => {
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
          <Suspense
            key={activity.id}
            fallback={
              <FullScreenLoader
                variant="normal"
                message="Loading activity..."
              />
            }
          >
            <ActivityCard activity={activity} />
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default ActivityGroup;
