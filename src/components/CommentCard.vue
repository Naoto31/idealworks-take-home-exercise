<template>
  <div>
    <div
      :style="{
        marginLeft: isMobile
          ? `${Math.min(comment.nestedLevel * 48, 48)}px`
          : `${comment.nestedLevel * 48}px`,
        maxWidth: cardMaxWidth,
      }"
      class="card"
    >
      <div class="header">
        <!-- profile -->
        <div class="profile">
          <ProfileAvatar
            :user="comment.user"
            :showDot="currentUser?.id !== comment.userId"
            :size="32"
            :dotWidth="8"
          />
          <p>{{ comment.user?.name }}</p>
          <BadgeTag
            v-if="currentUser?.id === comment.userId"
            text="You"
            class="badge"
          />
          <span>{{ formatCreatedAt(comment.createdAt) }}</span>
        </div>

        <!-- action container -->
        <div v-show="!isMobile">
          <div
            v-if="currentUser?.id === comment.userId"
            class="action-container"
          >
            <div class="delete" @click="deleteComment">
              <i class="icon" data-feather="trash-2" stroke="#B42318"></i>
              <p>Delete</p>
            </div>
            <div class="edit" @click="isEdit = true">
              <i class="icon" data-feather="edit-3" stroke="#7F56D9"></i>
              <p>Edit</p>
            </div>
          </div>
          <div v-else class="action-container reply" @click="isReply = true">
            <i class="icon" data-feather="corner-up-left" stroke="#7F56D9"></i>
            <p>Reply</p>
          </div>
        </div>
      </div>

      <!-- card body -->
      <div class="body">
        <div class="vote-container">
          <div class="up" @click="updateScore('up')">
            <i class="icon" data-feather="arrow-up" stroke="#667085"></i>
          </div>
          <span>
            {{ comment.score ?? 0 }}
          </span>
          <div class="down" @click="updateScore('down')">
            <i class="icon" data-feather="arrow-down" stroke="#667085"></i>
          </div>
        </div>
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
            <ActionButton
              label="Done"
              action="edit"
              @triggerAction="updateComment"
            />
          </div>
        </div>
      </div>
      <div v-show="isMobile" class="bottom">
        <div v-if="currentUser?.id === comment.userId" class="action-container">
          <div class="delete" @click="deleteComment">
            <i class="icon" data-feather="trash-2" stroke="#B42318"></i>
            <p>Delete</p>
          </div>
          <div class="edit" @click="isEdit = true">
            <i class="icon" data-feather="edit-3" stroke="#7F56D9"></i>
            <p>Edit</p>
          </div>
        </div>
        <div v-else class="action-container reply" @click="isReply = true">
          <i class="icon" data-feather="corner-up-left" stroke="#7F56D9"></i>
          <p>Reply</p>
        </div>
      </div>
    </div>

    <AddCommentCard
      v-if="isReply"
      :style="{
        marginLeft: `${comment.nestedLevel * 48}px`,
        maxWidth: cardMaxWidth,
      }"
      :currentUser="currentUser"
      :parentRef="comment.id"
    />

    <!-- recursive card -->
    <div v-if="comment.replies && comment.replies.length > 0" class="replies">
      <CommentCard
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :currentUser="currentUser"
      />
    </div>
  </div>
</template>

<script lang="ts">
import feather from "feather-icons";
import {
  defineComponent,
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { CommentUI } from "@/type";
import BadgeTag from "./ui/BadgeTag.vue";
import { formatCreatedAt } from "@/utils";
import AddCommentCard from "../components/AddCommentCard.vue";
import ProfileAvatar from "../components/ui/ProfileAvatar.vue";
import ActionButton from "../components/ui/ActionButton.vue";

import { useCommentsStore } from "@/store/comment";
import { useUserStore } from "@/store/user";

export default defineComponent({
  name: "CommentCard",
  components: {
    BadgeTag,
    AddCommentCard,
    ProfileAvatar,
    ActionButton,
  },
  props: {
    comment: {
      type: Object as () => CommentUI,
      required: true,
    },
  },
  setup(props) {
    const commentStore = useCommentsStore();
    const userStore = useUserStore();
    const currentUser = userStore.currentUser;
    const imageUrl = computed(() => {
      return props.comment.user?.image
        ? require(`@/assets/images/${props.comment.user.image}`)
        : "";
    });

    const windowWidth = ref(window.innerWidth);

    const updateWindowWidth = () => {
      windowWidth.value = window.innerWidth;
    };
    onMounted(() => {
      feather.replace({ height: 20, width: 20 });
      window.addEventListener("resize", updateWindowWidth);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateWindowWidth);
    });

    const isMobile = computed(() => windowWidth.value <= 768);

    const cardMaxWidth = computed(() => {
      const initialMaxWidth = 768;
      // Decrease max-width by 48px for each nested level
      return `${initialMaxWidth - props.comment.nestedLevel * 48}px`;
    });

    const isEdit = ref(false);
    const isReply = ref(false);
    const parentRef = ref(props.comment.parentRef ?? null);
    const commentMessage = ref(props.comment.message);

    watch(isEdit, (change) => {
      if (change) {
        commentMessage.value = props.comment.message;
      }
    });

    const deleteComment = () => {
      commentStore.deleteComment(
        props.comment.id,
        props.comment?.parentRef ?? null
      );
    };

    function updateComment() {
      commentStore.updateComment(
        props.comment.id,
        commentMessage.value,
        props.comment.parentRef
      );
      isEdit.value = false;
    }

    function updateScore(type: "up" | "down") {
      commentStore.updateCommentScore(props.comment.id, type);
    }

    return {
      imageUrl,
      cardMaxWidth,
      formatCreatedAt,
      deleteComment,
      isEdit,
      isReply,
      commentMessage,
      updateComment,
      parentRef,
      currentUser,
      updateScore,
      windowWidth,
      isMobile,
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
  }

  .body {
    padding: 16px;
    display: flex;

    .vote-container {
      display: flex;
      align-items: center;
      flex-direction: column;

      .up,
      .down {
        height: 20px;
        width: 20px;
        padding: 12px 10px;
        border: 1px solid #d0d5dd;
        cursor: pointer;
        &:hover {
          .icon {
            stroke: #51596a;
            stroke-width: 3;
          }
        }
      }

      .up {
        border-radius: 8px 8px 0 0;
      }
      .down {
        border-radius: 0 0 8px 8px;
      }

      span {
        height: 40px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #344054;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        word-wrap: break-word;
        border-right: 1px solid #d0d5dd;
        border-left: 1px solid #d0d5dd;
      }
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
      width: calc(100% - 44px);
      padding: 10px 14px;
      background: white;
      box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
      border-radius: 8px;
      border: 1px solid #d0d5dd;
      margin-bottom: 16px;
      margin-left: 16px;
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
  }
}

.bottom {
  text-align: right;
  margin: 0 16px 16px 0;
}

.action-container {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  p {
    margin: 0 0 0 8px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }
}

.delete,
.edit,
.reply {
  display: inline-flex;
  align-items: center;
}

.reply {
  p {
    color: #6941c6;
  }

  &:hover {
    p {
      color: #9877e0;
    }
    .icon {
      stroke: #9877e0;
    }
  }
}

.delete {
  p {
    color: #b42318;
  }

  &:hover {
    p {
      color: #c34f46;
    }
    .icon {
      stroke: #c34f46;
    }
  }
}

.edit {
  margin-left: 16px;
  p {
    color: #6941c6;
  }
  &:hover {
    .icon {
      stroke: #9877e0;
    }
    p {
      color: #9877e0;
    }
  }
}

.bottom {
}
</style>
