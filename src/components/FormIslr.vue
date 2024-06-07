<template>
  <div class="q-px-md q-pt-sm q-pb-xl">
    <h2 class="texto-2 q-mt-none">
      {{ islrData ? "Editar ISLR" : "Crear ISLR" }}
    </h2>
    <q-form ref="formRef" class="column q-col-gutter-md" no-error-focus>
      <div class="form-field">
        <q-input
          v-model="islr.nombre"
          dense
          label="Nombre"
          color="black"
          :rules="rules.required"
        />
      </div>
      <div class="form-field">
        <q-input
          v-model="islr.tipoRetencion"
          dense
          label="Tipo de retencion"
          color="black"
          :rules="rules.required"
        />
      </div>
      <div class="form-field">
        <q-input
          v-model="islr.valorRet"
          dense
          inputmode="numeric"
          label="Retención"
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
        <q-input
          v-model="islr.codigo"
          dense
          label="Código"
          color="black"
          :rules="rules.required"
        />
      </div>
      <div class="form-field">
        <q-select
          class="w-100"
          dense
          color="black"
          label="Tipo de calculo"
          v-model="islr.tipoCalculo"
          :options="['Bs.', '%', 'UT']"
          :rules="rules.required"
        >
        </q-select>
      </div>
      <div class="form-field">
        <CurrencyField
          v-model:value="islr.sustraendo"
          label="Sustraendo"
          class="col-6"
          :rules="rules.required"
          :value="islr.sustraendo"
        ></CurrencyField>
      </div>
      <div class="form-field">
        <CurrencyField
          v-model:value="islr.minimo"
          label="Mínimo"
          class="col-6"
          :rules="rules.required"
          :value="islr.minimo"
        ></CurrencyField>
      </div>
      <div class="form-field">
        <q-select
          label="País"
          color="black"
          v-model="islr.pais"
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
import CurrencyField from "src/components/CurrencyField.vue";
const userStore = useUserStore();
const emit = defineEmits(["guardar-islr"]);
const props = defineProps({
  islrData: {
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
const islr = ref({
  nombre: "",
  tipoRetencion: "",
  valorRet: "",
  codigo: "",
  tipoCalculo: "",
  sustraendo: 0,
  minimo: 0,
  pais: "",
});
const listContryOptions = ref([]);
onMounted(() => {
  //listContryOptions.value = props.listContry;
  if (props.islrData) {
    islr.value = { ...props.islrData };
  }
});
const guardarForm = () => {
  if (!isFormValid.value) return;
  isLoading.value = true;
  emit("guardar-islr", islr.value);
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
watch(
  () => islr.value,
  (value) => {
    formRef.value?.validate().then((success) => {
      isFormValid.value = success;
    });
  },
  { deep: true }
);
</script>
