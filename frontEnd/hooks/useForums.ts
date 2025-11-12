import { useEffect, useState } from "react";
import { ForumCategory, Forum } from "@/types/forum";

const fetchForumCategories = async (): Promise<ForumCategory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          title: "Дрессировка",
          forums: [
            { id: "1", title: "Когда начинать дресс...", lastMessage: "Последнее сообщение" },
            { id: "2", title: "Основы дрессировки", lastMessage: "Последнее сообщение" },
            { id: "3", title: "Техники дрессировки", lastMessage: "Последнее сообщение" },
          ],
        },
        {
          id: "2",
          title: "Вакцинация",
          forums: [
            { id: "4", title: "Стоит ли вакцинировать", lastMessage: "Последнее сообщение" },
            { id: "5", title: "Прививка от клещей", lastMessage: "Последнее сообщение" },
          ],
        },
      ]);
    }, 100);
  });
};

const fetchChats = async (): Promise<Forum[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        new Array(10).fill(0).map((_, i) => ({
          id: `chat-${i}`,
          title: `Чаты-${i}`,
          lastMessage: "Последнее сообщение",
        }))
      );
    }, 100);
  });
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

