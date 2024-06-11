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
                v-model="pais"
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
      <div class="row justify-center" style="max-width: 100%">
        <q-table
          class="col-12"
          :columns="headersRetIva"
          :rows="retIvaList"
          flat
          no-data-label="no hay datos disponibles"
          loading-label="Buscando..."
          rows-per-page-label="filas por pagina"
          key="_id"
          row-key="_id"
          v-model:pagination="paginationRetIva"
          @request="handleTableUpdate"
          :loading="loaderRetIva"
        >
          <template v-slot:top>
            <div class="row" style="width: 100%">
              <h2 class="col-4 texto-3">Retenciones de I.V.A</h2>
              <div class="col-8 flex justify-end" style="align-items: center">
                <q-btn
                  color="black"
                  class="text-white text-capitalize"
                  @click="openFormRetIva = true"
                >
                  <q-icon name="add" class="q-mr-sm"></q-icon>
                  Agregar Retención I.V.A
                </q-btn>
              </div>
            </div>
            <div class="row" style="width: 100%">
              <q-select
                v-model="paisRetencionIva"
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
              <q-btn icon="edit" unelevated @click="openEditFormRetIva(row)">
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  Editar
                </q-tooltip>
              </q-btn>
              <q-btn icon="delete" unelevated @click="openDeleteRetIVa(row)">
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
      <div class="row justify-center q-py-md" style="max-width: 100%">
        <q-table
          class="col-12"
          :columns="headerIslr"
          :rows="islrList"
          flat
          no-data-label="no hay datos disponibles"
          loading-label="Buscando..."
          rows-per-page-label="filas por pagina"
          key="_id"
          row-key="_id"
          v-model:pagination="paginationIslr"
          @request="handleTableUpdateIslr"
          :loading="loaderIslr"
        >
          <template v-slot:top>
            <div class="row" style="width: 100%">
              <h2 class="col-4 texto-3">Lista de ISLR</h2>
              <div class="col-8 flex justify-end" style="align-items: center">
                <q-btn
                  color="black"
                  class="text-white text-capitalize"
                  @click="openFormIslr = true"
                >
                  <q-icon name="add" class="q-mr-sm"></q-icon>
                  Agregar ISLR
                </q-btn>
              </div>
            </div>
            <div class="row" style="width: 100%">
              <q-select
                v-model="paisIslr"
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
              <q-btn icon="edit" unelevated @click="openEditFormIslr(row)">
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  Editar
                </q-tooltip>
              </q-btn>
              <q-btn icon="delete" unelevated @click="openDeleteIslr(row)">
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
      <q-dialog v-model="openFormIslr" @keydown.esc="openFormIslr = false">
        <q-card flat class="w-100" style="max-width: 400px">
          <div class="row justify-end">
            <q-btn
              unelevated
              icon="close"
              @click="openFormIslr = false"
            ></q-btn>
          </div>
          <FormIslr
            :islrData="islrData"
            :listContry="listContry"
            @guardar-islr="saveIslr"
          ></FormIslr>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="openDialogDeleteIslr"
        @keydown.esc="openDialogDeleteIslr = false"
      >
        <q-card flat class="w-100">
          <div class="flex justify-center q-pa-md" style="font-size: 14px">
            <span>¿Está seguro (a) que desea eliminar este ISLR?</span>
          </div>
          <div class="flex justify-center q-pb-md">
            <q-btn
              color="black"
              class="text-white text-capitalize"
              @click="deleteIslr"
              :loading="loaderDelete"
              >Aceptar</q-btn
            >
          </div>
        </q-card>
      </q-dialog>
      <q-dialog v-model="openFormRetIva" @keydown.esc="openFormRetIva = false">
        <q-card flat class="w-100" style="max-width: 400px">
          <div class="row justify-end">
            <q-btn
              unelevated
              icon="close"
              @click="openFormRetIva = false"
            ></q-btn>
          </div>
          <formRetIva
            :retIvaData="retIvaData"
            :listContry="listContry"
            @guardar-retIva="saveRetIva"
          ></formRetIva>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="openDeleteRetIva"
        @keydown.esc="openDeleteRetIva = false"
      >
        <q-card flat class="w-100">
          <div class="flex justify-center q-pa-md" style="font-size: 14px">
            <span
              >¿Está seguro (a) que desea eliminar esta retención de
              I.V.A?</span
            >
          </div>
          <div class="flex justify-center q-pb-md">
            <q-btn
              color="black"
              class="text-white text-capitalize"
              @click="deleteRetIva"
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
import formRetIva from "src/components/formRetIva.vue";
import FormIslr from "src/components/FormIslr.vue";
import Endpoint from "../../services/Endpoint";
import { debounce } from "quasar";

const userStore = useUserStore();
const ivaList = ref([]);
const islrList = ref([]);
const retIvaList = ref([]);
const listContry = ref([]);
const listContryOptions = ref([]);
const ivaData = ref(null);
const islrData = ref(null);
const retIvaData = ref(null);
const openFormIva = ref(false);
const openFormIslr = ref(false);
const openDeleteIva = ref(false);
const openDialogDeleteIslr = ref(false);
const openFormRetIva = ref(false);
const openDeleteRetIva = ref(false);
const loaderIva = ref(false);
const loaderIslr = ref(false);
const loaderRetIva = ref(false);
const loaderDelete = ref(false);
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});
const paginationIslr = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});
const paginationRetIva = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});
const pais = ref(null);
const paisIslr = ref(null);
const paisRetencionIva = ref(null);
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
      name: "iva",
      align: "center",
      label: "I.V.A (%)",
      field: "iva",
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
const headersRetIva = computed(() => {
  const header = [
    {
      name: "descipcion",
      align: "center",
      label: "Descripción",
      field: "descripcion",
      sortable: false,
    },
    {
      name: "retencion",
      align: "center",
      label: "Retencion (%)",
      field: "retIva",
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
const headerIslr = computed(() => {
  const header = [
    {
      name: "codigo",
      align: "left",
      label: "Código de retención",
      field: "codigo",
      sortable: false,
    },
    {
      name: "nombre",
      align: "left",
      label: "Nombre",
      field: "nombre",
      sortable: false,
    },
    {
      name: "tipo",
      align: "left",
      label: "Tipo de retencion",
      field: "tipoRetencion",
      sortable: false,
    },
    {
      name: "valorRet",
      align: "left",
      label: "Retención (%)",
      field: "valorRet",
      sortable: false,
    },
    {
      name: "valorBaseImponible",
      align: "left",
      label: "Base imponible (%)",
      field: "valorBaseImponible",
      sortable: false,
    },
    {
      name: "tipoCalculo",
      align: "left",
      label: "Tipo de calculo",
      field: "tipoCalculo",
      sortable: false,
    },
    {
      name: "sustraendo",
      align: "left",
      label: "Sustraendo",
      field: "sustraendo",
      sortable: false,
    },
    {
      name: "minimo",
      align: "left",
      label: "Mínimo",
      field: "minimo",
      sortable: false,
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
  getListIslr();
  getListRetIva();
});
const getListIva = async () => {
  try {
    loaderIva.value = true;
    const body = {
      pais: pais.value,
      itemsPorPagina: pagination.value.rowsPerPage,
      pagina: pagination.value.page,
    };
    const { data } = await Endpoint.impuestos({
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
    const { data } = await Endpoint.impuestos({
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
    const { data } = await Endpoint.impuestos({
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
  getListIva();
  return;
};
const handleTableUpdateIslr = (props) => {
  const { page, rowsPerPage } = props.pagination;
  paginationIslr.value.page = page;
  paginationIslr.value.rowsPerPage = rowsPerPage;
  getListIslr();
  return;
};
const getListIslr = async () => {
  try {
    loaderIslr.value = true;
    const body = {
      pais: paisIslr.value,
      itemsPorPagina: paginationIslr.value.rowsPerPage,
      pagina: paginationIslr.value.page,
    };
    const { data } = await Endpoint.impuestos({
      body,
      path: "get/islr",
    });
    islrList.value = data.islr;
    paginationIslr.value.rowsNumber = data.countIslr || 0;
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    loaderIslr.value = false;
  }
};
const openEditFormIslr = (item) => {
  islrData.value = item;
  openFormIslr.value = true;
};
const saveIslr = async ($event) => {
  try {
    const body = {
      ...$event,
    };
    const { data } = await Endpoint.impuestos({
      body,
      path: "save/islr",
    });
    const index = islrList.value.findIndex((e) => e._id === $event._id);
    if (index !== -1) {
      islrList.value.splice(index, 1, data.islr);
    } else {
      islrList.value.push(data.islr);
    }
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    openFormIslr.value = false;
  }
};
const openDeleteIslr = (item) => {
  islrData.value = item;
  openDialogDeleteIslr.value = true;
};
const deleteIslr = async () => {
  loaderDelete.value = true;
  try {
    const body = {
      _id: islrData.value._id,
    };
    const { data } = await Endpoint.impuestos({
      body,
      path: "delete/islr",
    });
    const index1 = islrList.value.findIndex(
      (e) => e._id === islrData.value._id
    );
    if (index1 !== -1) {
      islrList.value.splice(index1, 1);
    }
    alert(data.status);
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    openDialogDeleteIslr.value = false;
    loaderDelete.value = false;
  }
};
const getListRetIva = async () => {
  try {
    loaderRetIva.value = true;
    const body = {
      pais: paisRetencionIva.value,
      itemsPorPagina: paginationRetIva.value.rowsPerPage,
      pagina: paginationRetIva.value.page,
    };
    const { data } = await Endpoint.impuestos({
      body,
      path: "get/retIva",
    });
    retIvaList.value = data.retIva;
    paginationRetIva.value.rowsNumber = data.count || 0;
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    loaderRetIva.value = false;
  }
};
const openEditFormRetIva = (item) => {
  retIvaData.value = item;
  openFormRetIva.value = true;
};
const saveRetIva = async ($event) => {
  console.log($event);
  try {
    const body = {
      ...$event,
    };
    const { data } = await Endpoint.impuestos({
      body,
      path: "save/retIva",
    });
    const index = retIvaList.value.findIndex((e) => e._id === $event._id);
    if (index !== -1) {
      retIvaList.value.splice(index, 1, data.retIva);
    } else {
      retIvaList.value.push(data.retIva);
    }
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    openFormRetIva.value = false;
  }
};
const openDeleteRetIVa = (item) => {
  retIvaData.value = item;
  openDeleteRetIva.value = true;
};
const deleteRetIva = async () => {
  loaderDelete.value = true;
  try {
    const body = {
      _id: retIvaData.value._id,
    };
    const { data } = await Endpoint.impuestos({
      body,
      path: "delete/retIva",
    });
    const index1 = retIvaList.value.findIndex(
      (e) => e._id === retIvaData.value._id
    );
    if (index1 !== -1) {
      retIvaList.value.splice(index1, 1);
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
      retIvaData.value = null;
    }
  },
  { deep: true }
);
watch(
  () => openFormRetIva.value,
  (value) => {
    if (!value) {
      retIvaData.value = null;
    }
  },
  { deep: true }
);
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
  () => openDialogDeleteIslr.value,
  (value) => {
    if (!value) {
      islrData.value = null;
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
  () => openFormIslr.value,
  (value) => {
    if (!value) {
      islrData.value = null;
    }
  },
  { deep: true }
);
watch(
  pais,
  debounce((value) => {
    getListIva();
  }, 500)
);
watch(
  paisIslr,
  debounce((value) => {
    getListIslr();
  }, 500)
);
watch(
  paisRetencionIva,
  debounce((value) => {
    getListRetIva();
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
