<template>
  <q-layout view="lHh lpr lFf">
    <q-header class="q-pa-md bg-white text-primary sombra-1">
      <q-toolbar class="row justify-between">
        <div class="row justify-between w-100" style="gap: 40px">
          <q-btn
            v-if="!isDesktop"
            flat
            round
            dense
            icon="menu"
            size="xl"
            class="q-mr-sm"
          />
          <div class="square">Aibiz</div>
        </div>
        <div class="navigation text-weight-bold" v-if="isDesktop">
          <div class="navigation-page">
            <a href="#caracteristicas" class="navigation-item texto-2"
              >Caracteristicas</a
            >
            <a href="#nosotros" class="navigation-item texto-2">Nosotros</a>
          </div>
          <div class="navigation-user" v-if="!isLogin">
            <q-btn
              outline
              dense
              rounded
              :to="{
                path: '/login',
              }"
              class="q-px-xl text-capitalize texto-2 text-weight-bold btn-fixed-width"
            >
              Login
            </q-btn>
            <q-btn
              color="primary"
              dense
              rounded
              unelevated
              :to="{
                path: '/login',
                query: { registrar: true },
              }"
              class="q-px-xl text-capitalize texto-2"
            >
              Registrar
            </q-btn>
          </div>
          <div class="navigation-user" v-else>
            <UserLogout
              view-path="/administracion"
              view-label="Ir al Admin"
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
import { onMounted, computed } from "vue";
import { Screen } from "quasar";

import UserLogout from "components/UserLogout.vue";
import { useUserStore } from "stores/user-store";
const userStore = useUserStore();

onMounted(() => {});
const isLogin = computed(() => {
  return userStore.isLogin;
});
const breakpointName = computed(() => {
  return Screen.name;
});
const isDesktop = computed(() => {
  return Screen.gt.sm;
});
const isMobile = computed(() => {
  return Screen.lt.sm;
});
</script>
<style scoped>
.q-toolbar {
  max-width: 1440px;
  margin: auto;
}
.square {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 60px;
  background: var(--q-secondary, #f25512);
  color: #fff;
}
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 50px;
}
.navigation-page {
  display: flex;
  gap: 50px;
}
.navigation-user {
  display: flex;
  gap: 20px;
}
</style>
