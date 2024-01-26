<template>
  <v-text-field
    v-model="depositer"
    :label="$t('home.contractList.searchContracts.search')"
    prepend-icon="mdi-account-arrow-up"
    append-inner-icon="mdi-magnify"
    :rules="rules.ethereumAddress"
    single-line
    variant="outlined"
    @click:append-inner="searchEscrowContract"
  ></v-text-field>
</template>

<script setup>
import { ref } from "vue";
import { ethereumAddress } from "@/utils/validators";

const emit = defineEmits(["search"]);

const depositer = ref("");

const rules = {
  ethereumAddress,
};

const searchEscrowContract = () => {
  emit("search", depositer.value);
};
</script>
