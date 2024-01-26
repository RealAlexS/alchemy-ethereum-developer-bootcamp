<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <DeploymentForm />
      </v-col>

      <v-col cols="12" md="6">
        <ExistingContracts />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { load } from "@/utils/lazy";

const DeploymentForm = load(import("@/components/DeploymentForm/Index.vue"));
const ExistingContracts = load(
  import("@/components/ExistingContracts/Index.vue"),
);
</script>
