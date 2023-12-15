<template>
  <div class="container">
    <div>
      <div v-for="comment in topLevelComments" :key="comment.id">
        <CommentCard
          :comment="comment"
          :currentUser="currentUser"
          class="one"
        />
        <div v-for="reply in comment.replies" :key="reply.id" class="one">
          <CommentCard :comment="reply" :currentUser="currentUser" />
        </div>
      </div>
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

    return { topLevelComments, currentUser: data.currentUser, addComment };
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
