import React, { lazy, Suspense } from 'react';
import type { ActivityItem } from '@/modules/activity/types';
import { FullScreenLoader } from '@/modules/shared/components/loader';

// Lazy load ActivityAvatar component
const ActivityAvatar = lazy(() => import('./activity-avatar'));

interface ActivityCardProps {
  activity: ActivityItem;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const activityDate = new Date(timestamp);
    const diffInDays = Math.floor(
      (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-800/70 transition-colors">
      {/* Avatar/Icon */}
      <div className="flex-shrink-0">
        <Suspense
          fallback={
            <FullScreenLoader variant="normal" message="Loading avatar..." />
          }
        >
          <ActivityAvatar
            type={activity.icon?.type || 'avatar'}
            background={activity.icon?.background}
            text={activity.icon?.text}
            symbol={activity.icon?.symbol}
            isReceived={activity.type === 'received'}
          />
        </Suspense>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium">
          {activity.user?.username && (
            <span className="text-white">{activity.user.username}</span>
          )}
          {activity.title && (
            <span className="text-white font-semibold">{activity.title}</span>
          )}
        </div>

        {activity.description && (
          <div className="text-gray-400 text-sm mt-1">
            {activity.description}
          </div>
        )}

        <div className="text-gray-400 text-sm mt-1">
          {formatTimeAgo(activity.timestamp)}
        </div>
      </div>

      {/* Amount/Value */}
      {activity.amount && (
        <div className="flex-shrink-0 text-white font-medium">
          {activity.amount}
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
