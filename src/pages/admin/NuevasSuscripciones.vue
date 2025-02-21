<template>
  <q-page class="gap-2 page-main overflow-auto">
    <div>
      <div class="row justify-center" style="max-width: 100%">
        <q-table
          class="col-12"
          :columns="headers"
          :rows="suscripciones"
          flat
          no-data-label="no hay datos disponibles"
          loading-label="Buscando..."
          rows-per-page-label="filas por pagina"
          key="_id"
          row-key="_id"
          v-model:pagination="pagination"
          @request="handleTableUpdate"
          :loading="loader"
        >
          <template v-slot:top>
            <div class="row" style="width: 100%">
              <h2 class="col-4 texto-3 q-my-none">Nuevas Suscripciones</h2>
            </div>
          </template>
          <template v-slot:body-cell-suscriptor="{ row }">
            <q-td>
              {{ row?.suscriptor?.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-razonSocial="{ row }">
            <q-td>
              {{ row?.empresa?.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-plan="{ row }">
            <q-td v-if="row?.plan?.tipo === 'comercial'">
              {{ row?.plan?.nombre }} (COM)
            </q-td>
            <q-td v-if="row?.plan?.tipo === 'contador'">
              {{ row?.plan?.nombre }} (CON)
            </q-td>
          </template>
          <template v-slot:body-cell-metodoPago="{ row }">
            <q-td>
              {{ metodosPagos[row?.metodoType] }}
            </q-td>
          </template>
          <template v-slot:body-cell-banco="{ row }">
            <q-td>
              {{ row?.pago?.banco }}
            </q-td>
          </template>
          <template v-slot:body-cell-referencia="{ row }">
            <q-td>
              {{ row?.pago?.referencia }}
            </q-td>
          </template>
          <template v-slot:body-cell-fechaPago="{ row }">
            <q-td>
              {{ qDate(row?.pago?.fechaPago).format("DD-MM-YYYY") }}
            </q-td>
          </template>
          <template v-slot:body-cell-acciones="{ row }">
            <q-td style="text-align: center">
              <q-btn icon="check_circle" unelevated @click="openForm(row)">
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  Activar Suscripción
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
      <q-dialog v-model="openDialogForm" @keydown.esc="openDialogForm = false">
        <q-card flat class="w-100" style="min-width: 800px">
          <div class="row justify-end">
            <q-btn
              unelevated
              icon="close"
              @click="openDialogForm = false"
            ></q-btn>
          </div>
          <newSuscriptionForm
            :suscripcion-data="suscripcionData"
            :loader-action="loaderActions"
            @activar-suscripcion="activarSuscripcion"
          />
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { qDate } from "src/utils/qDate";

import endpoint from "../../services/Endpoint";
import { useUserStore } from "stores/user-store";
import Endpoint from "../../services/Endpoint";
import { debounce } from "quasar";
import newSuscriptionForm from "src/components/newSuscriptionForm.vue";

const userStore = useUserStore();
const suscripciones = ref([]);
const listContry = ref([]);
const listContryOptions = ref([]);
const listOfModules = ref([]);
const suscripcionData = ref(null);
const openDialogForm = ref(false);
const openDeleteBanco = ref(false);
const loader = ref(false);
const loaderDelete = ref(false);
const loaderActions = ref(false);
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});
const filtros = ref({
  pais: "",
});
const metodosPagos = {
  transferencia: "Transferencia",
  pagoMobil: "Pago Movil",
  zelle: "Zelle",
};
const headers = computed(() => {
  const header = [
    {
      name: "suscriptor",
      align: "left",
      label: "Suscriptor",
      field: "suscriptor",
      sortable: false,
    },
    {
      name: "razonSocial",
      align: "left",
      label: "Razón Social",
      field: "razonSocial",
      sortable: false,
    },
    {
      name: "subDominio",
      align: "left",
      label: "Sub Dominio",
      field: "subdominio",
      sortable: false,
    },
    {
      name: "plan",
      align: "left",
      label: "Planes",
      field: "plan",
      sortable: false,
    },
    {
      name: "cantidadPlanes",
      align: "left",
      label: "Cant.Planes",
      field: "cantidad",
      headerStyle: "width: 35px; white-space: normal",
      sortable: false,
    },
    {
      name: "cantidadMeses",
      align: "left",
      label: "Cant.Meses",
      field: "meses",
      headerStyle: "width: 35px; white-space: normal",
      sortable: false,
    },
    {
      name: "metodoPago",
      align: "left",
      label: "Metodo de Pago",
      field: "metodoPago",
      headerStyle: "width: 35px; white-space: normal",
      sortable: false,
    },
    {
      name: "banco",
      align: "left",
      label: "Banco",
      field: "banco",
      sortable: false,
    },
    {
      name: "referencia",
      align: "left",
      label: "Referencia",
      field: "referencia",
      sortable: false,
    },
    {
      name: "fechaPago",
      align: "left",
      label: "Fecha de pago",
      field: "fechaPago",
      headerStyle: "width: 35px; white-space: normal",
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
  getSuscripciones();
  getModules();
});
const getSuscripciones = async () => {
  try {
    loader.value = true;
    const body = {
      tipo: "suscripcion",
      estado: "Pendiente",
      itemsPorPagina: pagination.value.rowsPerPage,
      pagina: pagination.value.page,
    };
    const { data } = await Endpoint.suscripciones({
      body,
      path: "get",
    });
    suscripciones.value = data.suscripciones;
    pagination.value.rowsNumber = data.countSuscripciones || 0;
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    loader.value = false;
  }
};
const getModules = async () => {
  try {
    const { data } = await endpoint.getListModules();
    listOfModules.value = data;
  } catch (e) {
    console.log(e);
  }
};
const openForm = (item) => {
  console.log({ item });
  suscripcionData.value = item;
  openDialogForm.value = true;
};
const activarSuscripcion = async ($event) => {
  console.log($event);
  $event.modulosId = [];
  for (const modulosPlan of $event?.plan?.modulos) {
    if (!modulosPlan?.activo) continue;
    if (modulosPlan.modulos && modulosPlan.modulos[0]) {
      for (const modulo of modulosPlan.modulos) {
        const keyModulo = listOfModules.value.find((e) => e.nombre === modulo);
        const indexKey = $event?.modulosId?.findIndex(
          (e) => e === keyModulo.key,
        );
        if (indexKey === -1) $event.modulosId.push(keyModulo.key);
      }
    }
  }
  setTimeout(() => (loaderActions.value = true), 1000);
  try {
    const body = {
      ...$event,
    };
    const { data } = await Endpoint.suscripciones({
      body,
      path: "create/newDominio",
    });
    getSuscripciones();
    openDialogForm();
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    // openDialogForm.value = false;
    loaderActions.value = true;
    loaderActions.value = false;
  }
};
const openDelete = (item) => {
  suscripcionData.value = item;
  openDeleteBanco.value = true;
};
const deleteBanco = async () => {
  loaderDelete.value = true;
  const body = {
    _id: suscripcionData.value._id,
  };
  try {
    const { data } = await Endpoint.bancos({
      body,
      path: "delete",
    });
    const index1 = suscripciones.value.findIndex(
      (e) => e._id === suscripcionData.value._id,
    );
    if (index1 !== -1) {
      suscripciones.value.splice(index1, 1);
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
      (v) => v.name.toLowerCase().indexOf(needle) > -1,
    );
  });
};
watch(
  () => openDeleteBanco.value,
  (value) => {
    if (!value) {
      suscripcionData.value = null;
    }
  },
  { deep: true },
);
watch(
  () => openDialogForm.value,
  (value) => {
    if (!value) {
      suscripcionData.value = null;
    }
  },
  { deep: true },
);
watch(
  filtros.value,
  debounce((value) => {
    getSuscripciones();
  }, 500),
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
