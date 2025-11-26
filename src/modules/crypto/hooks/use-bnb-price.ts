import { useQuery } from '@tanstack/react-query';
import { fetchBnbPrice } from '../services/price.service';

// Query keys for BNB price
export const bnbPriceQueryKeys = {
  all: ['bnb-price'] as const,
  current: () => [...bnbPriceQueryKeys.all, 'current'] as const,
};

/**
 * Hook to fetch the current BNB price in USD
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useBnbPrice = (enabled: boolean = true) => {
  return useQuery({
    queryKey: bnbPriceQueryKeys.current(),
    queryFn: async () => {
      return await fetchBnbPrice();
    },
    enabled,
    staleTime: 60000, // 1 minute - prices don't change that frequently
    gcTime: 300000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
};

