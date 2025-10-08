export interface ReferralUser {
  id: string;
  tagName: string;
  walletAddress: string;
  points: number;
  referralCode: string;
  totalSuccessfulReferrals: number;
  totalReferralEarnings: number;
}

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}

export interface ReferralReward {
  awarded: number;
  type: 'deposit' | 'balance' | 'referral';
  timestamp: string;
}

export interface ReferralDepositParams {
  userId: string;
  depositedUsd: number;
}

export interface ReferralBalanceParams {
  userId: string;
  currentBalanceUsd: number;
}

export interface ReferralBonusParams {
  userId: string;
  totalSuccessfulReferrals: number;
}

export interface ReferralCodeResponse {
  referralCode: string;
  referralUrl: string;
}

export interface ReferralHistory {
  id: string;
  referredUser: {
    tagName: string;
    walletAddress: string;
  };
  status: 'pending' | 'successful' | 'failed';
  reward: number;
  createdAt: string;
  completedAt?: string;
}
