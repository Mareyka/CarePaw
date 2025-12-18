import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = 'http://localhost:8080/api';

export type Pet = {
  id: number;
  name: string;
  species?: string | null;
  breed?: string | null;
  dateOfBirth?: string | null;
  photoUrl?: string | null;
  sterilized?: boolean;
  vaccinated?: boolean;
  dewormed?: boolean;
};

export type CreatePetInput = {
  name: string;
  species?: string;
  breed?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  photoUrl?: string | null;
  sterilized?: boolean;
  vaccinated?: boolean;
  dewormed?: boolean;
};

export type UploadPhotoAsset = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  file?: File | null;
};

export function resolvePetPhotoUrl(photoUrl?: string | null): string | null {
  if (!photoUrl) return null;
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) return photoUrl;
  return `${API_URL}/images/pets/${photoUrl}`;
}

export async function getPetsByUserId(userId: number | string): Promise<Pet[]> {
  const response = await axios.get(`${API_URL}/pets`, { params: { userId } });
  return Array.isArray(response.data) ? response.data : [];
}

export async function getPetById(petId: number | string): Promise<Pet> {
  const response = await axios.get(`${API_URL}/pets/${petId}`);
  return response.data;
}

export async function createPet(userId: number | string, pet: CreatePetInput): Promise<Pet> {
  const response = await axios.post(`${API_URL}/pets`, pet, { params: { userId } });
  return response.data;
}

function guessMimeTypeFromUri(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.heic')) return 'image/heic';
  if (lower.endsWith('.heif')) return 'image/heif';
  if (lower.endsWith('.jfif')) return 'image/jpeg';
  return 'image/jpeg';
}

export async function uploadPetPhoto(petId: number | string, asset: UploadPhotoAsset): Promise<Pet> {
  const form = new FormData();
  const fileName = asset.fileName || asset.uri.split('/').pop() || `pet-${petId}.jpg`;
  const type = asset.mimeType || guessMimeTypeFromUri(asset.uri);

  if (Platform.OS === 'web') {
    const webFile: any = (asset as any).file;
    if (webFile instanceof File) {
      form.append('photo', webFile, webFile.name || fileName);
    } else {
      const blob = await fetch(asset.uri).then((r) => r.blob());
      form.append('photo', blob, fileName);
    }
  } else {
    form.append('photo', { uri: asset.uri, name: fileName, type } as any);
  }

  const response = await fetch(`${API_URL}/pets/${petId}/photo`, {
    method: 'POST',
    body: form as any,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Upload failed (${response.status}): ${text}`);
  }

  return (await response.json()) as Pet;
}
