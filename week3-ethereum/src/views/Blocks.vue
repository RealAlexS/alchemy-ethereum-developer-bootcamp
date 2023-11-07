<template>
  <v-container>
    <h3>Blocks</h3>

    <v-divider class="my-4"></v-divider>

    <v-card v-if="blocks">
      <v-list>
        <v-list-subheader class="font-weight-bold">
          Total of {{ serviceableNumBlocks?.toLocaleString("en-US") }} Blocks
          since "The Merge"
        </v-list-subheader>
        <v-list-subheader>
          (Showing blocks between #{{ fromBlock.number }} and #{{
            toBlock.number
          }})
        </v-list-subheader>

        <!-- NAVIGATION -->
        <v-list-item>
          <v-btn
            class="mr-1"
            size="x-small"
            variant="tonal"
            :disabled="currentPage == 1 || loading"
            @click="fetchBlocks(fromBlockNumberFirstPage)"
          >
            First
          </v-btn>
          <v-btn
            class="mr-1"
            size="x-small"
            variant="tonal"
            :disabled="currentPage == 1 || loading"
            @click="prevPage"
            ><v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn class="mr-1" size="x-small" variant="tonal">
            Page {{ currentPage }} of {{ numPages }}
          </v-btn>
          <v-btn
            class="mr-1"
            size="x-small"
            variant="tonal"
            :disabled="currentPage == numPages || loading"
            @click="nextPage"
            ><v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <v-btn
            class="mr-1"
            size="x-small"
            variant="tonal"
            :disabled="currentPage == numPages || loading"
            @click="fetchBlocks(fromBlockNumberLastPage)"
          >
            Last
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <!-- TABLE -->
        <v-list-item
          v-for="(block, i) in blocks"
          :key="i"
          :value="block"
          color="primary"
          prepend-icon="mdi-cube-outline"
          @click="viewBlock(block.number)"
        >
          <v-row no-gutters class="text-body-2">
            <v-col cols="4">{{ block.number }}</v-col>
            <v-col cols="8" class="tex-truncate">
              Fee Recipient: {{ block.miner }}
            </v-col>
          </v-row>
          <v-row no-gutters class="text-caption">
            <v-col cols="4">{{ humanizeTsToTimeDiff(block.timestamp) }}</v-col>
            <v-col cols="8">{{ block.transactions.length }} txns</v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAlchemy } from "@/composables/alchemy";
import { humanizeTsToTimeDiff } from "@/utils/date";

const blocks = ref(null);
const fromBlock = ref(null);
const toBlock = ref(null);
const totalNumBlocks = ref(null);
const serviceableNumBlocks = ref(null);
const numPages = ref(null);
const fromBlockNumberFirstPage = ref(totalNumBlocks.value - 1);
const fromBlockNumberLastPage = ref(THE_MERGE_BLOCK_NUMBER + PAGE_SIZE - 1);
const currentPage = ref(1);
const loading = ref(false);

const PAGE_SIZE = 20;
const THE_MERGE_BLOCK_NUMBER = 15537393;

onMounted(async () => {
  try {
    const blockNumber = await alchemy.core.getBlockNumber();
    await fetchBlocks(blockNumber);

    // compute page navigation values
    totalNumBlocks.value = fromBlock.value.number + 1; // add 1 to count in Genesis block 0
    serviceableNumBlocks.value = totalNumBlocks.value - THE_MERGE_BLOCK_NUMBER;
    numPages.value = Math.ceil(serviceableNumBlocks.value / PAGE_SIZE);
  } catch (error) {
    console.error(error);
  }
});

// SDK Calls
const { alchemy } = useAlchemy();

const fetchBlocks = async (fromBlockNumber) => {
  try {
    loading.value = true;

    const blocksPromises = [];
    for (let i = 0; i < PAGE_SIZE; i++) {
      blocksPromises.push(
        alchemy.core.getBlockWithTransactions(fromBlockNumber - i),
      );
    }
    blocks.value = await Promise.all(blocksPromises);

    fromBlock.value = blocks.value[0];

    toBlock.value = blocks.value[blocks.value.length - 1];

    // update page navigation
    if (fromBlockNumber == fromBlockNumberFirstPage.value) {
      currentPage.value = 1;
    }
    if (fromBlockNumber == fromBlockNumberLastPage.value) {
      currentPage.value = numPages.value;
    }

    loading.value = false;
  } catch (error) {
    console.error(error);
  }
};

// Page Navigation Methods
const nextPage = async () => {
  try {
    const newFromBlock = toBlock.value.number - 1;
    await fetchBlocks(newFromBlock);
    currentPage.value += 1;
  } catch (error) {
    console.error(error);
  }
};

const prevPage = async () => {
  try {
    const newFromBlock = fromBlock.value.number + PAGE_SIZE;
    await fetchBlocks(newFromBlock);
    currentPage.value -= 1;
  } catch (error) {
    console.error(error);
  }
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
