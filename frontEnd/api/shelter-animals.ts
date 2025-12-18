import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export type ShelterAnimal = {
  id: number;
  name: string;
  species?: string | null;
  breed?: string | null;
  age?: number | null;
  description?: string | null;
  photoUrl?: string | null;
  shelterAddress?: string | null;
  shelterEmail?: string | null;
  shelterPhone?: string | null;
  shelterId?: number | null;
  adopted?: boolean;
};

export type CreateShelterAnimalInput = {
  name: string;
  species?: string;
  breed?: string;
  age?: number;
  description?: string;
  photoUrl?: string | null;
  shelterAddress?: string;
  shelterEmail?: string;
  shelterPhone?: string;
  shelterId: number;
  adopted?: boolean;
};

export function resolveShelterAnimalPhotoUrl(photoUrl?: string | null): string | null {
  if (!photoUrl) return null;
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) return photoUrl;
  return null;
}

export async function getAllShelterAnimals(): Promise<ShelterAnimal[]> {
  const response = await axios.get(`${API_URL}/shelter-animals`);
  return Array.isArray(response.data) ? response.data : [];
}

export async function getShelterAnimalById(id: number | string): Promise<ShelterAnimal> {
  const response = await axios.get(`${API_URL}/shelter-animals/${id}`);
  return response.data;
}

export async function createShelterAnimal(animal: CreateShelterAnimalInput): Promise<ShelterAnimal> {
  const response = await axios.post(`${API_URL}/shelter-animals`, animal);
  return response.data;
}

