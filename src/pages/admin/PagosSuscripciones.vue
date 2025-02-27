<template>
  <q-page class="gap-2 page-main overflow-auto" style="background: #ffffff">
    <q-tabs
      v-model="tab"
      class="w-100"
      align="left"
      dense
      active-color="secondary"
    >
      <q-tab name="pagos" label="Pagos Suscripciones" />
      <q-tab name="modifcaciones" label="Modificaciones de suscripciones" />
    </q-tabs>
    <q-tab-panels v-model="tab" class="w-100">
      <q-tab-panel name="pagos">
        <q-tabs
          v-model="tabPagos"
          class="w-100"
          align="left"
          dense
          active-color="secondary"
        >
          <q-tab name="pendientes" label="Pendientes" />
          <q-tab name="historial" label="Historial" />
        </q-tabs>
        <q-tab-panels v-model="tabPagos" class="w-100">
          <q-tab-panel name="pendientes">
            <pagoSuscripcionesPendientes />
          </q-tab-panel>
          <q-tab-panel name="historial">
            <PagosHistorial />
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>
      <q-tab-panel name="modifcaciones">
        <q-tabs
          v-model="tabModificaciones"
          class="w-100"
          align="left"
          dense
          active-color="secondary"
        >
          <q-tab name="pendientes" label="Pendientes" />
          <q-tab name="historial" label="Historial" />
        </q-tabs>
        <q-tab-panels v-model="tabModificaciones" class="w-100">
          <q-tab-panel name="pendientes">
            <modificacionesSuscripcionesPendientes />
          </q-tab-panel>
          <q-tab-panel name="historial">
            <ModificacionesHistorial />
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { qDate } from "src/utils/qDate";

import endpoint from "../../services/Endpoint";
import { useUserStore } from "stores/user-store";
import Endpoint from "../../services/Endpoint";
import { debounce } from "quasar";
import newSuscriptionForm from "src/components/newSuscriptionForm.vue";
import pagoSuscripcionesPendientes from "src/components/pagoSuscripcionesPendientes.vue";
import modificacionesSuscripcionesPendientes from "src/components/modificacionesSuscripcionesPendientes.vue";
import ModificacionesHistorial from "src/components/ModificacionesHistorial.vue";
import PagosHistorial from "src/components/PagosHistorial.vue";

const userStore = useUserStore();
const tab = ref("pagos");
const tabModificaciones = ref("pendientes");
const tabPagos = ref("pendientes");
</script>
<style scoped>
.page-main {
  padding: 40px;
}
.alert-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  background: #ffff;
}
.alert-container > span {
  padding: 1.25rem 1.25rem 0;
}
@media only screen and (max-width: 600px) {
  .page-main {
    padding: 20px 10px;
  }
}
</style>
