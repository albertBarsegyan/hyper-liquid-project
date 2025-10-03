import { responseMessage } from '@/modules/shared/constants/app-messages.ts';

export const getErrorMessage = (error?: unknown): string => {
  if (!error) return responseMessage.WENT_WRONG;

  return typeof error === 'string'
    ? error
    : (error as Error)?.message || responseMessage.WENT_WRONG;
};
