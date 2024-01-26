import { ethers } from "ethers";
import Escrow from "@/artifacts/contracts/Escrow.sol/Escrow";
import { useWeb3ModalSigner } from "@web3modal/ethers5/vue";

export const initialize = async (contractAddress) => {
  const { signer } = useWeb3ModalSigner();
  return new ethers.Contract(contractAddress, Escrow.abi, signer.value);
};

export const deploy = async (arbiter, beneficiary, value) => {
  const { signer } = useWeb3ModalSigner();

  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer.value,
  );
  return factory.deploy(arbiter, beneficiary, { value });
};

export const approve = async (escrowContract) => {
  const { signer } = useWeb3ModalSigner();
  await escrowContract.connect(signer.value).approve();
};

export const parseEther = (value) => {
  return ethers.utils.parseEther(value);
};

export const formatEther = (value) => {
  const valueInWei = ethers.BigNumber.from(value);
  return ethers.utils.formatEther(valueInWei);
};
