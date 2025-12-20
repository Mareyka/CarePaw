import { useEffect, useState, useCallback } from "react";
import { ChatSummary } from "@/types/forum";
import { apiService, API_URL, API_URL_WITHOUT_API } from "@/api/service";

const getAvatarUrl = (photo?: string | null): string | undefined => {
  if (!photo || photo.trim() === '') {
    return undefined;
  }
  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo;
  }
  return `${API_URL_WITHOUT_API}/api/images/avatars/${photo}`;
};

const fetchChats = async (): Promise<ChatSummary[]> => {
  try {
    const currentUser = apiService.getCurrentUserFromMemory();
    if (!currentUser) throw new Error("Пользователь не авторизован");

    const resp = await fetch(`${API_URL}/chat/user/${currentUser.id}`);
    if (!resp.ok) throw new Error(`Ошибка сервера: ${resp.status}`);
    const data = await resp.json();

    const chats: ChatSummary[] = data.map((c: any) => ({
      id: String(c.id),
      title: c.title || "Без имени",
      lastMessage: c.lastMessage || "",
      avatarUri: getAvatarUrl(c.avatarUri),
      recipientId: c.recipientId
    }));

    return chats;
  } catch (error) {
    console.error("Ошибка загрузки чатов:", error);
    return [];
  }
};

export const useForums = () => {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchChats();
    setChats(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    chats,
    isLoading,
    refreshChats: loadData,
  };
};