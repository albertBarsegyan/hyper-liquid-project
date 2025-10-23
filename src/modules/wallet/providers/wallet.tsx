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

  enableInjected: false,
  enableEIP6963: true,
  enableCoinbase: true,
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
