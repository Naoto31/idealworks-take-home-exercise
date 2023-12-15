import { mount } from "@vue/test-utils";
import HomePage from "@/pages/HomePage.vue";
import CommentCard from "@/components/CommentCard.vue";
import AddCommentCard from "@/components/AddCommentCard.vue";
import data from "@/data.json";

describe("HomePage.vue", () => {
  let wrapper: any;

  beforeEach(() => {
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
    console.log(commentCards.length);
    console.log(data.comments.length);
    expect(commentCards.length).toBe(data.comments.length);
  });
});
