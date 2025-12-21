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
    const chatIdRef = { current: null as number | null };
    let subscriptionRef: any = null;

    const subscribeToChat = (client: Client, id: number) => {
      if (subscriptionRef) {
        subscriptionRef.unsubscribe();
      }
      
      const topic = `/topic/chat.${id}`;
      console.log(`Subscribing to ${topic}`);
      
      subscriptionRef = client.subscribe(topic, (payload) => {
        const msg: ChatMessage = JSON.parse(payload.body);
        const formatted: ChatMessage = {
          messageId: msg.messageId?.toString() ?? Date.now().toString(),
          chatId: msg.chatId?.toString() ?? id.toString(),
          senderId: msg.senderId,
          recipientId: msg.recipientId,
          content: msg.content ?? "",
          text: msg.text ?? msg.content ?? "",
          timestamp: msg.timestamp ?? new Date().toISOString(),
          isOwn: msg.senderId === senderId,
        };
        const isCurrentChat = 
          formatted.chatId === id.toString() &&
          ((formatted.senderId === senderId &&
            formatted.recipientId.toString() === recipientId) ||
           (formatted.recipientId === senderId &&
            formatted.senderId.toString() === recipientId));
        
        if (isCurrentChat) {
          setMessages((prev) => {
            const exists = prev.some(m => 
              m.messageId === formatted.messageId || 
              (m.content === formatted.content && 
               Math.abs(new Date(m.timestamp).getTime() - new Date(formatted.timestamp).getTime()) < 1000)
            );
            if (exists) return prev;
            return [...prev, formatted];
          });
        }
      });
    };

    const loadHistory = async () => {
      try {
        const resp = await fetch(
          `${API_URL}/chat/history?userAId=${senderId}&userBId=${recipientId}`
        );
        const raw: ChatMessage[] = await resp.json();
        
        if (raw.length > 0 && raw[0].chatId) {
          chatIdRef.current = Number(raw[0].chatId);
        } else {
          try {
            const createResp = await fetch(
              `${API_URL}/chat/create?userAId=${senderId}&userBId=${recipientId}`,
              { method: "POST" }
            );
            chatIdRef.current = await createResp.json();
          } catch (e) {
            console.error("Ошибка создания чата:", e);
          }
        }
        
        const normalized = raw.map((m) => ({
          messageId: m.messageId?.toString() ?? Date.now().toString(),
          chatId: m.chatId?.toString() ?? chatIdRef.current?.toString() ?? "",
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
        
        if (chatIdRef.current && stompClient && stompClient.connected) {
          subscribeToChat(stompClient, chatIdRef.current);
        }
      } catch (e) {
        console.error("Ошибка загрузки истории:", e);
      } finally {
        setIsLoading(false);
      }
    };

    const socketFactory = () =>
      new SockJS(`${API_URL_WITHOUT_API}/ws-chat`) as any;

    stompClient = new Client({
      webSocketFactory: socketFactory,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to chat WS");
        loadHistory();
      },
      onStompError: (frame) => {
        console.error("Broker error", frame.headers["message"]);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      console.log("WS disconnected");
      if (subscriptionRef) {
        subscriptionRef.unsubscribe();
      }
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