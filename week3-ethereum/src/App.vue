<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { useAlchemy } from "@/composables/alchemy";
import { useAppStore } from "@/store/app";

const { alchemy } = useAlchemy();
const { setLatestBlockNumber } = useAppStore();

// Subscriptions
const subscribe = () => {
  alchemy.ws.on("block", (blockNumber) => {
    console.info("The latest block number is", blockNumber);
    setLatestBlockNumber(blockNumber);
  });
};

const unsubscribe = () => {
  alchemy.ws.removeAllListeners();
};

// Lifecycle Actions
onMounted(async () => {
  subscribe();
});

onUnmounted(() => {
  unsubscribe();
});
</script>
