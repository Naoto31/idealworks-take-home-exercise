<template>
  <div class="card">
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
        <div class="desc">
          <p>{{ currentUser?.name }}</p>
          <p class="role">{{ currentUser?.role }}</p>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="comment-box">
        <textarea
          v-model="newComment"
          placeholder="Add a comment..."
          class="comment-textarea"
        ></textarea>
      </div>
      <div class="btn-container">
        <button @click="sendComment">Send</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Comment, User } from "@/type";
import { computed, defineComponent, ref } from "vue";
import { saveCommentToLocalStorage } from "@/services/localStorage";

export default defineComponent({
  name: "AddCommentCard",
  props: {
    currentUser: {
      type: Object as () => User,
      required: true,
    },
    parentRef: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    const newComment = ref("");
    const imageUrl = computed(() => {
      return props.currentUser?.image
        ? require(`@/assets/images/${props.currentUser.image}`)
        : "";
    });

    function setComment(): Comment {
      return {
        id: generateUniqueId(),
        userId: props.currentUser.id,
        message: newComment.value,
        parentRef: props.parentRef ?? null, // adjust in case of reply
        createdAt: new Date(),
        score: 0, // init 0
      };
    }

    function generateUniqueId(): string {
      return `comment-${new Date().getTime()}`; // simple timestamp-based ID
    }

    const sendComment = () => {
      if (newComment.value.trim() !== "") {
        const commentObj = setComment();
        saveCommentToLocalStorage(commentObj);
        context.emit("comment-submitted", commentObj);
        newComment.value = "";
      }
    };

    return { imageUrl, newComment, sendComment };
  },
});
</script>

<style lang="scss" scoped>
.card {
  height: 294px;
  max-width: 768px;
  border-radius: 8px;
  border: 1px #eaecf0 solid;

  .header {
    padding: 16px 20px 16px 16px;
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

      .desc {
        text-align: left;

        .role {
          color: var(--Gray-500, #667085);
          font-weight: 400;
        }
      }
    }
  }

  .avatar-container {
    display: flex;
    width: 48px;
    height: 48px;
    border-radius: 200px;
    position: relative;
    justify-content: center;
    align-items: center;

    .dot {
      position: absolute;
      width: 12px;
      height: 12px;
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
  .body {
    height: 180px;
    max-width: 768px;
    padding: 16px;

    .comment-box {
      height: 108px;
      padding: 10px 14px;
      background: white;
      box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
      border-radius: 8px;
      border: 1px solid #d0d5dd;
      margin-bottom: 16px;
    }

    .comment-textarea {
      height: 100%;
      width: 100%;
      color: #667085;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      border: none;
      outline: none;
      box-shadow: none;
      resize: none;

      &::placeholder {
        font-family: "Inter", Avenir, Helvetica, Arial, sans-serif;
        color: #667085;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
      }
    }

    .btn-container {
      text-align: left;

      button {
        height: 36px;
        padding: 8px 14px;
        background-color: #7f56d9;
        color: white;
        border: none;
        box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
        border-radius: 8px;
        cursor: pointer;

        &:hover {
          background-color: #3700b3;
        }
      }
    }
  }
}
</style>
