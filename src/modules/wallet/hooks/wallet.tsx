import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserProvider, type Eip1193Provider } from 'ethers';
import type { AdapterBlueprint } from '@reown/appkit/adapters';
import {
  useAppKit,
  useAppKitAccount,
  useAppKitBalance,
  useAppKitNetwork,
  useAppKitProvider,
  useAppKitState,
  useDisconnect,
  useWalletInfo,
} from '@reown/appkit/react';

import { CHAIN_CONFIG, type WalletContextType } from '@/modules/wallet/types';
import { storageName } from '@/modules/shared/constants/storage-name.ts';
import { localStorageUtil } from '@/modules/shared/utils/local-storage.ts';
import {
  authService,
  type AuthUser,
} from '@/modules/auth/services/auth.service.ts';
import { responseMessage } from '@/modules/shared/constants/app-messages.ts';

const DISCONNECT_STATE_KEY = 'wallet_disconnect_state';
const WALLET_ACCOUNT_KEY = 'wallet_last_account';

export const useWallet = (): WalletContextType => {
  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { fetchBalance } = useAppKitBalance();
  const { initialized, loading: walletLoading } = useAppKitState();
  const { walletProvider } = useAppKitProvider('eip155');
  const { disconnect: appKitDisconnect } = useDisconnect();
  const { walletInfo } = useWalletInfo();

  const [balance, setBalance] =
    useState<AdapterBlueprint.GetBalanceResult | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [loading, setLoading] = useState(true);

  const isMounted = useRef(true);
  const hasConnectedOnce = useRef(false);
  const authInitialized = useRef(false);
  const addressRef = useRef<string | undefined>(undefined);
  const authUserRef = useRef<AuthUser | null>(null);
  const walletProviderRef = useRef(walletProvider);

  useEffect(() => {
    addressRef.current = address;
  }, [address]);

  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  useEffect(() => {
    walletProviderRef.current = walletProvider;
  }, [walletProvider]);

  // ---------------------------------------------
  // Computed Values
  // ---------------------------------------------
  const isCorrectNetwork = useMemo(() => {
    if (!chainId) return false;
    const targetChainId = parseInt(CHAIN_CONFIG.chainId, 16);
    return chainId === targetChainId;
  }, [chainId]);

  // ---------------------------------------------
  // Utilities (stable callbacks)
  // ---------------------------------------------
  const setDisconnectState = useCallback((disconnected: boolean) => {
    if (disconnected) {
      localStorageUtil.setItem(DISCONNECT_STATE_KEY, 'true');
    } else {
      localStorageUtil.deleteItem(DISCONNECT_STATE_KEY);
    }
  }, []);

  const setLastAccount = useCallback((account: string | null) => {
    if (account) {
      localStorageUtil.setItem(WALLET_ACCOUNT_KEY, account);
    } else {
      localStorageUtil.deleteItem(WALLET_ACCOUNT_KEY);
    }
  }, []);

  const wasManuallyDisconnected = useCallback(
    (): boolean => localStorageUtil.getItem(DISCONNECT_STATE_KEY) === 'true',
    []
  );

  const clearError = useCallback(() => {
    setAuthError(null);
    setWalletError(null);
  }, []);

  const setError = useCallback(
    (_: unknown, source: 'wallet' | 'auth' = 'wallet') => {
      // const message = getErrorMessage(error);
      if (source === 'wallet') {
        setWalletError(responseMessage.WENT_WRONG);
      } else {
        setAuthError(responseMessage.WENT_WRONG);
      }
    },
    []
  );

  // ---------------------------------------------
  // Core Logic (stabilized callbacks)
  // ---------------------------------------------
  const refreshBalance = useCallback(async () => {
    try {
      const fetchedBalance = await fetchBalance();
      if (fetchedBalance?.data && isMounted.current) {
        setBalance(fetchedBalance.data);
      }
    } catch (error) {
      console.error('Balance fetch failed:', error);
      setError(error, 'wallet');
    }
  }, [fetchBalance, setError]);

  const connect = useCallback(async () => {
    if (!isConnected) {
      await open({ view: 'Connect', namespace: 'eip155' });
    }
  }, [isConnected, open]);

  const connectToServer = useCallback(async () => {
    const token = localStorageUtil.getItem(storageName.AUTH_TOKEN);
    const currentAddress = addressRef.current;
    const currentAuthUser = authUserRef.current;
    const currentWalletProvider = walletProviderRef.current;

    if (
      !currentAddress ||
      token ||
      !currentWalletProvider ||
      Boolean(currentAuthUser) ||
      !isMounted.current ||
      wasManuallyDisconnected()
    )
      return;

    setDisconnectState(false);
    setIsConnecting(true);

    try {
      const nonce = await authService.requestNonce(currentAddress);
      const provider = new BrowserProvider(
        currentWalletProvider as Eip1193Provider
      );
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(nonce);

      const { access_token } = await authService.verifySignature({
        address: currentAddress,
        signature,
      });
      if (!access_token) throw new Error('No access token received');

      localStorageUtil.setItem(storageName.AUTH_TOKEN, access_token);

      const profile = await authService.getProfile();
      if (isMounted.current) {
        setAuthUser(profile);
        await refreshBalance();
      }
    } catch (error) {
      if (isMounted.current) setError(error, 'auth');
    } finally {
      if (isMounted.current) setIsConnecting(false);
    }
  }, [wasManuallyDisconnected, setDisconnectState, refreshBalance, setError]);

  const disconnect = useCallback(async () => {
    try {
      setDisconnectState(true);
      setLastAccount(null);
      hasConnectedOnce.current = false;

      authService.signOut();

      if (isMounted.current) {
        setAuthUser(null);
        setBalance(null);
        clearError();
      }

      await appKitDisconnect();
    } catch (error) {
      console.error('Disconnect failed:', error);
      if (isMounted.current) setError(error, 'wallet');
    }
  }, [
    appKitDisconnect,
    setDisconnectState,
    setLastAccount,
    clearError,
    setError,
  ]);

  // ---------------------------------------------
  // Effects (optimized dependencies)
  // ---------------------------------------------
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle initial connection to server
  useEffect(() => {
    if (address && isConnected && !isConnecting && !hasConnectedOnce.current) {
      hasConnectedOnce.current = true;
      void connectToServer();
    }
  }, [address, isConnected, isConnecting, connectToServer]);

  // Initialize auth on mount
  useEffect(() => {
    if (!initialized || authInitialized.current) return;
    authInitialized.current = true;

    const initializeAuth = async () => {
      const token = localStorageUtil.getItem(storageName.AUTH_TOKEN);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const isValid = await authService.verifyToken();
        if (isValid) {
          const currentUser = await authService.getProfile();
          if (currentUser && isMounted.current) {
            setAuthUser(currentUser);
            await refreshBalance();
          }
        } else {
          localStorageUtil.deleteItem(storageName.AUTH_TOKEN);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorageUtil.deleteItem(storageName.AUTH_TOKEN);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    void initializeAuth();
  }, [initialized, refreshBalance]);

  useEffect(() => {
    if (isConnected && address) {
      console.log('isConnected && address');
      setLastAccount(address);
    }
  }, [address, isConnected, chainId, setLastAccount]);

  return useMemo(
    (): WalletContextType => ({
      isConnected,
      accountAddress: address,
      chainId,
      balanceState: balance,
      isCorrectNetwork,
      walletInfo,

      authUser,
      isAuthenticated: Boolean(authUser),
      authError,

      isConnecting: isConnecting || status === 'connecting',
      loading: loading || walletLoading,
      error: walletError ?? authError,
      switchToCorrectNetwork: () => {},
      connect,
      disconnect,
      refreshBalance,
      clearError,
    }),
    [
      isConnected,
      address,
      chainId,
      balance,
      isCorrectNetwork,
      walletInfo,
      authUser,
      authError,
      isConnecting,
      status,
      loading,
      walletLoading,
      walletError,
      connect,
      disconnect,
      refreshBalance,
      clearError,
    ]
  );
};
