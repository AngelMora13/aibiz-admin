<template>
  <q-page class="login-page row no-wrap">
    <div class="wrap-content col-12 col-md-6">
      <LoginForm v-if="isLoginSelected" @login-sucess="handleLogin"></LoginForm>
      <RegistrarForm v-else></RegistrarForm>
    </div>
    <div class="wrap-content col-12 col-md-6" v-if="isDesktop">
      <div
        class="banner"
        :style="{
          '--bg-color': isLoginSelected
            ? getCssVar('primary')
            : getCssVar('secondary'),
        }"
      ></div>
    </div>
  </q-page>
</template>
<script setup>
import { onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Screen } from "quasar";
import { getCssVar } from "quasar";

import { useUserStore } from "stores/user-store";
import LoginForm from "components/LoginForm.vue";
import RegistrarForm from "components/RegistrarForm.vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
let isLoginSelected = true;
let routerToAfterLogin = "";

const isDesktop = computed(() => {
  return Screen.gt.sm;
});
onMounted(() => {
  if (userStore.isLogin) router.push({ name: "administracion" });
  const query = route.query;
  isLoginSelected = !(query && query["registrar"]);
});

const handleLogin = ({ persona, token }) => {
  if (persona && persona._id && token) {
    userStore.loginSuccess({ persona, token });
  }
};
watch(
  () => userStore.isLogin,
  (value) => {
    if (routerToAfterLogin && value) return router.push(routerToAfterLogin);
    router.push({ name: "administracion" });
  }
);
watch(
  () => route.query,
  (value) => {
    isLoginSelected = !(value && value["registrar"]);
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
