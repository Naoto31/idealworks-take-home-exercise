<template>
  <div class="container">
    <div class="wrapper">
      <CommentCard
        v-for="comment in topLevelComments"
        :key="comment.id"
        :comment="comment"
        class="one"
      />
      <AddCommentCard />
    </div>
  </div>
</template>

<script lang="ts">
import { useCommentsStore } from "@/store/comment";
import { useUserStore } from "@/store/user";
import CommentCard from "../components/CommentCard.vue";
import AddCommentCard from "../components/AddCommentCard.vue";
import data from "../data.json";
import { computed } from "vue";

export default {
  name: "HomePage",
  components: {
    CommentCard,
    AddCommentCard,
  },
  setup() {
    const commentStore = useCommentsStore();
    const userStore = useUserStore();

    commentStore.initializeComments(data.comments);
    userStore.setCurrentUser(data.currentUser);
    userStore.setUsers(data.users);

    const topLevelComments = computed(() => commentStore.topLevelComments);

    return {
      topLevelComments,
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
