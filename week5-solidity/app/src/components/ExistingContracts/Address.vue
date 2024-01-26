<template>
  <div
    v-if="explorerUrl"
    class="text-blue-lighten-1"
    style="cursor: pointer"
    @click="openExternalLink()"
  >
    {{ address }}
  </div>
  <div v-else>
    {{ address }}
  </div>
</template>

<script setup>
import { useEtherscan } from "@/composables/etherscan";

const props = defineProps({
  address: {
    type: String,
    default: null,
    required: true,
  },
});

const { explorerUrl } = useEtherscan();

const openExternalLink = () => {
  const url = `${explorerUrl.value}/address/${props.address}`;
  window.open(url, "_blank");
};
</script>
