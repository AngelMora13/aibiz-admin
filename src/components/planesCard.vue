<template>
  <q-card
    class="q-px-lg q-py-md item-card"
    bordered
    flat
    style="border-radius: 12px; max-width: 300px"
  >
    <q-card-section class="row q-col-gutter-md">
      <div class="col-12 q-pt-none column justify-center items-center">
        <p
          class="item-title ellipsis-2-lines q-mb-none text-capitalize"
          :title="plan.nombre"
          style="font-size: 16px"
        >
          {{ plan?.nombre }}
        </p>
        <p
          class="item-subtitle ellipsis q-mb-none text-subtitle2 text-grey"
          :title="plan.tipo.text"
        >
          {{ tiposPlanes[plan?.tipo] }}
        </p>
      </div>
    </q-card-section>
    <q-card-section class="row q-col-gutter-md q-pa-none">
      <div class="col-12 q-pt-none column justify-center items-end">
        <p class="item-title ellipsis-2-lines q-mb-none text-capitalize">
          $
          {{
            (plan?.precio || 0).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </p>
      </div>
    </q-card-section>
    <q-list>
      <template v-for="group in groupedModulos">
        <q-item-label
          header
          v-if="group.length"
          :key="group[0].tipo"
          class="q-py-none"
          style="font-size: 13px"
        >
          {{ getTipoText(group[0].tipo) }}
        </q-item-label>
        <q-item v-for="modulo in group" :key="modulo.value" dense>
          <q-item-section side thumbnail>
            <q-icon
              name="check"
              color="secondary"
              class="listModulos"
              v-if="modulo.activo"
            />
            <q-icon name="close" color="negative" class="listModulos" v-else />
          </q-item-section>
          <q-item-section class="listModulos">{{ modulo.text }}</q-item-section>
        </q-item>
      </template>
    </q-list>
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
const tiposPlanes = { comercial: "Plan Comercial", contador: "Plan Contador" };
const orderTypes = {
  comercial: [
    "gestionOperativa",
    "gestionFinanciera",
    "gestionContable",
    "gestionTributaria",
  ],
  contador: [
    "gestionContable",
    "gestionTributaria",
    "gestionOperativa",
    "gestionFinanciera",
  ],
};

const sortedModulos = computed(() => {
  const order = orderTypes[props.plan.tipo] || [];
  return props.plan.modulos.slice().sort((a, b) => {
    return order.indexOf(a.tipo) - order.indexOf(b.tipo);
  });
});

const groupedModulos = computed(() => {
  return Object.values(
    sortedModulos.value.reduce((groups, modulo) => {
      if (!groups[modulo.tipo]) {
        groups[modulo.tipo] = [];
      }
      groups[modulo.tipo].push(modulo);
      return groups;
    }, {})
  );
});
onMounted(async () => {
  // console.log(props.plan);
});
const getTipoText = (tipo) => {
  const tipoTextos = {
    gestionContable: "Gestión Contable",
    gestionTributaria: "Gestión Tributaria",
    gestionOperativa: "Gestión Operativa",
    gestionFinanciera: "Gestión Financiera",
  };
  return tipoTextos[tipo] || "Otros";
};
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
.listModulos {
  font-size: 11px;
}
</style>
