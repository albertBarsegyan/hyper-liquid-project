import type { AddEthereumChainParameter } from '@/types/etherium.ts';
import type { AuthUser } from '@/modules/auth/services/auth.service.ts';
import type { AdapterBlueprint } from '@reown/appkit/adapters';
import type { ConnectedWalletInfo } from '@reown/appkit';

export interface WalletError extends Error {
  code: number;
  message: string;
  data?: unknown;
}

export interface WalletContextType {
  isConnected: boolean;
  accountAddress: string | undefined;
  isCorrectNetwork: boolean;
  chainId: string | number | undefined;
  balanceState: AdapterBlueprint.GetBalanceResult | null;
  isConnecting: boolean;
  error: string | null;
  connect: (referredAddress?: string | null) => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  clearError: () => void;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  authError: string | null;
  loading: boolean;
  switchToCorrectNetwork: VoidFunction;
  walletInfo: ConnectedWalletInfo | undefined;
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
