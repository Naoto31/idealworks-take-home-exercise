<template>
  <div class="tag" :class="statusClass">
    {{ text }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "BadgeTag",
  props: {
    text: {
      type: String,
      required: true,
    },
    status: {
      type: String as PropType<"default" | "success" | "focus">,
      default: "default",
    },
  },
  computed: {
    statusClass(): Record<string, boolean> {
      return {
        default: this.status === "default",
        success: this.status === "success",
        focus: this.status === "focus",
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.tag {
  padding: 2px 8px;
  background: var(--default-background, #f2f4f7);
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #344054;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
}

.default {
  color: var(--gray-700, #344054);
  background: var(--default-background, #f2f4f7);
}

.success {
  color: var(--success, #027a48);
  background: var(--success-background, #ecfdf3);
}

.focus {
  color: var(--focus, #274bdb);
  background: var(--focus-background, #d9e4ff);
}
</style>
