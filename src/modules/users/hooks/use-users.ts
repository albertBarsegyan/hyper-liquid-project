import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/modules/users/services/service';
import type { GetUsersParams } from '@/modules/users/types/user';

// Query keys for users
export const usersQueryKeys = {
  all: ['users'] as const,
  lists: () => [...usersQueryKeys.all, 'list'] as const,
  list: (params: GetUsersParams) =>
    [...usersQueryKeys.lists(), params] as const,
  detail: (id: string | number) =>
    [...usersQueryKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch users with optional filters
 * @param params - Search parameters for users
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useUsers = (
  params: GetUsersParams = {},
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: async () => {
      return await usersService.getUsers(params);
    },
    enabled: enabled && (params.hashTag ? params.hashTag.length >= 2 : true),
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
};
