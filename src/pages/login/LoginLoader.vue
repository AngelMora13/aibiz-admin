<template>
  <q-page class="login-page row no-wrap">
    <div class="column justify-center items-center w-100 mh-100">
      <q-spinner-hourglass color="primary" size="10em" />
    </div>
  </q-page>
</template>
<script setup>
import { onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Screen } from "quasar";

import { useUserStore } from "stores/user-store";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
let routerToAfterLogin = "/administracion";
onMounted(() => {
  const query = route.query;
  if (query.to) routerToAfterLogin = decodeURIComponent(query.to);
  if (routerToAfterLogin && userStore.isLogin)
    return router.push(routerToAfterLogin);
  if (userStore.isLoginLoading === false && !userStore.isLogin)
    router.push({ name: "login" });
  /*setTimeout(() => {
    if (userStore.isLogin) return;
    router.push({ name: "login" });
  }, 2000);*/
});
watch(
  () => userStore.isLogin,
  (value) => {
    if (routerToAfterLogin && value) return router.push(routerToAfterLogin);
    router.push({ name: "administracion" });
  }
);
watch(
  () => userStore.isLoginLoading,
  (value) => {
    if (value === false && !userStore.isLogin) router.push({ name: "login" });
  }
);
</script>
<style scoped>
.login-page {
  max-width: 1440px;
  margin: auto;
}
.wrap-content {
  padding: clamp(20px, 4vw, 80px);
}
.banner {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: var(--bg-color, --q-primary);
}
</style>
