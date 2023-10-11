<template>
  <q-page class="login-page row no-wrap">
    <div class="wrap-content col-12 col-md-6">
      <LoginForm v-if="isLogin"></LoginForm>
      <RegistrarForm v-else></RegistrarForm>
    </div>
    <div class="wrap-content col-12 col-md-6" v-if="isDesktop">
      <div
        class="banner"
        :style="{
          '--bg-color': isLogin ? getCssVar('primary') : getCssVar('secondary'),
        }"
      ></div>
    </div>
  </q-page>
</template>
<script setup>
import { onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Screen } from "quasar";

import LoginForm from "components/LoginForm.vue";
import RegistrarForm from "components/RegistrarForm.vue";
import { getCssVar } from "quasar";

const router = useRouter();
const route = useRoute();
let isLogin = true;
onMounted(() => {
  const query = route.query;
  isLogin = !(query && query["registrar"]);
});
const isDesktop = computed(() => {
  return Screen.gt.sm;
});
watch(
  () => {
    return route.query;
  },
  (value) => {
    isLogin = !(value && value["registrar"]);
    console.log(value);
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
