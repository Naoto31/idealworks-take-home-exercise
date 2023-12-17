<template>
  <div class="card">
    <div class="header">
      <div class="profile">
        <ProfileAvatar
          :user="currentUser"
          :showDot="true"
          :size="48"
          :dotWidth="12"
        />
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
      <ActionButton
        v-if="parentRef"
        label="Cancel"
        action="cancel"
        status="default"
        @triggerAction="cancel"
        class="cancel-btn"
      />
      <ActionButton label="Send" action="send" @triggerAction="sendComment" />
    </div>
  </div>
</template>

<script lang="ts">
import { User } from "@/type";
import { computed, defineComponent, ref } from "vue";
import { setComment } from "@/helpers/comment.helper";
import { useCommentsStore } from "@/store/comment";
import { useUserStore } from "@/store/user";
import ProfileAvatar from "@/components/ui/ProfileAvatar.vue";
import ActionButton from "@/components/ui/ActionButton.vue";

export default defineComponent({
  name: "AddCommentCard",
  props: {
    parentRef: {
      type: String,
      default: null,
    },
  },
  components: {
    ProfileAvatar,
    ActionButton,
  },
  setup(props, context) {
    const newComment = ref("");
    const commentStore = useCommentsStore();
    const userStore = useUserStore();
    const currentUser = userStore.currentUser;

    const imageUrl = computed(() => {
      return currentUser?.image
        ? require(`@/assets/images/${currentUser.image}`)
        : "";
    });

    const sendComment = () => {
      if (newComment.value.trim() !== "") {
        const data = {
          currentUser: currentUser,
          parentRef: props.parentRef,
        } as { currentUser: User; parentRef: string };
        const commentObj = setComment(data, newComment.value);
        commentStore.addComment(commentObj);
        context.emit("emit-reply");
        newComment.value = "";
      }
    };

    const cancel = () => {
      context.emit("emit-cancel");
    };

    return { imageUrl, newComment, sendComment, currentUser, cancel };
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

    .cancel-btn {
      margin-right: 16px;
    }
  }
}
</style>
