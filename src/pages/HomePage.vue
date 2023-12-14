<template>
  <div>
    <div v-for="comment in topLevelComments" :key="comment.id">
      <CommentCard
        :user="findUser(comment.userId)"
        :message="comment.message"
        :createdAt="comment.createdAt"
        :nestedLevel="comment.nestedLevel"
      />
      <div v-for="reply in comment.replies" :key="reply.id">
        <CommentCard
          :user="findUser(reply.userId)"
          :message="reply.message"
          :createdAt="reply.createdAt"
          :nestedLevel="reply.nestedLevel"
        />
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
          nestedLevel: level ?? 0,
          replies: buildCommentTree(comments, comment.id, level + 1),
        }));
    }

    return { topLevelComments, findUser };
  },
};
</script>
