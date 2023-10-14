<template>
  <div
    class="row no-wrap justify-center items-center user-control cursor-pointer"
  >
    <q-avatar
      class="q-mr-sm"
      :color="avatarColor"
      :text-color="textColor"
      icon="person"
    ></q-avatar>
    <span class="text-no-wrap">{{ userStore.user.nombre }}</span>

    <q-menu>
      <div class="column q-pa-md gap-1 text-primary">
        <p class="q-ma-none text-subtitle2">Cuenta</p>
        <div class="row no-wrap justify-center items-center">
          <q-avatar
            class="q-mr-sm"
            color="primary"
            text-color="white"
            icon="person"
          ></q-avatar>
          <div class="column">
            <span class="text-no-wrap texto-3">{{
              userStore.user.nombre
            }}</span>
            <span class="email-text text-no-wrap texto-4 overflow-hidden">{{
              userStore.user.email
            }}</span>
          </div>
        </div>
        <q-separator color="secondary" />
        <q-btn
          color="primary"
          flat
          dense
          class="no-hover texto-4 text-capitalize items-start q-pa-none"
          :ripple="false"
          :to="viewPath"
        >
          <q-icon name="manage_accounts" left></q-icon>
          {{ viewLabel }}
        </q-btn>
        <q-separator color="secondary" />
        <q-btn
          color="primary"
          flat
          dense
          class="no-hover texto-4 text-capitalize items-start q-pa-none"
          :ripple="false"
          to="/logout"
        >
          <q-icon name="logout" left></q-icon>
          Salir
        </q-btn>
      </div>
    </q-menu>
  </div>
</template>
<script setup>
import { defineProps, computed } from "vue";
import { useUserStore } from "stores/user-store";
const userStore = useUserStore();
const props = defineProps({
  viewPath: {
    default: "/",
    type: String,
  },
  viewLabel: {
    default: "Ir al Home",
    required: true,
    type: String,
  },
  avatarColor: {
    default: "primary",
    type: String,
  },
  textColor: {
    default: "white",
    type: String,
  },
});
</script>
<style scoped>
.user-control {
  padding: 10px;
  border-radius: 10px;
}
.user-control:hover {
  opacity: 0.85;
}
.email-text {
  max-width: 15ch;
  text-overflow: ellipsis;
}
.no-hover .q-focus-helper {
  display: none;
}
</style>
