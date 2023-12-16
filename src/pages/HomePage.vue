<template>
  <div class="container">
    <div class="wrapper">
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
import { Comment } from "../type";
import { ref } from "vue";
import {
  findParentComment,
  buildCommentTree,
  findUser,
} from "@/helpers/comment.helper";
import {
  getStoredCommentsInLocalStorage,
  updateCommentsToLocalStorage,
} from "@/services/localStorage";

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
      updateCommentsToLocalStorage(commentId, "delete");
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
      updateCommentsToLocalStorage(commentId, "update", { message: message });
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
  padding: 16px;

  .wrapper {
    margin: auto;
    max-width: 768px;
  }

  .one {
    margin-bottom: 16px;
  }
}
</style>
