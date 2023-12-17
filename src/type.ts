export interface User {
  id: string;
  name: string;
  image: string;
  role: string;
  mentionName: string;
}

export interface Comment {
  id: string;
  userId: string;
  parentRef: string | null; // `null` for top-level comments, ID of another Post for replies
  message: string;
  createdAt: string | Date;
  score: number;
}

export interface DataModel {
  currentUser: User;
  users: User[];
  comments: Comment[];
}

export interface CommentUI extends Comment {
  nestedLevel: number;
  user?: User;
  replies?: CommentUI[];
}
