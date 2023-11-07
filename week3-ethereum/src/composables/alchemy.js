import { Network, Alchemy } from "alchemy-sdk";

export function useAlchemy(
  apiKey = import.meta.env.VITE_ALCHEMY_API_KEY,
  network = Network.ETH_MAINNET,
) {
  const settings = {
    apiKey: apiKey,
    network: network,
  };

  const alchemy = new Alchemy(settings);

  return {
    alchemy,
  };
}
