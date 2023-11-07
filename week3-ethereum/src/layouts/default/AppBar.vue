<template>
  <v-app-bar flat color="primary">
    <v-app-bar-title style="cursor: pointer" @click="routeHome">
      <v-icon>mdi-magnify-scan</v-icon>
      Block Explorer
    </v-app-bar-title>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from "vue-router";

// Navigation
const router = useRouter();

const routeHome = () => {
  router.push({
    name: "Home",
  });
};
</script>
