<template>
  <div class="row no-wrap justify-center items-center">
    <q-avatar
      class="q-mr-sm"
      color="primary"
      text-color="white"
      icon="people"
    ></q-avatar>
    {{ userStore.user.nombre }}

    <q-menu>
      <div class="column">
        <p class="q-ma-none text-subtitle2">Cuenta</p>
      </div>
    </q-menu>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useUserStore } from "stores/user-store";
const userStore = useUserStore();
</script>
