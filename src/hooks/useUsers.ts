import { useQuery } from '@tanstack/react-query';
import { userKeys, fetchUsers, fetchUser } from '@/queries/users';

export function useUsers() {
  return useQuery({ queryKey: userKeys.lists(), queryFn: fetchUsers });
}

export function useUser(userId: number) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
    enabled: !isNaN(userId),
  });
}
