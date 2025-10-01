import type { WalletError } from '@/modules/wallet';

export const isWalletError = (error: unknown): error is WalletError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
};

export const getWalletErrorMessage = (error: WalletError | Error): string => {
  if (isWalletError(error)) {
    switch (error.code) {
      case 4001:
        return 'User rejected the request';
      case 4100:
        return 'Unauthorized. Please connect your wallet';
      case 4200:
        return 'Unsupported method';
      case 4900:
        return 'Wallet is disconnected';
      case 4901:
        return 'Wallet is locked';
      case 4902:
        return 'Chain not added to wallet';
      default:
        return error.message || 'An unknown error occurred';
    }
  }

  return error.message;
};
