import React, { createContext, type ReactNode, useEffect } from 'react';
import { useWallet } from '../hooks/wallet.tsx';
import { type WalletContextType } from '../types';
import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { bsc, bscTestnet } from '@/modules/wallet/constants/networks.ts';

import { Buffer } from 'buffer';

window.Buffer = window.Buffer || Buffer;

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

interface WalletProviderProps {
  children: ReactNode;
}

/**
 * Wallet metadata for AppKit configuration
 * This information is displayed in wallet connection modals
 */
const metadata = {
  name: 'DLIQD',
  description: 'Decentralized RWA liquidity on BNB',
  url: 'https://www.dliqd.com/',
  icons: [`${window.location.origin}/dliqd.png`],
};

// Get project ID from environment variables
const PROJECT_ID = import.meta.env.VITE_APP_REOWN_PROJECT_ID as string;

if (!PROJECT_ID) {
  console.warn(
    '⚠️ PROJECT_ID not found in environment variables. Please add VITE_PROJECT_ID to your .env file.'
  );
}

/**
 * Initialize AppKit with optimal configuration
 *
 * Features enabled:
 * - Analytics for usage tracking
 * - Email wallet support
 * - Social login options
 * - On-ramp integration for purchasing crypto
 * - Injected wallet support (including Binance Wallet)
 * - EIP-6963 wallet detection
 */

const isTestMode = Boolean(import.meta.env.VITE_APP_TEST_NET as string);

const appKit = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [isTestMode ? bscTestnet : bsc],
  metadata,
  projectId: PROJECT_ID,
  features: {
    analytics: true,
    email: false,
    socials: false,
    emailShowWallets: false,
  },

  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#0066FF',
    '--w3m-border-radius-master': '8px',
  },

  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,

  // Additional configuration for better wallet support
  includeWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89f', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7', // Trust Wallet
    'fd20dc426fb37566d803205b19bbc1d4096b248c',
    '19177a98252e07ddfc9afb3f1f5c6e6938f5e90', // Coinbase Wallet
    'c286eebc742a537cd1d6818363e9dc53b2178a6e', // WalletConnect
  ],
});

/**
 * WalletProvider Component
 *
 * Provides wallet context to the entire application.
 * Wraps the app with necessary AppKit providers and custom wallet state management.
 *
 * @example
 * ```tsx
 * <WalletProvider>
 *   <App />
 * </WalletProvider>
 * ```
 */
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const wallet = useWallet();

  // Monitor wallet initialization
  useEffect(() => {
    if (appKit) {
      console.log('✅ AppKit initialized successfully');
    }
  }, []);

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
};
