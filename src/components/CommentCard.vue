<template>
  <div
    :style="{
      marginLeft: `${comment.nestedLevel * 48}px`,
      maxWidth: cardMaxWidth,
    }"
    class="card"
  >
    <div class="header">
      <p>{{ comment.user?.name }}</p>
      <div
        v-if="imageUrl"
        :style="{ backgroundImage: `url(${imageUrl})` }"
        class="avatar-container image"
      >
        <div class="dot"></div>
      </div>
      <div v-else class="avatar-container icon">
        <i data-feather="user" stroke="#7F56D9"></i>
      </div>
    </div>
    <div class="body">
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

    const cardMaxWidth = computed(() => {
      const initialMaxWidth = 732;
      // Decrease max-width by 48px for each nested level
      return `${initialMaxWidth - props.comment.nestedLevel * 48}px`;
    });

    return { imageUrl, cardMaxWidth };
  },
});
</script>

<style lang="scss" scoped>
.card {
  max-width: 732px;
  border-radius: 8px;
  border: 1px #eaecf0 solid;

  .header {
    padding: 16px;
    border-bottom: 1px solid var(--Gray-200, #eaecf0);
  }
  .body {
    padding: 16px;
  }
}
.avatar-container {
  display: flex;
  width: 32px;
  height: 32px;
  border-radius: 200px;
  position: relative;
  justify-content: center;
  align-items: center;

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

.image {
  background: lightgray 50% / cover;
}

.icon {
  border-radius: 200px;
  background: var(--Primary-50, #f9f5ff);
}
</style>
