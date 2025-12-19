import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { apiService, API_URL, API_URL_WITHOUT_API } from "@/api/service";
import { ChatMessage } from "@/types/ChatMessage";

export const useChat = (recipientId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatName, setChatName] = useState<string | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  const currentUser = apiService.getCurrentUserFromMemory();
  const senderId = currentUser?.id;

  useEffect(() => {
    if (!senderId || !recipientId) return;

    let stompClient: Client;

    const loadHistory = async () => {
      try {
        const resp = await fetch(
          `${API_URL}/chat/history?userAId=${senderId}&userBId=${recipientId}`
        );
        const raw: ChatMessage[] = await resp.json();
        const normalized = raw.map((m) => ({
          messageId: m.messageId ?? Date.now(),
          chatId: m.chatId,
          senderId: m.senderId,
          recipientId: m.recipientId,
          content: m.content ?? "",
          text: m.text ?? m.content ?? "",
          timestamp: m.timestamp ?? new Date().toISOString(),
          isOwn: m.senderId === senderId,
        }));
        setMessages(
          normalized.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        );
      } catch (e) {
        console.error("Ошибка загрузки истории:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();

    const socketFactory = () =>
      new SockJS(`${API_URL_WITHOUT_API}/ws-chat`) as any;

    stompClient = new Client({
      webSocketFactory: socketFactory,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to chat WS");
        stompClient.subscribe(`/topic/chat.broadcast`, (payload) => {
          const msg: ChatMessage = JSON.parse(payload.body);
          const formatted: ChatMessage = {
            messageId: msg.messageId ?? Date.now(),
            chatId: msg.chatId,
            senderId: msg.senderId,
            recipientId: msg.recipientId,
            content: msg.content ?? "",
            text: msg.text ?? msg.content ?? "",
            timestamp: msg.timestamp ?? new Date().toISOString(),
            isOwn: msg.senderId === senderId,
          };
          if (
            (formatted.senderId === senderId &&
              formatted.recipientId.toString() === recipientId) ||
            (formatted.recipientId === senderId &&
              formatted.senderId.toString() === recipientId)
          ) {
            setMessages((prev) => [...prev, formatted]);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Broker error", frame.headers["message"]);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      console.log("WS disconnected");
      stompClient.deactivate();
    };
  }, [senderId, recipientId]);

  const sendMessage = (text: string) => {
    const client = stompClientRef.current;
    if (!client || !client.connected) {
      console.warn("STOMP client not connected");
      return;
    }
    if (!text.trim()) return;

    if (senderId === Number(recipientId)) {
         console.warn("Нельзя отправить сообщение самому себе");
         return;
       }

    const msg: ChatMessage = {
      messageId: Date.now().toString(),
      chatId: "",
      senderId: senderId ?? 0,
      recipientId: Number(recipientId),
      content: text,
      text,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, msg]);

    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        senderId,
        recipientId: Number(recipientId),
        content: text,
      }),
    });
  };

  return {
    messages,
    chatName,
    isLoading,
    sendMessage,
  };
};