import { useEffect, useState } from "react";
import { userService, User } from "@/api/userService";
import { apiService } from "@/api/service";

export const useRandomUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const currentUser = apiService.getCurrentUserFromMemory();
        const excludeId = currentUser?.id || 0;
        const data = await userService.getRandom(excludeId);
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  return { users, isLoading, error };
};