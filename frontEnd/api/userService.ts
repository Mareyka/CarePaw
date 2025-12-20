import { API_URL } from "@/api/service";

export interface User {
  id: number;
  username: string;
  role: string;
  email: string;
  description?: string;
  photo?: string | null;
  createdAt: string;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error(`Ошибка при загрузке пользователей: ${response.status}`);
    }
    return await response.json();
  },

  async getRandom(excludeId: number, limit = 5): Promise<User[]> {
    const response = await fetch(
      `${API_URL}/users/random?excludeId=${excludeId}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error(`Ошибка при загрузке случайных пользователей: ${response.status}`);
    }
    return await response.json();
  },

  async search(query: string, excludeId?: number): Promise<User[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    let url = `${API_URL}/users/search?query=${encodeURIComponent(query.trim())}`;
    if (excludeId) {
      url += `&excludeId=${excludeId}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка при поиске пользователей: ${response.status}`);
    }
    return await response.json();
  },
};