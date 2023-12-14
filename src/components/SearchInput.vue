<template>
  <div class="search-container flex flex-center gap-1 q-pa-md bg-white">
    <q-input
      v-model="handleSearch"
      class="col-grow"
      placeholder="Buscar..."
      dense
      outlined
      color="primary"
    ></q-input>
    <q-btn
      color="primary"
      unelevated
      class="text-capitalize"
      @click="() => emit('openDialog', true)"
    >
      {{ textBtn }}
    </q-btn>
  </div>
</template>
<script setup>
import { computed, defineEmits, defineProps } from "vue";
const props = defineProps({
  searchInput: {
    default: "",
    type: String,
  },
  textBtn: {
    default: "Crear Empresa",
    type: String,
  },
});
const emit = defineEmits(["update:searchInput", "openDialog"]);
const handleSearch = computed({
  get() {
    return props.searchInput;
  },
  set(value) {
    emit("update:searchInput", value);
  },
});
</script>
<style scoped>
.search-container {
  border-radius: 0.625rem;
  border: 1px solid #c4c4c4;
}
</style>
