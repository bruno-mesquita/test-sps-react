import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { UserAttachment } from '@/types';
import { userKeys } from '@/queries/users';

export function useDeleteAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, attachmentId }: { userId: number; attachmentId: number }) =>
      api.delete(`/users/${userId}/attachments/${attachmentId}`),
    onMutate: async ({ userId, attachmentId }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.attachments(userId) });
      const previous = queryClient.getQueryData<UserAttachment[]>(userKeys.attachments(userId));
      queryClient.setQueryData<UserAttachment[]>(userKeys.attachments(userId), (old) =>
        old?.filter((a) => a.id !== attachmentId) ?? []
      );
      return { previous };
    },
    onError: (_err, { userId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(userKeys.attachments(userId), context.previous);
      }
    },
    onSettled: (_data, _err, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.attachments(userId) });
    },
  });
}
