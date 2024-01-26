import { Network, Alchemy } from "alchemy-sdk";
import { useWeb3ModalAccount } from "@web3modal/ethers5/vue";

export function useAlchemy() {
  const { chainId } = useWeb3ModalAccount();

  const settingsMap = {
    1: {
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY_ETH_MAINNET,
      network: Network.ETH_MAINNET,
    },
    11155111: {
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY_ETH_SEPOLIA,
      network: Network.ETH_SEPOLIA,
    },
  };

  const settings = settingsMap[chainId.value];

  const alchemy = new Alchemy(settings);

  return {
    alchemy,
  };
}
