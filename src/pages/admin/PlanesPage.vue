<template>
  <q-page class="gap-2 page-main overflow-auto">
    <div class="flex justify-end w-100">
      <q-btn color="secondary" unelevated @click="openAddPlan = true"
        >Agregar Plan</q-btn
      >
    </div>
    <div class="grid-cards">
      <div v-for="plan of planes" :key="plan._id">
        <planesCard :plan="plan"></planesCard>
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
        <PlanesForm @guardar-plan="savePlan" />
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { useUserStore } from "src/stores/user-store";
import { ref, onMounted, watch, computed } from "vue";
import PlanesForm from "src/components/PlanesForm.vue";
import planesCard from "src/components/planesCard.vue";

const userStore = useUserStore();
const openAddPlan = ref(false);
const itemPlan = ref(null);
const planes = ref([]);
onMounted(async () => {});
const savePlan = ($event) => {
  console.log($event);
  openAddPlan.value = false;
  planes.value.push($event);
};
watch(
  () => {},
  (value) => {
    if (!value) {
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.item-card {
  height: 100%;
}
</style>
