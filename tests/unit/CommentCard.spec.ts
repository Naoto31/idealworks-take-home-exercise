import { shallowMount } from "@vue/test-utils";
import CommentCard from "@/components/CommentCard.vue";
import { CommentUI } from "@/type";
import { createPinia, setActivePinia } from "pinia";

jest.mock("@/utils", () => ({
  formatCreatedAt: jest.fn().mockReturnValue("Formatted Date"),
}));

describe("CommentCard.vue", () => {
  const pinia = createPinia();

  setActivePinia(pinia);
  it("render comment data correctly", () => {
    const comment: CommentUI = {
      id: "comment-1",
      userId: "user_1",
      parentRef: null,
      message:
        "Hey everyone, I'm having some trouble with my new smartphone. The battery life seems to be draining really fast, even with minimal usage. Any ideas on how to troubleshoot this issue?",
      createdAt: new Date(),
      score: 4,
      nestedLevel: 0,
      user: {
        id: "user_1",
        name: "Cassandra Dunn",
        image: "",
        role: "User",
        mentionName: "Cassandra Dunn",
      },
      isVisible: false,
      replies: [],
    };
    const wrapper = shallowMount(CommentCard, {
      props: { comment },
      global: {
        mocks: {
          isMobile: false,
          cardMaxWidth: "100%",
          currentUser: {
            id: "user_3",
            name: "Keiko Tanaka",
            image: "keiko-tanaka.png",
            role: "Marketing Coordinator",
            mentionName: "keiko",
          },
          areRepliesVisible: jest.fn().mockReturnValue(false),
          replyCountText: "+ 1 reply",
          isEdit: false,
          isReply: false,
          deleteComment: jest.fn(),
          showDeleteModal: false,
          formatMessage: jest.fn().mockReturnValue(comment.message),
          formatCreatedAt: jest.fn().mockReturnValue("Formatted Date"),
        },
        stubs: ["ProfileAvatar", "BadgeTag", "ActionButton", "ActionModal"],
        plugins: [pinia],
      },
    });

    expect(wrapper.text()).toContain(comment.user?.name);
    expect(wrapper.text()).toContain(comment.message);
  });
});
