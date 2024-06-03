<template>
  <v-container>
    <v-text-field
      v-model="userAddress"
      :loading="loading"
      label="Wallet Address or ENS domain"
      variant="solo"
      hide-details
      single-line
    >
      <template #append-inner>
        <v-icon
          class="cursor-pointer"
          icon="mdi-magnify"
          @click="getTokenBalances"
        />
      </template>
    </v-text-field>
    <v-card v-if="tokenBalances.length > 0" class="mt-4">
      <v-list>
        <v-list-item
          v-for="(token, i) in tokenBalances"
          :key="`token-${i}`"
          :value="block"
          color="primary"
        >
          <template #prepend>
            <v-avatar :size="32">
              <v-img :src="tokenMetadata[i].logo" contain />
            </v-avatar>
          </template>
          <v-row no-gutters class="text-body-2 d-flex align-center">
            <v-col cols="12" class="tex-truncate">
              {{ tokenMetadata[i].symbol }}
              {{ formatEther(token.tokenBalance, tokenMetadata[i].decimals) }}
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";
import { Utils } from "alchemy-sdk";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { useAlchemy } from "@/composables/alchemy";
import { useWeb3ModalAccount } from "@web3modal/ethers/vue";

const { address } = useWeb3ModalAccount();
const { tokenBalances, tokenMetadata } = storeToRefs(useAppStore());
const { setTokenBalances, setTokenMetadata } = useAppStore();

const { alchemy } = useAlchemy();

const loading = ref(false);

const userAddress = ref("");

watch(address, () => {
  userAddress.value = address.value;
});

// SDK Calls
const getTokenBalances = async () => {
  try {
    loading.value = true;
    const data = await alchemy.core.getTokenBalances(userAddress.value);
    setTokenBalances(data.tokenBalances);

    const contractAddresses = data.tokenBalances.map(
      (balance) => balance.contractAddress,
    );
    await getTokenMetadata(contractAddresses);
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
};

const getTokenMetadata = async (contractAddresses) => {
  try {
    let tokenMetadataPromises = [];
    contractAddresses.forEach((contractAddress) => {
      const tokenMetadata = alchemy.core.getTokenMetadata(contractAddress);
      tokenMetadataPromises.push(tokenMetadata);
    });
    const data = await Promise.all(tokenMetadataPromises);
    setTokenMetadata(data);
  } catch (error) {
    console.error(error);
  }
};

// Utils
const formatEther = (hexBalance, decimals) => {
  const amountEth = Utils.formatEther(hexBalance, decimals);
  let num = parseFloat(amountEth);
  if (num === 0) {
    return "0";
  }
  return num.toFixed(4).replace(/(\.0+|0+)$/, "");
};
</script>
