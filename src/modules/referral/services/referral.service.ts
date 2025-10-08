import { mainApiInstance } from '@/configs/api/main-instance.ts';
import type { ApiResponse } from '@/modules/shared/type/api.ts';
import type {
  ReferralReward,
  ReferralHistory,
  ReferralDepositParams,
  ReferralBalanceParams,
  ReferralBonusParams,
} from '@/modules/referral/types';

export const referralService = {
  /**
   * Get referral history
   */
  getReferralHistory: async (): Promise<ApiResponse<ReferralHistory[]>> => {
    const response = await mainApiInstance.get('referral/history');
    return response.json();
  },

  /**
   * Award points for deposit
   */
  awardDepositPoints: async (
    params: ReferralDepositParams
  ): Promise<ApiResponse<ReferralReward>> => {
    const response = await mainApiInstance.post('points/reward/deposit', {
      json: params,
    });
    return response.json();
  },

  /**
   * Award points for balance milestone
   */
  awardBalanceMilestone: async (
    params: ReferralBalanceParams
  ): Promise<ApiResponse<ReferralReward>> => {
    const response = await mainApiInstance.post('points/reward/balance', {
      json: params,
    });
    return response.json();
  },

  /**
   * Award points for referral bonus
   */
  awardReferralBonus: async (
    params: ReferralBonusParams
  ): Promise<ApiResponse<ReferralReward>> => {
    const response = await mainApiInstance.post('points/reward/referrals', {
      json: params,
    });
    return response.json();
  },
};
