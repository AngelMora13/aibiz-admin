<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "stores/user-store";
const userStore = useUserStore();
onMounted(async () => {
  userStore.makeLogin();
});
</script>
