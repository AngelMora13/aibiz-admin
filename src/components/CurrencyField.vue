<template>
  <q-input
    v-model="inputValue"
    ref="input"
    dense
    hide-bottom-space
    color="black"
    inputmode="numeric"
    :label="label"
    :rules="!optional ? rules.required : undefined"
    :readonly="readonly"
    :disable="disable"
    @keyup="formatCurrency"
    @keyup.enter="handleEnter"
    @blur="handleBlur"
  >
  </q-input>
</template>

<script setup>
import {
  computed,
  defineProps,
  defineEmits,
  ref,
  onMounted,
  defineExpose,
  nextTick,
  watch,
} from "vue";

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
  },
  optional: {
    type: Boolean,
    default: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disable: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:value", "key-enter", "update-object"]);
const rules = {
  required: [
    (v) => {
      return !!v || "Campo obligatorio";
    },
  ],
};
const showInput = ref(false);
const inputValue = ref("0,00");
const input = ref(null);

onMounted(() => {
  inputValue.value = valueFormat.value; //props.value || inputValue.value
});

const fieldValue = computed({
  get() {
    return props.value;
  },
  set(value) {
    emit("update:value", value);
  },
});

const valueFormat = computed(() => {
  return Number(fieldValue.value).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

const handleEnter = () => {
  emit("key-enter", true);
};

const handleBlur = () => {
  formatCurrency(null, true);
};

const handleChange = () => {
  inputValue.value = Number(fieldValue.value).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  formatCurrency(null, true);
};

const formatCurrency = ($event, blur = false) => {
  if ($event && $event.key.includes("Arrow")) return;
  const inputTag = input.value?.$el.querySelector("input");
  let input_val = String(inputValue.value);

  // don't validate empty input
  if (input_val === "") {
    return;
  }

  // original length
  let original_len = input_val.length;

  // initial caret position
  let caret_pos = inputTag?.selectionStart;

  // check for decimal
  let decimal_pos = input_val.indexOf(",");
  if (decimal_pos >= 0) {
    // get position of first decimal
    // this prevents multiple decimals from
    // being entered

    // split number by decimal point
    let left_side = input_val.substring(0, decimal_pos);
    let right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(unFormatNumber(left_side).replace(/^0+/g, ""));

    // validate right side
    right_side = formatNumber(right_side);

    // On blur make sure 2 numbers after decimal
    if (blur) {
      right_side += "00";
    }

    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = (left_side || "0") + "," + right_side;
    fieldValue.value =
      Number(unFormatNumber(left_side)) +
      Number(unFormatNumber(right_side) / 100);
  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(unFormatNumber(input_val).replace(/^0+/g, ""));
    fieldValue.value = Number(unFormatNumber(input_val));

    // final formatting
    if (blur) {
      input_val += ",00";
    }
  }

  // send updated string to input
  inputValue.value = input_val;

  // put caret back in the right position
  let updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  // nextick porque sino se pone al final
  nextTick(() => inputTag?.setSelectionRange(caret_pos, caret_pos));
};

const formatNumber = (n) => {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const unFormatNumber = (n) => {
  // format number 10.000,10 to 1000010
  return n.replace(/\D/g, "");
};

watch(
  () => props.value,
  (value) => {
    if (value) {
      if (valueFormat.value !== inputValue.value) {
        handleChange();
      }
    }
  },
  { flush: "post" }
);

defineExpose({
  input,
});
watch(
  () => props.value,
  (value) => {
    inputValue.value = valueFormat.value;
  },
  { deep: true }
);
</script>

<style scoped>
:deep(input) {
  text-align: right;
}
td > span {
  display: block;
  padding-top: 14px;
  padding-bottom: 2px;
}
</style>
