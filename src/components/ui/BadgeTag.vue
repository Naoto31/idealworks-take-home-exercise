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
      type: String as PropType<"default" | "success">,
      default: "default",
    },
  },
  computed: {
    statusClass(): Record<string, boolean> {
      return {
        default: this.status === "default",
        success: this.status === "success",
      };
    },
  },
});
</script>

<style scoped>
.tag {
  padding: 2px 8px;
  background: #f2f4f7;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  display: inline-flex;
  text-align: center;
  color: #344054;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
}

.status-default {
  color: #344054;
  background: #f2f4f7;
}

.status-active {
  color: #ffffff;
  background: #28a745;
}
</style>
