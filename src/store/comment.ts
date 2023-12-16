import { defineStore } from "pinia";
import { Comment, User, CommentUI } from "../type";
import {
  buildCommentTree,
  findUser,
  findParentComment,
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
        const parent = findParentComment(
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
    deleteComment(commentId: string, parentRef: string) {
      if (!parentRef) {
        this.topLevelComments = this.topLevelComments.filter(
          (value) => value.id !== commentId
        );
      } else {
        const parent = findParentComment(this.topLevelComments, parentRef);
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
      console.log("pinia");
      console.log(parentRef);
      if (!parentRef) {
        this.topLevelComments = this.topLevelComments.map((value) => {
          if (value.id !== commentId) return value;
          return {
            ...value,
            message: message,
          };
        });
        console.log("here");
      } else {
        const parent = findParentComment(this.topLevelComments, parentRef);
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
  },
});
