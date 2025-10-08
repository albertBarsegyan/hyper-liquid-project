import React from 'react';
import { Activity, AlertCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';

interface ActivityEmptyStateProps {
  title: string;
  description: string;
  type: 'empty' | 'error';
}

export const ActivityEmptyState: React.FC<ActivityEmptyStateProps> = ({
  title,
  description,
  type,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'empty':
        return <Users className="w-16 h-16 text-gray-500" />;
      case 'error':
        return <AlertCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Activity className="w-16 h-16 text-gray-500" />;
    }
  };

  const getIconBgColor = () => {
    switch (type) {
      case 'empty':
        return 'bg-gray-800/50';
      case 'error':
        return 'bg-red-900/20';
      default:
        return 'bg-gray-800/50';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div
        className={`w-32 h-32 rounded-full ${getIconBgColor()} flex items-center justify-center mb-6`}
      >
        {getIcon()}
      </div>

      <h3 className="text-xl font-semibold text-white mb-3 text-center">
        {title}
      </h3>

      <p className="text-gray-400 text-center max-w-md leading-relaxed">
        {description}
      </p>

      {type === 'empty' && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Start your referral journey today!
          </p>
          <Button
            variant="ghost"
            className="flex items-center justify-center gap-2 text-green-400"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm">
              Share your referral code with friends
            </span>
          </Button>
        </div>
      )}

      {type === 'error' && (
        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
