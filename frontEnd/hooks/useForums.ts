import { useEffect, useState } from "react";
import { ForumCategory, Forum } from "@/types/forum";
import { apiService, API_URL } from "@/api/service";

const fetchForumCategories = async (): Promise<ForumCategory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          title: "Дрессировка",
          forums: [
            { id: "1", title: "Когда начинать дресс...", lastMessage: "Последнее сообщение", recipientId: 1 },
            { id: "2", title: "Основы дрессировки", lastMessage: "Последнее сообщение", recipientId: 2 },
            { id: "3", title: "Техники дрессировки", lastMessage: "Последнее сообщение", recipientId: 3 },
          ],
        },
        {
          id: "2",
          title: "Вакцинация",
          forums: [
            { id: "4", title: "Стоит ли вакцинировать", lastMessage: "Последнее сообщение", recipientId: 3  },
            { id: "5", title: "Прививка от клещей", lastMessage: "Последнее сообщение", recipientId: 3  },
          ],
        },
      ]);
    }, 100);
  });
};

const fetchChats = async (): Promise<Forum[]> => {
  try {
    const currentUser = apiService.getCurrentUserFromMemory();
    if (!currentUser) throw new Error("Пользователь не авторизован");

    const resp = await fetch(`${API_URL}/chat/user/${currentUser.id}`);
    if (!resp.ok) throw new Error(`Ошибка сервера: ${resp.status}`);
    const data = await resp.json();

    // адаптируем под тип Forum
    const chats: Forum[] = data.map((c: any) => ({
      id: String(c.id),
      title: c.title || "Без имени",
      lastMessage: c.lastMessage || "",
      avatarUri: c.avatarUri || undefined,
      recipientId: c.recipientId
    }));

    return chats;
  } catch (error) {
    console.error("Ошибка загрузки чатов:", error);
    return [];
  }
};

export const useForums = (mode: "forums" | "chats") => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [chats, setChats] = useState<Forum[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (mode === "forums") {
        const data = await fetchForumCategories();
        setCategories(data);
      } else {
        const data = await fetchChats();
        setChats(data);
        console.log(data);
      }
      setIsLoading(false);
    };

    loadData();
  }, [mode]);

  return {
    categories,
    chats,
    isLoading,
  };
};