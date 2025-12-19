import { API_URL } from "@/api/service";

export interface Location {
  id: string;
  name: string;
}

export const locationService = {
  async getAll(): Promise<Location[]> {
    try {
      const response = await fetch(`${API_URL}/places`);

      if (!response.ok) {
        throw new Error(`Ошибка загрузки локаций: ${response.status}`);
      }

      const data: Location[] = await response.json();
      return data;
    } catch (error: any) {
      console.error("Ошибка при получении локаций:", error);
      throw new Error(error.message || "Не удалось загрузить локации");
    }
  },
};