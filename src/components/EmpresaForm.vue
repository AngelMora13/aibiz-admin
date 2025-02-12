<template>
  <div class="q-pa-md column gap-2">
    <h3 class="titulo-color titulo-3 q-ma-none text-capitalize">
      {{ formType }} Empresa
    </h3>
    <q-form ref="empresaForm" class="w-100" no-error-focus>
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
          v-model="empresaData.plan"
          class="col-6"
          placeholder="Planes"
          dense
          :options="planes"
          stack-label
          option-label="nombreMostrar"
          outlined
          color="secondary"
        >
          <template v-slot:selected-item="scope">
            <span v-if="scope.opt?.nombre">
              {{ scope.opt?.nombre }} ({{ tiposPlanes[scope.opt?.tipo] }})
            </span>
          </template>
        </q-select>
        <!--<q-select
          v-model="empresaData.modulosId"
          class="col-12"
          placeholder="Modulos Disponibles"
          dense
          multiple
          :options="listOfModules"
          stack-label
          option-label="nombre"
          option-value="_id"
          emit-value
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
                scope.opt?.nombre ||
                listOfModules.find((e) => e._id === scope.opt)?.nombre ||
                "Modulo no soportado"
              }}
            </q-chip>
          </template>
        </q-select> -->
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
        <q-btn flat color="negative" @click="openAlerDelete = true">
          Eliminar
        </q-btn>
        <div class="flex-responsive">
          <q-btn
            outline
            color="secondary"
            class="text-capitalize"
            @click="openAlertDisabled = true"
          >
            {{ empresaData.activo ? "Desactivar" : "activar" }}
          </q-btn>
          <q-btn
            unelevated
            color="primary"
            class="text-capitalize"
            :disable="!isFormValid"
            @click="emit('submit')"
          >
            Guardar
          </q-btn>
        </div>
      </div>
    </q-form>
    <q-dialog v-model="openAlertDisabled">
      <div class="alert-container">
        <span>
          ¿Está seguro(a) que desea
          {{ empresaData.activo ? "Desactivar" : "Activar" }} esta empresa?
        </span>
        <q-btn
          color="warning text-capitalize"
          class="q-mb-md"
          @click="emit('desactivar')"
        >
          {{ empresaData.activo ? "Desactivar" : "Activar" }}
        </q-btn>
      </div>
    </q-dialog>
    <q-dialog v-model="openAlerDelete">
      <div class="alert-container">
        <span> ¿Está seguro(a) que desea eliminaresta empresa? </span>
        <q-btn
          color="negative text-capitalize"
          class="q-mb-md"
          @click="openDialogConfirmDelete = true"
        >
          Eliminar
        </q-btn>
      </div>
    </q-dialog>
    <q-dialog v-model="openDialogConfirmDelete">
      <q-card>
        <div class="row justify-center" style="font-size: 16px; padding: 16px">
          <p>¿Está seguro(a) que desea eliminaresta empresa?</p>
          <span style="font-size: 14px; color: red">
            '* Se perderá toda la informacion que tenga la empresa'
          </span>
          <div class="column">
            <span style="font-size: 12px"
              >Para eliminar la empresa escriba
              <strong>{{ empresaData.subDominio }}</strong></span
            >
            <q-input
              outlined
              dense
              v-model="textConfirm"
              borderless
              color="#000"
            ></q-input>
          </div>
        </div>
        <div class="row justify-center text-h6">
          <q-btn
            unelevated
            label="Aceptar"
            color="red"
            class="q-mb-sm"
            :loading="loaderDelete"
            @click="deleteSubDominio"
            :disable="textConfirm !== empresaData.subDominio"
          ></q-btn>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch, defineProps, defineEmits } from "vue";
import { useUserStore } from "stores/user-store";
import endpoint from "../services/Endpoint";
import { tiposPlanes } from "app/constants/magicString";

const props = defineProps({
  empresa: {
    required: true,
  },
  formType: {
    default: "crear",
    type: String,
  },
});
const emit = defineEmits(["update:empresa", "desactivar", "submit", "delete"]);
const userStore = useUserStore();
const empresaForm = ref(null);
const typesDocument = ["J", "V"];
const listOfModules = ref([]);
const planes = ref([]);
const openAlertDisabled = ref(false);
const openAlerDelete = ref(false);
const openDialogConfirmDelete = ref(false);
const loaderDelete = ref(false);
const textConfirm = ref("");
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
  if (props.formType === "editar") {
    empresaForm.value?.validate().then((success) => {
      if (success) isFormValid.value = success;
    });
  }
  getModules();
  getLisPlanes();
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
    console.log(empresaData.value);
    for (const modulosPlan of empresaData.value?.plan?.modulos) {
      if (!modulosPlan?.activo) continue;
      console.log(modulosPlan);
      if (modulosPlan.modulos && modulosPlan.modulos.length[0]) {
        for (const modulo of modulosPlan.modulos) {
          const keyModulo = listOfModules.value.find(
            (e) => e.nombre === modulo
          )._id;
          const indexKey = empresaData.value.modulosId.findIndex(
            (e) => e === keyModulo
          );
          if (indexKey === -1) empresaData.value.modulosId.push(keyModulo);
        }
      }
    }
    empresaForm.value?.validate().then(async (success) => {
      /* if (success) {
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
      } */
    });
  } catch (e) {
    console.log(e);
  }
};
const deleteSubDominio = () => {
  loaderDelete.value = true;
  emit("delete");
};
const getLisPlanes = async () => {
  try {
    const { data } = await endpoint.planes({
      body: {},
      path: "get",
    });
    data.planes?.forEach((e) => {
      e.nombreMostrar = `${e.nombre} (${tiposPlanes[e.tipo]})`;
      planes.value = data.planes;
    });
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    //loaderIva.value = false;
  }
};
watch(
  () => empresaData,
  (value) => {
    empresaForm.value?.validate().then((success) => {
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
.alert-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  background: #ffff;
}
.alert-container > span {
  padding: 1.25rem 1.25rem 0;
}
@media only screen and (max-width: 600px) {
  .flex-responsive,
  .flex-responsive .flex-responsive {
    gap: 20px;
    flex-direction: column-reverse;
  }
}
</style>
