<template>
  <div class="q-pa-md column gap-2">
    <h3 class="titulo-color titulo-3 q-ma-none text-capitalize">
      {{ formType }}
      Usuario
    </h3>
    <q-form ref="formRef" class="w-100" no-error-focus>
      <div class="row q-col-gutter-md">
        <q-input
          v-model="usuarioData.nombre"
          class="col-12"
          placeholder="nombre"
          dense
          outlined
          color="primary"
          :rules="rules.requeridos"
        >
          <template v-slot:prepend>
            <q-icon name="format_color_text" color="secondary" />
          </template>
        </q-input>
        <q-input
          v-model="usuarioData.email"
          class="col-12"
          placeholder="email"
          dense
          outlined
          color="primary"
          :rules="rules.email"
        >
          <template v-slot:prepend>
            <q-icon name="alternate_email" color="secondary" />
          </template>
        </q-input>
        <q-input
          v-model="usuarioData.telefono"
          class="col-12"
          placeholder="Teléfono"
          type="tel"
          :rules="rules.phone"
          dense
          outlined
          color="primary"
        >
          <template v-slot:prepend>
            <q-icon name="call" color="secondary" />
          </template>
        </q-input>
      </div>
      <div class="column row-sm justify-end" v-if="formType === 'crear'">
        <q-btn
          unelevated
          color="primary"
          class="q-mt-md text-capitalize"
          :disable="!isFormValid"
          @click="emit('submit')"
          >Crear</q-btn
        >
      </div>
      <div
        class="flex-responsive justify-end q-mt-lg"
        v-if="formType === 'editar'"
      >
        <div class="flex-responsive justify-end">
          <q-btn
            v-if="!usuarioData.isSuperAdmin"
            outline
            color="negative"
            class="text-capitalize"
            @click="openAlertDelete = true"
          >
            Eliminar
          </q-btn>
          <q-btn
            unelevated
            color="primary"
            class="text-capitalize"
            :disable="!isFormValid"
            @click="emit('submit')"
          >
            Guardar
          </q-btn>
        </div>
      </div>
    </q-form>
    <q-dialog v-model="openAlertDelete">
      <div class="alert-container">
        <span> ¿Está seguro(a) que desea eliminar este usuario? </span>
        <q-btn
          color="negative text-capitalize"
          class="q-mb-md"
          @click="emit('delete')"
          >Eliminar
        </q-btn>
      </div>
    </q-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch, defineProps, defineEmits } from "vue";
import { useUserStore } from "stores/user-store";
import endpoint from "../services/Endpoint";

const props = defineProps({
  usuario: {
    required: true,
  },
  formType: {
    default: "crear",
    type: String,
  },
});
const emit = defineEmits(["update:usuario", "submit", "delete"]);
const userStore = useUserStore();
const formRef = ref(null);
const openAlertDelete = ref(false);
const rules = {
  email: [
    (v) => !!v || "Campo obligatorio",
    (v) => {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      return emailRegex.test(v) || "Correo invalido";
    },
  ],
  requeridos: [(v) => !!v || "Campo obligatorio"],
  phone: [
    (v) => !!v || "Campo obligatorio",
    (v) =>
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(v) ||
      "Numero invalido",
  ],
};
onMounted(() => {
  if (props.formType === "editar") {
    formRef.value?.validate().then((success) => {
      if (success) isFormValid.value = success;
    });
  }
});
const usuarioData = computed({
  get() {
    return props.usuario;
  },
  set(value) {
    emit("update:usuario", value);
  },
});
const isFormValid = ref(false);

watch(
  () => props.usuario,
  (value) => {
    formRef.value?.validate().then((success) => {
      isFormValid.value = success;
    });
  },
  { deep: true }
);
</script>
<style>
.q-field__suffix {
  color: var(--texto-input-light);
}
.q-chip__icon--remove {
  color: #fff;
  font-size: 0.875rem;
}
.q-field__prepend {
  align-self: center;
}
.flex-responsive {
  gap: 10px;
}
.flex-responsive .flex-responsive {
  gap: 40px;
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
  .flex-responsive,
  .flex-responsive .flex-responsive {
    gap: 20px;
    flex-direction: column-reverse;
  }
}
</style>
