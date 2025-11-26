import { mainApiInstance } from '@/configs/api/main-instance.ts';
import type {
  ConvertBnbDto,
  GetUsersParams,
  SendCoinRequest,
  UserResponseDto,
  UsersPaginatedResponse,
} from '@/modules/users/types/user.ts';

export const usersService = {
  /**
   * Get paginated users
   */
  getUsers: async ({
    page = 1,
    limit = 10,
    hashTag,
    minPoints,
    maxPoints,
    createdAfter,
    createdBefore,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }: GetUsersParams = {}): Promise<UsersPaginatedResponse> => {
    const response = await mainApiInstance.get('users', {
      searchParams: {
        page,
        limit,
        hashTag,
        minPoints,
        maxPoints,
        createdAfter,
        createdBefore,
        sortBy,
        sortOrder,
      },
    });

    return response.json<UsersPaginatedResponse>();
  },

  /**
   * Get single user by id
   */
  getUserById: async (id: string | number): Promise<UserResponseDto> => {
    const response = await mainApiInstance.get(`users/${id}`);
    return response.json<UserResponseDto>();
  },

  /**
   * Update user (example with partial user fields)
   */
  updateUser: async (
    id: string | number,
    data: Partial<UserResponseDto>
  ): Promise<UserResponseDto> => {
    const response = await mainApiInstance.patch(`users/${id}`, {
      json: data,
    });

    return response.json<UserResponseDto>();
  },
  sendCoins: async (data: SendCoinRequest): Promise<{ status: string }> => {
    const response = await mainApiInstance.post('coins/transfer', {
      json: data,
    });
    return response.json<{ status: string }>();
  },

  /**
   * Convert BNB to Dliqd
   */

  convertBnb: async (
    data: ConvertBnbDto
  ): Promise<{
    transactionHash: string;
    dliqdAmount: string;
    bnbAmount: string;
  }> => {
    const response = await mainApiInstance.post('coins/convert', {
      json: data,
    });
    return response.json<{
      transactionHash: string;
      dliqdAmount: string;
      bnbAmount: string;
    }>();
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string | number): Promise<{ success: boolean }> => {
    const response = await mainApiInstance.delete(`users/${id}`);
    return response.json<{ success: boolean }>();
  },
};
