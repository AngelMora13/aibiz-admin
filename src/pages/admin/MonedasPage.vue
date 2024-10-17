<template>
  <q-page class="gap-2 page-main overflow-auto">
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
                  :loading="isExcelLoading"
                  @click="probando"
                >
                  <q-icon name="cloud_upload" class="q-mr-sm"></q-icon>
                  Prueba de scraping
                </q-btn>
                <q-btn
                  color="black"
                  class="text-white text-capitalize"
                  :loading="isExcelLoading"
                  @click="excelInput && excelInput.pickFiles()"
                >
                  <q-icon name="cloud_upload" class="q-mr-sm"></q-icon>
                  Agregar Tasas Bancarias
                </q-btn>
                <q-file
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  class="hidden"
                  ref="excelInput"
                  v-model="excelFile"
                  @update:model-value="handleSaveFile"
                >
                </q-file>
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
          class="col-12 q-my-md"
        >
          <template v-slot:body-cell-fechaValor="{ row }">
            <td>
              {{ qDate(row.fechaValor).format("DD-MM-YYYY") }}
            </td>
          </template>
          <template v-slot:body-cell-acciones="{ row }">
            <td>
              <q-btn icon="delete" unelevated @click="openDeleteTasa(row)">
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  Eliminar registro
                </q-tooltip>
              </q-btn>
            </td>
          </template>
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
            <span>¿Está seguro (a) que desea eliminar este registro?</span>
          </div>
          <div class="flex justify-center q-pb-md">
            <q-btn
              color="black"
              class="text-white text-capitalize"
              @click="deleteMoneda"
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
import FormMoneda from "src/components/FormMoneda.vue";
import Endpoint from "../../services/Endpoint";

const excelInput = ref(null);
const excelFile = ref(null);
const isExcelLoading = ref(false);

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
      name: "simbolo",
      align: "center",
      label: "Simbolo",
      field: "simbolo",
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
  const header = [
    {
      name: "fechaValor",
      align: "center",
      label: "Fecha",
      field: "fecha",
      sortable: false,
    },
    {
      name: "monedaPrincipal",
      align: "center",
      label: "Moneda Principal",
      field: "monedaPrincipal",
      sortable: false,
    },
  ];
  const cabezales = [];
  for (const p of listMonedas.value) {
    cabezales.push(p.nombreCorto);
  }
  for (const c of cabezales) {
    header.push({
      name: c,
      align: "center",
      label: c,
      field: c,
      format: (val, row) =>
        Number(val).toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      style: "text-align: right",
      sortable: false,
    });
  }
  header.push({
    name: "acciones",
    align: "center",
    label: "acciones",
    field: "acciones",
    sortable: false,
  });
  return header;
});
onMounted(async () => {
  getListMonedas();
  getTasasBancarias();
});
const probando = async () => {
  try {
    const { data } = await Endpoint.monedas({
      body: {},
      path: "pruebaScraping",
    });
    console.log({ data });
  } catch (e) {
    console.log(e);
  } finally {
  }
};
const handleSaveFile = async () => {
  isExcelLoading.value = true;
  const tasas = [];
  const monedas = new Set(["Bs"]);
  try {
    const workbook = XLSX.read(await excelFile.value.arrayBuffer(), {
      type: "array",
    });
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const dataSheet = XLSX.utils.sheet_to_json(sheet, {
        range: 4,
        header: "A",
      });
      const tasa = { monedaPrincipal: "Bs", Bs: 1 };
      let DIsNumber = false;
      let index = 0;
      for (const row of dataSheet) {
        if (index === 0) {
          index++;
          tasa.fechaOperacion = qDate(
            row.B.replace("Fecha Operacion: ", ""),
            "DD/MM/YYYY"
          ).toDate;
          tasa.fechaValor = qDate(
            row.D.replace("Fecha Valor: ", ""),
            "DD/MM/YYYY"
          ).toDate;
          tasa.fechaUpdate = row.D.replace("Fecha Valor: ", "");
          continue;
        }
        index++;
        if (typeof row.D === "number") {
          DIsNumber = true;
          tasa[row.B] = row.G;
          monedas.add(row.B);
          continue;
        }
        if (DIsNumber) break;
      }
      tasas.push(tasa);
    }
    const { data } = await Endpoint.monedas({
      body: { tasas, monedas: [...monedas] },
      path: "saveTasas",
    });
    excelFile.value = null;
    isExcelLoading.value = false;
    getListMonedas();
    getTasasBancarias();
    alert(data.status);
  } catch (e) {
    isExcelLoading.value = false;
    console.log(e);
    excelFile.value = null;
    return;
  }
};

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
const openDeleteTasa = (item) => {
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
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    openForMoneda.value = false;
  }
};
const deleteMoneda = async () => {
  const body = {
    tasaId: monedaData.value?._id,
  };
  loaderDelete.value = true;
  try {
    const { data } = await Endpoint.monedas({
      body,
      path: "deleteTasa",
    });
    await getTasasBancarias();
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
