// Global type declarations for the application

// Ethereum request parameters
type EthereumRequestParams = unknown[] | Record<string, unknown>;

// Ethereum request response - more specific types for common responses
type EthereumRequestResponse =
  | string // for addresses, hashes, chainId, etc.
  | string[] // for accounts array
  | number // for block numbers, etc.
  | boolean // for boolean responses
  | unknown[] // for complex arrays
  | Record<string, unknown>; // for complex objects

// Ethereum event callback parameters
type EthereumEventCallbackParams = unknown[];

// Ethereum provider interface
interface EthereumProvider {
  isMetaMask?: boolean;
  isConnected?: () => boolean;
  request: (args: {
    method: string;
    params?: EthereumRequestParams;
  }) => Promise<EthereumRequestResponse>;
  on: (
    event: string,
    callback: (...args: EthereumEventCallbackParams) => void
  ) => void;
  removeListener: (
    event: string,
    callback: (...args: EthereumEventCallbackParams) => void
  ) => void;
  addListener?: (
    event: string,
    callback: (...args: EthereumEventCallbackParams) => void
  ) => void;
  removeAllListeners?: (event: string) => void;
}

// MetaMask specific provider
interface MetaMaskProvider extends EthereumProvider {
  isMetaMask: true;
  selectedAddress: string | null;
  networkVersion: string;
  chainId: string;
}

// Binance Wallet specific provider
interface BinanceWalletProvider extends EthereumProvider {
  isBinance: true;
  isMetaMask?: false;
  selectedAddress: string | null;
  networkVersion: string;
  chainId: string;
  bnbSign?: (address: string, message: string) => Promise<string>;
}

// Binance Chain provider (legacy)
interface BinanceChainProvider {
  isBinance: true;
  isMetaMask?: false;
  selectedAddress: string | null;
  networkVersion: string;
  chainId: string;
  request: (args: {
    method: string;
    params?: EthereumRequestParams;
  }) => Promise<EthereumRequestResponse>;
  on: (
    event: string,
    callback: (...args: EthereumEventCallbackParams) => void
  ) => void;
  removeListener: (
    event: string,
    callback: (...args: EthereumEventCallbackParams) => void
  ) => void;
  addListener?: (
    event: string,
    callback: (...args: EthereumEventCallbackParams) => void
  ) => void;
  removeAllListeners?: (event: string) => void;
}

// Ethereum request methods
type EthereumRequestMethod =
  | 'eth_requestAccounts'
  | 'eth_accounts'
  | 'eth_chainId'
  | 'eth_getBalance'
  | 'wallet_switchEthereumChain'
  | 'wallet_addEthereumChain'
  | 'personal_sign'
  | 'eth_signTypedData_v4'
  | 'eth_sendTransaction'
  | 'eth_sign';

// Ethereum events
type EthereumEvent =
  | 'accountsChanged'
  | 'chainChanged'
  | 'connect'
  | 'disconnect';

declare global {
  interface Window {
    ethereum?: EthereumProvider | MetaMaskProvider | BinanceWalletProvider;
    BinanceChain?: BinanceChainProvider;
  }

  // Environment variables
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly VITE_APP_TITLE?: string;
      readonly VITE_APP_DESCRIPTION?: string;
      readonly VITE_APP_VERSION?: string;
    }
  }
}

export type {
  EthereumProvider,
  MetaMaskProvider,
  BinanceWalletProvider,
  BinanceChainProvider,
  WalletError,
  EthereumRequestMethod,
  EthereumEvent,
  AddEthereumChainParameter,
  EthereumRequestParams,
  EthereumRequestResponse,
  EthereumEventCallbackParams,
};

// Make this file a module
export {};
