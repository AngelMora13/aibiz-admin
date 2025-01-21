<template>
  <q-layout view="hHh Lpr lff">
    <q-header :elevated="false" class="text-white bg-dark" bordered>
      <q-toolbar class="row justify-between">
        <div class="row">
          <q-btn
            v-if="!isDesktop"
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="miniDrawerStateController = !miniDrawerStateController"
          />
          <q-toolbar-title v-if="Screen.gt.sm">
            <router-link to="/administracion">
              <q-img
                src="~assets/logo.svg"
                alt="aibiz"
                fit="contain"
                width="100px"
              ></q-img>
            </router-link>
          </q-toolbar-title>
        </div>
        <div class="navigation text-weight-bold">
          <div class="navigation-user">
            <UserLogout
              avatar-color="white"
              text-color="black"
              view-path="/administracion"
              view-label="Ir al home"
            ></UserLogout>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawer"
      :mini="miniDrawerState"
      show-if-above
      :width="250"
      :mini-width="60"
      bordered
      :behavior="isDesktop ? 'desktop' : 'mobile'"
      class="text-white bg-dark"
      @click="isDesktop ? (miniDrawerStateController = false) : undefined"
    >
      <div>
        <TreeNavigation
          v-for="row of navLinks"
          :key="row.text"
          :node="row"
          :group="'some'"
          :mini-drawer="miniDrawerState"
        ></TreeNavigation>
      </div>
      <div
        class="absolute drawer-btn_open"
        :class="{
          'drawer-btn_close': miniDrawerStateController,
          hidden: !isDesktop,
        }"
        style="top: 15px; right: -17px"
      >
        <q-btn
          dense
          round
          unelevated
          color="accent"
          icon="chevron_left"
          class="text-white"
          @click.prevent.stop="
            isDesktop
              ? (miniDrawerStateController = !miniDrawerStateController)
              : undefined
          "
        />
      </div>
      <div class="column justify-end items-center q-pa-md">
        <router-link to="/administracion">
          <q-img
            src="~assets/logo.svg"
            alt="aibiz"
            fit="contain"
            :width="miniDrawerState ? '100%' : '130px'"
          ></q-img>
        </router-link>
      </div>
    </q-drawer>
    <q-page-container style="background: rgba(196, 196, 196, 0.2)">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { useUserStore } from "stores/user-store";
import { computed, watch, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Screen } from "quasar";

import UserLogout from "components/UserLogout.vue";
import TreeNavigation from "src/components/TreeNavigation.vue";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const drawer = ref(false);
const miniDrawerState = ref(false);

const instance = getCurrentInstance();

const navLinks = [
  {
    text: "Empresas",
    key: "0",
    icon: "apartment",
    route: "empresas",
  },
  {
    text: "Usuarios",
    key: "1",
    icon: "person",
    route: "usuarios",
  },
  {
    text: "Monedas",
    key: "2",
    icon: "paid",
    route: "monedas",
  },
  {
    text: "Bancos",
    key: "3",
    icon: "account_balance",
    route: "bancos",
  },
  {
    text: "Impuestos",
    key: "4",
    icon: "real_estate_agent",
    route: "impuestos",
  },
];

const isDesktop = computed(() => {
  return Screen.gt.sm;
});

const isMobile = computed(() => {
  return Screen.lt.sm;
});

const miniDrawerStateController = computed({
  get() {
    if (isDesktop.value) return miniDrawerState.value;
    return drawer.value;
  },
  set(value) {
    if (isDesktop.value) return (miniDrawerState.value = value);
    miniDrawerState.value = false;
    drawer.value = value;
  },
});

watch(
  () => isMobile.value,
  (value) => {
    if (!value) {
      drawer.value = false;
      miniDrawerState.value = false;
    }
  }
);
</script>
<style scoped>
.drawer-btn_open {
  transition: transform 0.3s;
  transform: scale(0.9);
}
.drawer-btn_close {
  transform: scale(0.7) rotate(180deg);
}
:deep(.q-item__section.q-item__section--avatar) {
  padding-right: 16px !important;
  min-width: auto;
}
</style>
