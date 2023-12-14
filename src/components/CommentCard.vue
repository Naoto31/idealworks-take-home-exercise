<template>
  <div :style="{ marginLeft: `${comment.nestedLevel * 48}px` }" class="card">
    <div class="header">
      <div
        v-if="imageUrl"
        :style="{ backgroundImage: `url(${imageUrl})` }"
        class="avatar"
      ></div>
      <i v-else data-feather="user" stroke="#7F56D9"></i>
    </div>
    <div class="body">
      <h3>{{ comment.user?.name }}</h3>
      <p>{{ comment.message }}</p>
      <span>{{ comment.createdAt }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import feather from "feather-icons";
import { defineComponent, computed, ref } from "vue";
import { CommentUI } from "@/type";

export default defineComponent({
  name: "CommentCard",
  props: {
    comment: {
      type: Object as () => CommentUI,
      required: true,
    },
  },
  mounted() {
    feather.replace();
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

<style lang="scss" scoped>
.card {
  max-width: 732px;
  padding: 16px;
  border-radius: 8px;
  border: 1px #eaecf0 solid;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 200px;
  background-size: cover;
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}
</style>
