import type { AddEthereumChainParameter } from '@/types/etherium.ts';
import type { BrowserProvider } from 'ethers';

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
}

export const HYPER_EVM_CONFIG: AddEthereumChainParameter = {
  chainId: '0x3e6',
  chainName: 'HyperEVM Testnet',
  rpcUrls: ['https://rpc.hyperliquid-testnet.xyz/evm'],
  blockExplorerUrls: ['https://www.hyperscan.com/'],
  nativeCurrency: {
    name: 'HYPE',
    symbol: 'HYPE',
    decimals: 18,
  },
};
