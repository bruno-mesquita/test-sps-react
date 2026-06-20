import api from '@/lib/api';
import { User, UserAttachment } from '@/types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
  attachments: (id: string) => [...userKeys.all, id, 'attachments'] as const,
};

export type UserWithAttachmentsCount = User & { attachmentCount: number };

type UserWithAttachments = User & { attachments: UserAttachment[] };

export async function fetchUsers(): Promise<UserWithAttachmentsCount[]> {
  const res = await api.get<UserWithAttachmentsCount[]>('/users');
  const users = res.data;
  return users;
}

export async function fetchUser(id: string): Promise<UserWithAttachments> {
  const res = await api.get<UserWithAttachments>(`/users/${id}`);
  return res.data;
}

export async function fetchUserAttachments(id: string): Promise<UserAttachment[]> {
  const res = await api.get<UserAttachment[]>(`/users/${id}/attachments`);
  return res.data;
}
