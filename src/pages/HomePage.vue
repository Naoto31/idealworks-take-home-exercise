<template>
  <div class="container">
    <div class="wrapper">
      <CommentCard
        v-for="comment in topLevelComments"
        :key="comment.id"
        :comment="comment"
        class="one"
      />
      <div>
        <AddCommentCard />
      </div>
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

    const topLevelComments = computed(() => commentStore.topLevelComments);
    const currentUser = data.currentUser;

    return {
      topLevelComments,
      currentUser,
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
