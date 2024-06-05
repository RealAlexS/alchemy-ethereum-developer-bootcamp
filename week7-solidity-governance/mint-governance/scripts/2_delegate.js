const { ethers } = require("hardhat");
const { getContract } = require("./utils/contract");

async function main() {
  const [owner] = await ethers.getSigners();

  // Get the deployed MyToken contract
  const token = await getContract("MyToken");

  // Delegate votes to the deployer
  await token.delegate(owner.address);

  console.log("Votes delegated successfully.");
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { main };