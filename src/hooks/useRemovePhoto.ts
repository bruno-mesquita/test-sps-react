import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';
import { userKeys } from '@/queries/users';

export function useRemovePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.delete(`/users/${userId}/photo`),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });
      const previous = queryClient.getQueryData<User>(userKeys.detail(userId));
      queryClient.setQueryData<User>(userKeys.detail(userId), (old) =>
        old ? { ...old, originalUrl: undefined, previewUrl: undefined } : old
      );
      return { previous };
    },
    onError: (_err, userId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(userKeys.detail(userId), context.previous);
      }
    },
    onSettled: (_data, _err, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
}
