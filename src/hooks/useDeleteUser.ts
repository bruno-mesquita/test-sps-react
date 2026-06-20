import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';
import { userKeys } from '@/queries/users';

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });
      const previous = queryClient.getQueryData<User[]>(userKeys.lists());
      queryClient.setQueryData<User[]>(userKeys.lists(), (old) =>
        old?.filter((u) => u.id !== id) ?? []
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(userKeys.lists(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
