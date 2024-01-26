import { computed, watch } from "vue";
import { useWeb3ModalAccount } from "@web3modal/ethers5/vue";

export function useWallet() {
  const { chainId } = useWeb3ModalAccount();

  const isLocalhost = computed(() => chainId.value === 31337);

  const onNetworkChange = (callback) => {
    watch(chainId, () => {
      callback();
    });
  };

  return {
    isLocalhost,
    onNetworkChange,
  };
}
