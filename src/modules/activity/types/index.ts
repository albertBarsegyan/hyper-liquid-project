export interface ActivityItem {
  id: string;
  type: 'received' | 'referred_by' | 'key_added' | 'deposit' | 'withdrawal' | 'referral_bonus';
  title: string;
  description: string;
  timestamp: string;
  amount?: string;
  user?: {
    username: string;
    avatar?: string;
  };
  icon?: {
    type: 'avatar' | 'square';
    background?: string;
    text?: string;
    symbol?: string;
  };
}

export interface ActivityGroup {
  date: string;
  activities: ActivityItem[];
}

export interface ActivityStats {
  totalActivities: number;
  totalReceived: number;
  totalSent: number;
  recentActivity: ActivityItem[];
}
