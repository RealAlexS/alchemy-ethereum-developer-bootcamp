<template>
  <v-container>
    <div class="d-flex align-center">
      <h3>Block</h3>
      <div class="ml-2 text-subtitle-2 text-grey-darken-1">
        #{{ blockNumber }}
      </div>
    </div>

    <v-divider class="my-4"></v-divider>

    <v-card v-if="block" class="pa-4">
      <!-- BLOCK HEIGHT -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Block Height
        </v-col>
        <v-col cols="8" class="text-body-2">
          {{ block.number }}
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
      <!-- TRANSACTIONS -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Transactions
        </v-col>
        <v-col cols="8" class="text-body-2">
          <div
            class="text-blue-lighten-1"
            style="cursor: pointer"
            @click="viewBlockTransaction"
          >
            {{ block.transactions.length }} transactions
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- FEE RECIPIENT -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Fee Recipient
        </v-col>
        <v-col cols="8" class="text-body-2">
          {{ block.miner }}
        </v-col>
      </v-row>
      <!-- BLOCK REWARD -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Block Reward
        </v-col>
        <v-col v-if="transactionReceipts" cols="8" class="text-body-2">
          {{
            Utils.formatEther(computeBlockReward(block, transactionReceipts))
          }}
          <v-icon size="small">mdi-ethereum</v-icon>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- GAS USED -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Gas Used
        </v-col>
        <v-col cols="8" class="text-body-2 d-flex align-center">
          <div>
            {{ parseInt(block.gasUsed).toLocaleString("en-US") }}
          </div>
          <div class="ml-2 text-caption text-grey-darken-1">
            ({{ ((block.gasUsed / block.gasLimit) * 100).toFixed(2) }}%)
          </div>
          <div
            class="ml-2 text-caption"
            :class="{
              'text-red': gasTargetDeviation < 0,
              'text-green': gasTargetDeviation >= 0,
            }"
          >
            {{ (gasTargetDeviation * 100).toFixed(0) }}% Gas Target
          </div>
        </v-col>
      </v-row>
      <!-- GAS LIMIT -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Gas Limit
        </v-col>
        <v-col cols="8" class="text-body-2">
          {{ parseInt(block.gasLimit).toLocaleString("en-US") }}
        </v-col>
      </v-row>
      <!-- BASE FEE PER GAS -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Base Fee Per Gas
        </v-col>
        <v-col cols="8" class="text-body-2 d-flex align-center">
          <div>
            {{ Utils.formatEther(block.baseFeePerGas) }}
          </div>
          <v-icon size="small">mdi-ethereum</v-icon>
          <div class="ml-2 text-caption text-grey-darken-1">
            ({{ Utils.formatUnits(block.baseFeePerGas, "gwei") }} Gwei)
          </div>
        </v-col>
      </v-row>
      <!-- BURNT FEES -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Burnt Fees
        </v-col>
        <v-col cols="8" class="text-body-2">
          <v-icon size="small" color="orange">mdi-fire</v-icon>
          {{ Utils.formatEther(computeBurntFee(block)) }}
          <v-icon size="small">mdi-ethereum</v-icon>
        </v-col>
      </v-row>
      <!-- EXTRA DATA -->
      <v-row>
        <v-col cols="4" class="text-subtitle-2 text-grey-darken-1">
          Extra Data
        </v-col>
        <v-col cols="8" class="text-body-2">
          {{ decodeExtraData(block) }} (hex: {{ block.extraData }})
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Utils } from "alchemy-sdk";
import { useAppStore } from "@/store/app";
import { useAlchemy } from "@/composables/alchemy";
import { humanizeTsToTimeDiff, humanizeTsToDate } from "@/utils/date";
import {
  computeBlockReward,
  computeDeviationFromGasTarget,
  computeBurntFee,
  decodeExtraData,
} from "@/utils/block";

const { alchemy } = useAlchemy();
const { setBlock, setTransactionReceipts } = useAppStore();

const block = ref(null);
const transactionReceipts = ref(null);
const gasTargetDeviation = ref(null);

const route = useRoute();
const blockNumber = parseInt(route.params.blockNumber);

onMounted(async () => {
  await Promise.all([fetchBlock(), fetchTransactionReceipts()]);
  gasTargetDeviation.value = computeDeviationFromGasTarget(block.value);

  // store to pinia
  setBlock(block.value);
  setTransactionReceipts(transactionReceipts.value);
});

// SDK Calls
const fetchBlock = async () => {
  block.value = await alchemy.core.getBlock(blockNumber);
};

const fetchTransactionReceipts = async () => {
  const params = {
    blockNumber: Utils.hexlify(blockNumber),
  };
  const res = await alchemy.core.getTransactionReceipts(params);
  transactionReceipts.value = res.receipts;
};

// Navigation
const router = useRouter();

const viewBlockTransaction = () => {
  router.push({
    name: "BlockTransactions",
    params: { blockNumber },
  });
};
</script>
