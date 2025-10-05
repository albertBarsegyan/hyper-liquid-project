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
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToHyperEVM: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  clearError: () => void;
  getProvider: () => BrowserProvider | null;
  // Unified authentication state
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  authError: string | null;
}

export const HYPER_EVM_CONFIG: AddEthereumChainParameter = {
  chainId: '0x3e7', // hexadecimal of 999 decimal
  chainName: 'HyperEVM Mainnet',
  rpcUrls: ['https://rpc.hyperliquid.xyz/evm'],
  blockExplorerUrls: ['https://explorer.hyperliquid.xyz/'], // or whichever explorer url is correct
  nativeCurrency: {
    name: 'HYPE',
    symbol: 'HYPE',
    decimals: 18,
  },
};
