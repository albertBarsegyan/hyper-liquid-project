import ky from 'ky';
import { responseMessage } from '@/modules/shared/constants/app-messages.ts';
import { getErrorMessage } from '@/modules/shared/utils/error.ts';
import { localStorageUtil } from '@/modules/shared/utils/local-storage.ts';
import { storageName } from '@/modules/shared/constants/storage-name.ts';

export const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL as string;

export const mainApiInstance = ky.create({
  prefixUrl: APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Connection: 'keep-alive',
  },
  timeout: 5000,
  retry: 2,
  hooks: {
    beforeRequest: [
      request => {
        const token = localStorageUtil.getItem(storageName.AUTH_TOKEN);

        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
    beforeError: [
      async error => {
        const { response } = error;

        if (!navigator.onLine || error.name === 'TypeError') {
          error.message = 'No internet connection. Please check your network.';
          return error;
        }

        if (response?.body) {
          try {
            const body = (await response.clone().json()) as { message: string };
            error.message = (body?.message ??
              `HTTP ${response.status}`) as string;
          } catch {
            error.message = responseMessage.WENT_WRONG;
          }
        }

        error.message = getErrorMessage(error.message);

        return error;
      },
    ],
  },
});
