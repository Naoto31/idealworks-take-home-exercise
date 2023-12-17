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
      if (storedComments.length === 0) {
        // check comments in localStorage, if nothing save initialComments to localStorage
        localStorage.setItem("comments", JSON.stringify(initialComments));
        this.topLevelComments = buildCommentTree(initialComments);
      } else {
        // Load comments from localStorage
        this.topLevelComments = buildCommentTree(storedComments);
      }
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
          const maxNestedLevel = parent.replies.reduce(
            (max, reply) => Math.max(max, reply.nestedLevel),
            parent.nestedLevel
          );

          const commentUI = {
            ...comment,
            user: findUser(comment.userId),
            nestedLevel: Math.min(maxNestedLevel + 1, 4),
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
