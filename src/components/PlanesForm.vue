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
          hide-bottom-space
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
          hide-bottom-space
        />
      </div>
      <div class="form-field">
        <q-input
          v-model="plan.cantidadEmpresas"
          dense
          hide-bottom-space
          color="black"
          inputmode="numeric"
          label="Cantidad de empresas"
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
          v-model="plan.cantidadUsuarios"
          dense
          hide-bottom-space
          color="black"
          inputmode="numeric"
          label="Cantidad de Usuarios"
          :rules="rules.required"
          mask="#"
          reverse-fill-mask
          :min="1"
          :max="99"
        >
        </q-input>
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
        <CurrencyField
          class="col-12"
          v-model:value="plan.destuento6"
          label="Descuento a 6 meses (%)"
          :value="plan.destuento6"
        ></CurrencyField>
      </div>
      <div class="form-field">
        <CurrencyField
          class="col-12"
          v-model:value="plan.descuento12"
          label="Descuento a 12 meses (%)"
          :value="plan.descuento12"
        ></CurrencyField>
      </div>
      <div class="form-field">
        <q-list>
          <div class="flex justify-end">
            <q-btn color="secondary" dense @click="selectAll"
              >Seleccionar todo</q-btn
            >
          </div>
          <template v-for="group in groupedModulos">
            <q-item-label
              header
              v-if="group.length"
              :key="group[0].tipo"
              class="q-py-none"
            >
              {{ getTipoText(group[0].tipo) }}
            </q-item-label>
            <q-item v-for="modulo in group" :key="modulo.value" dense>
              <q-item-section class="listModulos">{{
                modulo.text
              }}</q-item-section>
              <q-item-section side top>
                <q-checkbox v-model="modulo.activo" dense color="secondary" />
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
    </q-form>
    <div
      :class="
        planData ? 'row justify-between q-pt-md' : 'row justify-end q-pt-md'
      "
    >
      <q-btn
        color="negative"
        dense
        v-if="planData"
        @click="openAlertDelete = true"
      >
        Eliminar
      </q-btn>
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
  <q-dialog v-model="openAlertDelete" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm"
          >¿Estás seguro de que deseas eliminar este plan?</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="secondary" v-close-popup />
        <q-btn
          flat
          label="Eliminar"
          color="negative"
          @click="emit('eliminar-plan', { ...plan })"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted, computed, watch, defineProps, defineEmits } from "vue";
import { useUserStore } from "stores/user-store";
import endpoint from "../services/Endpoint";
import CurrencyField from "src/components/CurrencyField.vue";
import { ModulosForPlan } from "app/constants/magicString";
const userStore = useUserStore();
const emit = defineEmits(["guardar-plan", "eliminar-plan"]);
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
const openAlertDelete = ref(false);
const formRef = ref(null);
const plan = ref({
  tipo: null,
  nombre: null,
  cantidadEmpresas: null,
  cantidadUsuarios: null,
  precio: 0,
  descuento12: 0,
  destuento6: 0,
  modulos: [],
});
const groupedModulos = computed(() => {
  return Object.values(
    plan.value.modulos.reduce((groups, modulo) => {
      if (!groups[modulo.tipo]) {
        groups[modulo.tipo] = [];
      }
      groups[modulo.tipo].push(modulo);
      return groups;
    }, {})
  );
});
onMounted(() => {
  //listContryOptions.value = props.listContry;
  plan.value.modulos = structuredClone(ModulosForPlan);
  console.log({ modulos: plan.value.modulos, dos: ModulosForPlan });
  if (props.planData) {
    plan.value = { ...props.planData };
  }
});
const guardarForm = () => {
  if (!isFormValid.value) return;
  isLoading.value = true;
  emit("guardar-plan", plan.value);
};
const getTipoText = (tipo) => {
  const tipoTextos = {
    gestionContable: "Gestión Contable",
    gestionTributaria: "Gestión Tributaria",
    gestionOperativa: "Gestión Operativa",
    gestionFinanciera: "Gestión Financiera",
  };
  return tipoTextos[tipo] || "Otros";
};
const selectAll = () => {
  plan.value.modulos.forEach((modulo) => {
    modulo.activo = !modulo.activo;
  });
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
.listModulos {
  font-size: 12px;
}
</style>
