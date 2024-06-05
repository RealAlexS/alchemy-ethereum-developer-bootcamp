const { ethers } = require("hardhat");
const { loadFile } = require("../utils/json");

async function getContract(contractName) {

  // Load addresses from the JSON file
  const addresses = loadFile("./scripts/tmp", "addresses.json");

  const addressMap = {
    "MyToken": addresses.token,
    "MyGovernor": addresses.governor,
  }

  const address = addressMap[contractName];

  if (!address) {
    console.error(`${contractName} address not found in addresses.json`);
  }

  // Get the deployed token contract
  const contract = await ethers.getContractAt(contractName, address);
  // // Alternatively, pure ethers implementation
  // const tokenFactory = await ethers.getContractFactory(contractName);
  // const contract =  await tokenFactory.attach(address);

  return contract;
}

module.exports = { getContract };

