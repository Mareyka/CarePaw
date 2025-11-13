export type ChatMessage = {
  id: string;
  text: string;
  timestamp: Date | string;
  isOwn: boolean; // true если сообщение от текущего пользователя
  senderName?: string;
};

export type Chat = {
  id: string;
  name: string;
  avatarUri?: string;
  messages: ChatMessage[];
};

