export type Forum = {
  id: string;
  title: string;
  lastMessage?: string;
  avatarUri?: string;
  recipientId: number;
};

export type ForumCategory = {
  id: string;
  title: string;
  forums: Forum[];
};

