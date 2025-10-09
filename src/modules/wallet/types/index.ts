import type { AddEthereumChainParameter } from '@/types/etherium.ts';
import type { BrowserProvider } from 'ethers';
import type { AuthUser } from '@/modules/auth/services/auth.service.ts';

export interface WalletState {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  balance: string | null;
  isConnecting: boolean;
  error: string | null;
  isMetaMask: boolean;
  isCorrectNetwork: boolean;
}

export interface WalletError extends Error {
  code: number;
  message: string;
  data?: unknown;
}

export interface WalletContextType extends WalletState {
  connect: (referredAddress?: string | null) => Promise<void>;
  disconnect: () => void;
  switchToHyperEVM: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  clearError: () => void;
  getProvider: () => BrowserProvider | null;
  // Unified authentication state
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  authError: string | null;
  loading: boolean;
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
