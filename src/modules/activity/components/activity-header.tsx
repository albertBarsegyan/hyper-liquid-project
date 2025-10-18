import React from 'react';
import {
  useAuthReferrals,
  useAuthReferrers,
} from '@/modules/activity/hooks/useAuthReferrals';
import { DollarSign, Users } from 'lucide-react';

export const ActivityHeader: React.FC = () => {
  const { data: referralStats, isLoading: statsLoading } = useAuthReferrals();
  const { data: referrerStats, isLoading: referrerLoading } =
    useAuthReferrers();

  // const totalReferrals = referralStats?.totalReferrals ?? 0;
  const totalReferrers = referrerStats?.totalReferrers ?? 0;

  const isLoading = statsLoading || referrerLoading;

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-white mb-6">Activity</h1>

      {/* Stats Overview */}
      {!isLoading && (referralStats ?? referrerStats) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {referralStats && (
            <>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Total Referrals</p>
                    <p className="text-white font-semibold text-lg">
                      {totalReferrers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Total Earnings</p>
                    <p className="text-white font-semibold text-lg">0</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-700 rounded"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-16"></div>
                  <div className="h-5 bg-gray-700 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
