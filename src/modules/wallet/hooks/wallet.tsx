import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JsonRpcProvider } from 'ethers';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
} from '@/modules/auth/utils/webauthn.ts';
import { formatBalance } from '@/modules/wallet/utils/index.ts';
import { useModal } from '@/modules/shared/contexts/modal-context.tsx';
import { isLinuxUserAgent } from '@/modules/auth/utils/user-agent.ts';
import { APP_BASE_URL } from '@/configs/api/main-instance.ts';

// Query keys

export const authQueryKeys = {
  auth: {
    profile: ['auth', 'profile'] as const,
    balance: (address?: string) => ['auth', 'balance', address] as const,
  },
} as const;

export const useWallet = (): WalletContextType => {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();

  const isMountedRef = useRef(true);
  const hasConnectedOnceRef = useRef(false);
  const authInitializedRef = useRef(false);
  const authInProgressRef = useRef(false);
  const hasShownSignupModalRef = useRef(false);
  const { showModal } = useModal();

  // Auth profile query
  const {
    data: authUser,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: authQueryKeys.auth.profile,
    queryFn: async (): Promise<AuthUser | null> => {
      const token = localStorageUtil.getItem(storageName.AUTH_TOKEN);
      if (!token) return null;

      try {
        const currentUser = await authService.getProfile();
        return currentUser || null;
      } catch (error) {
        // Token is invalid, remove it
        localStorageUtil.deleteItem(storageName.AUTH_TOKEN);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized)
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Balance query
  const { data: balanceState } = useQuery({
    queryKey: authQueryKeys.auth.balance(authUser?.walletAddress),
    queryFn: async (): Promise<{ balance: string; symbol: string } | null> => {
      if (!authUser?.walletAddress) {
        return null;
      }

      try {
        const rpcUrl =
          CHAIN_CONFIG.rpcUrls?.[0] || 'https://bsc-dataseed.binance.org/';
        const provider = new JsonRpcProvider(rpcUrl);

        const balanceWei = await provider.getBalance(authUser.walletAddress);
        const formattedBalance = formatBalance(balanceWei, 18);
        const symbol = CHAIN_CONFIG.nativeCurrency?.symbol || 'BNB';

        return {
          balance: formattedBalance,
          symbol,
        };
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
        return null;
      }
    },
    enabled: !!authUser?.walletAddress,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const setError = useCallback((errorMessage?: string) => {
    setAuthError(errorMessage ?? responseMessage.WENT_WRONG);
  }, []);

  const signUp = useCallback(
    async ({ hashTag, referrer }: SignUpParams): Promise<boolean> => {
      const trimmed = hashTag.trim();
      if (!trimmed) {
        setAuthError('Tag name is required');
        return false;
      }
      if (trimmed.length < 3) {
        setAuthError('Tag name must be at least 3 characters');
        return false;
      }

      if (hasConnectedOnceRef.current) {
        return false;
      }

      setIsConnecting(true);
      authInProgressRef.current = true;

      try {
        // Check if user agent is Linux - use TOTP instead of WebAuthn
        if (isLinuxUserAgent()) {
          // Step 1: Setup TOTP (this also registers the user if they don't exist)
          const totpSetup = await authService.setupTotp({
            tagName: trimmed,
            referrer,
          });

          // Step 2: Show TOTP setup modal and wait for verification
          return new Promise<boolean>(resolve => {
            let isResolved = false;

            const handleVerify = async (code: string): Promise<boolean> => {
              try {
                // Step 3: Verify TOTP code (completes registration)
                const verifyResult = await authService.verifyTotp({
                  tagName: trimmed,
                  code,
                });

                if (!verifyResult.access_token) {
                  setAuthError('TOTP verification failed');
                  if (!isResolved) {
                    isResolved = true;
                    resolve(false);
                  }
                  return false;
                }

                localStorageUtil.setItem(
                  storageName.AUTH_TOKEN,
                  verifyResult.access_token
                );

                // Step 4: Get profile
                const profile = await authService.getProfile();

                if (!profile) {
                  setAuthError('Failed to fetch user profile');
                  if (!isResolved) {
                    isResolved = true;
                    resolve(false);
                  }
                  return false;
                }

                hasConnectedOnceRef.current = true;

                // Update React Query cache
                queryClient.setQueryData(authQueryKeys.auth.profile, profile);
                setError('');

                // Show sign-up success modal on first sign-up
                if (!hasShownSignupModalRef.current) {
                  hasShownSignupModalRef.current = true;
                  showModal({
                    type: 'signup-success',
                    data: { amount: '5' },
                  });
                }

                if (!isResolved) {
                  isResolved = true;
                  resolve(true);
                }
                return true;
              } catch (error) {
                setError(getErrorMessage(error));
                if (!isResolved) {
                  isResolved = true;
                  resolve(false);
                }
                return false;
              }
            };

            const handleClose = () => {
              if (!isResolved) {
                isResolved = true;
                setAuthError('TOTP setup cancelled');
                resolve(false);
              }
            };

            // Show the TOTP setup modal
            showModal({
              type: 'totp-setup',
              data: {
                qrCode: totpSetup.qrCode,
                manualEntryKey: totpSetup.manualEntryKey,
                onVerify: handleVerify,
                onClose: handleClose,
              },
            });
          });
        }

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

        // Parse JSON only once to avoid multiple async operations
        const registrationData = (await registrationResponse.json()) as
          | {
              options: PublicKeyCredentialCreationOptionsJSON;
              userId: number;
            }
          | { message: string };

        // Check for errors after parsing
        if (!registrationResponse.ok || 'message' in registrationData) {
          const errorMessage =
            'message' in registrationData
              ? registrationData.message
              : `HTTP ${registrationResponse.status}`;
          setError(errorMessage);
          return false;
        }

        // Step 2: Create credential with authenticator using SimpleWebAuthn
        // This must happen immediately after the single async fetch operation
        const credentialForServer = await startRegistration({
          optionsJSON: registrationData.options,
          useAutoRegister: true,
        });

        // Step 3: Complete registration
        // After startRegistration, we can make additional async calls
        const result: WebAuthnRegistrationResponse =
          await authService.completeWebAuthnRegistration(
            registrationData.userId,
            credentialForServer
          );

        if (result.access_token) {
          localStorageUtil.setItem(storageName.AUTH_TOKEN, result.access_token);
        }

        // Step 4: Get profile
        const profile = await authService.getProfile();

        if (!profile) {
          setAuthError('Failed to fetch user profile');
          return false;
        }

        hasConnectedOnceRef.current = true;

        // Update React Query cache
        queryClient.setQueryData(authQueryKeys.auth.profile, profile);
        setError('');

        // Show sign-up success modal on first sign-up
        if (!hasShownSignupModalRef.current) {
          hasShownSignupModalRef.current = true;
          showModal({
            type: 'signup-success',
            data: { amount: '5' },
          });
        }

        return true;
      } catch (error) {
        // Clean up any partial authentication state
        localStorageUtil.deleteItem(storageName.AUTH_TOKEN);
        queryClient.setQueryData(authQueryKeys.auth.profile, null);

        if (isMountedRef.current) {
          console.log('getErrorMessage(error)', getErrorMessage(error));
          setError(getErrorMessage(error));
          hasConnectedOnceRef.current = false;
        }

        return false;
      } finally {
        if (isMountedRef.current) setIsConnecting(false);
        authInProgressRef.current = false;
      }
    },
    [setError, showModal, queryClient]
  );

  const signIn = useCallback(
    async ({ referrer, hashTag }: SignInParams): Promise<boolean> => {
      const trimmed = hashTag?.trim?.() ?? '';
      if (!trimmed) {
        setAuthError('Tag name is required');
        return false;
      }
      if (trimmed.length < 3) {
        setAuthError('Tag name must be at least 3 characters');
        return false;
      }
      setIsConnecting(true);
      authInProgressRef.current = true;

      try {
        // Check if user agent is Linux - use TOTP instead of WebAuthn
        if (isLinuxUserAgent()) {
          // Show TOTP code modal and wait for submission
          return new Promise<boolean>(resolve => {
            let isResolved = false;

            const handleSubmit = async (
              code: string
            ): Promise<{ success?: boolean; error?: string }> => {
              try {
                // Authenticate with TOTP
                const result = await authService.authenticateTotp({
                  tagName: trimmed,
                  code,
                  referrer,
                });

                if (!result.access_token) {
                  const message = 'No access token received';
                  setAuthError(message);
                  if (!isResolved) {
                    isResolved = true;
                    resolve(false);
                  }
                  return { error: message };
                }

                localStorageUtil.setItem(
                  storageName.AUTH_TOKEN,
                  result.access_token
                );

                // Get profile
                const profile = await authService.getProfile();

                if (!profile) {
                  const message = 'Failed to fetch user profile';
                  setAuthError(message);
                  if (!isResolved) {
                    isResolved = true;
                    resolve(false);
                  }
                  return { error: message };
                }

                hasConnectedOnceRef.current = true;

                // Update React Query cache
                queryClient.setQueryData(authQueryKeys.auth.profile, profile);
                setError('');

                if (!isResolved) {
                  isResolved = true;
                  resolve(true);
                }
                return { success: true };
              } catch (error) {
                const message = getErrorMessage(error);
                setError(message);
                if (!isResolved) {
                  isResolved = true;
                  resolve(false);
                }
                return { error: message };
              }
            };

            const handleClose = () => {
              if (!isResolved) {
                isResolved = true;
                setAuthError('Sign in cancelled');
                resolve(false);
              }
            };

            // Show the TOTP code modal
            showModal({
              type: 'totp-code',
              data: {
                tagName: trimmed,
                onSubmit: handleSubmit,
                onClose: handleClose,
              },
            });
          });
        }

        // WebAuthn flow for non-Linux user agents
        // Step 1: Start WebAuthn authentication
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
            body: JSON.stringify({ referrer, hashTag }),
          }
        );

        const authenticationData = (await authenticationResponse.json()) as
          | PublicKeyCredentialRequestOptionsJSON
          | { message: string };

        if (!authenticationResponse.ok || 'message' in authenticationData) {
          const errorMessage =
            'message' in authenticationData
              ? authenticationData.message
              : `HTTP ${authenticationResponse.status}`;
          setError(errorMessage);
          return false;
        }

        // Step 2: Get credential with browser autofill support
        const credentialForServer = await startAuthentication({
          optionsJSON: authenticationData,
          useBrowserAutofill: true,
        });

        // Step 3: Complete authentication
        const result = await authService.completeWebAuthnAuthentication(
          hashTag,
          credentialForServer
        );

        if (!result.access_token) {
          setAuthError('No access token received');
          return false;
        }

        localStorageUtil.setItem(storageName.AUTH_TOKEN, result.access_token);

        // Step 4: Get profile
        const profile = await authService.getProfile();

        if (!profile) {
          setAuthError('Failed to fetch user profile');
          return false;
        }

        hasConnectedOnceRef.current = true;

        // Update React Query cache
        queryClient.setQueryData(authQueryKeys.auth.profile, profile);
        setError('');

        return true;
      } catch (error) {
        setError(getErrorMessage(error));

        localStorageUtil.deleteItem(storageName.AUTH_TOKEN);
        queryClient.setQueryData(authQueryKeys.auth.profile, null);
        hasConnectedOnceRef.current = false;
        return false;
      } finally {
        if (isMountedRef.current) setIsConnecting(false);
        authInProgressRef.current = false;
      }
    },
    [queryClient, setError, showModal]
  );

  const disconnect = useCallback(async () => {
    try {
      // Cancel any in-progress authentication
      authInProgressRef.current = false;
      hasConnectedOnceRef.current = false;

      // Sign out from auth service
      authService.signOut();

      // Clear React Query cache
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.auth.profile,
      });
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.auth.balance(),
      });

      // Clear local state
      if (isMountedRef.current) {
        clearError();
      }
    } catch (error) {
      console.error('Disconnect failed:', error);
      if (isMountedRef.current) setError(getErrorMessage(error));
    }
  }, [clearError, setError, queryClient]);

  // Set auth error from profile query
  useEffect(() => {
    if (profileError) {
      setError(getErrorMessage(profileError));
    }
  }, [profileError, setError]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initialize auth on mount - no longer needed as React Query handles this
  useEffect(() => {
    if (authInitializedRef.current) return;
    authInitializedRef.current = true;

    // React Query will automatically fetch the profile on mount
    // so we don't need the manual initialization anymore
  }, []);

  // Derived loading state
  const loading = profileLoading;

  return useMemo(
    (): WalletContextType => ({
      isConnected: Boolean(authUser),
      accountAddress: authUser?.walletAddress,
      balanceState: balanceState ?? null,
      isCorrectNetwork: true,
      walletInfo: undefined,
      authUser: authUser ?? null,
      isAuthenticated: Boolean(authUser),

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
