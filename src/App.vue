<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "stores/user-store";
const userStore = useUserStore();
onMounted(async () => {
  const tokenLocal = localStorage.getItem("token");
  console.log({ tokenLocal });
  if (tokenLocal) {
    userStore.setToken(tokenLocal);
    const { data } = await userStore.getUser({ token: tokenLocal });
    userStore.setUser(data);
  }
});
</script>
