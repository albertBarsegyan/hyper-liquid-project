import { useQuery } from '@tanstack/react-query';
import type { TransactionQueryParams } from '@/modules/transactions/types';
import { transactionService } from '@/modules/transactions/service';

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: TransactionQueryParams) =>
    [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (hash: string) => [...transactionKeys.details(), hash] as const,
};

export function useTransactions(
  filters: TransactionQueryParams = {},
  enabled?: boolean
) {
  return useQuery({
    enabled,
    queryKey: transactionKeys.list({ ...filters }),
    queryFn: async () => {
      return await transactionService.getTransactions(filters);
    },
    staleTime: 30000,
    gcTime: 300000,
    select: response => response?.data,
  });
}
