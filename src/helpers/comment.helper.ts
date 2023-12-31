import { Comment, CommentUI, User } from "../type";
import data from "../data.json";
import { generateUniqueId, parseDate } from "@/utils";

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
    .sort((a, b) => {
      if (parentId === null) {
        return b.score - a.score; // sort top-level comments by score
      } else {
        return parseDate(a.createdAt) - parseDate(b.createdAt); // sort replies by createdAt
      }
    })
    .map((comment, index) => {
      if (!parentId) index = 0;
      return {
        ...comment,
        user: findUser(comment.userId),
        nestedLevel: !parentId ? 0 : Math.min(level + index, 4), // max nested level: 4
        replies: buildCommentTree(comments, comment.id, level + index + 1),
      };
    });
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
