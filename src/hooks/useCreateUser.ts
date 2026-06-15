import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';
import { userKeys } from '@/queries/users';
import { UserFormValues } from '@/components/users/UserForm';

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, email, password, isAdmin, photo, newAttachments }: UserFormValues) => {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('type', isAdmin ? 'admin' : 'user');
      formData.append('password', password);
      if (photo) formData.append('photo', photo);
      newAttachments.forEach((file) => formData.append('attachments', file));
      return api.post<User>('/users', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
