<template>
  <q-page class="column gap-2 page-main overflow-auto">
    <div
      class="overflow-auto"
      style="max-width: 100%; background-color: transparent"
    >
      <q-table
        flat
        bordered
        :columns="headers"
        :rows="suscriptoresList"
        row-key="_id"
        v-model:selected="empresaSelect"
        class="q-pa-md"
        table-header-class="texto-th"
        rows-per-page-label="Filas por página"
        :pagination-label="
          (first, end, total) => first + ' - ' + end + ' de ' + total
        "
      >
        <!--
        :selected-rows-label="(n) => n + ' seleccionados'"
        selection="multiple"-->
        <template v-slot:no-data>
          <div class="full-width row flex-center text-accent q-gutter-sm">
            <span> No se encontrarón resultados </span>
          </div>
        </template>
        <template v-slot:top>
          <div class="row w-100 justify-between">
            <h1 class="no-margin titulo-3 titulo-color">
              Lista de Suscriptores
            </h1>
            <!--<div class="table-btn">
              <q-btn
                color="negative"
                class="q-mr-md text-capitalize"
                v-if="false"
                @click="openAlertDelete"
                >Eliminar</q-btn
              >
              <q-btn
                color="warning"
                class="text-capitalize"
                v-if="empresaSelect[0]"
                @click="openAlertDisabled"
                >Desactivar</q-btn
              >
            </div>-->
          </div>
        </template>
        <!--<template v-slot:body-selection="scope">
          <q-checkbox
            v-model="scope.selected"
            :class="{ inactivo: !scope.row.activo }"
            v-if="scope.row.activo"
          />
        </template>-->
        <template v-slot:body-cell-fechaCreacion="props">
          <q-td :props="props">
            {{ date.formatDate(props.value, "DD-MM-YYYY") }}
          </q-td>
        </template>
        <template v-slot:body-cell-documentoIdentidad="{ row }">
          <q-td> {{ row.tipoDocumento }}{{ row.documentoIdentidad }} </q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn flat round color="secondary" icon="attachment"></q-btn>
            <q-btn
              flat
              round
              color="secondary"
              icon="more_horiz"
              @click="handleEditform(props.row)"
            ></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="openFormEmpresa">
      <div class="formEmpresa-container" style="max-width: 800px">
        <EmpresaForm
          v-model:empresa="empresaFormData"
          :formType="formType"
          @desactivar="disabledEmpresa"
          @submit="handleSubmit"
          @delete="deleteEmpresa"
        ></EmpresaForm>
      </div>
    </q-dialog>
    <q-dialog v-model="openAlertDisableDelete">
      <div class="alert-container">
        <span>
          Está seguro(a) que desea {{ accionAlert }}
          {{ empresaSelect.length }} sub-dominios
        </span>
        <q-btn
          v-if="accionAlert === 'desactivar'"
          color="warning"
          class="q-mb-md text-capitalize"
          @click="disabledMany"
          >Desactivar
        </q-btn>
        <q-btn
          v-else
          color="negative"
          class="q-mb-md text-capitalize"
          @click="deleteMany"
          >Eliminar
        </q-btn>
      </div>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { date } from "quasar";
import { useUserStore } from "stores/user-store";
import endpoint from "../../services/Endpoint";
import EmpresaForm from "src/components/EmpresaForm.vue";
import SearchInput from "src/components/SearchInput.vue";

const userStore = useUserStore();
const searchInput = ref("");

const openFormEmpresa = ref(false);
const suscriptores = ref([]);
const empresaSelect = ref([]);
const accionAlert = ref("");
const openAlertDisableDelete = ref(false);

const empresaFormData = ref({
  razonSocial: "",
  email: "",
  telefono: "",
  tipoDocumento: "",
  documentoIdentidad: "",
  subDominio: "",
  modulos: [],
});
const empresaFormDataDefault = ref({
  razonSocial: "",
  email: "",
  telefono: "",
  tipoDocumento: "",
  documentoIdentidad: "",
  subDominio: "",
  modulos: [],
});
const formType = ref("crear");
const suscriptoresList = computed({
  get() {
    let newSuscriptores = suscriptores.value;
    return newSuscriptores.filter(
      (emp) =>
        emp.nombre?.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchInput.value.toLowerCase()) /*||
        emp.subDominio
          ?.toLowerCase()
          .includes(searchInput.value.toLowerCase()) ||
        emp.telefono?.toLowerCase().includes(searchInput.value.toLowerCase())*/
    );
  },
});

const headers = computed(() => {
  return [
    {
      label: "Nombre",
      field: "nombre",
      name: "nombre",
      align: "left",
      sortable: true,
    },
    {
      label: "Documento de Identidad",
      field: "documentoIdentidad",
      name: "documentoIdentidad",
      align: "left",
      sortable: true,
    },
    {
      label: "Email",
      field: "email",
      align: "left",
      sortable: true,
    },
    {
      label: "Fecha de Registro",
      field: "fechaCreacion",
      name: "fechaCreacion",
      align: "left",
      sortable: true,
    },
  ];
});
onMounted(() => {
  getListUser();
});
const getListUser = async () => {
  try {
    const { data } = await endpoint.getUser({
      body: {},
      path: "getSucriptores",
    });
    console.log({ data });
    suscriptores.value = data.personas;
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    //loaderIva.value = false;
  }
};
const handleEditform = (empresa) => {
  formType.value = "editar";
  const tipoDocumento = empresa.documentoIdentidad.slice(0, 1);
  const documentoIdentidad = empresa.documentoIdentidad.slice(1);
  empresaFormData.value = {
    ...empresa,
    tipoDocumento: tipoDocumento,
    documentoIdentidad: documentoIdentidad,
    modulos: empresa.modulosId || [],
  };
  console.log(empresa.modulos, empresa.modulosId);
  openFormEmpresa.value = true;
};
const handleSubmit = async () => {
  try {
    if (formType.value === "crear")
      return console.log("recuerda agregar el crear");
    else await updateEmpresa();
  } catch (e) {
    console.log(e);
  } finally {
    openFormEmpresa.value = false;
    getSubDominios();
  }
};
const updateEmpresa = async () => {
  console.log("editando ando");
  empresaFormData.value.documentoIdentidad = `${empresaFormData.value.tipoDocumento}${empresaFormData.value.documentoIdentidad}`;
  await endpoint.updateEmpresa(empresaFormData.value);
};
const disabledEmpresa = async () => {
  console.log("desactivar", empresaFormData.value);
  try {
    await endpoint.disabledEmpresa(empresaFormData.value);
  } catch (e) {
    console.log(e);
  } finally {
    openFormEmpresa.value = false;
    getSubDominios();
  }
};
const openAlertDisabled = () => {
  accionAlert.value = "desactivar";
  openAlertDisableDelete.value = true;
};
const disabledMany = async () => {
  try {
    const { data } = await endpoint.disableManyEmpresas(empresaSelect.value);
    empresaSelect.value = [];
    console.log(data);
  } catch (e) {
    console.log(e);
  } finally {
    openAlertDisableDelete.value = false;
  }
};
const openAlertDelete = () => {
  accionAlert.value = "eliminar";
  openAlertDisableDelete.value = true;
};
const deleteEmpresa = async () => {
  console.log("delete", empresaFormData.value);
  try {
    const { data } = await endpoint.deleteEmpresa(empresaFormData.value);
    empresaFormData.value = empresaFormDataDefault.value;
    console.log(data);
  } catch (e) {
    console.log(e);
  } finally {
    openFormEmpresa.value = false;
    getSubDominios();
  }
};
const deleteMany = async () => {
  console.log("delete");
  try {
    const { data } = await endpoint.deleteManyEmpresas(empresaSelect.value);
    empresaSelect.value = [];
    console.log(data);
  } catch (e) {
    console.log(e);
  } finally {
    openAlertDisableDelete.value = false;
  }
};
watch(
  () => openAlertDisableDelete,
  (value) => {
    if (!value) {
      accionAlert.value = "";
    }
  },
  { deep: true }
);
watch(
  () => openFormEmpresa.value,
  (value) => {
    if (!value) {
      formType.value = "crear";
      empresaFormData.value = empresaFormDataDefault.value;
    }
  }
);
</script>
<style scoped>
:deep(.inactivo) {
  border-left: 3px solid rgb(255, 134, 134);
}
.page-main {
  padding: 40px;
}
:deep(.q-table__top) {
  padding: 0 0 20px 0;
}
.formEmpresa-container {
  background: #fff;
  display: flex;
  width: 55rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
}
.table-btn {
  margin: auto 0;
}
.alert-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  font-size: 1rem;
  color: #7b7b7b;
  white-space: nowrap;
  max-width: 800px;
  padding: 0 1rem;
}
.alert-container span {
  font-size: 1rem;
  color: #7b7b7b;
  white-space: nowrap;
  padding: 1rem;
}
@media only screen and (max-width: 600px) {
  .page-main {
    padding: 20px 10px;
  }
}
</style>
