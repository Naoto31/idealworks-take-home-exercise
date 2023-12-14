<template>
  <div :style="{ marginLeft: `${nestedLevel * 20}px` }" class="card">
    <img :src="avatar" alt="User avatar" class="avatar" />
    <div class="content">
      <h3>{{ username }}</h3>
      <p>{{ message }}</p>
      <span>{{ createdAt }}</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "CommentCard",
  props: {
    avatar: String,
    username: String,
    message: String,
    createdAt: [String, Date],
    nestedLevel: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style>
.card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
