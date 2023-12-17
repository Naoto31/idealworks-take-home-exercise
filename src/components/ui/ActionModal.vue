<template>
  <div class="modal-overlay">
    <div class="modal">
      <p>{{ message }}</p>
      <div class="modal-actions">
        <ActionButton
          label="Cancel"
          action="cancel"
          status="default"
          @triggerAction="cancel"
        />
        <ActionButton
          label="Delete"
          action="send"
          status="danger"
          @triggerAction="confirm"
          class="right-btn"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ActionButton from "./ActionButton.vue";

export default defineComponent({
  name: "ActionModal",
  components: { ActionButton },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
  },

  setup(props, context) {
    function confirm() {
      context.emit("confirm-modal");
    }
    function cancel() {
      context.emit("cancel-modal");
    }

    return {
      cancel,
      confirm,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  min-width: 300px;

  p {
    font-size: 16px;
    color: #667085;
    margin-bottom: 20px;
    text-align: center;
  }
  .modal-actions {
    display: flex;
    justify-content: end;

    .right-btn {
      margin-left: 16px;
    }
  }
}
</style>
