import React from 'react';
import { ActivityHeader, ActivityFeed } from '@/modules/activity';

const ActivityPage: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <ActivityHeader />

        {/* Activity Feed */}
        <ActivityFeed />
      </div>
    </div>
  );
};

export default ActivityPage;
