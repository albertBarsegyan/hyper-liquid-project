import { mainApiInstance } from '@/configs/api/main-instance.ts';
import { localStorageUtil } from '@/modules/shared/utils/local-storage.ts';
import { storageName } from '@/modules/shared/constants/storage-name.ts';

export interface AuthUser {
  tagName: string;
  walletAddress: string;
  points: number;
}

export interface ReferrerHistoryResponse {
  totalReferrers: number;
  referrers: UserReferral[];
}

export interface ReferralHistoryResponse {
  totalReferrals: number;
  referrals: UserReferral[];
}

export interface UserReferral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referrerAddress: string;
  referredAddress: string;
  createdAt: string;
  referrer: UserReferralDetails;
}

interface UserReferralDetails {
  id: string;
  tagName: string;
  walletAddress: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  requestNonce: async (address: string): Promise<string> => {
    const response = await mainApiInstance.get('auth/nonce', {
      searchParams: { address },
    });
    const { nonce } = await response.json<{ nonce: string }>();
    return nonce;
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

  getReferrals: async (): Promise<ReferralHistoryResponse> => {
    const response = await mainApiInstance.get('auth/referrals');
    return response.json();
  },

  getReferrers: async (): Promise<ReferrerHistoryResponse> => {
    const response = await mainApiInstance.get('auth/referrers');
    return response.json();
  },
};
