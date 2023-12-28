<template>
  <q-layout view="lHh lpr lFf">
    <q-header class="q-pa-md text-white sombra-1">
      <q-toolbar class="row justify-between">
        <div class="row justify-between w-100" style="gap: 40px">
          <q-btn
            @click="miniDrawerStateController = !miniDrawerStateController"
            flat
            round
            dense
            icon="menu"
            size="lg"
            class="q-mr-sm"
          />
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
    <q-drawer
      v-model="drawer"
      :mini="miniDrawerState"
      show-if-above
      :width="250"
      :mini-width="80"
      :breakpoint="600"
      :overlay="!isDesktop"
      @click="miniDrawerStateController = false"
    >
      <q-scroll-area class="fit">
        <q-list class="q-pa-sm">
          <q-item clickable>
            <q-item-section avatar>
              <router-link
                class="square titulo-4"
                :class="{ mini: miniDrawerState, 'texto-3': miniDrawerState }"
                :to="{ name: 'administracion' }"
              >
                Aibiz
              </router-link>
            </q-item-section>
          </q-item>
          <q-separator class="q-my-sm" v-show="!miniDrawerState" />
        </q-list>
        <q-list class="list-links text-primary text-weight-bold q-pa-sm">
          <q-item
            clickable
            :to="{ name: 'empresas' }"
            exact
            exact-active-class="selected"
          >
            <q-item-section avatar>
              <q-icon name="apartment" />
            </q-item-section>
            <q-item-section class="titulo-color"> Empresas </q-item-section>
          </q-item>
          <q-separator color="secondary" class="q-mt-sm q-mb-xl" size="2px" />
          <q-item
            :to="{ name: 'usuarios' }"
            exact
            exact-active-class="selected"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section class="titulo-color"> Usuarios </q-item-section>
          </q-item>
          <q-separator color="secondary" class="q-mt-sm q-mb-xl" size="2px" />
          <q-item :to="{ name: 'monedas' }" exact exact-active-class="selected">
            <q-item-section avatar>
              <q-icon name="paid" />
            </q-item-section>
            <q-item-section class="titulo-color"> Monedas </q-item-section>
          </q-item>
          <q-separator color="secondary" class="q-mt-sm q-mb-xl" size="2px" />
        </q-list>
      </q-scroll-area>
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

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const drawer = ref(false);
const miniDrawerState = ref(false);

const instance = getCurrentInstance();

const isDesktop = computed(() => {
  return Screen.gt.xs;
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
  () => isDesktop.value,
  (value) => {
    if (value) {
      drawer.value = false;
      miniDrawerState.value = false;
    }
  }
);
</script>
<style scoped>
.square {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 55px;
  background: var(--q-secondary, #f25512);
  color: #fff;
  border-radius: 20px;
  transition: all 0.3s;
}
.square.mini {
  width: 35px;
  height: 35px;
  border-radius: 0;
}
.list-links {
  margin-top: 40px;
}
.list-links .selected .q-item__section--avatar i {
  color: #fff;
}
.list-links .selected .q-item__section--avatar i::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 6px;
  border-radius: 20px;
  background: var(--q-primary);
  z-index: -1;
}
</style>
