<template>
  <v-container>
    <div class="d-flex align-center">
      <h3>Transaction Details</h3>
      <div class="ml-2 text-subtitle-2 text-grey-darken-1">#{{ txHash }}</div>
    </div>

    <v-divider class="my-4"></v-divider>

    <v-card v-if="transactionReceipt && block && transaction" class="pa-4">
      <!-- TRANSACTION HASH -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Transaction Hash
        </v-col>
        <v-col cols="8" class="text-body-2 text-truncate">
          {{ transactionReceipt.transactionHash }}
        </v-col>
      </v-row>
      <!-- BLOCK -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Block
        </v-col>
        <v-col cols="8" class="text-body-2 d-flex align-center">
          <div
            class="text-blue-lighten-1"
            style="cursor: pointer"
            @click="viewBlock(transactionReceipt.blockNumber)"
          >
            {{ transactionReceipt.blockNumber }}
          </div>
          <v-chip size="small" class="ml-2">
            {{ transaction.confirmations }} Block Confirmations</v-chip
          >
        </v-col>
      </v-row>
      <!-- TIMESTAMP -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Timestamp
        </v-col>
        <v-col cols="8" class="text-body-2">
          <v-icon size="small">mdi-clock-outline</v-icon>

          {{ humanizeTsToTimeDiff(block.timestamp) }}
          ({{ humanizeTsToDate(block.timestamp) }})
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- FROM -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          From
        </v-col>
        <v-col cols="8" class="text-body-2">
          {{ transactionReceipt.from }}
        </v-col>
      </v-row>
      <!-- TO -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1"> To </v-col>
        <v-col cols="8" class="text-body-2">
          {{ transactionReceipt.to }}
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- VALUE -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Value
        </v-col>
        <v-col cols="8" class="text-body-2">
          {{ Utils.formatEther(transaction.value) }}
          <v-icon size="small">mdi-ethereum</v-icon>
        </v-col>
      </v-row>

      <!-- TRANSACTION FEE -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Transaction Fee
        </v-col>
        <v-col cols="8" class="text-body-2">
          {{
            Utils.formatEther(transactionReceipt.gasUsed * transaction.gasPrice)
          }}
          <v-icon size="small">mdi-ethereum</v-icon>
        </v-col>
      </v-row>

      <!-- GAS PRICE -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Gas Price
        </v-col>
        <v-col cols="8" class="text-body-2">
          {{ Utils.formatUnits(transaction.gasPrice, "gwei") }} Gwei
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Utils } from "alchemy-sdk";
import { useAlchemy } from "@/composables/alchemy";
import { humanizeTsToTimeDiff, humanizeTsToDate } from "@/utils/date";

const { alchemy } = useAlchemy();
const transactionReceipt = ref(null);
const block = ref(null);
const transaction = ref(null);

const route = useRoute();
const { txHash } = route.params;

onMounted(async () => {
  await Promise.all([fetchTransactionReceipt()]);
  await Promise.all([fetchBlock(transactionReceipt.value.blockNumber)]);
  transaction.value = block.value.transactions.find((tx) => tx.hash === txHash);
});

// SDK Calls
const fetchTransactionReceipt = async () => {
  transactionReceipt.value = await alchemy.core.getTransactionReceipt(txHash);
};

const fetchBlock = async (blockNumber) => {
  block.value = await alchemy.core.getBlockWithTransactions(blockNumber);
};

// Navigation
const router = useRouter();

const viewBlock = (blockNumber) => {
  router.push({
    name: "Block",
    params: { blockNumber },
  });
};
</script>
