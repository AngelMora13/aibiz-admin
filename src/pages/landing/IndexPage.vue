<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
  </q-page>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = ref(useRouter());
router.value.push({ name: "login" });
</script>
