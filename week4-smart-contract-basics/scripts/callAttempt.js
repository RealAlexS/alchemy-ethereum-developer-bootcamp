const hre = require("hardhat");

const CALLER_CONTRACT = "0x92574d78b315cabDd9D1f36904AcD9A5E5E93585"
const LOTTERY_CONTRACT = "0x1B6a2684B5b134a3E85A366259A1da215858CB12"

async function main() {
  const caller = await hre.ethers.getContractAt("Caller", CALLER_CONTRACT);

  const tx = await caller.callAttempt(LOTTERY_CONTRACT);

  const receipt = await tx.wait();

  console.log("TX confirmed: ", receipt.hash);

  if (hre.network.name === 'sepolia') {
    console.log(`Details: https://sepolia.etherscan.io/tx/${receipt.hash}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
