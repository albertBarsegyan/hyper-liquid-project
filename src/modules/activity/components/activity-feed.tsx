import React from 'react';
import { ActivityGroup } from './activity-group';
import { ActivityEmptyState } from './activity-empty-state';
import { useAuthReferralHistory } from '@/modules/activity/hooks/useAuthReferrals';
import type {
  ActivityGroup as ActivityGroupType,
  ActivityItem,
} from '@/modules/activity/types';
import type { ReferralHistoryItem } from '@/modules/auth/services/auth.service';

export const ActivityFeed: React.FC = () => {
  const { data: referralHistory, isLoading, error } = useAuthReferralHistory();

  // Transform referral history into activity groups
  const transformReferralHistoryToActivities = (
    history: ReferralHistoryItem[]
  ): ActivityGroupType[] => {
    if (!history || history.length === 0) return [];

    // Group by date
    const groupedByDate = history.reduce(
      (acc, item) => {
        const date = new Date(item.createdAt).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      },
      {} as Record<string, ReferralHistoryItem[]>
    );

    // Convert to ActivityGroupType
    return Object.entries(groupedByDate)
      .map(([date, items]) => ({
        date,
        activities: items.map(
          (item): ActivityItem => ({
            id: item.id,
            type: item.status === 'successful' ? 'received' : 'referred_by',
            title: item.status === 'successful' ? '' : 'Referred By',
            description:
              item.status === 'successful'
                ? 'Received'
                : item.referredUser.tagName,
            timestamp: item.createdAt,
            amount:
              item.status === 'successful'
                ? `${item.reward} Points`
                : undefined,
            user: {
              username: item.referredUser.tagName,
            },
            icon: {
              type: 'avatar',
            },
          })
        ),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-700 rounded w-32"></div>
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ActivityEmptyState
        title="Failed to load activity"
        description="There was an error loading your activity feed. Please try again later."
        type="error"
      />
    );
  }

  const activityData = transformReferralHistoryToActivities(
    referralHistory?.history ?? []
  );

  if (activityData.length === 0) {
    return (
      <ActivityEmptyState
        title="No activity yet"
        description="Your referral activity will appear here once you start referring friends or receive rewards."
        type="empty"
      />
    );
  }

  return (
    <div className="space-y-8">
      {activityData.map(group => (
        <ActivityGroup key={group.date} group={group} />
      ))}
    </div>
  );
};
