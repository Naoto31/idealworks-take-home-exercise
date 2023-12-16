import { CommentUI } from "@/type";

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
