import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';
import { userKeys } from '@/queries/users';
import { UserFormValues } from '@/components/users/UserForm';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, email, password, isAdmin, photo, newAttachments, removeAttachmentIds }: UserFormValues & { id: string; removeAttachmentIds: string[] }) => {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('type', isAdmin ? 'admin' : 'user');
      if (password) formData.append('password', password);
      if (photo) formData.append('photo', photo);
      newAttachments.forEach((file) => formData.append('attachments', file));
      removeAttachmentIds.forEach((id) => formData.append('removeAttachmentIds', id));
      return api.put<User>(`/users/${id}`, formData);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}
