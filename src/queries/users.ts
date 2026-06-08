import api from '@/lib/api';
import { User, UserAttachment } from '@/types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
  attachments: (id: number) => [...userKeys.all, id, 'attachments'] as const,
};

export async function fetchUsers(): Promise<User[]> {
  const res = await api.get<User[]>('/users');
  const users = res.data;
  const attachmentLists = await Promise.all(
    users.map((u) =>
      api.get<UserAttachment[]>(`/users/${u.id}/attachments`)
        .then((r) => r.data)
        .catch(() => [] as UserAttachment[])
    )
  );
  return users.map((u, i) => ({ ...u, attachments: attachmentLists[i] }));
}

export async function fetchUser(id: number): Promise<User> {
  const res = await api.get<User>(`/users/${id}`);
  return res.data;
}

export async function fetchUserAttachments(id: number): Promise<UserAttachment[]> {
  const res = await api.get<UserAttachment[]>(`/users/${id}/attachments`);
  return res.data;
}
