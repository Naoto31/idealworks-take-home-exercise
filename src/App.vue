<template>
  <HomePage />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HomePage from "./pages/HomePage.vue";

export default defineComponent({
  name: "App",
  components: {
    HomePage,
  },
});
</script>

<style lang="scss">
#app {
  font-family: "Inter", Avenir, Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
}
</style>
