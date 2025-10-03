import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import {
  type WalletState,
  type WalletContextType,
  HYPER_EVM_CONFIG,
} from '@/modules/wallet/types';

import { getWalletErrorMessage } from '@/modules/wallet/utils';

type ErrorWithCode = { code: unknown; error?: unknown };

const getErrorCode = (error: unknown): number | undefined => {
  if (typeof error === 'object' && error !== null) {
    const errObj = error as ErrorWithCode;

    // Check nested error (ethers v6 wrapping)
    if (errObj.error && typeof errObj.error === 'object') {
      const inner = errObj.error as ErrorWithCode;
      if (typeof inner.code === 'number') {
        return inner.code;
      }
    }

    // Check direct code
    if (typeof errObj.code === 'number') {
      return errObj.code;
    }
  }
  return undefined;
};

// Local storage keys
const DISCONNECT_STATE_KEY = 'wallet_disconnect_state';
const WALLET_ACCOUNT_KEY = 'wallet_last_account';

const defaultState = {
  isConnected: false,
  account: null,
  chainId: null,
  balance: null,
  isConnecting: false,
  error: null,
  isMetaMask: false,
  isCorrectNetwork: false,
  getProvider: () => {},
};

const useWallet = (): WalletContextType => {
  const [state, setState] = useState<WalletState>(defaultState);
  const providerRef = useRef<BrowserProvider | null>(null);

  const getProvider = useCallback((): BrowserProvider | null => {
    if (!window.ethereum) return null;

    providerRef.current ??= new BrowserProvider(window.ethereum);

    return providerRef.current;
  }, []);

  // Check if user manually disconnected
  const isManuallyDisconnected = (): boolean => {
    return localStorage.getItem(DISCONNECT_STATE_KEY) === 'true';
  };

  // Set disconnect state in localStorage
  const setDisconnectState = (disconnected: boolean) => {
    if (disconnected) {
      localStorage.setItem(DISCONNECT_STATE_KEY, 'true');
    } else {
      localStorage.removeItem(DISCONNECT_STATE_KEY);
    }
  };

  const setLastAccount = (account: string | null) => {
    if (account) localStorage.setItem(WALLET_ACCOUNT_KEY, account);
    else localStorage.removeItem(WALLET_ACCOUNT_KEY);
  };

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const setError = useCallback((error: unknown) => {
    const message =
      error instanceof Error
        ? getWalletErrorMessage(error)
        : 'An unknown error occurred';
    setState(prev => ({ ...prev, error: message }));
  }, []);

  const updateBalance = useCallback(
    async (account: string) => {
      const provider = getProvider();
      if (!provider) return;

      try {
        const balance = await provider.getBalance(account);
        const formattedBalance = parseFloat(formatEther(balance)).toFixed(4);

        setState(prev => ({
          ...prev,
          balance: formattedBalance,
        }));
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    },
    [getProvider]
  );

  const checkConnection = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setState(prev => ({
        ...prev,
        error: 'MetaMask not detected. Please install MetaMask to continue.',
        isMetaMask: false,
        isCorrectNetwork: false,
      }));
      return;
    }

    if (isManuallyDisconnected()) {
      setState(defaultState);
      return;
    }

    try {
      const network = await provider.getNetwork();
      const accounts = await provider.listAccounts();

      const isMetaMask = window.ethereum?.isMetaMask ?? false;
      const chainIdHex = '0x' + network.chainId.toString(16);
      const isCorrectNetwork = chainIdHex === HYPER_EVM_CONFIG.chainId;

      if (accounts.length > 0) {
        const account = accounts[0].address;

        setState(prev => ({
          ...prev,
          isConnected: true,
          account,
          chainId: chainIdHex,
          isMetaMask,
          isCorrectNetwork,
          error: null,
        }));

        setLastAccount(account);

        if (!isCorrectNetwork) {
          try {
            await provider.send('wallet_switchEthereumChain', [
              { chainId: HYPER_EVM_CONFIG.chainId },
            ]);
          } catch (switchError) {
            const errorCode = getErrorCode(switchError);
            if (errorCode === 4902) {
              try {
                await provider.send('wallet_addEthereumChain', [
                  HYPER_EVM_CONFIG,
                ]);
              } catch (addError) {
                console.warn('Failed to add HyperEVM network:', addError);
              }
            } else {
              console.warn(
                'Failed to switch to HyperEVM network:',
                switchError
              );
            }
          }
        }

        await updateBalance(account);
      } else {
        setState(prev => ({
          ...prev,
          isConnected: false,
          account: null,
          chainId: chainIdHex,
          isMetaMask,
          isCorrectNetwork,
          balance: null,
          error: null,
        }));
        // Clear stored account if no accounts
        setLastAccount(null);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setError(error);
    }
  }, [getProvider, setError, updateBalance]);

  const switchToHyperEVM = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setState(prev => ({
        ...prev,
        error: 'MetaMask not detected. Please install MetaMask to continue.',
        isMetaMask: false,
        isCorrectNetwork: false,
      }));
      return;
    }

    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: HYPER_EVM_CONFIG.chainId },
      ]);
    } catch (switchError) {
      console.log('switchError', switchError);
      const errorCode = getErrorCode(switchError);
      if (errorCode === 4902) {
        try {
          await provider.send('wallet_addEthereumChain', [HYPER_EVM_CONFIG]);
        } catch (addError) {
          console.log('addError', addError);
          const addErrorCode = getErrorCode(addError);
          if (addErrorCode === -32002)
            setError('Please check your metamask application');
        }
      } else {
        setError(switchError);
      }
    }
  }, [getProvider, setError]);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setState(prev => ({
        ...prev,
        error: 'MetaMask not detected. Please install MetaMask to continue.',
        isMetaMask: false,
        isCorrectNetwork: false,
      }));
      return;
    }

    setDisconnectState(false);
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      await switchToHyperEVM();

      const network = await provider.getNetwork();
      const chainIdHex = '0x' + network.chainId.toString(16);

      console.log('chainIdHex', chainIdHex);

      const isMetaMask = window.ethereum?.isMetaMask ?? false;
      const isCorrectNetwork = chainIdHex === HYPER_EVM_CONFIG.chainId;

      setState(prev => ({
        ...prev,
        isConnected: true,
        account,
        chainId: chainIdHex,
        isMetaMask,
        isCorrectNetwork,
        isConnecting: false,
        error: null,
      }));

      if (!isCorrectNetwork) {
        try {
          await switchToHyperEVM();
        } catch (switchError) {
          console.warn('Failed to switch to HyperEVM network:', switchError);
        }
      }

      await updateBalance(account);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
      }));
      setError(error);
    }
  }, [getProvider, setError, updateBalance, switchToHyperEVM]);

  const disconnect = useCallback(() => {
    setDisconnectState(true);
    setLastAccount(null);

    setState(defaultState);
  }, []);

  const refreshBalance = useCallback(async () => {
    try {
      if (state.account) await updateBalance(state.account as string);
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  }, [state.account, updateBalance]);

  const handleAccountsChanged = useCallback(
    (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts && accounts.length === 0) {
        setDisconnectState(true);
        setLastAccount(null);
        setState(defaultState);
      } else {
        if (!isManuallyDisconnected()) void checkConnection();
      }
    },
    [checkConnection]
  );

  const handleChainChanged = useCallback(
    (...args: unknown[]) => {
      const chainId = args[0] as string;
      if (chainId) {
        setState(prev => ({
          ...prev,
          chainId: chainId,
          isCorrectNetwork: chainId === HYPER_EVM_CONFIG.chainId,
        }));
        // Only check connection if user hasn't manually disconnected
        if (!isManuallyDisconnected()) {
          void checkConnection();
        }
      }
    },
    [checkConnection]
  );

  useEffect(() => {
    void checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener(
          'accountsChanged',
          handleAccountsChanged
        );
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [checkConnection, handleAccountsChanged, handleChainChanged]);

  return {
    ...state,
    connect,
    disconnect,
    switchToHyperEVM,
    refreshBalance,
    getProvider,
    clearError,
  };
};

export default useWallet;
