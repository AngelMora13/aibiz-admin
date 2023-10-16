<template>
  <q-page class="column gap-2 page-main overflow-auto">
    <SearchInput
      v-model:searchInput="searchInput"
      textBtn="Crear usuarios"
      @openDialog="($event) => (openForm = $event)"
    ></SearchInput>
    <div
      class="overflow-auto"
      style="max-width: 100%; background-color: transparent"
    >
      <q-table
        flat
        bordered
        :columns="headers"
        selection="multiple"
        :rows="usuarios"
        row-key="_id"
        v-model:selected="selected"
        class="q-pa-md"
        table-header-class="texto-th"
        :selected-rows-label="(n) => n + ' seleccionados'"
        rows-per-page-label="Filas por página"
        :pagination-label="
          (first, end, total) => first + ' - ' + end + ' de ' + total
        "
      >
        <template v-slot:no-data>
          <div class="full-width row flex-center text-accent q-gutter-sm">
            <span> No se encontrarón resultados </span>
          </div>
        </template>
        <template v-slot:top>
          <div class="row w-100 justify-between">
            <h1 class="no-margin titulo-3 titulo-color">Lista de Usuarios</h1>
            <div class="table-btn" v-if="selected[0]">
              <q-btn color="negative" class="q-mr-md">Eliminar</q-btn>
            </div>
          </div>
        </template>
        <template v-slot:body-cell-fechaCreacion="props">
          <q-td :props="props">
            {{ date.formatDate(props.value, "DD-MM-YYYY") }}
          </q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
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
    <q-dialog v-model="openForm">
      <q-card class="formEmpresa-container" style="max-width: 800px">
        <UsuarioForm
          v-model:usuario="usuarioFormData"
          :formType="formType"
          @submit="handleSubmit"
        ></UsuarioForm>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { date, Quasar } from "quasar";

import endpoint from "../../services/Endpoint";
import SearchInput from "src/components/SearchInput.vue";
import UsuarioForm from "src/components/UsuarioForm.vue";

const searchInput = ref("");
const usuarios = ref([]);
const selected = ref([]);
const openForm = ref(false);

const usuarioFormData = ref({
  email: "",
  nombre: "",
  telefono: "",
});
const usuarioFormDataDefault = ref({
  email: "",
  nombre: "",
  telefono: "",
});
const formType = ref("crear");

const headers = [
  {
    label: "Email",
    name: "email",
    field: "email",
    align: "left",
    sortable: true,
  },
  {
    label: "Nombre",
    name: "nombre",
    field: "nombre",
    align: "left",
    sortable: true,
  },
  {
    label: "Telefono",
    name: "telefono",
    field: "telefono",
    align: "left",
    sortable: true,
  },
  {
    label: "Creación",
    name: "fechaCreacion",
    field: "fechaCreacion",
    align: "left",
    sortable: true,
  },
  {
    label: "Acciones",
    name: "acciones",
    align: "left",
    sortable: false,
  },
];
onMounted(async () => {
  findUsuarios();
});
const findUsuarios = async () => {
  try {
    const { data } = await endpoint.getUsuarios();
    usuarios.value = data;
  } catch (e) {}
};
const handleEditform = (usuario) => {
  formType.value = "editar";
  usuarioFormData.value = { ...usuario };
  openForm.value = true;
};

const handleSubmit = async () => {
  try {
    if (formType.value === "crear") await createUsuarios();
    else await updateUsuarios();
  } catch (e) {
    console.log(e);
  } finally {
    openForm.value = false;
    findUsuarios();
  }
};
const createUsuarios = async () => {
  endpoint.createUsuarios(usuarioFormData.value);
};
const updateUsuarios = async () => {
  endpoint.updateUsuarios(usuarioFormData.value);
};

watch(
  () => openForm.value,
  (value) => {
    if (!value) {
      formType.value = "crear";
      usuarioFormData.value = usuarioFormDataDefault.value;
    }
  }
);
</script>
<style scoped>
.page-main {
  padding: 40px;
}
@media only screen and (max-width: 600px) {
  .page-main {
    padding: 20px 10px;
  }
}
</style>
