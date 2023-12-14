<template>
  <q-page class="login-page row no-wrap">
    <div class="column justify-center items-center w-100 mh-100">
      <q-spinner-hourglass color="primary" size="10em" />
    </div>
  </q-page>
</template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "stores/user-store";

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  if (userStore.isLogin) userStore.logOut();
  setTimeout(() => {
    router.push({ name: "home" });
  }, 1500);
});
</script>
