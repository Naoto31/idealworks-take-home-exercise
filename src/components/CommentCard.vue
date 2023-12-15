<template>
  <div
    :style="{
      marginLeft: `${comment.nestedLevel * 48}px`,
      maxWidth: cardMaxWidth,
    }"
    class="card"
  >
    <div class="header">
      <!-- profile -->
      <div class="profile">
        <div
          v-if="imageUrl"
          :style="{ backgroundImage: `url(${imageUrl})` }"
          class="avatar-container image"
        >
          <div v-if="currentUser.id !== comment.userId" class="dot"></div>
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
        <span>{{ formatCreatedAt(comment.createdAt) }}</span>
      </div>

      <!-- action container -->
      <div v-if="currentUser.id === comment.userId" class="right">
        <div class="delete" @click="deleteComment">
          <i data-feather="trash-2" stroke="#B42318"></i>
          <p>Delete</p>
        </div>
        <div class="edit" @click="isEdit = true">
          <i data-feather="edit-3" stroke="#7F56D9"></i>
          <p>Edit</p>
        </div>
      </div>
      <div v-else class="right reply">
        <i data-feather="corner-up-left" stroke="#7F56D9"></i>
        <p>Reply</p>
      </div>
    </div>

    <!-- card body -->
    <div class="body">
      <div class="vote-container"></div>
      <div v-if="!isEdit" class="message">{{ comment.message }}</div>
      <div v-else class="edit-right">
        <div class="comment-box">
          <textarea
            v-model="commentMessage"
            placeholder="Add a comment..."
            class="comment-textarea"
          ></textarea>
        </div>
        <div class="btn-container">
          <button @click="updateComment">Done</button>
        </div>
      </div>
    </div>
  </div>

  <!-- recursive card -->
  <div v-if="comment.replies && comment.replies.length > 0" class="replies">
    <CommentCard
      v-for="reply in comment.replies"
      :key="reply.id"
      :comment="reply"
      :currentUser="currentUser"
      @delete-comment="handleDeleteComment"
      @update-comment="handleUpdateComment"
    />
  </div>
</template>

<script lang="ts">
import feather from "feather-icons";
import { defineComponent, computed, ref, watch } from "vue";
import { CommentUI, User } from "@/type";
import BadgeTag from "./ui/BadgeTag.vue";
import { formatCreatedAt } from "@/utils";

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
    feather.replace({ height: 20, width: 20 });
  },
  setup(props, context) {
    const imageUrl = computed(() => {
      return props.comment.user?.image
        ? require(`@/assets/images/${props.comment.user.image}`)
        : "";
    });

    const cardMaxWidth = computed(() => {
      const initialMaxWidth = 768;
      // Decrease max-width by 48px for each nested level
      return `${initialMaxWidth - props.comment.nestedLevel * 48}px`;
    });

    const isEdit = ref(false);
    const commentMessage = ref(props.comment.message);

    watch(isEdit, (change) => {
      if (change) {
        commentMessage.value = props.comment.message;
      }
    });

    const deleteComment = () => {
      context.emit(
        "delete-comment",
        props.comment.id,
        props.comment.parentRef ?? null
      );
    };

    const handleDeleteComment = (
      commentId: string,
      parentRef: string | null
    ) => {
      context.emit("delete-comment", commentId, parentRef);
    };

    const handleUpdateComment = (
      commentId: string,
      message: string,
      parentRef: string | null
    ) => {
      context.emit("update-comment", commentId, message, parentRef);
    };

    function updateComment() {
      context.emit(
        "update-comment",
        props.comment.id,
        commentMessage.value,
        props.comment.parentRef
      );
      isEdit.value = false;
    }

    return {
      imageUrl,
      cardMaxWidth,
      formatCreatedAt,
      deleteComment,
      handleDeleteComment,
      isEdit,
      commentMessage,
      updateComment,
      handleUpdateComment,
    };
  },
});
</script>

<style lang="scss" scoped>
.card {
  max-width: 768px;
  border-radius: 8px;
  border: 1px #eaecf0 solid;
  margin-bottom: 16px;

  .header {
    padding: 16px 20px 16px 16px;
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

    .right {
      display: flex;
      align-items: center;
      cursor: pointer;

      p {
        margin: 0 0 0 8px;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
      }
    }

    .reply {
      p {
        color: #6941c6;
      }
    }

    .delete,
    .edit {
      display: flex;
      align-items: center;
    }

    .delete {
      p {
        color: #b42318;
      }
    }

    .edit {
      margin-left: 16px;
      p {
        color: #6941c6;
      }
    }
  }

  .body {
    padding: 16px;
    display: flex;

    .vote-container {
      height: 50px;
      width: 44px;
    }

    .message {
      margin: 0 0 0 16px;
      color: #667085;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      word-wrap: break-word;
      width: 100%;
    }

    .edit-right {
      width: 100%;
    }

    .comment-box {
      height: 108px;
      width: calc(100% - 28px);
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
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      border: none;
      outline: none;
      box-shadow: none;
      resize: none;
      font-family: "Inter", Avenir, Helvetica, Arial, sans-serif;

      &::placeholder {
        font-family: "Inter", Avenir, Helvetica, Arial, sans-serif;
        color: #667085;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
      }
    }
  }

  .btn-container {
    text-align: right;

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
