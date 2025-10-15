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

  const isMountedRef = useRef(true);
  const hasConnectedOnceRef = useRef(false);
  const authInitializedRef = useRef(false);
  const authUserRef = useRef<AuthUser | null>(null);
  const walletProviderRef = useRef(walletProvider);
  const authInProgressRef = useRef(false);
  const isDisconnectedRef = useRef(false);

  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  useEffect(() => {
    walletProviderRef.current = walletProvider;
  }, [walletProvider]);

  const isCorrectNetwork = useMemo(() => {
    if (!chainId) return false;
    const targetChainId = parseInt(CHAIN_CONFIG.chainId, 16);
    return chainId === targetChainId;
  }, [chainId]);

  const clearError = useCallback(() => {
    setAuthError(null);
    setWalletError(null);
  }, []);

  const setError = useCallback(
    (_: unknown, source: 'wallet' | 'auth' = 'wallet') => {
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
      if (fetchedBalance?.data && isMountedRef.current) {
        setBalance(fetchedBalance.data);
      }
    } catch (error) {
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
    const currentAuthUser = authUserRef.current;
    const currentWalletProvider = walletProviderRef.current;

    if (
      !address ||
      token ||
      !currentWalletProvider ||
      Boolean(currentAuthUser) ||
      !isMountedRef.current
    ) {
      return;
    }

    setIsConnecting(true);
    authInProgressRef.current = true;

    try {
      // Step 1: Request nonce
      const nonce = await authService.requestNonce(address as string);

      // Step 2: Sign message
      const provider = new BrowserProvider(
        currentWalletProvider as Eip1193Provider
      );

      const signer = await provider.getSigner();
      const signature = await signer.signMessage(nonce);

      // Verify address hasn't changed after user interaction

      // Step 3: Verify signature
      const { access_token } = await authService.verifySignature({
        address,
        signature,
      });

      if (!access_token) {
        setAuthError('No access token received');
        return;
      }

      localStorageUtil.setItem(storageName.AUTH_TOKEN, access_token);

      // Step 4: Get profile BEFORE saving token to ensure consistency
      const profile = await authService.getProfile();

      if (!profile) {
        setAuthError('Failed to fetch user profile');
      }

      // Only save token after successful profile fetch

      // Update state if still mounted and address matches

      hasConnectedOnceRef.current = true;

      setAuthUser(profile);
      await refreshBalance();
    } catch (error) {
      // Clean up any partial authentication state
      localStorageUtil.deleteItem(storageName.AUTH_TOKEN);

      if (isMountedRef.current) {
        // Check if user rejected the signature request
        setError(error, 'auth');

        // Reset connection flag to allow retry
        hasConnectedOnceRef.current = false;
      }
    } finally {
      if (isMountedRef.current) setIsConnecting(false);

      authInProgressRef.current = false;
    }
  }, [address, refreshBalance, setError]);

  const disconnect = useCallback(async () => {
    try {
      await appKitDisconnect();
      // Cancel any in-progress authentication
      authInProgressRef.current = false;

      hasConnectedOnceRef.current = false;

      // Sign out from auth service
      authService.signOut();

      // Clear local state
      if (isMountedRef.current) {
        setAuthUser(null);
        setBalance(null);
        clearError();
      }

      // Disconnect from wallet

      isDisconnectedRef.current = true;
    } catch (error) {
      isDisconnectedRef.current = false;
      console.error('Disconnect failed:', error);
      if (isMountedRef.current) setError(error, 'wallet');
    }
  }, [appKitDisconnect, clearError, setError]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Handle initial connection to server
  useEffect(() => {
    if (
      Boolean(address) &&
      !isConnecting &&
      !hasConnectedOnceRef.current &&
      !authInProgressRef.current
    ) {
      void connectToServer();
    }
  }, [isConnecting, connectToServer, disconnect, address]);

  // Initialize auth on mount
  useEffect(() => {
    if (!initialized || authInitializedRef.current) return;
    authInitializedRef.current = true;

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
          if (currentUser && isMountedRef.current) {
            setAuthUser(currentUser);
            await refreshBalance();
          } else {
            // Profile fetch failed, clear invalid token
            localStorageUtil.deleteItem(storageName.AUTH_TOKEN);
          }
        } else {
          // Token is invalid, remove it
          localStorageUtil.deleteItem(storageName.AUTH_TOKEN);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorageUtil.deleteItem(storageName.AUTH_TOKEN);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    void initializeAuth();
  }, [initialized, refreshBalance]);

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
