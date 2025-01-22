export type User = {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  isOnline: boolean;
};

export type Message = {
  _id: string;
  text: string;
  images: Media[];
  links: Media[];
  from: User;
  chat: string;
  timestamp: string;
};

export type Media = {
  _id: string;
  type: "image" | "link";
  url: string;
  from: User;
  chat: string;
  timestamp: string;
};

export type Chat = {
  _id: string;
  members: User[];
  messages: Message[];
  images: Media[];
  links: Media[];
  typingUsers: string[];
  unreadCount: number;
};
