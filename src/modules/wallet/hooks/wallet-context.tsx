import { useContext } from 'react';
import type { WalletContextType } from '../types';
import { WalletContext } from '../providers/wallet';

export const useWalletContext = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
