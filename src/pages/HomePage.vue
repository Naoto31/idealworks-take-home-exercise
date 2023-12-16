<template>
  <div class="container">
    <div>
      <CommentCard
        v-for="comment in topLevelComments"
        :key="comment.id"
        :comment="comment"
        :currentUser="currentUser"
        @delete-comment="deleteComment"
        @update-comment="updateComment"
        @comment-submitted="addComment"
        class="one"
      />
      <div>
        <AddCommentCard
          :currentUser="currentUser"
          @comment-submitted="addComment"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CommentCard from "../components/CommentCard.vue";
import AddCommentCard from "../components/AddCommentCard.vue";
import data from "../data.json";
import { Comment, User, CommentUI } from "../type";
import { onMounted, ref } from "vue";
import { findParentComment } from "@/utils";

export default {
  name: "HomePage",
  components: {
    CommentCard,
    AddCommentCard,
  },
  setup() {
    const storedComments = getStoredCommentsInLocalStorage();
    const topLevelComments = ref(
      buildCommentTree([...storedComments, ...data.comments])
    );

    function getStoredCommentsInLocalStorage(): Comment[] {
      const storedComments = localStorage.getItem("comments");
      return storedComments ? JSON.parse(storedComments) : [];
    }

    function findUser(userId: string): User | undefined {
      const user = data.users.find((value) => value.id === userId);
      return user;
    }

    function buildCommentTree(
      comments: Comment[],
      parentId: string | null = null,
      level = 0
    ): CommentUI[] {
      return comments
        .filter((ele) => ele.parentRef === parentId)
        .map((comment) => ({
          ...comment,
          user: findUser(comment.userId),
          nestedLevel: level,
          replies: buildCommentTree(comments, comment.id, level + 1),
        }));
    }

    function addComment(comment: Comment) {
      if (!comment.parentRef) {
        const commentUI = {
          ...comment,
          user: findUser(comment.userId),
          nestedLevel: 0,
          replies: [],
        };
        topLevelComments.value.push(commentUI);
      } else {
        const parent = findParentComment(
          topLevelComments.value,
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
    }

    function deleteComment(commentId: string, parentRef: string) {
      if (!parentRef) {
        topLevelComments.value = topLevelComments.value.filter(
          (value) => value.id !== commentId
        );
      } else {
        const parent = findParentComment(topLevelComments.value, parentRef);
        if (parent) {
          parent.replies = parent.replies!.filter(
            (value) => value.id !== commentId
          );
        }
      }
      // update to local storage
      const storedComments = getStoredCommentsInLocalStorage();
      const updated = storedComments.filter((value) => value.id !== commentId);
      localStorage.setItem("comments", JSON.stringify(updated));
    }

    function updateComment(
      commentId: string,
      message: string,
      parentRef: string | null
    ) {
      if (!parentRef) {
        topLevelComments.value = topLevelComments.value.map((value) => {
          if (value.id !== commentId) return value;
          return {
            ...value,
            message: message,
          };
        });
      } else {
        const parent = findParentComment(topLevelComments.value, parentRef);
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
      // update to local storage
      const storedComments = getStoredCommentsInLocalStorage();
      const updated = storedComments.map((value) => {
        if (value.id !== commentId) return value;
        return {
          ...value,
          message: message,
        };
      });
      localStorage.setItem("comments", JSON.stringify(updated));
    }

    return {
      topLevelComments,
      currentUser: data.currentUser,
      addComment,
      deleteComment,
      updateComment,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-around;
  padding: 16px;

  .one {
    margin-bottom: 16px;
  }
}
</style>
