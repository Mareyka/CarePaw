import { ChatMessage } from "./ChatMessage";

export type Chat = {
  id: string;
  name: string;
  avatarUri?: string;
  messages: ChatMessage[];
};

