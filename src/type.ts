export interface User {
  id: number;
  name: string;
  avatar: string;
  role: string;
}

export interface Post {
  id: number;
  userId: number;
  parentId: number | null; // `null` for top-level comments, ID of another Post for replies
  message: string;
  createdAt: string | Date;
  score: number;
}

export interface DataModel {
  currentUser: User;
  users: User[];
  comments: Post[];
}

export interface PostUI extends Post {
  nestedLevel?: number | null;
  replies?: Post[];
}
