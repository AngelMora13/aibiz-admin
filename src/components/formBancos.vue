<template>
  <div class="q-px-md q-pt-sm q-pb-xl">
    <h2 class="texto-2 q-mt-none">
      {{ bancoData ? "Editar banco" : "Crear banco" }}
    </h2>
    <q-form ref="formRef" class="column q-col-gutter-md" no-error-focus>
      <div class="form-field">
        <q-input
          label="Nombre"
          color="black"
          v-model="banco.nombre"
          :rules="rules.required"
        ></q-input>
      </div>
      <div class="form-field">
        <q-select
          label="País"
          color="black"
          v-model="banco.pais"
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
const emit = defineEmits(["guardar-banco"]);
const props = defineProps({
  bancoData: {
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
const banco = ref({
  nombre: "",
  pais: "",
});
const listContryOptions = ref([]);
onMounted(() => {
  //listContryOptions.value = props.listContry;
  if (props.bancoData) {
    banco.value = { ...props.bancoData };
  }
});
const guardarForm = () => {
  if (!isFormValid.value) return;
  isLoading.value = true;
  emit("guardar-banco", banco.value);
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
  () => banco.value,
  (value) => {
    formRef.value?.validate().then((success) => {
      isFormValid.value = success;
    });
  },
  { deep: true }
);
</script>
