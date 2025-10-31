import type { AddEthereumChainParameter } from '@/types/etherium.ts';
import type { AuthUser } from '@/modules/auth/services/auth.service.ts';

export interface WalletError extends Error {
  code: number;
  message: string;
  data?: unknown;
}

export interface SignUpParams {
  hashTag: string;
  referrer?: string;
}

export interface SignInParams {
  referrer?: string;
  hashTag: string;
}

export interface WalletContextType {
  isConnected: boolean;
  accountAddress: string | undefined;
  isCorrectNetwork: boolean;
  balanceState: { balance: string; symbol: string } | null;
  isConnecting: boolean;
  error: string | null;
  signUp: (params: SignUpParams) => Promise<void>;
  signIn: (params: SignInParams) => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  authError: string | null;
  loading: boolean;
  walletInfo: { name: string } | undefined;
}

export const CHAIN_CONFIG: AddEthereumChainParameter = {
  chainId: '0x38', // 56 in decimal
  chainName: 'Binance Smart Chain Mainnet',
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/'],
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
};
