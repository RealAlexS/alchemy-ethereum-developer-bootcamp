<template>
  <v-app>
    <NotificationSnackbar />

    <default-app-bar />

    <default-view />
  </v-app>
</template>

<script setup>
import DefaultAppBar from "./AppBar.vue";
import DefaultView from "./View.vue";

import { load } from "@/utils/lazy";

const NotificationSnackbar = load(
  import("@/components/NotificationSnackbar.vue"),
);
</script>
