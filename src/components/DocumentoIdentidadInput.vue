<template>
  <div class="form-field row no-wrap q-col-gutter-md">
    <q-select
      v-model="inputValue.type"
      :options="typesDocument"
      dense
      class="col-3"
      :color="color"
      :rules="rules.required"
      @update:model-value="emitValue"
    >
    </q-select>
    <q-input
      v-model="inputValue.text"
      :placeholder="placeholder"
      :label="label"
      dense
      class="col-9"
      :color="color"
      :rules="optional ? [] : rules || rulesrequired"
      :disable="!typesDocument.includes(inputValue.type)"
      type="number"
      @update:model-value="emitValue"
    >
    </q-input>
  </div>
</template>
<script setup>
import { computed, defineEmits, defineProps, onMounted, watch, ref } from "vue";
const props = defineProps({
  value: {
    default: "",
    type: String,
  },
  doc: {
    default: "",
    type: String,
  },
  type: {
    default: "",
    type: String,
  },
  typesDocument: {
    default: () => ["V", "J", "G", "E", ""],
    type: Array,
  },
  label: {
    default: "",
    type: String,
  },
  color: {
    default: "black",
    type: String,
  },
  placeholder: {
    default: "Documento de Identidad",
    type: String,
  },
  rules: {
    default: () => [],
    type: Array,
  },
  optional: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  "update:value",
  "update:type",
  "update:doc",
  "openDialog",
]);
const inputValue = ref({
  type: "V",
  text: "",
});
const rulesrequired = [(v) => !!v || "Campo requerido"];
const fieldValue = computed({
  get() {
    const { text, type } = inputValue.value;
    return `${type}${text}`;
  },
  set(value) {
    const { text, type } = inputValue.value;
    emit("update:value", `${type}${text}`);
  },
});
onMounted(() => {
  setValue();
});
const setValue = () => {
  if (props.value && typeof props.value === "string") {
    const type = props.value[0];
    let indexSubstring = 2;
    if (props.typesDocument.includes(type)) {
      inputValue.value.type = type;
    } else {
      indexSubstring = 0;
    }
    const text = unFormatNumber(props.value.substring(indexSubstring));
    inputValue.value.text = text;
  }
  const type = props.type;
  if (type && props.typesDocument.includes(type)) {
    inputValue.value.type = type;
  }
  const doc = unFormatNumber(props.doc || "");
  if (doc) {
    inputValue.value.text = doc;
  }
};
const emitValue = () => {
  const { text, type } = inputValue.value;
  emit("update:type", type);
  emit("update:doc", text);
  emit("update:value", `${type}${text}`);
};
const unFormatNumber = (n) => {
  // format number 10.000,10 to 1000010
  return n.replace(/\D/g, "");
};
watch(
  () => props.value,
  (val) => {
    if (val === fieldValue.value) return;
    setValue();
  }
);
watch(
  () => props.doc,
  (val) => {
    console.log("some");
    if (val === fieldValue.value) return;
    setValue();
  }
);
watch(
  () => props.type,
  (val) => {
    console.log("some");
    if (val === fieldValue.value) return;
    setValue();
  }
);
</script>
