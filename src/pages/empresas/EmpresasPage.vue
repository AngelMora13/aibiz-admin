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
    >
      <template v-slot:no-data>
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <span> No se encontrarón resultados </span>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="openFormEmpresa">
      <div class="formEmpresa-container">
        <form-crear-empresa />
      </div>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "stores/user-store";
import endpoint from "../../services/Endpoint";
import FormCrearEmpresa from "src/components/FormCrearEmpresa.vue";
const userStore = useUserStore();
const searchInput = ref("");
const openFormEmpresa = ref(false);
const headers = computed(() => {
  return [
    {
      label: "Dominio",
      field: "subDominio",
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
      sortable: true,
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
    console.log(data);
  } catch (e) {
    console.log(e);
  }
};
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
</style>
