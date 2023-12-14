<template>
  <div :style="{ marginLeft: `${comment.nestedLevel * 20}px` }" class="card">
    <img v-if="imageUrl" :src="imageUrl" alt="User avatar" class="avatar" />
    <div class="content">
      <h3>{{ comment.user?.name }}</h3>
      <p>{{ comment.message }}</p>
      <span>{{ comment.createdAt }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { CommentUI } from "@/type";

export default defineComponent({
  name: "CommentCard",
  props: {
    comment: {
      type: Object as () => CommentUI,
      required: true,
    },
  },
  setup(props) {
    const imageUrl = computed(() => {
      return props.comment.user?.image
        ? require(`@/assets/images/${props.comment.user.image}`)
        : "";
    });
    return { imageUrl };
  },
});
</script>

<style>
.avatar {
  width: 40px;
  height: 40px;
}
</style>
