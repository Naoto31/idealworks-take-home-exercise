<template>
  <button :class="['action-button', `button-${status}`]" @click="emitAction">
    {{ label }}
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "ActionButton",
  props: {
    label: {
      type: String,
      required: true,
    },
    action: {
      type: String as PropType<"send" | "edit">,
      required: true,
    },
    status: {
      type: String as PropType<"primary">,
      default: "primary",
    },
  },
  emits: ["triggerAction"],
  setup(props, { emit }) {
    const emitAction = () => {
      emit("triggerAction", props.action);
    };

    return { emitAction };
  },
});
</script>

<style lang="scss" scoped>
.action-button {
  height: 36px;
  padding: 8px 14px;
  color: white;
  border: none;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 8px;
  cursor: pointer;
}

.button-primary {
  background-color: #7f56d9;
  &:hover {
    background-color: #9877e0;
  }
}
</style>
