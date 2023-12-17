import { shallowMount } from "@vue/test-utils";
import ActionModal from "@/components/ui/ActionModal.vue";
import ActionButton from "@/components/ui/ActionButton.vue";

describe("ActionModal.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(ActionModal, {
      props: { message: "Are you sure you want to delete the comment?" },
      global: {
        stubs: { ActionButton },
      },
    });
  });

  it("renders the message passed via props", () => {
    expect(wrapper.text()).toContain(
      "Are you sure you want to delete the comment?"
    );
  });

  it("emits confirm-modal event when the confirm button is clicked", async () => {
    await wrapper.find(".right-btn").trigger("click");
    expect(wrapper.emitted("confirm-modal")).toBeTruthy();
  });

  it("emits cancel-modal event when the cancel button is clicked", async () => {
    await wrapper.findComponent(ActionButton).trigger("click");
    expect(wrapper.emitted("cancel-modal")).toBeTruthy();
  });
});
