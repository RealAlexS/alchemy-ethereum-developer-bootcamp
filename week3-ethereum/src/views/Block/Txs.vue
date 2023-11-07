<template>
  <v-container>
    <div class="d-flex align-center">
      <h3>Transactions for Block</h3>
      <div class="ml-2 text-subtitle-2 text-grey-darken-1">
        #{{ blockNumber }}
      </div>
    </div>

    <v-divider class="my-4"></v-divider>

    <v-card v-if="transactionReceipts" class="text-body-2">
      <v-list>
        <v-list-subheader class="font-weight-bold">
          Block Transactions
        </v-list-subheader>
        <v-divider></v-divider>
        <v-list-item
          v-for="(tx, i) in transactionReceipts"
          :key="i"
          :value="tx"
          color="primary"
          prepend-icon="mdi-file-document-outline"
          @click="viewTx(tx.transactionHash)"
        >
          <div>
            <v-row no-gutters>
              <v-col cols="4">{{ shortenHash(tx.transactionHash) }}</v-col>
              <v-col cols="4">From: {{ shortenAddress(tx.from) }}</v-col>
              <v-col cols="4">To: {{ shortenAddress(tx.to) }}</v-col>
            </v-row>
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Utils } from "alchemy-sdk";
import { useAlchemy } from "@/composables/alchemy";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";

const { transactionReceipts } = storeToRefs(useAppStore());
const { setTransactionReceipts } = useAppStore();
const { alchemy } = useAlchemy();
const route = useRoute();

const blockNumber = parseInt(route.params.blockNumber);

onMounted(async () => {
  if (transactionReceipts.value.length == 0) {
    const transactionReceipts = await fetchTransactionReceipts();
    setTransactionReceipts(transactionReceipts);
  }
});

// SDK Calls
const fetchTransactionReceipts = async () => {
  const params = {
    blockNumber: Utils.hexlify(blockNumber),
  };
  const res = await alchemy.core.getTransactionReceipts(params);
  return res.receipts;
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

// Navigation
const router = useRouter();

const viewTx = (txHash) => {
  router.push({
    name: "Tx",
    params: { txHash },
  });
};
</script>
