<template>
  <q-layout view="lHh lpr lFf">
    <q-header class="q-pa-md text-white sombra-1">
      <q-toolbar class="row justify-between">
        <div class="row justify-between w-100" style="gap: 40px">
          <q-btn flat round dense icon="menu" size="lg" class="q-mr-sm" />
        </div>
        <div class="navigation text-weight-bold">
          <div class="navigation-user">
            <UserLogout
              avatar-color="white"
              text-color="primary"
              view-path="/"
              view-label="Ir al home"
            ></UserLogout>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { useUserStore } from "stores/user-store";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import UserLogout from "components/UserLogout.vue";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (!userStore.isLogin) {
    router.push({
      path: "/login",
      query: {
        to: encodeURIComponent(route.path),
      },
    });
  }
});
</script>
<style scoped>
.q-toolbar {
  max-width: 1440px;
  margin: auto;
}
</style>
