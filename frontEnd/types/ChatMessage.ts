export interface ChatMessage {
  messageId: string;
    chatId: string;
    senderId: number;
    recipientId: number;
    content: string;
    text?: string; 
    timestamp: string;
    isOwn?: boolean; 
  }