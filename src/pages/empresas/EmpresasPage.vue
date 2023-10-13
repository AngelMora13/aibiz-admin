import { computed } from 'vue'; import { computed } from 'vue';
<template>
  <q-page style="background: rgba(196, 196, 196, 0.2)" class="empresas-page">
    <div class="search-container">
      <q-input
        v-model="searchInput"
        class="search-input"
        placeholder="Buscar..."
        dense
        outlined
        color="primary"
      ></q-input>
      <q-btn
        rounded
        color="primary"
        unelevated
        class="search-btn"
        @click="openFormEmpresa = true"
      >
        Crear Empresa
      </q-btn>
    </div>
    <q-table
      flat
      bordered
      title="Lista de Empresas"
      :columns="headers"
      selection="multiple"
      :rows="listEmpresas"
      row-key="_id"
      v-model:selected="empresaSelect"
    >
      <template v-slot:no-data>
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <span> No se encontrarón resultados </span>
        </div>
      </template>
      <template v-slot:top>
        <div class="row w-100 justify-between">
          <h5>Lista de Empresas</h5>
          <div class="table-btn">
            <q-btn
              color="negative"
              class="q-mr-md"
              v-if="empresaSelect[0]"
              @click="openAlertDelete"
              >Eliminar</q-btn
            >
            <q-btn
              color="warning"
              v-if="empresaSelect[0]"
              @click="openAlertDisabled"
              >Desactivar</q-btn
            >
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
          <q-btn flat round color="secondary" icon="attachment"></q-btn>
          <q-btn flat round color="secondary" icon="more_horiz"></q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="openFormEmpresa">
      <div class="formEmpresa-container">
        <form-crear-empresa />
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
          color="warmning"
          class="q-mb-md"
          @click="disabledMany"
          >Desactivar
        </q-btn>
        <q-btn v-else color="negative" class="q-mb-md" @click="deleteMany"
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
import FormCrearEmpresa from "src/components/FormCrearEmpresa.vue";
const userStore = useUserStore();
const searchInput = ref("");
const openFormEmpresa = ref(false);
const listEmpresas = ref([]);
const empresaSelect = ref([]);
const accionAlert = ref("");
const openAlertDisableDelete = ref(false);
const headers = computed(() => {
  return [
    {
      label: "Dominio",
      field: "subDominio",
      name: "subDominio",
      sortable: true,
    },
    {
      label: "Razón Social",
      field: "razonSocial",
      sortable: true,
    },
    {
      label: "Documento de Identidad",
      field: "documentoIdentidad",
      sortable: true,
    },
    {
      label: "Email",
      field: "email",
      sortable: true,
    },
    {
      label: "Teléfono",
      field: "telefono",
      sortable: true,
    },
    {
      label: "Fecha de Creación",
      field: "fechaCreacion",
      name: "fechaCreacion",
      sortable: true,
    },
    {
      label: "Acciones",
      name: "acciones",
      sortable: false,
    },
  ];
});
onMounted(() => {
  getSubDominios();
});
const getSubDominios = async () => {
  try {
    const token = userStore.$state.token;
    const { data } = await endpoint.getListSubDominios({ token });
    listEmpresas.value = data;
    console.log(data, listEmpresas);
  } catch (e) {
    console.log(e);
  }
};
const openAlertDisabled = () => {
  accionAlert.value = "desactivar";
  openAlertDisableDelete.value = true;
};
const disabledMany = async () => {
  console.log("desactivar");
  try {
    const token = userStore.$state.token;
    const { data } = await endpoint.disableManyEmpresas({
      token,
      empresaData: empresaSelect.value,
    });
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
const deleteMany = async () => {
  console.log("delete");
  try {
    const token = userStore.$state.token;
    const { data } = await endpoint.deleteManyEmpresas({
      token,
      empresaData: empresaSelect.value,
    });
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
</script>
<style scoped>
.empresas-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 3rem;
}
.search-container {
  display: flex;
  gap: 0.625rem;
  justify-content: center;
  align-items: center;
  padding: 1.25rem;
  background: #ffff;
  border-radius: 0.625rem;
  border: 1px solid #c4c4c4;
}
.search-input {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  flex: 1 0 0;
}
.search-btn {
  text-transform: capitalize;
}
.formEmpresa-container {
  background: #fff;
  display: flex;
  width: 55rem;
  padding: 1.25rem;
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
</style>
