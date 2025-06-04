<template>
  <div class="q-px-md q-pt-sm q-pb-xl">
    <h2 class="texto-2 q-my-none" style="line-height: 50px">Valor U.T</h2>
    <q-form ref="formRef" class="column q-col-gutter-md" no-error-focus>
      <div class="form-field">
        <q-select
          label="País"
          color="black"
          v-model="valorUt.pais"
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
      <div class="form-field">
        <CurrencyField
          v-model:value="valorUt.valor"
          label="Valor UT"
          class="col-6"
          :rules="rules.required"
          :value="valorUt.valor"
        ></CurrencyField>
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
const emit = defineEmits(["guardar-ut"]);
const props = defineProps({
  value: {
    type: Object,
    default: () => ({}),
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
const valorUt = ref({
  pais: "",
  valor: 0,
});
const listContryOptions = ref([]);
onMounted(() => {
  if (props.value) {
    valorUt.value = props.value;
  }
});
const guardarForm = () => {
  if (!isFormValid.value) return;
  isLoading.value = true;
  emit("guardar-ut", valorUt.value);
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
      (v) => v.name.toLowerCase().indexOf(needle) > -1,
    );
  });
};
watch(
  () => valorUt.value,
  (value) => {
    formRef.value?.validate().then((success) => {
      isFormValid.value = success;
    });
  },
  { deep: true },
);
</script>
