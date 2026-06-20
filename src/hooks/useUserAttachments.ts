import { useQuery } from '@tanstack/react-query';
import { userKeys, fetchUserAttachments } from '@/queries/users';

export function useUserAttachments(userId: string) {
  return useQuery({
    queryKey: userKeys.attachments(userId),
    queryFn: () => fetchUserAttachments(userId),
    enabled: !userId,
  });
}
