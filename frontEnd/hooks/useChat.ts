import { useEffect, useState } from "react";
import { Chat, ChatMessage } from "@/types/chat";

const fetchChatData = async (chatId: string): Promise<Chat> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: chatId,
        name: "Врач Алена",
        messages: [
          {
            id: "1",
            text: "Здравствуйте, мы к вам записаны на 13:20. Нам с собой что-то нужно брать?",
            timestamp: new Date("2025-11-12T11:49:00"),
            isOwn: true,
          },
          {
            id: "2",
            text: "Здравствуйте",
            timestamp: new Date("2025-11-12T11:50:00"),
            isOwn: false,
            senderName: "Врач Алена",
          },
          {
            id: "3",
            text: "Да, нужны пеленка, паспорт животного и лакомство для вашего питомца ))",
            timestamp: new Date("2025-11-12T11:51:00"),
            isOwn: false,
            senderName: "Врач Алена",
          },
        ],
      });
    }, 100);
  });
};

export const useChat = (chatId: string | undefined) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatName, setChatName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChat = async () => {
      if (chatId) {
        setIsLoading(true);
        const chatData = await fetchChatData(chatId);
        setMessages(chatData.messages);
        setChatName(chatData.name);
        setIsLoading(false);
      }
    };
    loadChat();
  }, [chatId]);

  const sendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return {
    messages,
    chatName,
    isLoading,
    sendMessage,
  };
};

