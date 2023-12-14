<template>
  <div :style="{ marginLeft: `${comment.nestedLevel * 20}px` }" class="card">
    <div
      v-if="imageUrl"
      :style="{ backgroundImage: `url(${imageUrl})` }"
      class="avatar"
    ></div>
    <i v-else data-feather="user" stroke="#7F56D9"></i>

    <div class="content">
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
  beforeCreate() {
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
