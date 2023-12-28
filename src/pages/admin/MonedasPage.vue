<template>
  <q-page class="column gap-2 page-main overflow-auto">
    <div>
      <div class="row justify-center" style="max-width: 100%">
        <q-table
          class="col-12"
          :columns="headerMonedas"
          :rows="listMonedas"
          flat
          no-data-label="no hay datos disponibles"
          loading-label="Buscando movimientos.."
          rows-per-page-label="filas por pagina"
          key="_id"
          row-key="_id"
          :loading="loaderMonedas"
        >
          <template v-slot:top>
            <div class="row" style="width: 100%">
              <h2 class="col-4 texto-3">Lista de monedas</h2>
              <div class="col-8 flex justify-end" style="align-items: center">
                <q-btn
                  color="black"
                  class="text-white text-capitalize"
                  @click="openForMoneda = true"
                >
                  <q-icon name="add" class="q-mr-sm"></q-icon>Agregar
                  Moneda</q-btn
                >
              </div>
            </div>
          </template>
          <template v-slot:body-cell-acciones="{ row }">
            <q-td style="text-align: center">
              <q-btn icon="edit" unelevated @click="openEditForm(row)">
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  Editar
                </q-tooltip>
              </q-btn>
              <q-btn
                icon="delete"
                unelevated
                @click="openDeleteMonedaData(row)"
              >
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  Eliminar
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
        <q-table
          no-data-label="no hay datos disponibles"
          loading-label="Buscando Estado de Cuenta..."
          rows-per-page-label="filas por pagina"
          :rows="tasasBancarias"
          :columns="headerTasas"
          flat
          v-model:pagination="paginationTasas"
          @request="handleTableTasas"
          :loading="loaderTasas"
          class="col-12"
        >
        </q-table>
      </div>
      <q-dialog v-model="openForMoneda" @keydown.esc="openForMoneda = false">
        <q-card flat class="w-100" style="max-width: 400px">
          <div class="row justify-end">
            <q-btn
              unelevated
              icon="close"
              @click="openForMoneda = false"
            ></q-btn>
          </div>
          <FormMoneda
            :monedaData="monedaData"
            @guardar-usuario="handleGuardarMoneda"
          ></FormMoneda>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="openDeleteMoneda"
        @keydown.esc="openDeleteMoneda = false"
      >
        <q-card flat class="w-100">
          <div class="flex justify-center q-pa-md" style="font-size: 14px">
            <span>¿Está seguro (a) que desea eliminar esta moneda?</span>
          </div>
          <div class="flex justify-center q-pb-md">
            <q-btn
              color="black"
              class="text-white text-capitalize"
              @click="deleteMoneda"
              :laoding="loaderDelete"
              >Aceptar</q-btn
            >
          </div>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { date, Quasar } from "quasar";

import endpoint from "../../services/Endpoint";
import { useUserStore } from "stores/user-store";
import FormMoneda from "src/components/FormMoneda.vue";
import Endpoint from "../../services/Endpoint";

const userStore = useUserStore();
const openForMoneda = ref(false);
const listMonedas = ref([]);
const loaderMonedas = ref(false);
const monedaData = ref(null);
const openDeleteMoneda = ref(false);
const loaderDelete = ref(false);
const loaderTasas = ref(false);
const tasasBancarias = ref([]);
const paginationTasas = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});
const headerMonedas = computed(() => {
  const header = [
    {
      name: "nombre",
      align: "center",
      label: "Nombre",
      field: "nombre",
      sortable: false,
    },
    {
      name: "nombreCorto",
      align: "center",
      label: "Nombre corto",
      field: "nombreCorto",
      sortable: false,
      headerStyle: "white-space: normal",
    },
    {
      name: "nombreInterno",
      align: "center",
      label: "Nombre interno",
      field: "nombreInterno",
      sortable: false,
      headerStyle: "white-space: normal",
    },
    {
      name: "acciones",
      align: "center",
      label: "Acciones",
      field: "acciones",
      sortable: false,
    },
  ];
  return header;
});
const headerTasas = computed(() => {
  const header = [];
  return header;
});
onMounted(async () => {
  getListMonedas();
  //getTasasBancarias();
});
const getListMonedas = async () => {
  loaderMonedas.value = true;
  try {
    const { data } = await Endpoint.monedas({
      body: {},
      path: "get",
    });
    listMonedas.value = data.monedas;
  } catch (e) {
    console.log(e);
  } finally {
    loaderMonedas.value = false;
  }
};
const openEditForm = (item) => {
  monedaData.value = item;
  openForMoneda.value = true;
};
const openDeleteMonedaData = (item) => {
  monedaData.value = item;
  openDeleteMoneda.value = true;
};
const handleGuardarMoneda = async ($event) => {
  try {
    const body = {
      ...$event,
    };
    const { data } = await Endpoint.monedas({
      body,
      path: "save",
    });
    const index = listMonedas.value.findIndex((e) => e._id === $event._id);
    if (index !== -1) {
      listMonedas.value.splice(index, 1, data.moneda);
    } else {
      listMonedas.value.push(data.moneda);
    }
  } catch (e) {
    console.log(e);
  } finally {
    openForMoneda.value = false;
  }
};
const deleteMoneda = async () => {
  const body = {
    ...monedaData.value,
  };
  loaderDelete.value = true;
  try {
    const { data } = await Endpoint.monedas({
      body,
      path: "delete",
    });
    const index = listMonedas.value.findIndex(
      (e) => e._id === monedaData.value._id
    );
    if (index !== -1) {
      listMonedas.value.splice(index, 1);
    }
  } catch (e) {
    console.log(e);
  } finally {
    openDeleteMoneda.value = false;
    loaderDelete.value = false;
  }
};
const getTasasBancarias = async () => {
  loaderTasas.value = true;
  try {
    const body = {
      itemsPorPagina: paginationTasas.value.rowsPerPage,
      pagina: paginationTasas.value.page,
    };
    const { data } = await Endpoint.monedas({
      path: "getTasas",
      body,
    });
    tasasBancarias.value = data.tasas || [];
    paginationTasas.value.rowsNumber = data.cantidad || 0;
  } catch (e) {
    console.log(e);
    errorNotify({ message: e.response?.data?.error || e.message });
  } finally {
    loaderTasas.value = false;
  }
};
const handleTableTasas = (props) => {
  const { page, rowsPerPage } = props.pagination;
  paginationTasas.value.page = page;
  paginationTasas.value.rowsPerPage = rowsPerPage;
  return getTasasBancarias();
};
watch(
  () => openForMoneda.value,
  (value) => {
    if (!value) {
      monedaData.value = null;
    }
  },
  { deep: true }
);
watch(
  () => openDeleteMoneda.value,
  (value) => {
    if (!value) {
      monedaData.value = null;
    }
  },
  { deep: true }
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
