import React, { lazy, Suspense } from 'react';
import {
  useAuthReferrals,
  useAuthReferrers,
} from '@/modules/activity/hooks/useAuthReferrals';
import { FullScreenLoader } from '@/modules/shared/components/loader';
import ModuleErrorBoundary from '@/components/module-error-boundary';

const ActivityCard = lazy(() => import('./activity-card'));
const ActivityEmptyState = lazy(() => import('./activity-empty-state'));

export const ActivityFeed: React.FC = () => {
  const {
    isLoading: referralLoading,
    error: referralError,
    data: referralStats,
  } = useAuthReferrals();

  const {
    data: referrerStats,
    isLoading: referrerLoading,
    error: referrerError,
  } = useAuthReferrers();

  const totalReferrals = referralStats?.totalReferrals ?? 0;
  const totalReferrers = referrerStats?.totalReferrers ?? 0;

  const referrers = referrerStats?.referrers ?? [];

  const referrals = referralStats?.referrals ?? [];

  const isLoading = referralLoading || referrerLoading;
  const error = referralError ?? referrerError;

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Referrers Loading Section */}
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`referrer-${index}`}
                  className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-700 rounded w-32"></div>
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Referrals Loading Section */}
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-40 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`referral-${index}`}
                  className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-700 rounded w-32"></div>
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Suspense
        fallback={
          <FullScreenLoader variant="normal" message="Loading error state..." />
        }
      >
        <ActivityEmptyState
          title="Failed to load activity"
          description="There was an error loading your activity feed. Please try again later."
          type="error"
        />
      </Suspense>
    );
  }

  if (!totalReferrers && !totalReferrals && !isLoading) {
    return (
      <Suspense
        fallback={
          <FullScreenLoader variant="normal" message="Loading empty state..." />
        }
      >
        <ActivityEmptyState
          title="No activity yet"
          description="Your referral activity will appear here once you start referring friends or receive rewards."
          type="empty"
        />
      </Suspense>
    );
  }

  return (
    <ModuleErrorBoundary moduleName="Activity Feed" showDetails={true}>
      <div className="space-y-8">
        {/* Referrers Section */}
        {Boolean(totalReferrals) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                People You Referred
              </h2>
              <span className="text-sm text-gray-400">
                {totalReferrals} referral{totalReferrals !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-3">
              {referrals.map(activity => (
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
        )}

        {/* Referrals Section */}
        {Boolean(totalReferrers) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                People Who referred you
              </h2>
              <span className="text-sm text-gray-400">
                {totalReferrers} referral
                {totalReferrers !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-3">
              {referrers.map(activity => (
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
        )}
      </div>
    </ModuleErrorBoundary>
  );
};
