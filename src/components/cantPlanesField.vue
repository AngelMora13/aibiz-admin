<template>
  <div class="flex justify-start aling-center">
    <q-btn
      icon="add"
      @click="increment"
      flat
      dense
      color="secondary"
      class="q-ma-none q-pa-none"
      :disable="disabled"
    />
    <q-input
      v-model="counter"
      type="number"
      min="1"
      outlined
      dense
      style="width: 60px"
      @update:model-value="checkMin"
      :disable="disabled"
    >
    </q-input>
    <q-btn
      icon="remove"
      @click="decrement"
      flat
      color="secondary"
      dense
      class="q-pa-none q-ma-none"
      :disable="disabled"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, defineEmits, watch } from "vue";

const emit = defineEmits(["update:value"]);
const props = defineProps({
  value: {
    type: Number,
  },
  counterMin: {
    default: 0,
    type: Number,
  },
  counterMax: {
    type: Number,
  },
  tipo: {
    type: String,
  },
  disabled: {
    type: Boolean,
  },
});
const counter = ref(0);
const min = ref(0);
const max = ref(null);
onMounted(() => {
  counter.value = props?.value || 0;
  if (!props.value && props.tipo === "planes") counter.value = 1;
  min.value = props.counterMin;
  max.value = props.counterMax;
});

const increment = () => {
  let countNumber = Number(counter.value);
  if (max.value && countNumber >= max.value)
    return (counter.value = countNumber);
  countNumber++;
  counter.value = countNumber;
};

const decrement = () => {
  let countNumber = Number(counter.value);
  if (min.value && countNumber <= min.value) {
    return (counter.value = countNumber);
  }
  if (countNumber === 0) return;
  countNumber--;
  counter.value = countNumber;
};

const checkMin = () => {
  if (Number(counter.value) < min.value) {
    counter.value = min.value;
  }
};
watch(
  () => counter.value,
  (value) => {
    emit("update:value", value);
  },
  { flush: "post" }
);
watch(
  () => props.disabled,
  (value) => {
    console.log(value);
    if (value && props.tipo !== "planes") {
      counter.value = 0;
    }
  },
  { flush: "post" }
);
</script>

<style scoped>
.q-input__inner {
  display: flex;
  align-items: center;
}
.q-btn {
  margin: 0 5px;
}
</style>
