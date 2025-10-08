import React from 'react';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import { useReferralStats } from '@/modules/referral/hooks/referral';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ReferralStats: React.FC = () => {
  const { data: statsData, isLoading, error } = useReferralStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Statistics</CardTitle>
          <CardDescription>Failed to load referral statistics</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const stats = statsData?.data;

  const statCards = [
    {
      title: 'Total Referrals',
      value: stats?.totalReferrals || 0,
      description: 'People you referred',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Successful Referrals',
      value: stats?.successfulReferrals || 0,
      description: 'Active referrals',
      icon: Award,
      color: 'text-green-500',
    },
    {
      title: 'Total Earnings',
      value: `$${stats?.totalEarnings?.toFixed(2) || '0.00'}`,
      description: 'From referrals',
      icon: DollarSign,
      color: 'text-yellow-500',
    },
    {
      title: 'Pending Earnings',
      value: `$${stats?.pendingEarnings?.toFixed(2) || '0.00'}`,
      description: 'Awaiting payout',
      icon: TrendingUp,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Referral Performance</h3>
        <Badge variant="secondary">
          {stats?.successfulReferrals || 0} Active
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
