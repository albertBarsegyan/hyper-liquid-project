import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { referralService } from '@/modules/referral/services/referral.service';
import type {
  ReferralUser,
  ReferralStats,
  ReferralCodeResponse,
  ReferralHistory,
  ReferralDepositParams,
  ReferralBalanceParams,
  ReferralBonusParams,
} from '@/modules/referral/types';

// Query keys
export const REFERRAL_QUERY_KEYS = {
  profile: ['referral', 'profile'] as const,
  stats: ['referral', 'stats'] as const,
  code: ['referral', 'code'] as const,
  history: ['referral', 'history'] as const,
  leaderboard: ['referral', 'leaderboard'] as const,
};

/**
 * Hook to get user's referral profile
 */
export const useReferralProfile = () => {
  return useQuery({
    queryKey: REFERRAL_QUERY_KEYS.profile,
    queryFn: () => referralService.getReferralProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get user's referral statistics
 */
export const useReferralStats = () => {
  return useQuery({
    queryKey: REFERRAL_QUERY_KEYS.stats,
    queryFn: () => referralService.getReferralStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get user's referral code
 */
export const useReferralCode = () => {
  return useQuery({
    queryKey: REFERRAL_QUERY_KEYS.code,
    queryFn: () => referralService.getReferralCode(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get referral history
 */
export const useReferralHistory = () => {
  return useQuery({
    queryKey: REFERRAL_QUERY_KEYS.history,
    queryFn: () => referralService.getReferralHistory(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get referral leaderboard
 */
export const useReferralLeaderboard = (limit: number = 10) => {
  return useQuery({
    queryKey: [...REFERRAL_QUERY_KEYS.leaderboard, limit],
    queryFn: () => referralService.getReferralLeaderboard(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to award deposit points
 */
export const useAwardDepositPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReferralDepositParams) =>
      referralService.awardDepositPoints(params),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.profile });
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.stats });
    },
  });
};

/**
 * Hook to award balance milestone points
 */
export const useAwardBalanceMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReferralBalanceParams) =>
      referralService.awardBalanceMilestone(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.profile });
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.stats });
    },
  });
};

/**
 * Hook to award referral bonus points
 */
export const useAwardReferralBonus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReferralBonusParams) =>
      referralService.awardReferralBonus(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.profile });
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.history });
    },
  });
};

/**
 * Hook to validate referral code
 */
export const useValidateReferralCode = () => {
  return useMutation({
    mutationFn: (code: string) => referralService.validateReferralCode(code),
  });
};

/**
 * Hook to apply referral code
 */
export const useApplyReferralCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => referralService.applyReferralCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.profile });
    },
  });
};

/**
 * Hook to track referral conversion
 */
export const useTrackReferralConversion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ referralId, action, value }: { referralId: string; action: string; value?: number }) =>
      referralService.trackReferralConversion(referralId, action, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.history });
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.stats });
    },
  });
};

/**
 * Custom hook for referral logic management
 */
export const useReferralLogic = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const awardDepositPointsMutation = useAwardDepositPoints();
  const awardBalanceMilestoneMutation = useAwardBalanceMilestone();
  const awardReferralBonusMutation = useAwardReferralBonus();

  const awardDepositPoints = useCallback(async (userId: string, depositedUsd: number) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await awardDepositPointsMutation.mutateAsync({
        userId,
        depositedUsd,
      });
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [awardDepositPointsMutation, isProcessing]);

  const awardBalanceMilestone = useCallback(async (userId: string, currentBalanceUsd: number) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await awardBalanceMilestoneMutation.mutateAsync({
        userId,
        currentBalanceUsd,
      });
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [awardBalanceMilestoneMutation, isProcessing]);

  const awardReferralBonus = useCallback(async (userId: string, totalSuccessfulReferrals: number) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await awardReferralBonusMutation.mutateAsync({
        userId,
        totalSuccessfulReferrals,
      });
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [awardReferralBonusMutation, isProcessing]);

  return {
    awardDepositPoints,
    awardBalanceMilestone,
    awardReferralBonus,
    isProcessing,
    isLoading: awardDepositPointsMutation.isPending || awardBalanceMilestoneMutation.isPending || awardReferralBonusMutation.isPending,
    error: awardDepositPointsMutation.error || awardBalanceMilestoneMutation.error || awardReferralBonusMutation.error,
  };
};
