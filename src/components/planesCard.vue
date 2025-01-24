<template>
  <q-card
    class="q-px-lg q-py-md item-card"
    bordered
    flat
    style="border-radius: 12px"
  >
    <q-card-section class="row q-col-gutter-md">
      <div class="col-3 q-pl-none q-pt-none">
        <q-avatar color="secondary" size="60px" class="text-white">
          {{ name }}
        </q-avatar>
      </div>
      <div class="col-9 q-pl-sm q-pt-none">
        <p
          class="item-title ellipsis-2-lines q-mb-none text-capitalize"
          :title="plan.nombre"
        >
          {{ plan?.nombre }}
        </p>
        <p
          class="item-subtitle ellipsis q-mb-none text-subtitle2 text-grey"
          :title="plan.tipo.text"
        >
          {{ plan?.tipo.text }}
        </p>
      </div>
    </q-card-section>
    <div class="flex" style="gap: 5px">
      <q-chip
        color="secondary"
        text-color="white"
        class=""
        dense
        v-for="modulo of visibleModulos"
        :key="modulo._id"
      >
        <span>{{ modulo.text.substring(0, 15) + "..." }}</span>
        <q-tooltip
          class="secondary"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
        >
          <span style="font-size: 12px">{{ modulo.text }}</span>
        </q-tooltip>
      </q-chip>
      <q-btn v-if="showVerMas" color="secondary" flat dense> ...Ver más </q-btn>
    </div>
  </q-card>
</template>

<script setup>
import { onMounted, ref, defineProps, computed } from "vue";

const props = defineProps({
  plan: {
    type: Object,
    default: () => ({}),
  },
});
const mostrarTodos = ref(false);
const name = computed(() => {
  const nombre = (props.plan?.nombre || "").split("");
  console.log(nombre);
  return `${nombre[0]}${nombre[1]}`.toUpperCase();
});
const visibleModulos = computed(() => {
  return mostrarTodos.value
    ? props.plan.modulos
    : props.plan.modulos.slice(0, 3);
});
const showVerMas = computed(() => {
  return !mostrarTodos.value && props.plan.modulos.length > 3;
});

onMounted(async () => {
  console.log(props.plan);
});
</script>
<style scoped>
.q-avatar {
  width: 60px;
  height: 60px;
}
:deep(.q-avatar .q-avatar__content) {
  font-size: 1.5rem !important;
}
.item-card {
  cursor: pointer;
}
.item-card:hover {
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.25) !important;
}
.item-title {
  font-size: 1rem;
  font-weight: 600;
}
.item-title,
.item-subtitle {
  line-height: normal;
}
</style>
