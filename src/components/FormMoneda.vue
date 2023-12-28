<template>
  <div class="q-px-md q-pt-sm q-pb-xl">
    <h2 class="texto-2 q-mt-none">
      {{ monedaData ? "Editar moneda" : "Crear moneda" }}
    </h2>
    <q-form ref="formRef" class="column q-col-gutter-md" no-error-focus>
      <div class="form-field">
        <q-input
          label="Nombre"
          color="black"
          v-model="moneda.nombre"
          :rules="rules.required"
        ></q-input>
      </div>
      <div class="form-field">
        <q-input
          label="Nombre corto"
          color="black"
          v-model="moneda.nombreCorto"
          :rules="rules.required"
        ></q-input>
      </div>
      <div class="form-field">
        <q-input
          label="Nombre interno"
          color="black"
          v-model="moneda.nombreInterno"
          :rules="rules.required"
        ></q-input>
      </div>
    </q-form>
    <div class="row justify-end q-pt-md">
      <q-btn
        color="black"
        @click="guardarForm"
        dense
        :disable="!isFormValid"
        :loading="isLoading"
      >
        Guardar
      </q-btn>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch, defineProps, defineEmits } from "vue";
import { useUserStore } from "stores/user-store";
import endpoint from "../services/Endpoint";
const userStore = useUserStore();
const emit = defineEmits(["guardar-usuario"]);
const props = defineProps({
  monedaData: {
    default: null,
    type: Object || null,
  },
});
const rules = {
  requeridos: [(v) => !!v || "Campo obligatorio"],
};
const isFormValid = ref(false);
const isLoading = ref(false);
const formRef = ref(null);
const moneda = ref({
  nombre: "",
  nombreCorto: "",
  nombreInterno: "",
});
onMounted(() => {
  if (props.monedaData) {
    moneda.value = { ...props.monedaData };
  }
});
const guardarForm = () => {
  if (!isFormValid.value) return;
  isLoading.value = true;
  emit("guardar-usuario", moneda.value);
};
watch(
  () => moneda.value,
  (value) => {
    formRef.value?.validate().then((success) => {
      isFormValid.value = success;
    });
  },
  { deep: true }
);
</script>
