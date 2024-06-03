<template>
  <v-app-bar flat color="primary">
    <v-app-bar-title style="cursor: pointer" @click="routeHome">
      <v-icon>mdi-magnify-scan</v-icon>
      Token Indexer
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <Web3Modal />
  </v-app-bar>
</template>

<script setup>
import { useRouter } from "vue-router";

import Web3Modal from "@/components/Web3Modal/Index.vue";

// Navigation
const router = useRouter();

const routeHome = () => {
  router.push({
    name: "Home",
  });
};
</script>
