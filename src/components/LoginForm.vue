<template>
  <div class="card-form sombra-1">
    <router-link class="square titulo-4" :to="{ path: '/' }">
      Aibiz
    </router-link>
    <h1
      class="titulo-color q-ma-none"
      :class="{ 'titulo-2': isDesktop, 'titulo-4': !isDesktop }"
    >
      Iniciar sesión
    </h1>
    <q-form ref="loginForm" class="w-100" no-error-focus>
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
            type="password"
            class="q-mt-xs"
            placeholder="********"
            dense
            outlined
            color="primary"
            :rules="rules.password"
          ></q-input>
        </label>
      </div>
    </q-form>
    <a class="w-100 text-primary">¿Olvidaste tu contraseña?</a>
    <q-btn
      rounded
      color="primary"
      unelevated
      class="w-100 btn-login text-2 text-weight-bold"
      :disable="!isFormValid"
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
import { ref, onMounted, computed, watch } from "vue";
import { Screen } from "quasar";
import endpoint from "../services/Endpoint";

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
const loginData = ref({
  email: "angelmorab13@gmail.com",
  password: "angel123",
});

onMounted(() => {
  console.log(isFormValid.value);
});

const isDesktop = computed(() => {
  return Screen.gt.sm;
});

const handleSubmit = async () => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (!emailRegex.test(loginData.value.email)) return;
  if (!loginData.value.password) return;
  try {
    const { data } = await endpoint.login(loginData.value);
    localStorage.setItem("token", data.token);
    console.log(data);
  } catch (e) {
    console.log(e);
  }
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
  background: var(--q-secondary, #f25512);
  color: #fff;
  border-radius: 20px;
}
.btn-login {
  min-height: 48px;
}
</style>
