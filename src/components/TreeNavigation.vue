<template>
  <q-expansion-item
    v-model="show"
    :expand-separator="expandSeparator"
    :icon="node.icon"
    :label="node.text"
    hide-expand-icon
    :header-inset-level="headerInsetLevel"
    :to="toRoute && { name: toRoute, params: toParams }"
    :group="group"
    v-if="hasChilds && showTree"
  >
    <TreeNavigation
      v-for="child of node.childs"
      :key="child.text"
      :node="child"
      :expand-separator="false"
      :header-inset-level="headerInsetLevel + 0.3"
      group="nivel"
    ></TreeNavigation>
  </q-expansion-item>
  <q-item
    v-else
    clickable
    v-ripple
    :inset-level="headerInsetLevel"
    :to="toRoute && { name: toRoute, params: toParams }"
  >
    <q-item-section avatar v-show="node.icon">
      <q-icon :name="node.icon"/>
    </q-item-section>
    <q-item-section>{{ node.text }}</q-item-section>
  </q-item>
</template>

<script setup>
import { useUserStore } from "src/stores/user-store";
import { computed, defineProps, ref, watch } from "vue";
const props = defineProps({
  node: { type: Object, required: true },
  headerInsetLevel: {
    type: Number,
    default: 0,
  },
  expandSeparator: {
    type: Boolean,
    default: true,
  },
  group: {
    type: String,
  },
  miniDrawer: {
    type: Boolean
  }
});
const show = ref(false)
const userStore = useUserStore();
const hasChilds = computed(() => {
  return props.node.childs && props.node.childs.length;
});
const toRoute = computed(() => {
  return props.node.route;
});
const showTree = computed(() => {
  return (
    !props.node.condicion ||
    (props.node.esCliente ? userStore.user.isCliente : userStore.user.isEmpresa)
  );
});
const toParams = computed(() => {
  return props.node.params;
});

watch(()=>props.miniDrawer, (value)=> {
  if (value) show.value = false
})
</script>
<style scoped>
:deep(.q-item.q-router-link--active, .q-item--active) {
  color: var(--q-accent) !important;
  background: rgba(0,0,0,0.1);
  font-weight: 600;
}
</style>
