import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JsonRpcProvider } from 'ethers';
import {
  CHAIN_CONFIG,
  type SignInParams,
  type SignUpParams,
  type WalletContextType,
} from '@/modules/wallet/types';
import { storageName } from '@/modules/shared/constants/storage-name.ts';
import { localStorageUtil } from '@/modules/shared/utils/local-storage.ts';
import {
  authService,
  type AuthUser,
  type WebAuthnRegistrationResponse,
} from '@/modules/auth/services/auth.service.ts';
import { responseMessage } from '@/modules/shared/constants/app-messages.ts';
import { getErrorMessage } from '@/modules/shared/utils/error.ts';
import {
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';
import { formatBalance } from '@/modules/wallet/utils/index.ts';

export const useWallet = (): WalletContextType => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balanceState, setBalanceState] = useState<{
    balance: string;
    symbol: string;
  } | null>(null);

  const isMountedRef = useRef(true);
  const hasConnectedOnceRef = useRef(false);
  const authInitializedRef = useRef(false);
  const authUserRef = useRef<AuthUser | null>(null);
  const authInProgressRef = useRef(false);

  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  // Fetch wallet balance when authUser wallet address is available
  useEffect(() => {
    const fetchBalance = async () => {
      if (!authUser?.walletAddress) {
        setBalanceState(null);
        return;
      }

      try {
        // Use BSC RPC endpoint from CHAIN_CONFIG
        const rpcUrl =
          CHAIN_CONFIG.rpcUrls?.[0] || 'https://bsc-dataseed.binance.org/';
        const provider = new JsonRpcProvider(rpcUrl);

        // Get balance in wei (returns bigint in ethers v6)
        const balanceWei = await provider.getBalance(authUser.walletAddress);

        // Format balance and get symbol
        // formatBalance accepts string or bigint
        const formattedBalance = formatBalance(balanceWei, 18);
        const symbol = CHAIN_CONFIG.nativeCurrency?.symbol || 'BNB';

        if (isMountedRef.current) {
          setBalanceState({
            balance: formattedBalance,
            symbol,
          });
        }
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
        if (isMountedRef.current) {
          setBalanceState(null);
        }
      }
    };

    void fetchBalance();
  }, [authUser?.walletAddress]);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const setError = useCallback((errorMessage?: string) => {
    setAuthError(errorMessage ?? responseMessage.WENT_WRONG);
  }, []);

  const signUp = useCallback(
    async ({ hashTag, referrer }: SignUpParams) => {
      if (!hashTag.trim()) {
        setAuthError('Tag name is required');
        return;
      }

      if (hasConnectedOnceRef.current) {
        return;
      }

      setIsConnecting(true);
      authInProgressRef.current = true;

      try {
        // Step 1: Start WebAuthn registration using native fetch for Safari compatibility
        // This must be called within a user gesture (click handler) using native fetch
        const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL as string;
        const token = localStorageUtil.getItem(storageName.AUTH_TOKEN);
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const registrationResponse = await fetch(
          `${APP_BASE_URL}/auth/webauthn/register/start`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              tagName: hashTag,
              referredByTagName: referrer,
            }),
          }
        );

        if (!registrationResponse.ok) {
          const errorData = (await registrationResponse.json()) as {
            message: string;
          };

          setError(errorData?.message);
          return;
        }

        const registrationOptions = (await registrationResponse.json()) as {
          options: PublicKeyCredentialCreationOptionsJSON;
          userId: number;
        };

        // Step 2: Create credential with authenticator using SimpleWebAuthn
        const credentialForServer = await startRegistration({
          optionsJSON: registrationOptions.options,
          useAutoRegister: true,
        });

        // Step 3: Complete registration
        const result: WebAuthnRegistrationResponse =
          await authService.completeWebAuthnRegistration(
            registrationOptions.userId,
            credentialForServer
          );

        if (result.access_token) {
          localStorageUtil.setItem(storageName.AUTH_TOKEN, result.access_token);
        }

        // Step 4: Get profile
        const profile = await authService.getProfile();

        if (!profile) {
          setAuthError('Failed to fetch user profile');
          return;
        }

        hasConnectedOnceRef.current = true;
        setAuthUser(profile);
        setError('');
      } catch (error) {
        // Clean up any partial authentication state
        localStorageUtil.deleteItem(storageName.AUTH_TOKEN);

        if (isMountedRef.current) {
          setError(getErrorMessage(error));
          hasConnectedOnceRef.current = false;
        }
      } finally {
        if (isMountedRef.current) setIsConnecting(false);
        authInProgressRef.current = false;
      }
    },
    [setError]
  );

  const signIn = useCallback(
    async ({ referrer, hashTag }: SignInParams) => {
      setIsConnecting(true);
      authInProgressRef.current = true;

      try {
        // Step 1: Start WebAuthn authentication using native fetch for Safari compatibility
        // This must be called within a user gesture (click handler) using native fetch
        const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL as string;
        const token = localStorageUtil.getItem(storageName.AUTH_TOKEN);
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const authenticationResponse = await fetch(
          `${APP_BASE_URL}/auth/webauthn/login/start`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              referrer,
              hashTag,
            }),
          }
        );

        if (!authenticationResponse.ok) {
          const errorData = (await authenticationResponse.json()) as {
            message: string;
          };

          setError(errorData?.message);
          return;
        }

        const authenticationOptions =
          (await authenticationResponse.json()) as PublicKeyCredentialRequestOptionsJSON;

        // Step 2: Get credential from authenticator using SimpleWebAuthn
        const credentialForServer = await startAuthentication({
          optionsJSON: authenticationOptions,
        });

        // Step 3: Complete authentication
        const result = await authService.completeWebAuthnAuthentication(
          hashTag,
          credentialForServer
        );

        if (!result.access_token) {
          setAuthError('No access token received');
          return;
        }

        localStorageUtil.setItem(storageName.AUTH_TOKEN, result.access_token);

        // Step 4: Get profile
        const profile = await authService.getProfile();

        if (!profile) {
          setAuthError('Failed to fetch user profile');
          return;
        }

        hasConnectedOnceRef.current = true;
        setAuthUser(profile);
        setError('');
      } catch (error) {
        console.log('error', error);
        // Clean up any partial authentication state
        localStorageUtil.deleteItem(storageName.AUTH_TOKEN);

        if (isMountedRef.current) {
          setError(getErrorMessage(error));
          hasConnectedOnceRef.current = false;
        }
      } finally {
        if (isMountedRef.current) setIsConnecting(false);
        authInProgressRef.current = false;
      }
    },
    [setError]
  );

  const disconnect = useCallback(async () => {
    try {
      // Cancel any in-progress authentication
      authInProgressRef.current = false;
      hasConnectedOnceRef.current = false;

      // Sign out from auth service
      authService.signOut();

      // Clear local state
      if (isMountedRef.current) {
        setAuthUser(null);
        clearError();
      }
    } catch (error) {
      console.error('Disconnect failed:', error);
      if (isMountedRef.current) setError(getErrorMessage(error));
    }
  }, [clearError, setError]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    if (authInitializedRef.current) return;
    authInitializedRef.current = true;

    const initializeAuth = async () => {
      const token = localStorageUtil.getItem(storageName.AUTH_TOKEN);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getProfile();
        if (currentUser) {
          if (currentUser && isMountedRef.current) {
            setAuthUser(currentUser);
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
  }, []);

  return useMemo(
    (): WalletContextType => ({
      isConnected: Boolean(authUser),
      accountAddress: authUser?.walletAddress,
      balanceState,
      isCorrectNetwork: true,
      walletInfo: undefined,

      authUser,
      isAuthenticated: Boolean(authUser),
      authError,

      isConnecting,
      loading,
      error: authError,
      disconnect,

      clearError,
      signUp,
      signIn,
    }),
    [
      authUser,
      authError,
      isConnecting,
      loading,
      disconnect,
      clearError,
      signUp,
      signIn,
      balanceState,
    ]
  );
};
