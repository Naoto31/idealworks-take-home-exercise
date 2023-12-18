<template>
  <div>
    <div
      :style="{
        marginLeft: isMobile
          ? `${Math.min(comment.nestedLevel * 56, 56)}px`
          : `${comment.nestedLevel * 56}px`,
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
          <div>
            <p>{{ comment.user?.name }}</p>
            <p v-show="isMobile" class="mobile-createdAt">
              {{ formatCreatedAt(comment.createdAt) }}
            </p>
          </div>
          <BadgeTag
            v-if="currentUser?.id === comment.userId"
            text="You"
            class="badge"
          />
          <BadgeTag
            v-if="!areRepliesVisible(comment.id)"
            :text="replyCountText"
            status="success"
            class="badge"
          />
          <span v-show="!isMobile">{{
            formatCreatedAt(comment.createdAt)
          }}</span>
        </div>
        <div class="header-right">
          <div
            v-if="comment.replies && comment.replies.length > 0"
            @click="toggleReplies(comment.id)"
            class="reply-badge"
            :style="{ 'margin-right': isMobile ? '0' : '16px' }"
          >
            <BadgeTag
              v-show="!areRepliesVisible(comment.id)"
              text="Expand"
              status="focus"
              class="reply-toggle-icon badge"
            />
            <BadgeTag
              v-show="areRepliesVisible(comment.id)"
              text="Minimize"
              status="focus"
              class="reply-toggle-icon badge"
            />
          </div>

          <!-- action container -->
          <div v-show="!isMobile">
            <div
              v-if="currentUser?.id === comment.userId"
              class="action-container"
            >
              <div class="delete" @click="showDeleteModal = true">
                <i class="icon" data-feather="trash-2" stroke="#B42318"></i>
                <p>Delete</p>
              </div>
              <div class="edit" @click="isEdit = true">
                <i class="icon" data-feather="edit-3" stroke="#7F56D9"></i>
                <p>Edit</p>
              </div>
            </div>
            <div v-else class="action-container reply" @click="isReply = true">
              <i
                class="icon"
                data-feather="corner-up-left"
                stroke="#7F56D9"
              ></i>
              <p>Reply</p>
            </div>
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
        <div
          v-if="!isEdit"
          class="message"
          v-html="formatMessage(comment.message)"
        ></div>
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
              label="Cancel"
              action="cancel"
              status="default"
              @triggerAction="isEdit = false"
              class="cancel-btn"
            />
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
          <div class="delete" @click="showDeleteModal = true">
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
        marginLeft: isMobile
          ? `${Math.min(comment.nestedLevel * 56, 56)}px`
          : `${comment.nestedLevel * 56}px`,
        maxWidth: cardMaxWidth,
      }"
      :currentUser="currentUser"
      :parentRef="comment.id"
      :mentionName="comment.user?.mentionName"
      @emit-reply="isReply = false"
      @emit-cancel="isReply = false"
    />

    <!-- recursive card -->
    <div v-if="areRepliesVisible(comment.id)" class="replies">
      <CommentCard
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :currentUser="currentUser"
      />
    </div>

    <ActionModal
      v-show="showDeleteModal"
      message="Are you sure you want to delete this comment?"
      @cancel-modal="showDeleteModal = false"
      @confirm-modal="deleteComment"
    />
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
import ActionModal from "../components/ui/ActionModal.vue";

import { useCommentsStore } from "@/store/comment";
import { useUserStore } from "@/store/user";

export default defineComponent({
  name: "CommentCard",
  components: {
    BadgeTag,
    AddCommentCard,
    ProfileAvatar,
    ActionButton,
    ActionModal,
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
    const users = userStore.users ? userStore.users : [];
    const windowWidth = ref(window.innerWidth);
    const isMobile = computed(() => windowWidth.value <= 768);
    const isEdit = ref(false);
    const isReply = ref(false);
    const showDeleteModal = ref(false);
    const commentMessage = ref(props.comment.message);
    const parentRef = ref(props.comment.parentRef ?? null);
    const mentionNamesList = users.map((value) => value.mentionName);

    const updateWindowWidth = () => {
      windowWidth.value = window.innerWidth;
    };

    watch(isEdit, (change) => {
      if (change) {
        commentMessage.value = props.comment.message;
      }
    });

    onMounted(() => {
      feather.replace({ height: 20, width: 20 });
      window.addEventListener("resize", updateWindowWidth);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateWindowWidth);
    });

    const cardMaxWidth = computed(() => {
      const initialMaxWidth = 768;
      // Decrease max-width by 56px for each nested level
      return `${initialMaxWidth - props.comment.nestedLevel * 56}px`;
    });

    function deleteComment() {
      commentStore.deleteComment(
        props.comment.id,
        props.comment?.parentRef ?? null
      );
    }

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

    const toggleReplies = (commentId: string) => {
      if (repliesVisible.value[commentId] === undefined) {
        repliesVisible.value[commentId] = false;
      } else {
        repliesVisible.value[commentId] = !repliesVisible.value[commentId];
      }
      commentStore.updateCommentShowAndHide(
        commentId,
        repliesVisible.value[commentId]
      );
    };

    const areRepliesVisible = (commentId: string) => {
      return repliesVisible.value[commentId] !== false;
    };

    const replyCountText = computed(() => {
      const replyCount = props.comment.replies?.length
        ? props.comment.replies.length
        : 0;
      return replyCount === 1 ? "+ 1 reply" : `+ ${replyCount} replies`;
    });

    function formatMessage(message: string) {
      let formatted = message;
      // regex to stop at commas, periods, or spaces after the mention
      for (let name of mentionNamesList) {
        const regex = new RegExp(`@${name}`, "g");
        formatted = formatted.replace(regex, `<b>@${name}</b>`);
      }
      return formatted;
    }

    // Add a new reactive property for tracking which comments have their replies visible
    const repliesVisible = ref<{ [key: string]: boolean }>({});
    const allComments = commentStore.allComments;

    // initialize replies Visible
    for (const comment of allComments) {
      if (comment.id && comment.isVisible !== undefined) {
        repliesVisible.value[comment.id] = comment.isVisible;
      }
    }

    return {
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
      toggleReplies,
      areRepliesVisible,
      replyCountText,
      formatMessage,
      showDeleteModal,
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

    &:hover {
      .reply-toggle-icon {
        display: block;
      }
    }

    &.has-replies {
      cursor: pointer;
      &:hover {
        background-color: #fafafa;
      }
    }

    .profile {
      display: flex;
      align-items: center;

      p {
        margin: 0 0 0 16px;
        color: var(--gray-700, #344054);
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
      }

      .mobile-createdAt {
        color: var(--gray-500);
        font-weight: 400;
      }

      .badge {
        margin-left: 16px;
      }

      span {
        margin-left: 16px;
        color: var(--gray-500);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
      }
    }
    .header-right {
      display: flex;
      align-items: center;
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
      color: var(--gray-500);
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

    .cancel-btn {
      margin-right: 16px;
    }
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

.reply-toggle-icon {
  display: none;
  cursor: pointer;
  margin-left: 16px;
}

.delete,
.edit,
.reply {
  display: inline-flex;
  align-items: center;
}

.reply {
  p {
    color: var(--primary-text-color, #6941c6);
  }

  &:hover {
    p {
      color: var(--primary-hover-color, #9877e0);
    }
    .icon {
      stroke: var(--primary-hover-color, #9877e0);
    }
  }
}

.delete {
  p {
    color: var(--danger-color, #b42318);
  }

  &:hover {
    p {
      color: var(--danger-hover-color, #c34f46);
    }
    .icon {
      stroke: var(--danger-hover-color, #c34f46);
    }
  }
}

.edit {
  margin-left: 16px;
  p {
    color: var(--primary-text-color, #6941c6);
  }
  &:hover {
    .icon {
      stroke: var(--primary-hover-color, #9877e0);
    }
    p {
      color: var(--primary-hover-color, #9877e0);
    }
  }
}
</style>
