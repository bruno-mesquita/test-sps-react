import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, UserAttachment } from '@/types';
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

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.put<User>(`/users/${id}`, formData),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/users/${id}`),
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

export function useRemovePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => api.delete(`/users/${userId}/photo`),
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

export function useUploadAttachments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, formData }: { userId: number; formData: FormData }) =>
      api.post(`/users/${userId}/attachments`, formData),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.attachments(userId) });
    },
  });
}
