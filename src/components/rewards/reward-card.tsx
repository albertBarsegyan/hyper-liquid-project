import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface RewardCardProps {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'ongoing';
  reward: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  progress?: number;
  maxProgress?: number;
  onStart?: () => void;
}

const RewardCard: React.FC<RewardCardProps> = ({
  title,
  description,
  status,
  reward,
  icon: Icon,
  progress,
  maxProgress,
  onStart,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ongoing':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'ongoing':
        return 'Ongoing';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'ongoing':
        return 'text-green-500';
      case 'pending':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const progressPercentage =
    progress && maxProgress ? (progress / maxProgress) * 100 : 0;

  return (
    <Card
      className="relative overflow-hidden hover:shadow-lg transition-shadow"
      style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}
    >
      {/* Reward Badge */}
      <div
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-responsive-xs font-bold"
        style={{ backgroundColor: '#97fce4', color: '#0e1e27' }}
      >
        {reward}
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Task Header */}
          <div className="flex items-start space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#97fce4', opacity: 0.2 }}
            >
              <Icon className="h-5 w-5" style={{ color: '#97fce4' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-responsive-base font-semibold mb-1"
                style={{ color: '#97fce4' }}
              >
                {title}
              </h3>
              <p
                className="text-responsive-sm"
                style={{ color: '#97fce4', opacity: 0.7 }}
              >
                {description}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {progress && maxProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-responsive-xs">
                <span style={{ color: '#97fce4', opacity: 0.7 }}>Progress</span>
                <span style={{ color: '#97fce4', opacity: 0.7 }}>
                  {progress}/{maxProgress}
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full"
                style={{ backgroundColor: '#0e1e27' }}
              >
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: '#97fce4',
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(status)}
              <span
                className={`text-responsive-sm font-medium ${getStatusColor(status)}`}
              >
                {getStatusText(status)}
              </span>
            </div>
            {status === 'pending' && onStart && (
              <Button
                size="sm"
                className="text-responsive-xs"
                onClick={onStart}
                style={{
                  backgroundColor: '#97fce4',
                  color: '#0e1e27',
                  border: 'none',
                }}
              >
                Start
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardCard;
