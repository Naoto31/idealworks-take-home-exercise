<template>
  <div class="tag">
    {{ text }}
  </div>
</template>

<script lang="ts">
export default {
  name: "BadgeTag",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
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
</style>
