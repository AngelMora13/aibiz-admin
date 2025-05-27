<template>
  <q-page class="gap-2 page-main overflow-auto">
    <q-card class="row q-col-gutter-md q-ma-none">
      <q-card-section class="column col-12 col-sm-6 col-md-4">
        <div class="text-h6 text-center">Transferencia</div>
        <q-separator />
        <q-form class="q-mt-md q-mx-auto" style="max-width: 400px">
          <div class="row">
            <div class="col-12 q-pb-md">
              <q-input
                v-model="transferencia.nroCuenta"
                label="Número de cuenta"
                dense
                color="secondary"
              />
            </div>
            <div class="col-12 q-pb-md">
              <DocumentoIdentidadInput
                v-model:value="transferencia.documentoIdentidad"
                :optional="true"
                color="secondary"
              />
            </div>
            <div class="col-12 q-pb-md">
              <q-input
                v-model="transferencia.nombre"
                label="Nombre"
                dense
                color="secondary"
              />
            </div>
          </div>
        </q-form>
        <q-card-actions class="justify-end q-mt-auto">
          <q-btn
            color="secondary"
            unelevated
            :loading="isLoading"
            @click="guardarMetodoPago(transferencia)"
          >
            Guardar
          </q-btn>
        </q-card-actions>
      </q-card-section>
      <q-card-section class="column col-12 col-sm-6 col-md-4">
        <div class="text-h6 text-center">Pago movil</div>
        <q-separator />
        <q-form class="q-mt-md q-mx-auto" style="max-width: 400px">
          <div class="row">
            <div class="col-12 q-pb-md">
              <q-input
                v-model="pagoMobil.telefono"
                label="Número de teléfono"
                dense
                color="secondary"
              />
            </div>
            <div class="col-12 q-pb-md">
              <q-input
                v-model="pagoMobil.banco"
                label="Banco"
                dense
                color="secondary"
              />
            </div>
            <div class="col-12 q-pb-md">
              <DocumentoIdentidadInput
                v-model:value="pagoMobil.documentoIdentidad"
                :optional="true"
                color="secondary"
              />
            </div>
            <div class="col-12 q-pb-md">
              <q-input
                v-model="pagoMobil.nombre"
                label="Nombre"
                dense
                color="secondary"
              />
            </div>
          </div>
        </q-form>
        <q-card-actions class="justify-end q-mt-auto">
          <q-btn
            color="secondary"
            unelevated
            :loading="isLoading"
            @click="guardarMetodoPago(pagoMobil)"
          >
            Guardar
          </q-btn>
        </q-card-actions>
      </q-card-section>
      <q-card-section class="column col-12 col-sm-6 col-md-4">
        <div class="text-h6 text-center">Zelle</div>
        <q-separator />
        <q-form class="q-mt-md q-mx-auto" style="max-width: 400px">
          <div class="row">
            <div class="col-12 q-pb-md">
              <q-input
                v-model="zelle.correo"
                label="Correo"
                dense
                color="secondary"
              />
            </div>
            <div class="col-12 q-pb-md">
              <q-input
                v-model="zelle.nombre"
                label="Nombre"
                dense
                color="secondary"
              />
            </div>
          </div>
        </q-form>
        <q-card-actions class="justify-end q-mt-auto">
          <q-btn
            color="secondary"
            unelevated
            :loading="isLoading"
            @click="guardarMetodoPago(zelle)"
          >
            Guardar
          </q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import Endpoint from "src/services/Endpoint";
import DocumentoIdentidadInput from "src/components/DocumentoIdentidadInput.vue";

const metodosPago = ref([]);
const isLoading = ref(false);
const transferencia = ref({
  type: "transferencia",
  nroCuenta: "",
  documentoIdentidad: "",
  nombre: "",
});
const pagoMobil = ref({
  type: "pagoMobil",
  telefono: "",
  documentoIdentidad: "",
  banco: "",
});
const zelle = ref({
  type: "zelle",
  correo: "",
  nombre: "",
});
onMounted(async () => {
  getMetodosPago();
});
const getMetodosPago = async () => {
  isLoading.value = true;
  try {
    const { data } = await Endpoint.metodosPago({
      path: "get",
      body: {},
    });
    metodosPago.value = data.metodosPago || [];
    setMetodosPago();
  } catch (e) {
    console.log(e);
  }
  isLoading.value = false;
};

const setMetodosPago = () => {
  metodosPago.value.forEach((item) => {
    if (item.type === "transferencia") {
      transferencia.value = item;
    }
    if (item.type === "pagoMobil") {
      pagoMobil.value = item;
    }
    if (item.type === "zelle") {
      zelle.value = item;
    }
  });
};

const guardarMetodoPago = async (metodo) => {
  isLoading.value = true;
  try {
    await Endpoint.metodosPago({
      body: {
        type: metodo.type,
        metodo,
      },
      path: "save",
    });
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  }
  isLoading.value = false;
};
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
