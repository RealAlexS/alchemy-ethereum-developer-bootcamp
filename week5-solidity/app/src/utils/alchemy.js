import { useAlchemy } from "@/composables/alchemy";

// Define the asynchronous function that will retrieve deployed contracts
export const findContractCreationTransactions = async (address) => {
  const { alchemy } = useAlchemy();

  const transfers = [];

  // Paginate through the results using getAssetTransfers method
  let response = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toBlock: "latest", // Fetch results up to the latest block
    fromAddress: address, // Filter results to only include transfers from the specified address
    excludeZeroValue: false, // Include transfers with a value of 0
    category: ["external"], // Filter results to only include external transfers
  });
  transfers.push(...response.transfers);

  // Continue fetching and aggregating results while there are more pages
  while (response.pageKey) {
    let pageKey = response.pageKey;
    response = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toBlock: "latest",
      fromAddress: address,
      excludeZeroValue: false,
      category: ["external"],
      pageKey: pageKey,
    });
    transfers.push(...response.transfers);
  }

  // Filter the transfers to only include contract deployments (where 'to' is null)
  const deployments = transfers.filter((transfer) => transfer.to === null);
  return deployments.map((deployment) => deployment.hash);
};

export const getTransactions = async (txHashes) => {
  const { alchemy } = useAlchemy();
  const promises = txHashes.map((hash) => alchemy.core.getTransaction(hash));
  return await Promise.all(promises);
};

export const getTransactionReceipts = async (txHashes) => {
  const { alchemy } = useAlchemy();
  const promises = txHashes.map((hash) =>
    alchemy.core.getTransactionReceipt(hash),
  );
  return await Promise.all(promises);
};

export const getTransaction = async (txHash) => {
  const { alchemy } = useAlchemy();
  return await alchemy.core.getTransaction(txHash);
};

export const getTransactionReceipt = async (txHash) => {
  const { alchemy } = useAlchemy();
  return await alchemy.core.getTransactionReceipt(txHash);
};
