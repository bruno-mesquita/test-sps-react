import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';
import { userKeys } from '@/queries/users';
import { UserFormValues } from '@/components/users/UserForm';

type UpdateUserInput = { id: string  } & Omit<UserFormValues, 'newAttachments'>;

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, email, password, isAdmin, photo }: UpdateUserInput) => {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('type', isAdmin ? 'admin' : 'user');
      if (password) formData.append('password', password);
      if (photo) formData.append('photo', photo);
      return api.put<User>(`/users/${id}`, formData);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}
