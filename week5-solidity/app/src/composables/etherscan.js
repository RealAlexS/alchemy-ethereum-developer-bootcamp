import { computed } from "vue";
import { useWeb3ModalAccount } from "@web3modal/ethers5/vue";

export function useEtherscan() {
  const { chainId } = useWeb3ModalAccount();

  const explorerUrlMap = {
    1: "https://etherscan.io",
    11155111: "https://sepolia.etherscan.io",
    31337: null,
  };

  const explorerUrl = computed(() => explorerUrlMap[chainId.value]);

  return {
    explorerUrl,
  };
}
