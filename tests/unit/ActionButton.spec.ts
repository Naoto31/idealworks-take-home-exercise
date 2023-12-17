import { mount } from "@vue/test-utils";
import ActionButton from "@/components/ui/ActionButton.vue";

describe("ActionButton.vue", () => {
  it("renders the label passed via props", () => {
    const label = "Test Button";
    const wrapper = mount(ActionButton, {
      props: { label, action: "send" },
    });
    expect(wrapper.text()).toBe(label);
  });

  it("applies the correct class based on the status prop", () => {
    const wrapper = mount(ActionButton, {
      props: { label: "Test", action: "send", status: "danger" },
    });
    expect(wrapper.classes()).toContain("button-danger");
  });
});
