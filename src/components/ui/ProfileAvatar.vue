<template>
  <div
    v-if="imageUrl"
    class="avatar-container"
    :style="{ backgroundImage: `url(${imageUrl})`, ...avatarSize }"
  >
    <div v-if="showDot" class="dot" :style="dotSize"></div>
  </div>
  <div v-else class="avatar-container icon" :style="avatarSize">
    <i data-feather="user" stroke="#7F56D9"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import { User } from "@/type";

export default defineComponent({
  name: "ProfileAvatar",
  props: {
    user: {
      type: Object as PropType<User | null | undefined>,
      required: true,
    },
    showDot: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 48,
    },
    dotWidth: {
      type: Number,
      default: 12,
    },
  },
  setup(props) {
    const imageUrl = computed(() => {
      return props.user?.image
        ? require(`@/assets/images/${props.user.image}`)
        : "";
    });

    const avatarSize = computed(() => {
      return {
        width: `${props.size}px`,
        height: `${props.size}px`,
      };
    });

    const dotSize = computed(() => {
      return {
        width: `${props.dotWidth}px`,
        height: `${props.dotWidth}px`,
      };
    });

    return { imageUrl, avatarSize, dotSize };
  },
});
</script>

<style lang="scss" scoped>
.avatar-container {
  display: flex;
  position: relative;
  border-radius: 200px;
  justify-content: center;
  align-items: center;
  background: lightgray 50% / cover;

  .dot {
    position: absolute;
    right: 0;
    bottom: -2px;
    border-radius: 8px;
    border: 1.5px solid var(--White, #fff);
    background: var(--Success-500, #12b76a);
  }
}

.icon {
  background: var(--Primary-50, #f9f5ff);
}
</style>
