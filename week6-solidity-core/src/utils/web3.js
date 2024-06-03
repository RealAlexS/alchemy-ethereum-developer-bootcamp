import { ethers } from "ethers";

export const getMetamask = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  return { address, signer };
};

export const getErc20Contract = async (address, abi) => {
  const { signer } = await getMetamask();
  return new ethers.Contract(address, abi, signer);
};

export const isMetamaskInstalled = () => {
  return !!window.ethereum;
};

export const getENSAddress = async (address) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return await provider.lookupAddress(address);
};
