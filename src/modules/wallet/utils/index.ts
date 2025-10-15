import { formatEther, formatUnits, parseUnits } from 'ethers';
import type { WalletError } from '@/modules/wallet/types';

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
      case -32002:
        return 'Request already pending. Please check your wallet';
      case -32603:
        return 'Internal error. Please try again';
      default:
        return error.message || 'An unknown error occurred';
    }
  }

  return error.message || 'An unknown error occurred';
};

// ==================== Address Utilities ====================

/**
 * Formats an Ethereum address for display
 * @param address - The full Ethereum address
 * @param startChars - Number of characters to show at the start (default: 6)
 * @param endChars - Number of characters to show at the end (default: 4)
 * @returns Formatted address (e.g., "0x1234...5678")
 */
export const formatAddress = (
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string => {
  if (!address || address.length < startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Validates if a string is a valid Ethereum address
 * @param address - The address to validate
 * @returns true if valid, false otherwise
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Checks if two addresses are equal (case-insensitive)
 * @param address1 - First address
 * @param address2 - Second address
 * @returns true if addresses are equal
 */
export const addressesEqual = (address1: string, address2: string): boolean => {
  return address1.toLowerCase() === address2.toLowerCase();
};

// ==================== Balance Utilities ====================

/**
 * Formats a balance from wei to a human-readable format
 * @param balance - Balance in wei (as string or bigint)
 * @param decimals - Token decimals (default: 18 for ETH/BNB)
 * @param maxDecimals - Maximum decimal places to show (default: 4)
 * @returns Formatted balance string
 */
export const formatBalance = (
  balance: string | bigint,
  decimals: number = 18,
  maxDecimals: number = 4
): string => {
  try {
    const formatted = formatUnits(balance, decimals);
    const num = parseFloat(formatted);

    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';

    return num.toFixed(maxDecimals).replace(/\.?0+$/, '');
  } catch {
    return '0';
  }
};

/**
 * Formats ETH/BNB balance with symbol
 * @param balance - Balance in wei
 * @param symbol - Token symbol (default: 'BNB')
 * @returns Formatted balance with symbol (e.g., "1.5 BNB")
 */
export const formatBalanceWithSymbol = (
  balance: string | bigint,
  symbol: string = 'BNB'
): string => {
  const formatted = formatBalance(balance);
  return `${formatted} ${symbol}`;
};

/**
 * Parses a human-readable balance to wei
 * @param value - Balance as string (e.g., "1.5")
 * @param decimals - Token decimals (default: 18)
 * @returns Balance in wei as bigint
 */
export const parseBalance = (value: string, decimals: number = 18): bigint => {
  try {
    return parseUnits(value, decimals);
  } catch {
    return BigInt(0);
  }
};

/**
 * Formats a USD value with proper formatting
 * @param value - USD value as number or string
 * @returns Formatted USD string (e.g., "$1,234.56")
 */
export const formatUSD = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// ==================== Chain Utilities ====================

/**
 * Converts a chain ID to hex format
 * @param chainId - Chain ID as number
 * @returns Chain ID in hex format (e.g., "0x38")
 */
export const chainIdToHex = (chainId: number): string => {
  return `0x${chainId.toString(16)}`;
};

/**
 * Converts a hex chain ID to decimal
 * @param chainIdHex - Chain ID in hex format
 * @returns Chain ID as number
 */
export const hexToChainId = (chainIdHex: string): number => {
  return parseInt(chainIdHex, 16);
};

/**
 * Gets the block explorer URL for an address
 * @param address - Ethereum address
 * @param chainId - Chain ID (default: 56 for BSC)
 * @returns Block explorer URL
 */
export const getExplorerUrl = (
  address: string,
  chainId: number = 56
): string => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    56: 'https://bscscan.com',
    97: 'https://testnet.bscscan.com',
    137: 'https://polygonscan.com',
  };

  const baseUrl = explorers[chainId] || explorers[56];
  return `${baseUrl}/address/${address}`;
};

/**
 * Gets the block explorer URL for a transaction
 * @param txHash - Transaction hash
 * @param chainId - Chain ID (default: 56 for BSC)
 * @returns Block explorer URL
 */
export const getTxExplorerUrl = (
  txHash: string,
  chainId: number = 56
): string => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    56: 'https://bscscan.com',
    97: 'https://testnet.bscscan.com',
    137: 'https://polygonscan.com',
  };

  const baseUrl = explorers[chainId] || explorers[56];
  return `${baseUrl}/tx/${txHash}`;
};

// ==================== Transaction Utilities ====================

/**
 * Checks if a transaction hash is valid
 * @param txHash - Transaction hash
 * @returns true if valid
 */
export const isValidTxHash = (txHash: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(txHash);
};

/**
 * Formats gas price from wei to Gwei
 * @param gasPriceWei - Gas price in wei
 * @returns Gas price in Gwei as string
 */
export const formatGasPrice = (gasPriceWei: bigint | string): string => {
  const gwei = formatUnits(gasPriceWei, 9);
  return `${parseFloat(gwei).toFixed(2)} Gwei`;
};

/**
 * Calculates transaction cost in native token
 * @param gasUsed - Gas used
 * @param gasPrice - Gas price in wei
 * @returns Transaction cost in ETH/BNB
 */
export const calculateTxCost = (
  gasUsed: bigint | string,
  gasPrice: bigint | string
): string => {
  try {
    const cost = BigInt(gasUsed) * BigInt(gasPrice);
    return formatEther(cost);
  } catch {
    return '0';
  }
};

// ==================== Time Utilities ====================

/**
 * Formats a timestamp to a human-readable date
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

/**
 * Gets relative time string (e.g., "2 hours ago")
 * @param timestamp - Unix timestamp in seconds
 * @returns Relative time string
 */
export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp * 1000;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

// ==================== Validation Utilities ====================

/**
 * Validates if a string is a valid number
 * @param value - Value to validate
 * @returns true if valid number
 */
export const isValidNumber = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

/**
 * Validates if a value is within min and max bounds
 * @param value - Value to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns true if within bounds
 */
export const isWithinBounds = (
  value: string | number,
  min: string | number,
  max: string | number
): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  const minNum = typeof min === 'string' ? parseFloat(min) : min;
  const maxNum = typeof max === 'string' ? parseFloat(max) : max;

  return num >= minNum && num <= maxNum;
};
