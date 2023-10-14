<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "stores/user-store";
const userStore = useUserStore();
onMounted(async () => {
  const token = localStorage.getItem("token");
  if (token) {
    userStore.setToken(token);
    const { data } = await userStore.getUser({ token });
    userStore.setUser(data);
  }
});
</script>
