import { Comment, CommentUI, User } from "../type";
import data from "../data.json";
import { generateUniqueId } from "@/utils";

export const findCommentById = (
  comments: CommentUI[],
  commentId: string
): CommentUI | null => {
  for (const comment of comments) {
    if (comment.id === commentId) return comment;
    if (comment.replies) {
      const found = findCommentById(comment.replies, commentId);
      if (found) return found;
    }
  }
  return null;
};

export function findUser(userId: string): User | undefined {
  return data.users.find((value) => value.id === userId);
}

export function buildCommentTree(
  comments: Comment[],
  parentId: string | null = null,
  level = 0
): CommentUI[] {
  return comments
    .filter((ele) => ele.parentRef === parentId)
    .map((comment) => ({
      ...comment,
      user: findUser(comment.userId),
      nestedLevel: level > 4 ? 3 : level, // max nested level: 3
      replies: buildCommentTree(comments, comment.id, level + 1),
    }));
}

export function setComment(
  data: { currentUser: User; parentRef: string },
  newComment: string
): Comment {
  return {
    id: generateUniqueId(),
    userId: data.currentUser.id,
    message: newComment,
    parentRef: data.parentRef ?? null,
    createdAt: new Date(),
    score: 0, // init 0
  };
}
