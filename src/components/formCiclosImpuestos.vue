<template>
  <div class="q-px-md q-pt-sm q-pb-xl">
    <h2 class="texto-2 q-mt-none">
      {{ itemCiclo ? "Editar ciclo de impuesto" : "Crear ciclo de impuesto" }}
    </h2>
    <q-form ref="formRef" class="column q-col-gutter-md" no-error-focus>
      <div class="form-field">
        <q-input
          label="Descripción"
          color="black"
          v-model="ciclo.descripcion"
          :rules="rules.required"
        ></q-input>
      </div>
      <div class="form-field">
        <q-input
          v-model="ciclo.fechaInicio"
          dense
          label="Fecha inicio"
          color="black"
          :rules="rules.required"
          :mask="maskInput2"
          fill-mask=""
          @update:model-value="addDateToInput"
          hide-bottom-space
          hint=""
          class="q-my-none q-py-none"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="fechaInicio"
                  color="black"
                  @update:model-value="
                    handleDatesChangeHasta($event, 'fechaInicio')
                  "
                  minimal
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="secondary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="form-field">
        <q-input
          v-model="ciclo.fechaFin"
          dense
          label="Fecha inicio"
          color="black"
          :rules="ciclo.isFechaActual ? [] : rules.required"
          :mask="maskInput2"
          fill-mask=""
          @update:model-value="updateFecha('fecha')"
          hide-bottom-space
          hint=""
          class="q-my-none q-py-none"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="fechaFin"
                  color="black"
                  @update:model-value="
                    handleDatesChangeHasta($event, 'fechaFin')
                  "
                  minimal
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="secondary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="form-field">
        <q-checkbox
          v-model="ciclo.isFechaActual"
          label="Hasta fecha actual"
          color="secondary"
          :rules="ciclo.fechaFin ? [] : rules.required"
          @update:model-value="updateFecha"
        />
      </div>
      <div class="form-field">
        <q-select
          label="Tipo de ciclo"
          color="black"
          v-model="ciclo.tipoCiclo"
          :options="tiposCiclos"
          use-input
          input-debounce="0"
          :rules="rules.required"
        ></q-select>
      </div>
      <div class="form-field">
        <q-select
          label="Tipo de ciclo"
          color="black"
          v-model="ciclo.tipoImpuesto"
          :options="tiposimpuestos"
          use-input
          input-debounce="0"
          :rules="rules.required"
        ></q-select>
      </div>
      <div class="form-field">
        <q-select
          label="País"
          color="black"
          v-model="ciclo.pais"
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
import { date, debounce } from "quasar";
import { qDate } from "src/utils/qDate";
const userStore = useUserStore();
const emit = defineEmits(["guardar-ciclo"]);
const props = defineProps({
  itemCiclo: {
    default: null,
    type: Object,
  },
  listContry: {
    type: Array,
  },
});
const rules = {
  required: [(v) => !!v || "Campo obligatorio"],
};
const qDateProxy = ref(null);
const isFormValid = ref(false);
const isLoading = ref(false);
const formRef = ref(null);
const fechaInicio = ref("");
const fechaFin = ref("");
const ciclo = ref({
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  isFechaActual: false,
  tipoCiclo: "",
  tipoImpuesto: "",
  pais: "",
});
const tiposCiclos = ["Mensual", "Quincenal", "Semanal"];
const tiposimpuestos = ["IVA", "RET ISLR", "RET IVA"];
const listContryOptions = ref([]);
onMounted(() => {
  //listContryOptions.value = props.listContry;
  if (props.itemCiclo) {
    ciclo.value = { ...props.itemCiclo };
    ciclo.value.fechaInicio = qDate(props.itemCiclo.fechaInicio).format(
      "DD/MM/YYYY"
    );
    ciclo.value.fechaFin = props.itemCiclo.fechaFin
      ? qDate(props.itemCiclo.fechaFin).format("DD/MM/YYYY")
      : "";
  }
});
const maskInput2 = computed(() => {
  const dateFormat = "DD/MM/YYYY";
  return dateFormat
    .replace("YYYY", "####")
    .replace("MM", "##")
    .replace("DD", "##");
});
const addDateToInput = debounce(() => {
  if (ciclo.value.fechaInicio) {
    const arrayFecha = ciclo.value.fechaInicio.split("/");
    const newFecha = new Date(arrayFecha[2], arrayFecha[1] - 1, arrayFecha[0]);
    fechaInicio.value = date.formatDate(newFecha, "YYYY/MM/DD");
  }
  if (ciclo.value.fechaFin) {
    const arrayFecha = ciclo.value.fechaFin.split("/");
    const newFecha = new Date(arrayFecha[2], arrayFecha[1] - 1, arrayFecha[0]);
    fechaFin.value = date.formatDate(newFecha, "YYYY/MM/DD");
    // ciclo.value.isFechaActual = false;
  }
}, 500);
const handleDatesChangeHasta = (value, tipo) => {
  if (tipo === "fechaInicio") {
    ciclo.value.fechaInicio = date.formatDate(value, "DD/MM/YYYY");
    qDateProxy.value.hide();
  } else {
    ciclo.value.fechaFin = date.formatDate(value, "DD/MM/YYYY");
    qDateProxy.value.hide();
    ciclo.value.isFechaActual = false;
  }
};
const updateFecha = (tipo) => {
  if (tipo === "fecha") {
    addDateToInput();
    if (
      ciclo.value.fechaFin.replaceAll("_", "").replaceAll("/", "").length > 0
    ) {
      ciclo.value.isFechaActual = false;
    }
  }
  if (
    tipo !== "fecha" &&
    ciclo.value.fechaFin.replaceAll("_", "").replaceAll("/", "").length > 0
  ) {
    ciclo.value.fechaFin = "";
  }
};
const guardarForm = () => {
  if (!isFormValid.value) return;
  isLoading.value = true;
  emit("guardar-ciclo", ciclo.value);
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
  () => ciclo.value,
  (value) => {
    formRef.value?.validate().then((success) => {
      isFormValid.value = success;
    });
  },
  { deep: true }
);
</script>
