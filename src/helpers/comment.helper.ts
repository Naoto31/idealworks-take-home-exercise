import { Comment, CommentUI, User } from "../type";
import data from "../data.json";
import { generateUniqueId } from "@/utils";

export const findParentComment = (
  comments: CommentUI[],
  parentRef: string
): CommentUI | null => {
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    if (comment.id === parentRef) {
      return comment;
    }
    if (comment.replies) {
      const parent = comment.replies.find((reply) => reply.id === parentRef);
      if (parent) {
        return parent;
      }
      const parentInfo = findParentComment(comment.replies, parentRef);
      if (parentInfo) {
        return parentInfo;
      }
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
