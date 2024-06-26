<template>
  <q-page class="gap-2 page-main overflow-auto">
    <div>
      <div class="row justify-center" style="max-width: 100%">
        <q-table
          class="col-12"
          :columns="headerBancos"
          :rows="bancosList"
          flat
          no-data-label="no hay datos disponibles"
          loading-label="Buscando..."
          rows-per-page-label="filas por pagina"
          key="_id"
          row-key="_id"
          v-model:pagination="pagination"
          @request="handleTableUpdate"
          :loading="loaderBancos"
        >
          <template v-slot:top>
            <div class="row" style="width: 100%">
              <h2 class="col-4 texto-3">Lista de bancos</h2>
              <div class="col-8 flex justify-end" style="align-items: center">
                <q-btn
                  color="black"
                  class="text-white text-capitalize"
                  @click="openFormBanco = true"
                >
                  <q-icon name="add" class="q-mr-sm"></q-icon>
                  Agregar Bancos
                </q-btn>
              </div>
            </div>
            <div class="row" style="width: 100%">
              <q-select
                v-model="filtros.pais"
                label="País"
                title="País"
                :options="listContryOptions"
                option-label="name"
                option-value="name"
                emit-value
                style="min-width: 180px"
                dense
                clearable
                color="black"
                use-input
                input-debounce="0"
                @filter="filterFn"
              ></q-select>
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
              <q-btn icon="delete" unelevated @click="openDelete(row)">
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
      </div>
      <q-dialog v-model="openFormBanco" @keydown.esc="openFormBanco = false">
        <q-card flat class="w-100" style="max-width: 400px">
          <div class="row justify-end">
            <q-btn
              unelevated
              icon="close"
              @click="openFormBanco = false"
            ></q-btn>
          </div>
          <FormBancos
            :bancoData="bancoData"
            :listContry="listContry"
            @guardar-banco="saveBanco"
          ></FormBancos>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="openDeleteBanco"
        @keydown.esc="openDeleteBanco = false"
      >
        <q-card flat class="w-100">
          <div class="flex justify-center q-pa-md" style="font-size: 14px">
            <span>¿Está seguro (a) que desea eliminar este banco?</span>
          </div>
          <div class="flex justify-center q-pb-md">
            <q-btn
              color="black"
              class="text-white text-capitalize"
              @click="deleteBanco"
              :loading="loaderDelete"
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
import { qDate } from "src/utils/qDate";
import XLSX from "xlsx";

import endpoint from "../../services/Endpoint";
import { useUserStore } from "stores/user-store";
import FormBancos from "src/components/formBancos.vue";
import Endpoint from "../../services/Endpoint";
import { debounce } from "quasar";

const userStore = useUserStore();
const bancosList = ref([]);
const listContry = ref([]);
const listContryOptions = ref([]);
const bancoData = ref(null);
const openFormBanco = ref(false);
const openDeleteBanco = ref(false);
const loaderBancos = ref(false);
const loaderDelete = ref(false);
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});
const filtros = ref({
  pais: "",
});
const headerBancos = computed(() => {
  const header = [
    {
      name: "nombre",
      align: "center",
      label: "Nombre",
      field: "nombre",
      sortable: false,
    },
    {
      name: "pais",
      align: "center",
      label: "País",
      field: "pais",
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
onMounted(async () => {
  getListContry();
  getListBancos();
});
const getListBancos = async () => {
  try {
    loaderBancos.value = true;
    const body = {
      ...filtros.value,
      itemsPorPagina: pagination.value.rowsPerPage,
      pagina: pagination.value.page,
    };
    const { data } = await Endpoint.bancos({
      body,
      path: "get",
    });
    bancosList.value = data.bancos;
    pagination.value.rowsNumber = data.countBancos || 0;
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    loaderBancos.value = false;
  }
};
const openEditForm = (item) => {
  bancoData.value = item;
  openFormBanco.value = true;
};
const saveBanco = async ($event) => {
  console.log($event);
  try {
    const body = {
      ...$event,
    };
    const { data } = await Endpoint.bancos({
      body,
      path: "save",
    });
    const index = bancosList.value.findIndex((e) => e._id === $event._id);
    if (index !== -1) {
      bancosList.value.splice(index, 1, data.banco);
    } else {
      bancosList.value.push(data.banco);
    }
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    openFormBanco.value = false;
  }
};
const openDelete = (item) => {
  bancoData.value = item;
  openDeleteBanco.value = true;
};
const deleteBanco = async () => {
  loaderDelete.value = true;
  const body = {
    _id: bancoData.value._id,
  };
  try {
    const { data } = await Endpoint.bancos({
      body,
      path: "delete",
    });
    const index1 = bancosList.value.findIndex(
      (e) => e._id === bancoData.value._id
    );
    if (index1 !== -1) {
      bancosList.value.splice(index1, 1);
    }
    alert(data.status);
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    openDeleteBanco.value = false;
    loaderDelete.value = false;
  }
};
const getListContry = async () => {
  try {
    const { data } = await Endpoint.getStateByCode();
    listContry.value = data.data;
  } catch (e) {
    console.log(e);
  }
};
const handleTableUpdate = (props) => {
  const { page, rowsPerPage } = props.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  return; //getMovimientos();
};
const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      listContryOptions.value = listContry.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    listContryOptions.value = listContry.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};
watch(
  () => openDeleteBanco.value,
  (value) => {
    if (!value) {
      bancoData.value = null;
    }
  },
  { deep: true }
);
watch(
  () => openFormBanco.value,
  (value) => {
    if (!value) {
      bancoData.value = null;
    }
  },
  { deep: true }
);
watch(
  filtros.value,
  debounce((value) => {
    getListBancos();
  }, 500)
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
