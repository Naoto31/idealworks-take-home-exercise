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

  it("applies the default class when no status is provided", () => {
    expect(wrapper.classes()).toContain("default");
  });

  it("applies the success class when status is success", () => {
    const successText = "Success Status";
    const wrapper = mount(BadgeTag, {
      props: { text: successText, status: "success" },
    });
    expect(wrapper.text()).toBe(successText);
    expect(wrapper.classes()).toContain("success");
  });
});
