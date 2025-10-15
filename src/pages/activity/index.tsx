import React from 'react';
import { ActivityHeader } from '@/modules/activity/components/activity-header.tsx';
import { ActivityFeed } from '@/modules/activity/components/activity-feed.tsx';

const ActivityPage: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <ActivityHeader />

        <ActivityFeed />
      </div>
    </div>
  );
};

export default ActivityPage;
