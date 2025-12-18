import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export type PetEventType = 'medical' | 'shop' | 'beauty' | 'other';

export type PetEvent = {
  id: number;
  title: string;
  description?: string | null;
  eventDate: string; 
  eventType: PetEventType | string;
};

export type CreatePetEventInput = {
  title: string;
  description?: string;
  eventType: PetEventType;
  eventDate: string;
};

export async function getEventsByPetId(petId: number | string): Promise<PetEvent[]> {
  const response = await axios.get(`${API_URL}/events/pet/${petId}`);
  return Array.isArray(response.data) ? response.data : [];
}


// POST /api/events?petId=123 with JSON body { title, description, eventType, eventDate }
export async function createPetEvent(
  petId: number | string,
  event: CreatePetEventInput
): Promise<PetEvent> {
  const response = await axios.post(`${API_URL}/events`, event, { params: { petId } });
  return response.data;
}

