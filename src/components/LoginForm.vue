<template>
  <div class="card-form sombra-1 q-mx-auto" style="max-width: 600px">
    <router-link class="square titulo-4 q-pa-md" :to="{ path: '/login' }">
      <q-img src="~assets/logo.svg" />
    </router-link>
    <h1
      class="titulo-color q-ma-none"
      :class="{ 'titulo-2': isDesktop, 'titulo-4': !isDesktop }"
    >
      Iniciar sesión
    </h1>
    <q-form
      ref="loginForm"
      class="w-100"
      no-error-focus
      @keyup.enter="handleSubmit"
    >
      <div class="field-input">
        <label class="texto-3 texto-color">
          Email
          <q-input
            v-model="loginData.email"
            class="q-mt-xs"
            placeholder="myemail@mail.com"
            dense
            outlined
            color="primary"
            :rules="rules.email"
          ></q-input>
        </label>
      </div>
      <div class="field-input">
        <label class="texto-3 texto-color">
          Contraseña
          <q-input
            v-model="loginData.password"
            class="q-mt-xs"
            placeholder="********"
            dense
            outlined
            color="primary"
            :type="passwordType"
            :rules="rules.password"
          >
            <template v-slot:append>
              <q-btn flat dense :icon="iconsByInput" @click="togglePaswordType">
                <q-tooltip>
                  <span>{{ tooltipByInput }}</span>
                </q-tooltip></q-btn
              >
            </template>
          </q-input>
        </label>
      </div>
    </q-form>
    <a class="w-100 text-primary" v-if="false">¿Olvidaste tu contraseña?</a>
    <q-btn
      rounded
      color="primary"
      unelevated
      class="w-100 btn-login text-2 text-weight-bold"
      :disable="!isFormValid"
      :loading="isLoading"
      @click="handleSubmit"
    >
      Iniciar sesión
    </q-btn>
    <p class="q-my-none" v-show="false">¿aun no tiene una cuenta?</p>
    <q-btn
      v-show="false"
      rounded
      color="primary"
      flat
      unelevated
      class="w-100 text-2 text-weight-bold"
    >
      Regístrate
    </q-btn>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch, defineEmits } from "vue";
import { Screen } from "quasar";
import endpoint from "../services/Endpoint";

const emit = defineEmits(["login-sucess"]);
const rules = {
  email: [
    (v) => !!v || "Campo obligatorio",
    (v) => {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      return emailRegex.test(v) || "Correo invalido";
    },
  ],
  password: [(v) => !!v || "Campo obligatorio"],
};

const isFormValid = ref(false);
const loginForm = ref(null);
const isLoading = ref(false);
const loginData = ref({
  email: "",
  password: "",
});
const passwordType = ref("password");

onMounted(() => {});

const isDesktop = computed(() => {
  return Screen.gt.sm;
});
const togglePaswordType = () => {
  passwordType.value = passwordType.value === "password" ? "text" : "password";
};
const iconsByInput = computed(() => {
  return passwordType.value === "password" ? "visibility_off" : "visibility";
});
const tooltipByInput = computed(() => {
  return passwordType.value === "password" ? "Mostrar" : "Ocultar";
});

const handleSubmit = async () => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (!emailRegex.test(loginData.value.email)) return;
  if (!loginData.value.password) return;
  isLoading.value = true;
  try {
    const { data } = await endpoint.login(loginData.value);
    emit("login-sucess", data);
  } catch (e) {
    console.log(e);
  }
  isLoading.value = false;
};

watch(
  () => loginData,
  (value) => {
    loginForm.value?.validate().then((success) => {
      isFormValid.value = success;
    });
  },
  { deep: true }
);
</script>
<style scoped>
.field-input {
  margin-top: 20px;
}
.card-form {
  display: flex;
  flex-direction: column;
  padding: 40px;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
  border: 1px solid #d3d3d3;
  background: #fff;
  height: 100%;
}
.square {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 80px;
  background: var(--q-dark, #f25512);
  color: #fff;
  border-radius: 20px;
}
.btn-login {
  min-height: 48px;
}
</style>
