<template>
  <div>
    <h1>Comments</h1>
    <CommentCard></CommentCard>
    <!-- <div v-for="post in topLevelPosts" :key="post.id">
      <Card
        :avatar="getUserAvatar(post.userId)"
        :username="getUserName(post.userId)"
        :message="post.message"
        :createdAt="post.createdAt"
        :nestedLevel="post.nestedLevel"
      />
      <div v-for="reply in post.replies" :key="reply.id">
        <Card
          :avatar="getUserAvatar(reply.userId)"
          :username="getUserName(reply.userId)"
          :message="reply.message"
          :createdAt="reply.createdAt"
          :nestedLevel="reply.nestedLevel"
        />
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import CommentCard from "../components/CommentCard.vue";
import data from "../data.json";
import { Post, PostUI } from "@/type";

export default {
  name: "HomePage",
  components: {
    CommentCard,
  },
  setup() {
    console.log(data);
    // const topLevelPosts = buildCommentTree(data.comments);
    // function getUserAvatar(userId: string) {
    //   return data.users.find(user => user.id === userId)?.avatar || "";
    // }
    // function getUserName(userId: string) {
    //   return data.users.find(user => user.id === userId)?.name || "Unknown";
    // }
    // function buildCommentTree(posts: PostUI[], parentId = null, level = 0) {
    //   return posts
    //     .filter(post => post.parentId === parentId)
    //     .map(post => ({
    //       ...post,
    //       nestedLevel: level,
    //       replies: buildCommentTree(posts, post.id, level + 1),
    //     }));
    // }
    // return { topLevelPosts, getUserAvatar, getUserName };
  },
};
</script>
