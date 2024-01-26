<template>
  <v-app-bar flat color="primary">
    <v-app-bar-title style="cursor: pointer" @click="routeHome">
      <v-icon>mdi-account-supervisor-circle</v-icon>
      {{ $t("appBar.title") }}
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <w3m-button />
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
