import React, { createContext, type ReactNode } from 'react';
import { useWallet } from '../hooks/wallet.tsx';
import { type WalletContextType } from '../types';

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

interface WalletProviderProps {
  children: ReactNode;
}

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

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
};
