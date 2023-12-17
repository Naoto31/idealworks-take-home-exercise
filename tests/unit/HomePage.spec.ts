import { mount } from "@vue/test-utils";
import HomePage from "@/pages/HomePage.vue";
import CommentCard from "@/components/CommentCard.vue";
import AddCommentCard from "@/components/AddCommentCard.vue";
import { createPinia, setActivePinia } from "pinia";
import data from "@/data.json";

describe("HomePage.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    // clear localStorage before each test
    window.localStorage.clear();

    // mock the localStorage with initial data
    window.localStorage.setItem("comments", JSON.stringify(data.comments));

    // Create and set an active Pinia instance
    const pinia = createPinia();
    setActivePinia(pinia);

    wrapper = mount(HomePage, {
      props: {},
      global: {
        stubs: {
          CommentCard,
          AddCommentCard,
        },
      },
    });
  });

  it("renders all the comments", () => {
    const commentCards = wrapper.findAllComponents(CommentCard);
    expect(commentCards.length).toBe(data.comments.length);
  });
});
