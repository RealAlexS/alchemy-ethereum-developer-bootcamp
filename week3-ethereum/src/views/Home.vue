<template>
  <v-container>
    <v-card color="tertiary" class="mb-4 pa-4">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon>mdi-clock-outline</v-icon>
          <h3 class="ml-2">Last Block</h3>
          <div class="ml-2 text-subtitle-2 text-grey-darken-1">
            #{{ latestBlockNumber }}
          </div>
        </div>
        <div v-if="currentGasPrice" class="d-flex align-center">
          <v-icon>mdi-gas-station-outline</v-icon>
          <h3 class="ml-2">Gas Price</h3>
          <div class="ml-2 text-subtitle-2 text-grey-darken-1">
            {{ parseInt(Utils.formatUnits(currentGasPrice, "gwei")) }} Gwei
          </div>
        </div>
      </div>
    </v-card>

    <v-divider class="my-4"></v-divider>

    <v-btn
      color="tertiary"
      size="small"
      prepend-icon="mdi-navigation-variant-outline"
      @click="viewBlocks"
    >
      View All Blocks
    </v-btn>

    <v-btn
      color="tertiary"
      size="small"
      prepend-icon="mdi-refresh"
      class="ml-4"
      @click="fetchLatestData"
    >
      Refresh
    </v-btn>
    <v-divider class="my-4"></v-divider>

    <v-row v-if="latestBlocks && latestTransactions">
      <v-col cols="12" md="6">
        <v-card>
          <v-list>
            <v-list-subheader class="font-weight-bold">
              Latest Blocks
            </v-list-subheader>
            <v-divider></v-divider>
            <v-list-item
              v-for="(block, i) in latestBlocks"
              :key="i"
              :value="block"
              color="primary"
              prepend-icon="mdi-cube-outline"
              @click="viewBlock(block.number)"
            >
              <v-row no-gutters class="text-body-2">
                <v-col cols="4">{{ block.number }}</v-col>
                <v-col cols="8">
                  Fee Recipient: {{ shortenAddress(block.miner) }}
                </v-col>
              </v-row>
              <v-row no-gutters class="text-caption">
                <v-col cols="4">
                  {{ humanizeTsToTimeDiff(block.timestamp) }}
                </v-col>
                <v-col cols="8">{{ block.transactions.length }} txns</v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="text-body-2">
          <v-list>
            <v-list-subheader class="font-weight-bold">
              Latest Transactions
            </v-list-subheader>
            <v-divider></v-divider>
            <v-list-item
              v-for="(tx, i) in latestTransactions"
              :key="i"
              :value="tx"
              color="primary"
              prepend-icon="mdi-file-document-outline"
              @click="viewTx(tx.hash)"
            >
              <div>
                <v-row no-gutters>
                  <v-col cols="4">{{ shortenHash(tx.hash) }}</v-col>
                  <v-col cols="8"> From: {{ shortenAddress(tx.from) }} </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="4" class="text-caption">{{
                    humanizeTsToTimeDiff(tx.timestamp)
                  }}</v-col>
                  <v-col cols="8">To: {{ shortenAddress(tx.to) }}</v-col>
                </v-row>
              </div>

              <template #append>
                <v-card
                  color="tertiary"
                  width="80"
                  class="elevation-0 text-caption font-weight-bold"
                >
                  <div class="ma-2 d-flex align-center justify-end">
                    {{ formatEther(tx.value) }}
                    <v-icon size="small">mdi-ethereum</v-icon>
                  </div>
                </v-card>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Utils } from "alchemy-sdk";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { useAlchemy } from "@/composables/alchemy";
import { humanizeTsToTimeDiff } from "@/utils/date";

const { latestBlockNumber } = storeToRefs(useAppStore());
const { setLatestBlockNumber } = useAppStore();

const { alchemy } = useAlchemy();

const currentGasPrice = ref(null);
const blockWithTransactions = ref(null);
const latestTransactions = ref(null);
const latestBlocks = ref(null);

const MAX_ITEMS = 6;

onMounted(async () => {
  await Promise.all([fetchBlockNumber()]);
  await fetchLatestData();
});

const fetchLatestData = async () => {
  try {
    await Promise.all([
      fetchLatestBlocks(),
      fetchLatestTransactions(),
      fetchGasPrice(),
    ]);
  } catch (error) {
    console.error(error);
  }
};

// SDK Calls
const fetchBlockNumber = async () => {
  try {
    const latestBlockNumber = await alchemy.core.getBlockNumber();
    setLatestBlockNumber(latestBlockNumber);
  } catch (error) {
    console.error(error);
  }
};

const fetchGasPrice = async () => {
  try {
    currentGasPrice.value = await alchemy.core.getGasPrice();
  } catch (error) {
    console.error(error);
  }
};

const fetchLatestTransactions = async () => {
  try {
    const res = await alchemy.core.getBlockWithTransactions(
      latestBlockNumber.value,
    );
    blockWithTransactions.value = res;
    latestTransactions.value = res.transactions
      .slice(0, MAX_ITEMS)
      .map((obj) => ({
        ...obj,
        timestamp: res.timestamp,
      }));
  } catch (error) {
    console.error(error);
  }
};

const fetchLatestBlocks = async () => {
  try {
    const blocksPromises = [];
    for (let i = 0; i < MAX_ITEMS; i++) {
      blocksPromises.push(alchemy.core.getBlock(latestBlockNumber.value - i));
    }
    latestBlocks.value = await Promise.all(blocksPromises);
  } catch (error) {
    console.error(error);
  }
};

// Utils
const shortenAddress = (address) => {
  return (
    address.substring(0, 5) + "..." + address.substring(address.length - 4)
  );
};

const shortenHash = (hash) => {
  return hash.substring(0, 7) + "...";
};

const formatEther = (bigNumber) => {
  const amountEth = Utils.formatEther(bigNumber);
  let num = parseFloat(amountEth);
  if (num === 0) {
    return "0";
  }
  return num.toFixed(4).replace(/(\.0+|0+)$/, "");
};

// Navigation
const router = useRouter();

const viewBlocks = () => {
  router.push({
    name: "Blocks",
  });
};

const viewBlock = (blockNumber) => {
  router.push({
    name: "Block",
    params: { blockNumber },
  });
};

const viewTx = (txHash) => {
  router.push({
    name: "Tx",
    params: { txHash },
  });
};
</script>
