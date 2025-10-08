import { mainApiInstance } from '@/configs/api/main-instance.ts';
import { localStorageUtil } from '@/modules/shared/utils/local-storage.ts';
import { storageName } from '@/modules/shared/constants/storage-name.ts';

export interface AuthUser {
  tagName: string;
  walletAddress: string;
  points: number;
}

export interface UserToken {
  token: string;
}

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}

export interface ReferrerStatsResponse {
  totalReferrers: number;
  referrers: ReferrerStats[];
}

export interface ReferrerStats {
  referrerId: string;
  referrerName: string;
  totalEarnings: number;
  totalReferrals: number;
}

export interface ReferralHistoryResponse {
  totalReferrals: number;
  history: ReferralHistoryItem[];
}

export interface ReferralHistoryItem {
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

export const authService = {
  /**
   * Request nonce from server
   */
  requestNonce: async (address: string): Promise<string> => {
    const response = await mainApiInstance.get('auth/nonce', {
      searchParams: { address },
    });
    const { nonce } = await response.json<{ nonce: string }>();
    return nonce;
  },

  /**
   * Sign message with wallet (MetaMask)
   */
  signMessage: async (message: string, address: string): Promise<string> => {
    if (!window.ethereum) throw new Error('MetaMask not installed');
    const walletSign = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });

    return String(walletSign) as string;
  },

  /**
   * Verify signature and get token
   */
  verifySignature: async ({
    address,
    signature,
    referredAddress,
  }: {
    address: string;
    signature: string;
    referredAddress?: string | null;
  }): Promise<{ access_token: string }> => {
    const response = await mainApiInstance.post('auth/verify', {
      json: {
        address,
        signature,
        referredAddresses: referredAddress ? [referredAddress] : [],
      },
    });

    return response.json<{ access_token: string }>();
  },

  /**
   * Verify token
   */
  verifyToken: async (): Promise<boolean> => {
    const response = await mainApiInstance.get('auth/profile');
    if (!response.ok) {
      authService.signOut();
      return false;
    }
    return true;
  },

  /**
   * Sign out
   */
  signOut: (): void => {
    localStorageUtil.deleteItem(storageName.AUTH_TOKEN);
    localStorageUtil.deleteItem(storageName.AUTH_USER);
  },

  getToken: (): string | null => localStorage.getItem(storageName.AUTH_TOKEN),

  getProfile: async (): Promise<AuthUser> => {
    const response = await mainApiInstance.get('auth/profile');
    return response.json();
  },

  /**
   * Get referral statistics for the authenticated user
   */
  getReferrals: async (): Promise<ReferralStats> => {
    const response = await mainApiInstance.get('auth/referrals');
    return response.json();
  },

  /**
   * Get referrer statistics for the authenticated user
   */
  getReferrers: async (): Promise<ReferrerStatsResponse> => {
    const response = await mainApiInstance.get('auth/referrers');
    return response.json();
  },

  /**
   * Get referral history for the authenticated user
   */

  getReferralHistory: async (): Promise<ReferralHistoryResponse> => {
    const response = await mainApiInstance.get('auth/referral/history');
    return response.json();
  },
};
