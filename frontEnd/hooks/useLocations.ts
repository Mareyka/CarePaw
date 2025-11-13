import { useEffect, useState } from "react";
import { Location } from "@/components/location-selector";

const fetchLocations = async (): Promise<Location[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "minsk", name: "Минск" },
        { id: "bsu", name: "БГУ, Факультет длыфовалдфыовадлоыфвдлофывфывф" },
        { id: "kamenka", name: "Каменка" },
      ]);
    }, 100);
  });
};

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      const data = await fetchLocations();
      setLocations(data);
      setIsLoading(false);
    };

    loadLocations();
  }, []);

  return { locations, isLoading };
};

