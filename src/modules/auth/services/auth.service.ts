import { mainApiInstance } from '@/configs/api/main-instance.ts';
import { localStorageUtil } from '@/modules/shared/utils/local-storage.ts';
import { storageName } from '@/modules/shared/constants/storage-name.ts';

export interface AuthUser {
  tagName: string;
  walletAddress: string;
}

export interface UserToken {
  token: string;
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
  verifySignature: async (
    address: string,
    signature: string
  ): Promise<{ access_token: string }> => {
    const response = await mainApiInstance.post('auth/verify', {
      json: { address, signature },
    });

    return response.json<{ access_token: string }>();
  },

  /**
   * Authenticate with wallet
   */
  authenticateWithWallet: async (
    address: string,
    signature: string
  ): Promise<UserToken> => {
    const { access_token } = await authService.verifySignature(
      address,
      signature
    );

    localStorageUtil.setItem(storageName.AUTH_TOKEN, access_token);

    return { token: access_token };
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
};
