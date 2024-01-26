<template>
  <v-card class="text-body-2">
    <v-card-title> {{ $t("home.contractList.title") }} </v-card-title>

    <v-divider class="my-4"></v-divider>

    <v-card-text>
      <SearchContracts @search="init" />
    </v-card-text>

    <div v-if="loading" class="my-8 d-flex justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else>
      <div v-if="escrows.length">
        <EscrowContract
          v-for="escrow in escrows"
          :key="escrow.contractAddress"
          :escrow="escrow"
        />
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useEscrowStore } from "@/store/escrow";
import { useWallet } from "@/composables/wallet";
import { useWeb3ModalAccount } from "@web3modal/ethers5/vue";
import { load } from "@/utils/lazy";
import {
  findContractCreationTransactions,
  getTransactions,
  getTransactionReceipt,
} from "@/utils/alchemy";
import { initialize, formatEther } from "@/utils/ethers";
import Escrow from "@/artifacts/contracts/Escrow.sol/Escrow";

const EscrowContract = load(
  import("@/components/ExistingContracts/EscrowContract.vue"),
);
const SearchContracts = load(
  import("@/components/ExistingContracts/SearchContracts.vue"),
);

const { addEscrow, reset } = useEscrowStore();
const { escrows } = storeToRefs(useEscrowStore());

const { address } = useWeb3ModalAccount();

const { isLocalhost, onNetworkChange } = useWallet();

onMounted(async () => {
  await init(address.value);
});

onNetworkChange(async () => {
  await init(address.value);
});

const init = async (address) => {
  reset();
  if (!isLocalhost.value) {
    await fetchExistingEscrowContracts(address);
  }
};

const loading = ref(false);

const fetchExistingEscrowContracts = async (address) => {
  loading.value = true;

  const allTxHashes = await findContractCreationTransactions(address);

  const allTxs = await getTransactions(allTxHashes);

  // Filter out any transactions that are not Escrow smart contracts
  const txs = allTxs.filter((tx) =>
    tx.data.startsWith(Escrow.bytecode.substring(0, 10)),
  );

  const promises = txs.map((tx) => getEscrowInfo(tx));
  await Promise.all(promises);
  loading.value = false;
};

const getEscrowInfo = async (tx) => {
  const { contractAddress } = await getTransactionReceipt(tx.hash);

  const escrowContract = await initialize(contractAddress);

  const escrow = {
    contractAddress: escrowContract.address,
    arbiter: await escrowContract.arbiter(),
    beneficiary: await escrowContract.beneficiary(),
    value: formatEther(tx.value.toString()),
    isApproved: await escrowContract.isApproved(),
  };
  addEscrow(escrow);
};
</script>
