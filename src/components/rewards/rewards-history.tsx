import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';

interface RewardHistoryItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface RewardsHistoryProps {
  rewards: RewardHistoryItem[];
  currency: string;
}

const RewardsHistory: React.FC<RewardsHistoryProps> = ({
  rewards,
  currency,
}) => {
  return (
    <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
      <CardHeader>
        <CardTitle className="flex items-center" style={{ color: '#97fce4' }}>
          <Gift className="mr-2 h-5 w-5" />
          Rewards History
        </CardTitle>
      </CardHeader>
      <div className="relative">
        <p className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl z-10 bold">
          Coming soon
        </p>
        <CardContent className="filter blur-sm">
          <div className="space-y-3">
            {rewards.length === 0 ? (
              <div className="text-center py-8">
                <Gift
                  className="h-12 w-12 mx-auto mb-4"
                  style={{ color: '#97fce4', opacity: 0.5 }}
                />
                <p style={{ color: '#97fce4', opacity: 0.7 }}>
                  No rewards earned yet
                </p>
                <p
                  className="text-responsive-sm mt-1"
                  style={{ color: '#97fce4', opacity: 0.5 }}
                >
                  Complete tasks to start earning rewards
                </p>
              </div>
            ) : (
              rewards.map(reward => {
                const Icon = reward.icon;
                return (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-opacity-50 transition-colors"
                    style={{ backgroundColor: '#0e1e27' }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className="h-5 w-5"
                        style={{ color: reward.color }}
                      />
                      <div>
                        <p
                          className="text-responsive-sm font-medium"
                          style={{ color: '#97fce4' }}
                        >
                          {reward.title}
                        </p>
                        <p
                          className="text-responsive-xs"
                          style={{ color: '#97fce4', opacity: 0.7 }}
                        >
                          {reward.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-responsive-sm font-bold"
                        style={{ color: '#97fce4' }}
                      >
                        +{reward.amount} {currency}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default RewardsHistory;
