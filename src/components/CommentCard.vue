<template>
  <div :style="{ marginLeft: `${comment.nestedLevel * 48}px` }" class="card">
    <div class="header">
      <div
        v-if="imageUrl"
        :style="{ backgroundImage: `url(${imageUrl})` }"
        class="image-container"
      >
        <div class="dot"></div>
      </div>
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
.image-container {
  display: flex;
  width: 32px;
  height: 32px;
  border-radius: 200px;
  background: lightgray 50% / cover;
  position: relative;

  .dot {
    position: absolute;
    width: 8px;
    height: 8px;
    right: 0;
    bottom: -2px;
    border-radius: 8px;
    border: 1.5px solid var(--White, #fff);
    background: var(--Success-500, #12b76a);
  }
}
</style>
