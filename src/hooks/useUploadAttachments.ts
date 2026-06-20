import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { userKeys } from '@/queries/users';

export function useUploadAttachments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, formData }: { userId: string ; formData: FormData }) =>
      api.post(`/users/${userId}/attachments`, formData),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.attachments(userId) });
    },
  });
}
