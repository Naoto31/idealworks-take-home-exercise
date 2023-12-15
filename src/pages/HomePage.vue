<template>
  <div class="container">
    <div>
      <CommentCard
        v-for="comment in topLevelComments"
        :key="comment.id"
        :comment="comment"
        :currentUser="currentUser"
        @delete-comment="deleteComment"
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
import { ref } from "vue";
import { findParentComment } from "@/utils";

export default {
  name: "HomePage",
  components: {
    CommentCard,
    AddCommentCard,
  },
  setup() {
    const topLevelComments = ref(buildCommentTree(data.comments));

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
      const commentUI = {
        ...comment,
        user: findUser(comment.userId),
        nestedLevel: 0,
        replies: [],
      };
      topLevelComments.value.push(commentUI);
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
    }
    return {
      topLevelComments,
      currentUser: data.currentUser,
      addComment,
      deleteComment,
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
