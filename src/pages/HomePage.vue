<template>
  <div>
    <div v-for="comment in topLevelComments" :key="comment.id">
      <CommentCard :comment="comment" />
      <div v-for="reply in comment.replies" :key="reply.id">
        <CommentCard :comment="reply" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CommentCard from "../components/CommentCard.vue";
import data from "../data.json";
import { Comment, User, CommentUI } from "../type";

export default {
  name: "HomePage",
  components: {
    CommentCard,
  },
  setup() {
    const topLevelComments = buildCommentTree(data.comments);

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
        .filter((ele) => ele.parentId === parentId)
        .map((comment) => ({
          ...comment,
          user: findUser(comment.userId),
          nestedLevel: level,
          replies: buildCommentTree(comments, comment.id, level + 1),
        }));
    }

    return { topLevelComments };
  },
};
</script>
