import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import {
  type WalletState,
  type WalletContextType,
  CHAIN_CONFIG,
} from '@/modules/wallet/types';

import { localStorageUtil } from '@/modules/shared/utils/local-storage.ts';
import { getErrorMessage } from '@/modules/shared/utils/error.ts';
import {
  authService,
  type AuthUser,
} from '@/modules/auth/services/auth.service.ts';
import { storageName } from '@/modules/shared/constants/storage-name.ts';
import { responseMessage } from '@/modules/shared/constants/app-messages.ts';

type ErrorWithCode = { code: unknown; error?: unknown };

const getErrorCode = (error: unknown): number | undefined => {
  if (typeof error === 'object' && error !== null) {
    const errObj = error as ErrorWithCode;

    if (errObj.error && typeof errObj.error === 'object') {
      const inner = errObj.error as ErrorWithCode;
      if (typeof inner.code === 'number') {
        return inner.code;
      }
    }

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
  const [loading, setIsLoading] = useState(true);
  const providerRef = useRef<BrowserProvider | null>(null);

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const getProvider = useCallback((): BrowserProvider | null => {
    if (!window.ethereum) return null;

    providerRef.current ??= new BrowserProvider(window.ethereum);

    return providerRef.current;
  }, []);

  const isManuallyDisconnected = (): boolean => {
    return localStorageUtil.getItem(DISCONNECT_STATE_KEY) === 'true';
  };

  const setDisconnectState = (disconnected: boolean) => {
    if (disconnected) localStorageUtil.setItem(DISCONNECT_STATE_KEY, 'true');
    else localStorageUtil.deleteItem(DISCONNECT_STATE_KEY);
  };

  const setLastAccount = (account: string | null) => {
    if (account) localStorageUtil.setItem(WALLET_ACCOUNT_KEY, account);
    else localStorageUtil.deleteItem(WALLET_ACCOUNT_KEY);
  };

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
    setAuthError(null);
  }, []);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorageUtil.getItem(storageName.AUTH_TOKEN);
      if (!token) return;

      const currentUser = await authService.getProfile();
      if (!currentUser) return;

      setAuthUser(currentUser);
      setIsAuthenticated(true);

      try {
        const isValid = await authService.verifyToken();
        if (!isValid) {
          setAuthUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        setAuthUser(null);
        setIsAuthenticated(false);
      }
    };

    initializeAuth().finally(() => setIsLoading(false));
  }, []);

  const setError = useCallback((error: unknown) => {
    const message = getErrorMessage(error);
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
      const isCorrectNetwork = chainIdHex === CHAIN_CONFIG.chainId;

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
              { chainId: CHAIN_CONFIG.chainId },
            ]);
          } catch (switchError) {
            const errorCode = getErrorCode(switchError);
            if (errorCode === 4902) {
              try {
                await provider.send('wallet_addEthereumChain', [CHAIN_CONFIG]);
              } catch {
                setError('Failed to add BNB network');
              }
            } else setError('Failed to switch to BNB network:');
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
        { chainId: CHAIN_CONFIG.chainId },
      ]);
    } catch (switchError) {
      const errorCode = getErrorCode(switchError);
      if (errorCode === 4902) {
        try {
          await provider.send('wallet_addEthereumChain', [CHAIN_CONFIG]);
        } catch (addError) {
          const addErrorCode = getErrorCode(addError);
          if (addErrorCode === -32002)
            setError('Please check your metamask application');
        }
      } else setError(switchError);
    }
  }, [getProvider, setError]);

  const connect = useCallback(
    async (referredAddress?: string | null) => {
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

        const isMetaMask = window.ethereum?.isMetaMask ?? false;
        const isCorrectNetwork = chainIdHex === CHAIN_CONFIG.chainId;

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

        try {
          const nonce = await authService.requestNonce(account);

          const signature = await signer.signMessage(nonce);

          const { access_token } = await authService.verifySignature({
            address: account,
            signature,
            referredAddress,
          });

          if (!access_token) return;

          localStorageUtil.setItem(storageName.AUTH_TOKEN, access_token);

          const profile = await authService.getProfile();

          setAuthUser(profile);
          setIsAuthenticated(true);
          setAuthError(null);
        } catch {
          setAuthError(responseMessage.WENT_WRONG);
        }

        if (!isCorrectNetwork) {
          try {
            await switchToHyperEVM();
          } catch {
            setAuthError('Failed to switch to BNB network');
          }
        }

        await updateBalance(account);
      } catch {
        setState(prev => ({
          ...prev,
          isConnecting: false,
        }));
        setError(responseMessage.WENT_WRONG);
      }
    },
    [getProvider, setError, updateBalance, switchToHyperEVM]
  );

  const disconnect = useCallback(() => {
    setDisconnectState(true);
    setLastAccount(null);

    authService.signOut();
    setAuthUser(null);
    setIsAuthenticated(false);
    setAuthError(null);

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
          isCorrectNetwork: chainId === CHAIN_CONFIG.chainId,
        }));

        if (!isManuallyDisconnected()) void checkConnection();
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
    authUser,
    isAuthenticated,
    authError,
    loading,
  };
};

export default useWallet;
