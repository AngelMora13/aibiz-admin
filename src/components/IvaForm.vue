<template>
  <div class="q-px-md q-pt-sm q-pb-xl">
    <h2 class="texto-2 q-mt-none">
      {{ ivaData ? "Editar I.V.A" : "Crear I.V.A" }}
    </h2>
    <q-form ref="formRef" class="column q-col-gutter-md" no-error-focus>
      <div class="form-field">
        <q-input
          label="Descripción"
          color="black"
          v-model="iva.descripcion"
          :rules="rules.required"
        ></q-input>
      </div>
      <div class="form-field">
        <q-input
          v-model="iva.iva"
          dense
          :disable="iva.isExento || iva.isExonerado || iva.isNoSujeto"
          inputmode="numeric"
          label="I.V.A (%)"
          color="black"
          :rules="rules.required"
          mask="#"
          reverse-fill-mask
          :min="1"
          :max="99"
        >
        </q-input>
      </div>
      <div class="form-field">
        <q-checkbox
          v-model="iva.isExento"
          label="Exento"
          color="secondary"
          @update:model-value="updateValueIva($event, 'isExento')"
        />
        <q-checkbox
          v-model="iva.isExonerado"
          label="Exonerado"
          color="secondary"
          @update:model-value="updateValueIva($event, 'isExonerado')"
        />
        <q-checkbox
          v-model="iva.isNoSujeto"
          label="No sujeto"
          color="secondary"
          @update:model-value="updateValueIva($event, 'isNoSujeto')"
        />
        <q-checkbox
          v-model="iva.SinDeretoCredito"
          label="Sin derecho a crédito fiscal"
          color="secondary"
          @update:model-value="updateValueIva($event, 'SinDeretoCredito')"
        />
      </div>
      <div class="form-field">
        <q-input
          label="Nombre corto"
          color="black"
          v-model="iva.nombreCorto"
          :rules="rules.required"
          v-if="
            iva.SinDeretoCredito ||
            iva.isExento ||
            iva.isExonerado ||
            iva.isNoSujeto
          "
        ></q-input>
      </div>
      <div class="form-field">
        <q-select
          label="País"
          color="black"
          v-model="iva.pais"
          :options="listContryOptions"
          use-input
          input-debounce="0"
          @filter="filterFn"
          option-label="name"
          option-value="name"
          emit-value
          :rules="rules.required"
        ></q-select>
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
const emit = defineEmits(["guardar-iva"]);
const props = defineProps({
  ivaData: {
    default: null,
    type: Object || null,
  },
  listContry: {
    type: Array,
  },
});
const rules = {
  required: [(v) => !!v || "Campo obligatorio"],
};
const isFormValid = ref(false);
const isLoading = ref(false);
const formRef = ref(null);
const iva = ref({
  nombre: "",
  iva: "",
  pais: "",
  isExento: false,
  isExonerado: false,
  isNoSujeto: false,
  SinDeretoCredito: false,
  nombreCorto: "",
});
const listContryOptions = ref([]);
onMounted(() => {
  //listContryOptions.value = props.listContry;
  if (props.ivaData) {
    iva.value = { ...props.ivaData };
  }
});
const guardarForm = () => {
  if (!isFormValid.value) return;
  isLoading.value = true;
  emit("guardar-iva", iva.value);
};
const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      listContryOptions.value = props.listContry;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    listContryOptions.value = props.listContry.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};
const updateValueIva = (value, type) => {
  if (!value) iva.value.nombreCorto = "";
  if (value && type === "isExento") {
    iva.value.iva = 0;
    iva.value.isExonerado = false;
    iva.value.isNoSujeto = false;
    iva.value.SinDeretoCredito = false;
  }
  if (value && type === "isExonerado") {
    iva.value.iva = 0;
    iva.value.isExento = false;
    iva.value.isNoSujeto = false;
    iva.value.SinDeretoCredito = false;
  }
  if (value && type === "isNoSujeto") {
    iva.value.iva = 0;
    iva.value.isExonerado = false;
    iva.value.isExento = false;
    iva.value.SinDeretoCredito = false;
  }
  if (value && type === "SinDeretoCredito") {
    iva.value.isExonerado = false;
    iva.value.isNoSujeto = false;
    iva.value.isExento = false;
  }
};
watch(
  () => iva.value,
  (value) => {
    formRef.value?.validate().then((success) => {
      isFormValid.value = success;
    });
  },
  { deep: true }
);
</script>
