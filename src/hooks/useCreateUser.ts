import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';
import { userKeys } from '@/queries/users';

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => api.post<User>('/users', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
