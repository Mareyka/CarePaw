import { useEffect, useState } from "react";
import { Location } from "@/components/location-selector";
import { locationService } from "@/api/locationService";

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoading(true);
        const data = await locationService.getAll();
        setLocations(data);
      } catch (err: any) {
        console.error("Ошибка загрузки локаций:", err);
        setError(err.message || "Не удалось загрузить локации");
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  return { locations, isLoading, error };
};