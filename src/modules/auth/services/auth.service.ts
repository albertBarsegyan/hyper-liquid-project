import { mainApiInstance } from '@/configs/api/main-instance.ts';
import { localStorageUtil } from '@/modules/shared/utils/local-storage.ts';
import { storageName } from '@/modules/shared/constants/storage-name.ts';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';

export interface AuthUser {
  hashTag: string;
  walletAddress: string;
  points: number;
}

export interface WebAuthnRegistrationResponse {
  access_token?: string;
}

export interface WebAuthnAuthenticationResponse {
  access_token: string;
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
  referrerTagname: string; // Referrer's unique tag name (referral code)
  referredTagname: string; // Referred user's tag name at the time
  createdAt: string; // ISO string
  referrer?: UserReferralDetails; // Optional detailed referrer info
  referredUser?: UserReferralDetails; // Optional detailed referred user info
}

interface UserReferralDetails {
  id: string;
  hashTag: string;
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

  startWebAuthnRegistration: async (
    tagName: string,
    referredByTagName?: string
  ): Promise<{
    options: PublicKeyCredentialCreationOptionsJSON;
    userId: number;
  }> => {
    const response = await mainApiInstance.post(
      'auth/webauthn/register/start',
      {
        json: {
          tagName,
          referredByTagName,
        },
      }
    );

    return response.json<{
      options: PublicKeyCredentialCreationOptionsJSON;
      userId: number;
    }>();
  },

  /**
   * Complete WebAuthn registration
   */
  completeWebAuthnRegistration: async (
    userId: string | number,
    credential: RegistrationResponseJSON
  ): Promise<WebAuthnRegistrationResponse> => {
    const response = await mainApiInstance.post(
      'auth/webauthn/register/complete',
      {
        json: {
          userId,
          credential,
        },
      }
    );

    return response.json<WebAuthnRegistrationResponse>();
  },

  /**
   * Start WebAuthn authentication
   */
  startWebAuthnAuthentication: async ({
    hashTag,
    referrer,
  }: {
    hashTag: string;
    referrer?: string;
  }): Promise<PublicKeyCredentialRequestOptionsJSON> => {
    const response = await mainApiInstance.post('auth/webauthn/login/start', {
      json: {
        referrer,
        hashTag,
      },
    });

    return response.json<PublicKeyCredentialRequestOptionsJSON>();
  },

  /**
   * Complete WebAuthn authentication
   */
  completeWebAuthnAuthentication: async (
    tagName: string,
    credential: AuthenticationResponseJSON
  ): Promise<WebAuthnRegistrationResponse> => {
    const response = await mainApiInstance.post(
      'auth/webauthn/login/complete',
      {
        json: {
          tagName,
          credential,
        },
      }
    );
    return response.json<WebAuthnAuthenticationResponse>();
  },
};
