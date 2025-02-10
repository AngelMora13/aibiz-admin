<template>
  <q-page class="gap-2 page-main overflow-auto">
    <div class="flex justify-between w-100">
      <div>
        <q-select
          v-model="tipoPlan"
          label="Tipo de plan"
          title="Tipo de plan"
          :options="['Plan Comercial', 'Plan Contador']"
          dense
          clearable
          color="black"
          style="min-width: 200px"
          @update:model-value="getLisPlanes()"
        ></q-select>
      </div>
      <q-btn
        color="secondary"
        unelevated
        @click="openAddPlan = true"
        class="q-mb-sm"
        >Agregar Plan</q-btn
      >
    </div>
    <div class="grid-cards">
      <div v-for="plan of planes" :key="plan._id">
        <planesCard :plan="plan" @click="openEditPlan(plan)"></planesCard>
      </div>
    </div>
    <q-dialog
      v-model="openAddPlan"
      @keydown.esc="openAddPlan = false"
      persistent
    >
      <q-card class="dialog-card" style="width: 600px">
        <div
          class="dialog-card_header q-pt-sm flex justify-between align-center"
        >
          {{ itemPlan ? "Editar" : "Agregar" }} Plan
          <q-btn flat icon="close" @click="openAddPlan = false"></q-btn>
        </div>
        <PlanesForm
          @guardar-plan="savePlan"
          @eliminar-plan="deletePlan"
          :planData="itemPlan"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { useUserStore } from "src/stores/user-store";
import { ref, onMounted, watch, computed } from "vue";
import PlanesForm from "src/components/PlanesForm.vue";
import planesCard from "src/components/planesCard.vue";
import Endpoint from "src/services/Endpoint";

const userStore = useUserStore();
const openAddPlan = ref(false);
const itemPlan = ref(null);
const planes = ref([]);
const planesFilter = ref([]);
const tipoPlan = ref(null);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});
onMounted(async () => {
  getLisPlanes();
});
const getLisPlanes = async () => {
  try {
    //loaderIva.value = true;
    const body = {
      tipoPlan: tipoPlan.value,
      itemsPorPagina: pagination.value.rowsPerPage,
      pagina: pagination.value.page,
    };
    const { data } = await Endpoint.planes({
      body,
      path: "get",
    });
    planes.value = data.planes;
    pagination.value.rowsNumber = data.countPlanes || 0;
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    //loaderIva.value = false;
  }
};
const savePlan = async ($event) => {
  console.log($event);
  try {
    const body = {
      ...$event,
    };
    const { data } = await Endpoint.planes({
      body,
      path: "save",
    });
    getLisPlanes();
    openAddPlan.value = false;
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    //openAddPlan.value = false;
  }
  //planes.value.push($event);
};
const deletePlan = async ($event) => {
  console.log($event);
  try {
    const body = {
      ...$event,
    };
    const { data } = await Endpoint.planes({
      body,
      path: "delete",
    });
    getLisPlanes();
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Ha ocurrido un error inesperado");
  } finally {
    openAddPlan.value = false;
  }
};
const openEditPlan = (plan) => {
  console.log({ plan });
  itemPlan.value = plan;
  openAddPlan.value = true;
};
watch(
  () => openAddPlan.value,
  (value) => {
    if (!value) {
      itemPlan.value = null;
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
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.item-card {
  height: 100%;
}
</style>
