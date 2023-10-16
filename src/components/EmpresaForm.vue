<template>
  <div class="q-pa-md column gap-2">
    <h3 class="titulo-color titulo-3 q-ma-none text-capitalize">
      {{ formType }} Empresa
    </h3>
    <q-form ref="crearEmpresaForm" class="w-100" no-error-focus>
      <div class="row q-col-gutter-md">
        <q-input
          v-model="empresaData.razonSocial"
          class="col-12"
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
        <q-input
          v-model="empresaData.email"
          class="col-12 col-sm-6"
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
          class="col-12 col-sm-6"
          placeholder="Teléfono"
          dense
          outlined
          color="primary"
        >
          <template v-slot:prepend>
            <q-icon name="call" color="secondary" />
          </template>
        </q-input>
        <q-select
          v-model="empresaData.tipoDocumento"
          :options="typesDocument"
          class="col-3 col-sm-2 col-md-1"
          dense
          outlined
          color="secondary"
          :rules="rules.requeridos"
        >
        </q-select>
        <q-input
          v-model="empresaData.documentoIdentidad"
          class="col-9 col-sm-5"
          placeholder="Documento de Identidad"
          dense
          outlined
          color="primary"
          :rules="rules.requeridos"
        >
        </q-input>
        <q-input
          v-model="empresaData.subDominio"
          class="col-12 col-sm-5 col-md-6"
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
        <q-select
          v-model="empresaData.modulos"
          class="col-12"
          placeholder="Modulos Disponibles"
          dense
          multiple
          :options="listOfModules"
          stack-label
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
              icon-remove="close"
              @remove="scope.removeAtIndex(scope.index)"
              :tabindex="scope.tabindex"
              color="primary"
              text-color="white"
              class="q-pa-md"
            >
              {{
                listOfModules.find((e) => e._id === scope.opt)?.nombre ||
                "Modulo no soportado"
              }}
            </q-chip>
          </template>
        </q-select>
      </div>
      <div class="column row-sm justify-end" v-if="formType === 'crear'">
        <q-btn
          unelevated
          color="primary"
          class="q-mt-md text-capitalize"
          @click="crearSubDominio"
          :disable="!isFormValid"
          >Crear</q-btn
        >
      </div>
      <div
        class="flex-responsive justify-between q-mt-lg"
        v-if="formType === 'editar'"
      >
        <q-btn flat color="#C4C4C4" class="color-disabled"> Eliminar </q-btn>
        <div class="flex-responsive">
          <q-btn outline color="secondary" class="text-capitalize">
            Desactivar
          </q-btn>
          <q-btn
            unelevated
            color="primary"
            class="text-capitalize"
            :disable="!isFormValid"
          >
            Guardar
          </q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch, defineProps, defineEmits } from "vue";
import { useUserStore } from "stores/user-store";
import endpoint from "../services/Endpoint";

const props = defineProps({
  empresa: {
    required: true,
  },
  formType: {
    default: "crear",
    type: String,
  },
});
const emit = defineEmits(["update:empresa"]);
const userStore = useUserStore();
const crearEmpresaForm = ref(null);
const typesDocument = ["J", "V"];
const listOfModules = ref([]);
/*
const empresaData = ref({
  razonSocial: "",
  email: "",
  telefono: "",
  tipoDocumento: "",
  documentoIdentidad: "",
  subDominio: "",
  modulos: [],
});*/
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

const empresaData = computed({
  get() {
    return props.empresa;
  },
  set(value) {
    emit("update:empresa", value);
  },
});
const isFormValid = ref(false);
onMounted(() => {
  getModules();
});
const getModules = async () => {
  try {
    const { data } = await endpoint.getListModules();
    listOfModules.value = data;
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
.q-field__suffix {
  color: var(--texto-input-light);
}
.q-chip__icon--remove {
  color: #fff;
  font-size: 0.875rem;
}
.q-field__prepend {
  align-self: center;
}
.flex-responsive {
  gap: 10px;
}
.flex-responsive .flex-responsive {
  gap: 40px;
}
@media only screen and (max-width: 600px) {
  .flex-responsive,
  .flex-responsive .flex-responsive {
    gap: 20px;
    flex-direction: column-reverse;
  }
}
</style>
