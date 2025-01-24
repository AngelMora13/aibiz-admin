<template>
  <div class="q-pt-sm q-pb-xl q-px-none">
    <q-form
      ref="formRef"
      class="column q-col-gutter-md q-px-none"
      no-error-focus
    >
      <div class="form-field">
        <q-select
          dense
          class="col-12"
          color="black"
          label="Tipo"
          v-model="plan.tipo"
          :options="tiposPlanes"
          option-label="text"
          :rules="rules.required"
          options-selected-class="selectClass"
        >
        </q-select>
      </div>
      <div class="form-field">
        <q-input
          class="col-12"
          v-model="plan.nombre"
          dense
          label="Nombre"
          color="black"
          :rules="rules.required"
        />
      </div>
      <div class="form-field">
        <CurrencyField
          class="col-12"
          v-model:value="plan.precio"
          label="Precio"
          :rules="rules.required"
          :value="plan.precio"
        ></CurrencyField>
      </div>
      <div class="form-field">
        <q-select
          color="black"
          label="Modulos"
          v-model="plan.modulos"
          :options="modulosPlanes"
          :rules="rules.required"
          option-label="text"
          multiple
          class="col-12 q-px-none multipleSelect"
          stack-label
          options-selected-class="selectClass"
          text-color="white"
        >
          <template v-slot:selected-item="scope">
            <q-chip
              removable
              icon-remove="close"
              @remove="scope.removeAtIndex(scope.index)"
              :tabindex="scope.tabindex"
              color="secondary"
              text-color="white"
              class=""
              dense
            >
              <span>{{ scope.opt?.text.substring(0, 15) + "..." }}</span>
              <q-tooltip
                class="secondary"
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
              >
                <span style="font-size: 12px">{{ scope.opt?.text }}</span>
              </q-tooltip>
            </q-chip>
          </template>
        </q-select>
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
import { ModulosForPlan } from "app/constants/magicString";
const userStore = useUserStore();
const emit = defineEmits(["guardar-plan"]);
const props = defineProps({
  planData: {
    default: null,
    type: Object || null,
  },
});
const rules = {
  required: [(v) => !!v || "Campo obligatorio"],
};
const tiposPlanes = [
  { text: "Plan Comercial", value: "comercial" },
  { text: "Plan Contador", value: "contador" },
];
const isFormValid = ref(false);
const isLoading = ref(false);
const formRef = ref(null);
const plan = ref({
  tipo: null,
});
const modulosPlanes = ref([]);
onMounted(() => {
  //listContryOptions.value = props.listContry;
  modulosPlanes.value = ModulosForPlan;
  console.log({ modulos: modulosPlanes.value });
  if (props.planData) {
    plan.value = { ...props.planData };
  }
});
const guardarForm = () => {
  if (!isFormValid.value) return;
  isLoading.value = true;
  emit("guardar-plan", plan.value);
};
watch(
  () => plan.value,
  (value) => {
    formRef.value?.validate().then((success) => {
      isFormValid.value = success;
    });
  },
  { deep: true }
);
</script>
<style>
.selectClass {
  background-color: var(--q-secondary);
  color: #ffffff;
}
:deep(.multipleSelect .q-field--auto-height.q-field--labeled .q-field__native) {
  min-height: 100px !important;
}
</style>
