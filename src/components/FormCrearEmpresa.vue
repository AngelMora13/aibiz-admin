<template>
  <h5 class="titulo-color q-ma-none">Crear Empresa</h5>
  <q-form ref="crearEmpresaForm" class="w-100" no-error-focus>
    <q-input
      v-model="empresaData.razonSocial"
      class="q-mt-xs"
      placeholder="Razón Social"
      dense
      outlined
      color="primary"
      :rules="rules.requeridos"
    >
      <template v-slot:prepend>
        <q-icon name="format_color_text" color="secondary" />
      </template>
    </q-input>
    <div class="form-input-2row">
      <q-input
        v-model="empresaData.email"
        class="q-mt-lg"
        placeholder="Email"
        dense
        outlined
        color="primary"
        :rules="rules.email"
      >
        <template v-slot:prepend>
          <q-icon name="alternate_email" color="secondary" />
        </template>
      </q-input>
      <q-input
        v-model="empresaData.telefono"
        class="q-mt-lg"
        placeholder="Teléfono"
        dense
        outlined
        color="primary"
      >
        <template v-slot:prepend>
          <q-icon name="call" color="secondary" />
        </template>
      </q-input>
    </div>
    <div class="form-input-3row">
      <q-select
        v-model="empresaData.tipoDocumento"
        :options="typesDocument"
        class="q-mt-lg"
        dense
        outlined
        color="secondary"
        :rules="rules.requeridos"
      >
      </q-select>
      <q-input
        v-model="empresaData.documentoIdentidad"
        class="q-mt-lg"
        placeholder="Documento de Identidad"
        dense
        outlined
        color="primary"
        :rules="rules.requeridos"
      >
      </q-input>
      <q-input
        v-model="empresaData.subDominio"
        class="q-mt-lg"
        placeholder="Dominio"
        dense
        outlined
        suffix=".aibiz.com"
        color="primary"
        :rules="rules.requeridos"
      >
        <template v-slot:prepend>
          <q-icon name="language" color="secondary" />
        </template>
      </q-input>
    </div>
    <q-select
      v-model="empresaData.modulos"
      class="q-mt-lg"
      placeholder="Modulos Disponibles"
      dense
      multiple
      :options="listOfModules"
      option-label="nombre"
      option-value="_id"
      outlined
      color="primary"
    >
      <template v-slot:prepend>
        <q-icon name="list" color="secondary" />
      </template>
      <template v-slot:selected-item="scope">
        <q-chip
          removable
          dense
          @remove="scope.removeAtIndex(scope.index)"
          :tabindex="scope.tabindex"
          color="primary"
          text-color="white"
          class="q-pa-md"
        >
          {{ scope.opt.nombre }}
        </q-chip>
      </template>
    </q-select>
    <div class="row justify-end">
      <q-btn
        unelevated
        color="primary"
        class="q-mt-md"
        @click="crearSubDominio"
        :disable="!isFormValid"
        >Crear</q-btn
      >
    </div>
  </q-form>
</template>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useUserStore } from "stores/user-store";
import endpoint from "../services/Endpoint";
const userStore = useUserStore();
const crearEmpresaForm = ref(null);
const typesDocument = ["J", "V"];
const listOfModules = ref([]);
const empresaData = ref({
  razonSocial: "",
  email: "",
  telefono: "",
  tipoDocumento: "",
  documentoIdentidad: "",
  subDominio: "",
  modulos: [],
});
const rules = {
  email: [
    (v) => !!v || "Campo obligatorio",
    (v) => {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      return emailRegex.test(v) || "Correo invalido";
    },
  ],
  requeridos: [(v) => !!v || "Campo obligatorio"],
};
const isFormValid = ref(false);
onMounted(() => {
  getModules();
});
const getModules = async () => {
  try {
    const { data } = await endpoint.getListModules();
    listOfModules.value = data;
    console.log("nodulos", listOfModules);
  } catch (e) {
    console.log(e);
  }
};
const crearSubDominio = async () => {
  try {
    const token = userStore.$state.token;
    empresaData.value.documentoIdentidad = `${empresaData.value.tipoDocumento}${empresaData.value.documentoIdentidad}`;
    crearEmpresaForm.value?.validate().then(async (success) => {
      if (success) {
        console.log("formulario validado", success);
        const { data } = await endpoint.createSubDominio({
          token,
          empresaData: empresaData.value,
        });
        console.log(data);
        empresaData.value = {};
        console.log(empresaData.value);
      } else {
        console.log("form no valido", success);
      }
    });
  } catch (e) {
    console.log(e);
  }
};
watch(
  () => empresaData,
  (value) => {
    crearEmpresaForm.value?.validate().then((success) => {
      isFormValid.value = success;
    });
  },
  { deep: true }
);
</script>
<style>
.form-input-2row {
  display: flex;
  gap: 1rem;
}
.form-input-3row {
  display: flex;
  gap: 1rem;
}
</style>
