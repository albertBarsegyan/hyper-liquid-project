import React, { lazy, Suspense } from 'react';
import { FullScreenLoader } from '@/modules/shared/components/loader';
import type { UserReferral } from '@/modules/auth/services/auth.service';

// Lazy load ActivityAvatar component
const ActivityAvatar = lazy(() => import('./activity-avatar'));

interface ActivityCardProps {
  activity: UserReferral;
  fieldName: 'referrerTagname' | 'referredTagname';
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, fieldName }) => {
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
            type="avatar"
            background="#3B82F6"
            text={activity?.[fieldName].charAt(0).toUpperCase()}
            symbol={undefined}
            isReceived={false}
          />
        </Suspense>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Referrer info */}
        <div className="text-white font-semibold">#{activity?.[fieldName]}</div>

        <div className="text-gray-400 text-sm mt-1">
          {formatTimeAgo(activity.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
