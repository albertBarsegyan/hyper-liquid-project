import type {
  TransactionQueryParams,
  TransactionResponse,
} from '@/modules/transactions/types';
import { toQueryString } from '@/modules/shared/utils/url.ts';
import { mainApiInstance } from '@/configs/api/main-instance.ts';
import type { ApiResponse } from '@/modules/shared/type/api.ts';

export const transactionService = {
  getTransactions: async (
    params: TransactionQueryParams
  ): Promise<ApiResponse<TransactionResponse>> => {
    const query = toQueryString<TransactionQueryParams>(params);
    const response = await mainApiInstance.get(`transactions/proxy${query}`);
    return response.json();
  },
};
