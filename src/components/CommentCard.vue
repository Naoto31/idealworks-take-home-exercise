<template>
  <div
    :style="{
      marginLeft: `${comment.nestedLevel * 48}px`,
      maxWidth: cardMaxWidth,
    }"
    class="card"
  >
    <div class="header">
      <div class="profile">
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
        <p>{{ comment.user?.name }}</p>
        <BadgeTag
          v-if="currentUser.id === comment.userId"
          text="You"
          class="badge"
        />
        <span>{{ comment.createdAt }}</span>
      </div>
      <div class="action-container">
        <i data-feather="corner-up-left" stroke="#7F56D9"></i>
        <p>Reply</p>
      </div>
    </div>
    <div class="body">
      <p class="message">{{ comment.message }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import feather from "feather-icons";
import { defineComponent, computed, ref } from "vue";
import { CommentUI, User } from "@/type";
import BadgeTag from "./ui/BadgeTag.vue";

export default defineComponent({
  name: "CommentCard",
  components: {
    BadgeTag,
  },
  props: {
    comment: {
      type: Object as () => CommentUI,
      required: true,
    },
    currentUser: {
      type: Object as () => User,
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--Gray-200, #eaecf0);

    .profile {
      display: flex;
      align-items: center;

      p {
        margin: 0 0 0 16px;
        color: var(--Gray-700, #344054);
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
      }

      .badge {
        margin-left: 16px;
      }

      span {
        margin-left: 16px;
        color: var(--Gray-500, #667085);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
      }
    }

    .action-container {
      display: flex;
      align-items: center;

      p {
        margin: 0 0 0 8px;
        color: #6941c6;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
      }
    }
  }
  .body {
    padding: 16px;

    .message {
      margin: 0;
      color: #667085;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      word-wrap: break-word;
    }
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
