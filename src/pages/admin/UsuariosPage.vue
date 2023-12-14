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
        :rows="userList"
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
              <q-btn
                color="negative"
                class="q-mr-md"
                @click="openAlertDeleteMany = true"
                >Eliminar</q-btn
              >
            </div>
          </div>
        </template>
        <template v-slot:body-selection="scope">
          <q-checkbox v-model="scope.selected" v-if="!scope.row.isSuperAdmin" />
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
      <q-dialog v-model="openAlertDeleteMany">
        <div class="alert-container">
          <span>
            ¿Está seguro(a) que desea eliminar {{ selected.length }} usuarios?
          </span>
          <q-btn
            color="negative text-capitalize"
            class="q-mb-md"
            @click="deleteUsersMany"
            >Eliminar
          </q-btn>
        </div>
      </q-dialog>
    </div>
    <q-dialog v-model="openForm">
      <q-card class="formEmpresa-container" style="max-width: 800px">
        <UsuarioForm
          v-model:usuario="usuarioFormData"
          :formType="formType"
          @submit="handleSubmit"
          @delete="deleteUser()"
        ></UsuarioForm>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { date, Quasar } from "quasar";

import endpoint from "../../services/Endpoint";
import SearchInput from "src/components/SearchInput.vue";
import UsuarioForm from "src/components/UsuarioForm.vue";
import { useUserStore } from "stores/user-store";

const userStore = useUserStore();
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
const openAlertDeleteMany = ref(false);

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
    usuarios.value = data.sort((a, b) => {
      return b.email === userStore.user.email ? 1 : -1;
    });
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
    console.log("s");
  } catch (e) {
    console.log(e);
  } finally {
    openForm.value = false;
    findUsuarios();
  }
};
const createUsuarios = () => {
  return endpoint.createUsuarios(usuarioFormData.value);
};
const updateUsuarios = () => {
  return endpoint.updateUsuarios(usuarioFormData.value);
};
const deleteUser = async () => {
  try {
    await endpoint.deleteUsuarios(usuarioFormData.value);
  } catch (e) {
    console.log(e);
  } finally {
    openForm.value = false;
    findUsuarios();
  }
};
const deleteUsersMany = async () => {
  try {
    await endpoint.deleteManyUsuarios(selected.value);
  } catch (e) {
    console.log(e);
  } finally {
    openAlertDeleteMany.value = false;
    findUsuarios();
  }
};

const userList = computed({
  get() {
    let newUsers = usuarios.value;
    return newUsers.filter(
      (user) =>
        user.nombre.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        user.telefono.toLowerCase().includes(searchInput.value.toLowerCase())
    );
  },
});
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
  .page-main {
    padding: 20px 10px;
  }
}
</style>
