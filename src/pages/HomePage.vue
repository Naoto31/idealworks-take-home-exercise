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
        <AddCommentCard :currentUser="currentUser" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useCommentsStore } from "@/store/comment";
import CommentCard from "../components/CommentCard.vue";
import AddCommentCard from "../components/AddCommentCard.vue";
import data from "../data.json";
import { Comment } from "@/type";
import { computed } from "vue";

export default {
  name: "HomePage",
  components: {
    CommentCard,
    AddCommentCard,
  },
  setup() {
    const commentStore = useCommentsStore();
    commentStore.initializeComments(data.comments);

    const topLevelComments = computed(() => commentStore.topLevelComments);
    const currentUser = data.currentUser;

    const addComment = (comment: Comment) => {
      commentStore.addComment(comment);
    };

    const deleteComment = (commentId: string, parentRef: string) => {
      commentStore.deleteComment(commentId, parentRef);
    };

    const updateComment = (
      commentId: string,
      message: string,
      parentRef: string
    ) => {
      console.log("here");
      commentStore.updateComment(commentId, message, parentRef);
    };

    return {
      topLevelComments,
      currentUser,
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
