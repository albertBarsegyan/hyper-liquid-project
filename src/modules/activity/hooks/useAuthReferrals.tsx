import { useQuery } from '@tanstack/react-query';
import { authService } from '@/modules/auth/services/auth.service';

// Query keys for auth referral endpoints
export const AUTH_REFERRAL_QUERY_KEYS = {
  referrals: ['auth', 'referrals'] as const,
  referrers: ['auth', 'referrers'] as const,
};

/**
 * Hook to get referral statistics for the authenticated user
 */
export const useAuthReferrals = () => {
  return useQuery({
    queryKey: AUTH_REFERRAL_QUERY_KEYS.referrals,
    queryFn: authService.getReferrals,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to get referrer statistics for the authenticated user
 */
export const useAuthReferrers = () => {
  return useQuery({
    queryKey: AUTH_REFERRAL_QUERY_KEYS.referrers,
    queryFn: authService.getReferrers,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};
