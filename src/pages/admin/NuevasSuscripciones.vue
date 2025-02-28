<template>
  <q-page class="gap-2 page-main overflow-auto" style="background: #ffffff">
    <q-tabs
      v-model="tab"
      class="w-100"
      align="left"
      dense
      active-color="secondary"
    >
      <q-tab name="pendientes" label="Pendientes" />
      <q-tab name="historial" label="Historial" />
    </q-tabs>
    <q-tab-panels v-model="tab" class="w-100">
      <q-tab-panel name="pendientes">
        <NewSucripcionPendientes />
      </q-tab-panel>
      <q-tab-panel name="historial">
        <HistorialNewSuscripcion />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { qDate } from "src/utils/qDate";

import { useUserStore } from "stores/user-store";
import NewSucripcionPendientes from "src/components/NewSucripcionPendientes.vue";
import HistorialNewSuscripcion from "src/components/HistorialNewSuscripcion.vue";

const userStore = useUserStore();
const tab = ref("pendientes");
onMounted(async () => {});
</script>
<style scoped>
.page-main {
  padding: 40px;
}
</style>
