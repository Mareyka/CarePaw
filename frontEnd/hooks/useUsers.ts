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

export const useSearchUsers = (query: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query || query.trim().length === 0) {
        setUsers([]);
        setError(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const currentUser = apiService.getCurrentUserFromMemory();
        const excludeId = currentUser?.id;
        console.log("Searching with excludeId:", excludeId, "currentUser:", currentUser);
        const data = await userService.search(query, excludeId);
        console.log("Search results:", data.map(u => ({ id: u.id, username: u.username })));
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { users, isLoading, error };
};