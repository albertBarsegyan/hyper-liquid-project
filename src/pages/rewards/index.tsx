import React, { useState } from 'react';

import RewardCard from '@/components/rewards/reward-card';
import BalanceDisplay from '@/components/rewards/balance-display';
import RewardsHistory from '@/components/rewards/rewards-history';
import {
  Trophy,
  Star,
  Target,
  Zap,
  Coins,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'ongoing';
  reward: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  progress?: number;
  maxProgress?: number;
}

interface Reward {
  id: string;
  title: string;
  amount: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

const RewardsPage: React.FC = () => {
  const [currentMonth] = useState('October');
  const [sendBalance] = useState(8028);
  const [monthlyRewards] = useState(28);

  const achievements: Reward[] = [
    {
      id: 'sendtag',
      title: 'Deposit 10$',
      amount: 1000,
      icon: Star,
      color: '#97fce4',
    },
    {
      id: 'balance',
      title: 'Make balance 8,888',
      amount: 5000,
      icon: Coins,
      color: '#97fce4',
    },
    {
      id: 'savings',
      title: 'Make 3 referral',
      amount: 3000,
      icon: TrendingUp,
      color: '#97fce4',
    },
  ];

  const tasks: Task[] = [
    {
      id: 'passkey',
      title: 'Create a Passkey',
      description: 'Set up biometric authentication',
      status: 'completed',
      reward: 100,
      icon: Target,
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'sendtag-purchase',
      title: 'Purchase a Sendtag',
      description: 'Buy your personalized sendtag',
      status: 'completed',
      reward: 200,
      icon: Star,
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'sends-10',
      title: '10+ DLIQD',
      description: 'Complete 10 transactions',
      status: 'pending',
      reward: 150,
      icon: Zap,
      progress: 7,
      maxProgress: 10,
    },
    {
      id: 'sends-100',
      title: '100+ DLIQD',
      description: 'Complete 100 transactions',
      status: 'pending',
      reward: 500,
      icon: Trophy,
      progress: 7,
      maxProgress: 100,
    },
    {
      id: 'momentum',
      title: 'DLIQD momentum',
      description: 'Maintain daily DLIQD momentum',
      status: 'ongoing',
      reward: 50,
      icon: Clock,
      progress: 3,
      maxProgress: 7,
    },
  ];

  const historyRewards = achievements.map(achievement => ({
    ...achievement,
    date: `${currentMonth} ${new Date().getFullYear()}`,
  }));

  const handleTaskStart = (taskId: string) => {
    console.log(`Starting task: ${taskId}`);
    // Implement task start logic here
  };

  return (
    <div className="container-responsive py-responsive">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1
            className="text-responsive-3xl font-bold mb-2"
            style={{ color: '#97fce4' }}
          >
            Activity Rewards
          </h1>
          <p
            className="text-responsive-base"
            style={{ color: '#97fce4', opacity: 0.8 }}
          >
            Earn DLIQD points by completing activities and tasks
          </p>
        </div>

        {/* Monthly Rewards Summary */}
        <BalanceDisplay
          balance={sendBalance}
          monthlyEarned={monthlyRewards}
          currency="DLIQD"
          achievements={achievements}
        />

        {/* Tasks Section */}
        <div>
          <h2
            className="text-responsive-2xl font-bold mb-6"
            style={{ color: '#97fce4' }}
          >
            Tasks
          </h2>
          <div className="relative">
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl z-10 bold">
              Coming soon
            </p>

            <div className="filter blur-sm  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map(task => (
                <RewardCard
                  key={task.id}
                  {...task}
                  onStart={() => handleTaskStart(task.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rewards History */}
        <RewardsHistory rewards={historyRewards} currency="DLIQD" />
      </div>
    </div>
  );
};

export default RewardsPage;
