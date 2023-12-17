import { mount } from "@vue/test-utils";
import BadgeTag from "@/components/ui/BadgeTag.vue";

describe("BadgeTag.vue", () => {
  let wrapper: any;
  const text = "Sample Text";

  beforeEach(() => {
    wrapper = mount(BadgeTag, {
      props: { text },
    });
  });
  it("renders the text passed via props", () => {
    expect(wrapper.text()).toBe(text);
  });
});
