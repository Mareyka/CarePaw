export type Forum = {
  id: string;
  title: string;
  lastMessage?: string;
  avatarUri?: string;
};

export type ForumCategory = {
  id: string;
  title: string;
  forums: Forum[];
};

