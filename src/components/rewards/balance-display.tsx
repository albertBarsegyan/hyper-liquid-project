import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';
import React from 'react';

interface BalanceDisplayProps {
  balance: number;
  monthlyEarned: number;
  currency: string;
  achievements: Array<{
    id: string;
    title: string;
    amount: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
  }>;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  monthlyEarned,
  currency,
  achievements,
}) => {
  return (
    <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
      <CardHeader>
        <CardTitle className="text-responsive-xl" style={{ color: '#97fce4' }}>
          Balance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Balance Section */}
          <div className="space-y-4">
            <div>
              <p
                className="text-responsive-sm mb-2"
                style={{ color: '#97fce4', opacity: 0.8 }}
              >
                Your {currency} Balance
              </p>
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#97fce4', opacity: 0.2 }}
                >
                  <Coins className="h-6 w-6" style={{ color: '#97fce4' }} />
                </div>
                <div>
                  <p
                    className="text-responsive-2xl font-bold"
                    style={{ color: '#97fce4' }}
                  >
                    {balance.toLocaleString()} {currency}
                  </p>
                  <p
                    className="text-responsive-sm"
                    style={{ color: '#97fce4', opacity: 0.7 }}
                  >
                    +{monthlyEarned} this month
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p
              className="text-responsive-sm font-medium"
              style={{ color: '#97fce4' }}
            >
              Qualified for Canton coin reward
            </p>
            <div className="space-y-3">
              {achievements.map(achievement => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: '#0e1e27' }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className="h-5 w-5"
                        style={{ color: achievement.color }}
                      />

                      <span
                        className="text-responsive-sm"
                        style={{ color: '#97fce4' }}
                      >
                        {achievement.title}
                      </span>
                    </div>
                    <Badge
                      style={{
                        backgroundColor: achievement.color,
                        color: '#0e1e27',
                        opacity: 0.8,
                      }}
                    >
                      +{achievement.amount}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceDisplay;
