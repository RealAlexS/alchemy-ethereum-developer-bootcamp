const { writeFile } = require("./utils/json");
const { ethers } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();

  const transactionCount = await owner.getTransactionCount();

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 1
  });

  const MyGovernor = await ethers.getContractFactory("MyGovernor");
  const governor = await MyGovernor.deploy(futureAddress);

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(governor.address);

  // Write addresses to a JSON file
  const addresses = { governor: governor.address, token: token.address };
  writeFile("scripts/tmp", "addresses.json", addresses);

  console.log(
    `Governor deployed to ${governor.address}`,
    `Token deployed to ${token.address}`
  );
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { main };