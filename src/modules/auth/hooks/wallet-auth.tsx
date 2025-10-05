import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/modules/auth/services/auth.service.ts';
import { getErrorMessage } from '@/modules/shared/utils/error.ts';
import { localStorageUtil } from '@/modules/shared/utils/local-storage.ts';
import { storageName } from '@/modules/shared/constants/storage-name.ts';

interface AuthUser {
  address: string;
  token: string;
}

interface UseWalletAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authenticate: (address: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
}

export const useWalletAuth = (): UseWalletAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (!localStorageUtil.getItem(storageName.AUTH_USER)) {
        const currentUser = authService.getUser();
        if (currentUser) {
          setUser(currentUser);

          // Verify token with server
          try {
            const isValid = await authService.verifyToken();
            if (!isValid) setUser(null);
          } catch (error) {
            console.error('Token verification failed:', error);
            setUser(null);
          }
        }
      }
    };

    void initializeAuth();
  }, [user]);

  const authenticate = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const authUser = await authService.authenticateWithWallet(address);
      setUser(authUser);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    authService.signOut();
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshAuth = useCallback(async () => {
    if (!user) {
      setUser(null);
      return;
    }

    try {
      const isValid = await authService.verifyToken();
      if (isValid) {
        const currentUser = authService.getUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth refresh failed:', error);
      setUser(null);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    authenticate,
    signOut,
    clearError,
    refreshAuth,
  };
};
