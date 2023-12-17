import { defineStore } from "pinia";
import { Comment, CommentUI } from "../type";
import {
  buildCommentTree,
  findUser,
  findCommentById,
} from "@/helpers/comment.helper";
import {
  getStoredCommentsInLocalStorage,
  saveCommentToLocalStorage,
  updateCommentsToLocalStorage,
} from "@/services/localStorage";

export const useCommentsStore = defineStore("comments", {
  state: () => ({
    topLevelComments: [] as CommentUI[],
  }),
  actions: {
    initializeComments(initialComments: Comment[]) {
      const storedComments = getStoredCommentsInLocalStorage();
      this.topLevelComments = buildCommentTree([
        ...storedComments,
        ...initialComments,
      ]);
    },
    addComment(comment: Comment) {
      saveCommentToLocalStorage(comment);
      if (!comment.parentRef) {
        const commentUI = {
          ...comment,
          user: findUser(comment.userId),
          nestedLevel: 0,
          replies: [],
        };
        this.topLevelComments.push(commentUI);
      } else {
        const parent = findCommentById(
          this.topLevelComments,
          comment.parentRef
        );
        if (parent) {
          parent.replies = parent.replies ?? [];
          const commentUI = {
            ...comment,
            user: findUser(comment.userId),
            nestedLevel: parent.nestedLevel + 1,
            replies: [],
          };
          parent.replies.push(commentUI);
        }
      }
    },
    deleteComment(commentId: string, parentRef: string | null) {
      if (!parentRef) {
        this.topLevelComments = this.topLevelComments.filter(
          (value) => value.id !== commentId
        );
      } else {
        const parent = findCommentById(this.topLevelComments, parentRef);
        if (parent) {
          parent.replies = parent.replies!.filter(
            (value) => value.id !== commentId
          );
        }
      }
      updateCommentsToLocalStorage(commentId, "delete");
    },
    updateComment(
      commentId: string,
      message: string,
      parentRef: string | null
    ) {
      if (!parentRef) {
        this.topLevelComments = this.topLevelComments.map((value) => {
          if (value.id !== commentId) return value;
          return {
            ...value,
            message: message,
          };
        });
      } else {
        const parent = findCommentById(this.topLevelComments, parentRef);
        if (parent) {
          parent.replies = parent.replies!.map((value) => {
            if (value.id !== commentId) return value;
            return {
              ...value,
              message: message,
            };
          });
        }
      }
      updateCommentsToLocalStorage(commentId, "update", { message: message });
    },

    updateCommentScore(commentId: string, type: "up" | "down") {
      const comment = findCommentById(this.topLevelComments, commentId);
      if (comment) {
        comment.score =
          type === "up" ? (comment.score ?? 0) + 1 : (comment.score ?? 0) - 1;
        updateCommentsToLocalStorage(commentId, "update", {
          score: comment.score,
        });
      }
    },
  },
});
