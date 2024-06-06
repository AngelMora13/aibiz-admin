<template>
  <q-page class="gap-2 page-main overflow-auto">
    <div>
      <div class="row justify-center" style="max-width: 100%">
        <q-table
          class="col-12"
          :columns="headersIva"
          :rows="ivaList"
          flat
          no-data-label="no hay datos disponibles"
          loading-label="Buscando..."
          rows-per-page-label="filas por pagina"
          key="_id"
          row-key="_id"
          v-model:pagination="pagination"
          @request="handleTableUpdate"
          :loading="loaderIva"
        >
          <template v-slot:top>
            <div class="row" style="width: 100%">
              <h2 class="col-4 texto-3">Lista de I.V.A</h2>
              <div class="col-8 flex justify-end" style="align-items: center">
                <q-btn
                  color="black"
                  class="text-white text-capitalize"
                  @click="openFormIva = true"
                >
                  <q-icon name="add" class="q-mr-sm"></q-icon>
                  Agregar I.V.A
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
      <q-dialog v-model="openFormIva" @keydown.esc="openFormIva = false">
        <q-card flat class="w-100" style="max-width: 400px">
          <div class="row justify-end">
            <q-btn unelevated icon="close" @click="openFormIva = false"></q-btn>
          </div>
          <FormIva
            :ivaData="ivaData"
            :listContry="listContry"
            @guardar-iva="saveIva"
          ></FormIva>
        </q-card>
      </q-dialog>
      <q-dialog v-model="openDeleteIva" @keydown.esc="openDeleteIva = false">
        <q-card flat class="w-100">
          <div class="flex justify-center q-pa-md" style="font-size: 14px">
            <span>¿Está seguro (a) que desea eliminar este I.V.A?</span>
          </div>
          <div class="flex justify-center q-pb-md">
            <q-btn
              color="black"
              class="text-white text-capitalize"
              @click="deleteIva"
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
import FormIva from "src/components/IvaForm.vue";
import Endpoint from "../../services/Endpoint";
import { debounce } from "quasar";

const userStore = useUserStore();
const ivaList = ref([]);
const listContry = ref([]);
const listContryOptions = ref([]);
const ivaData = ref(null);
const openFormIva = ref(false);
const openDeleteIva = ref(false);
const loaderIva = ref(false);
const loaderDelete = ref(false);
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});
const filtros = ref({
  pais: "",
});
const headersIva = computed(() => {
  const header = [
    {
      name: "descipcion",
      align: "center",
      label: "Descripción",
      field: "descripcion",
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
  getListIva();
});
const getListIva = async () => {
  try {
    loaderIva.value = true;
    const body = {
      ...filtros.value,
      itemsPorPagina: pagination.value.rowsPerPage,
      pagina: pagination.value.page,
    };
    const { data } = await Endpoint.iva({
      body,
      path: "get",
    });
    ivaList.value = data.iva;
    pagination.value.rowsNumber = data.countIva || 0;
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    loaderIva.value = false;
  }
};
const openEditForm = (item) => {
  ivaData.value = item;
  openFormIva.value = true;
};
const saveIva = async ($event) => {
  console.log($event);
  try {
    const body = {
      ...$event,
    };
    const { data } = await Endpoint.iva({
      body,
      path: "save",
    });
    const index = ivaList.value.findIndex((e) => e._id === $event._id);
    if (index !== -1) {
      ivaList.value.splice(index, 1, data.iva);
    } else {
      ivaList.value.push(data.iva);
    }
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    openFormIva.value = false;
  }
};
const openDelete = (item) => {
  ivaData.value = item;
  openDeleteIva.value = true;
};
const deleteIva = async () => {
  loaderDelete.value = true;
  try {
    const body = {
      _id: ivaData.value._id,
    };
    const { data } = await Endpoint.iva({
      body,
      path: "delete",
    });
    const index1 = ivaList.value.findIndex((e) => e._id === ivaData.value._id);
    if (index1 !== -1) {
      ivaList.value.splice(index1, 1);
    }
    alert(data.status);
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    openDeleteIva.value = false;
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
  () => openDeleteIva.value,
  (value) => {
    if (!value) {
      ivaData.value = null;
    }
  },
  { deep: true }
);
watch(
  () => openFormIva.value,
  (value) => {
    if (!value) {
      ivaData.value = null;
    }
  },
  { deep: true }
);
watch(
  filtros.value,
  debounce((value) => {
    getListIva();
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
