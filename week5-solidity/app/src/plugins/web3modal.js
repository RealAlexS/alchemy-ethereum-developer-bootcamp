// initWeb3Modal.js or initWeb3Modal.ts

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/vue";

export function initWeb3Modal() {
  // 1. Get projectId at https://cloud.walletconnect.com
  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

  // 2. Set chains
  const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://eth.llamarpc.com	",
  };

  const sepolia = {
    chainId: 11155111,
    name: "Sepolia",
    currency: "SepoliaETH",
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://ethereum-sepolia.publicnode.com",
  };

  const localhost = {
    chainId: 31337,
    name: "Localhost 8545",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "http://localhost:8545",
  };

  // 3. Create modal
  const metadata = {
    name: "My Escrow Contract Manager",
    description: "My Escrow Contract Manager",
  };

  createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [mainnet, sepolia, localhost],
    projectId,
  });
}
